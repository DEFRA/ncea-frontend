'use strict';

// Initialize form object
const defaultSessionData = {
  version: '',
  fields: {},
};
const localStorageKey = 'ncea-search-data';
const expiryInMinutes = 15;

// Store the data to storage
const storeStorageData = (newSessionData) => {
  const updatedSessionData = {
    ...newSessionData,
    version: new Date().getTime(),
  };
  localStorage.setItem(localStorageKey, JSON.stringify(updatedSessionData));
};

// Store the data to storage and dispatch storage event
const fireEventAfterStorage = (newSessionData) => {
  const oldSessionData = getStorageData();
  storeStorageData(newSessionData);
  window.dispatchEvent(
    new StorageEvent('storage', {
      key: localStorageKey,
      oldValue: JSON.stringify(oldSessionData),
      newValue: JSON.stringify(newSessionData),
      storageArea: window.localStorage,
    }),
  );
};

const checkStorageExpiry = (storeTimestamp) => {
  if (storeTimestamp) {
    const currentTime = new Date().getTime();
    const storedTime = new Date(Number(storeTimestamp)).getTime();
    const minutesInMilliSeconds = expiryInMinutes * 60 * 1000;
    return currentTime - storedTime >= minutesInMilliSeconds;
  }
  return false;
};

// Populate data with values from session storage
const getStorageData = () => {
  const sessionData =
    localStorage.getItem(localStorageKey) || defaultSessionData;
  const isStorageExpired = checkStorageExpiry(sessionData.version);
  return isStorageExpired ? defaultSessionData : JSON.parse(sessionData);
};

// Populate input fields with values from session data
const hydrateFormFromStorage = (form) => {
  const sessionData = getStorageData();
  Object.keys(sessionData.fields[form.id] ?? {}).forEach((fieldName) => {
    const input = form.querySelector(`input[name="${fieldName}"]`);
    if (input) {
      input.value = sessionData.fields[form.id][fieldName];
    }
  });
};

// Function to check if any field is empty
const isAllFieldEmpty = (formId) => {
  const sessionData = getStorageData();
  const form = sessionData.fields[formId];
  if (!form) {
    return true;
  }
  return Object.values(form).some((value) => value.trim() !== '');
};

// Function to update submit button state
const updateSubmitButtonState = (form) => {
  const submitButton = form.querySelector('button[data-to-disable]');
  if (submitButton) {
    submitButton.disabled = !isAllFieldEmpty(form.id);
  }
};

//Listen for the input event on input fields
const attachEventListeners = (form) => {
  const sessionData = getStorageData();
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
      const fieldName = input.getAttribute('name');
      const value = input.value;

      if (!sessionData.fields[form.id]) {
        sessionData.fields[form.id] = {};
      }
      sessionData.fields[form.id][fieldName] = value;

      storeStorageData(sessionData);

      updateSubmitButtonState(form);
    });
  });
};

// To update storage with new count data
const updateCountData = (formId, count) => {
  const sessionData = getStorageData();
  sessionData.count[formId] = count;
  storeStorageData(sessionData);
};

const resetStorage = () => {
  const resetElements = document.querySelectorAll('[data-do-storage-reset]');
  if (resetElements.length > 0) {
    resetElements.forEach((element) => {
      element.addEventListener('click', () => {
        storeStorageData(defaultSessionData);
      });
    });
  }
};

const skipStorage = () => {
  const skipElements = document.querySelectorAll('[data-do-storage-skip]');
  if (skipElements.length > 0) {
    skipElements.forEach((element) => {
      element.addEventListener('click', (event) => {
        const associatedForm = event.target.closest('form');
        if (associatedForm) {
          const sessionData = getStorageData();
          if (sessionData.fields.hasOwnProperty(associatedForm.id)) {
            delete sessionData.fields[associatedForm.id];
          }
          storeStorageData(sessionData);
        }
      });
    });
  }
};

const hasGuidedSearchProperties = (fieldsData, formKey) =>
  Object.keys(fieldsData).some((key) => key !== formKey);

const handleSearchJourney = (event) => {
  const quickSearchJourney = event.target.getAttribute('data-do-quick-search');
  let sessionData = getStorageData();
  let updateSession = false;
  const formKey = 'quick-search';
  if (quickSearchJourney === 'true') {
    if (hasGuidedSearchProperties(sessionData.fields, formKey)) {
      sessionData = {
        ...sessionData,
        fields: {
          [formKey]: {
            ...sessionData.fields[formKey],
          },
        },
      };
      updateSession = true;
    }
  } else {
    if (sessionData.fields.hasOwnProperty(formKey)) {
      delete sessionData.fields[formKey];
      updateSession = true;
    }
  }
  if (updateSession) {
    storeStorageData(sessionData);
    updateSession = false;
  }
};

if (typeof Storage !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('[data-do-browser-storage]');
    if (forms.length > 0) {
      forms.forEach((form) => {
        if (form instanceof HTMLFormElement) {
          hydrateFormFromStorage(form);

          updateSubmitButtonState(form);

          attachEventListeners(form);
        }
      });
    }

    resetStorage();
    skipStorage();

    const searchJourneyElement = document.querySelectorAll(
      '[data-do-quick-search]',
    );
    if (searchJourneyElement.length) {
      searchJourneyElement.forEach((searchElement) => {
        searchElement.addEventListener('click', handleSearchJourney);
      });
    }
  });
}

// Listen for storage events to reflect changes made in one tab across all tabs
window.addEventListener('storage', (event) => {
  if (event.storageArea === localStorage && event.key === localStorageKey) {
    // Retrieve the updated form data from session storage
    const updatedData = JSON.parse(event.newValue);
    Object.keys(updatedData.fields ?? {}).forEach((formId) => {
      const form = document.getElementById(formId);
      if (form) {
        hydrateFormFromStorage(form);
        updateSubmitButtonState(form);
      }
    });
  }
});

export {
  hydrateFormFromStorage,
  updateSubmitButtonState,
  storeStorageData,
  getStorageData,
  fireEventAfterStorage,
};
