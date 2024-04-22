'use strict';

// Initialize form object
const defaultSessionData = JSON.stringify({
  version: '',
  fields: {},
  sort: 'best_match',
  filters: { resourceType: 'all' },
  rowsPerPage: '20',
  page: 1,
  stepState: {},
  previousStep: '',
});
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
  const isStorageExpired = checkStorageExpiry(sessionData.version ?? '');
  return isStorageExpired ? defaultSessionData : JSON.parse(sessionData);
};

// Populate input fields with values from session data
const hydrateFormFromStorage = (form) => {
  const sessionData = getStorageData();
  Object.keys(sessionData.fields[form.id] ?? {}).forEach((fieldAltName) => {
    const input = form.querySelector(`input[altName="${fieldAltName}"]`);
    if (input) {
      input.value = sessionData.fields[form.id][fieldAltName];
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
  return !Object.values(form).some((value) => value.trim() !== '');
};

// Function to update submit button state
const updateSubmitButtonState = (form) => {
  const submitButton = form.querySelector('button[data-to-disable]');
  if (submitButton) {
    submitButton.disabled = isAllFieldEmpty(form.id);
  }
};

//Listen for the input event on input fields
const attachEventListeners = (form) => {
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
      const sessionData = getStorageData();
      const fieldAltName = input.getAttribute('altName');
      const value = input.value;
      if (!sessionData.fields.hasOwnProperty(form.id)) {
        sessionData.fields[form.id] = {};
      }
      sessionData.fields[form.id][fieldAltName] = value;
      storeStorageData(sessionData);
      updateSubmitButtonState(form);
    });
  });
};

const resetStorage = () => {
  const resetElements = document.querySelectorAll('[data-do-storage-reset]');
  if (resetElements.length > 0) {
    resetElements.forEach((element) => {
      element.addEventListener('click', () => {
        storeStorageData(JSON.parse(defaultSessionData));
      });
    });
  }
};

const previousQuestion = () => {
  const previousQuestionElements = document.querySelectorAll(
    '[data-do-previous-page]',
  );
  if (previousQuestionElements.length > 0) {
    previousQuestionElements.forEach((element) => {
      element.addEventListener('click', () => {
        const { previousStep } = getStorageData();
        window.location.href = previousStep;
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
          sessionData.stepState[associatedForm.id] = 'skipped';
          sessionData.previousStep = `${window.location.pathname}${window.location.search}`;
          storeStorageData(sessionData);
        }
      });
    });
  }
};

const nextQuestion = () => {
  const nextQuestionElements = document.querySelectorAll(
    '[data-next-question]',
  );
  if (nextQuestionElements.length > 0) {
    nextQuestionElements.forEach((element) => {
      element.addEventListener('click', (event) => {
        const associatedForm = event.target.closest('form');
        if (associatedForm) {
          const sessionData = getStorageData();
          sessionData.stepState[associatedForm.id] = 'submitted';
          sessionData.previousStep = `${window.location.pathname}${window.location.search}`;
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
  const formKey = 'keyword';
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
    const hasQuickSearchData = sessionData.fields.hasOwnProperty(formKey);
    if (hasQuickSearchData) {
      delete sessionData.fields[formKey];
      updateSession = true;
    }
  }
  if (updateSession) {
    storeStorageData(sessionData);
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
    nextQuestion();
    previousQuestion();

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

export { getStorageData, fireEventAfterStorage };
