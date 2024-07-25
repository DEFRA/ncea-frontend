'use strict';

// Initialize form object
const defaultSessionData = JSON.stringify({
  version: '',
  fields: {},
  sort: 'best_match',
  filters: {},
  rowsPerPage: '20',
  page: 1,
  stepState: {},
  previousStep: '',
});
const localStorageKey = 'ncea-search-data';
const expiryInMinutes = 15;
const todayCheckbox = document.getElementById('today-date');

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
    const input = form.querySelector(
      `input[type="text"][altName="${fieldAltName}"]`,
    );
    if (input) {
      input.value = sessionData.fields[form.id][fieldAltName];
    }
    const checkbox = form.querySelector(
      `input[type="checkbox"][altName="${fieldAltName}"]`,
    );
    if (checkbox) {
      checkbox.checked = sessionData.fields[form.id][fieldAltName] === 'true';
    }
  });
  if (form.id === 'classifier-search') {
    const classifierData = sessionData.fields['classifier-search'] || {};
    Object.keys(classifierData).forEach((levelKey) => {
      if (levelKey === 'currentLevel') return;
      const valuesArray = classifierData[levelKey] || [];
      valuesArray.forEach((value) => {
        const checkbox = form.querySelector(
          `input[type="checkbox"][value="${value}"]`
        );
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    });
  }
};

// Function to check if any field is empty
const isAllFieldEmpty = (formId) => {
  const sessionData = getStorageData();
  const form = sessionData.fields[formId];
  if (!form) {
    return true;
  }
  return !Object.values(form).some((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return typeof value === 'string' && value.trim() !== '';
  });
};

// Function to update submit button state
const updateSubmitButtonState = (form) => {
  const submitButton = form.querySelector('button[data-to-disable]');
  if (submitButton) {
    submitButton.disabled = isAllFieldEmpty(form.id);
  }
};

const attachEventListeners = (form) => {
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('change', () => {
      const sessionData = getStorageData();
      const fieldAltName = input.getAttribute('altName') || input.value;
      if (input.type === 'checkbox') {
        const value = input.value;
        let levelKey = '';

        // Determine the level and key
        if (value.startsWith('lvl')) {
          levelKey = `level${value.slice(3, 4)}`;
        } else if (value.startsWith('lv')) {
          levelKey = `level${value.slice(2, 3)}`;
        }

        if (!sessionData.fields.hasOwnProperty('classifier-search')) {
          sessionData.fields['classifier-search'] = {};
        }

        if (!sessionData.fields['classifier-search'].hasOwnProperty(levelKey)) {
          sessionData.fields['classifier-search'][levelKey] = [];
        }

       sessionData.fields['classifier-search']['currentLevel'] = levelKey

        const valuesArray = sessionData.fields['classifier-search'][levelKey];
        if (input.checked) {
          if (!valuesArray.includes(value)) {
            valuesArray.push(value);
          }
        } else {
          const valueIndex = valuesArray.indexOf(value);
          if (valueIndex !== -1) {
            valuesArray.splice(valueIndex, 1);
          }
        }

        // Clean up empty levels
        if (sessionData.fields['classifier-search'][levelKey].length === 0) {
          delete sessionData.fields['classifier-search'][levelKey];
        }

      } else {
        const value = input.value;
        if (!sessionData.fields.hasOwnProperty(form.id)) {
          sessionData.fields[form.id] = {};
        }
        sessionData.fields[form.id][fieldAltName] = value;
      }

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
            if (associatedForm.id === 'classifier-search' && sessionData.fields['classifier-search'].currentLevel) {
              const currentLevel = sessionData.fields['classifier-search'].currentLevel;
              delete sessionData.fields['classifier-search'][currentLevel];
            } else {
              delete sessionData.fields[associatedForm.id];
            }
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

const hydrateTodayDate = (checked) => {
  const sessionData = getStorageData();
  if (!sessionData.fields.hasOwnProperty('date')) {
    sessionData.fields['date'] = {};
  }
  if (checked) {
    const currentDate = new Date();
    const date = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    sessionData.fields['date'] = {
      ...sessionData.fields['date'],
      ...{
        tdcheck: 'true',
        tdd: date.toString(),
        tdm: month.toString(),
        tdy: year.toString(),
      },
    };
  } else {
    sessionData.fields['date'] = {
      ...sessionData.fields['date'],
      ...{
        tdcheck: '',
        tdd: '',
        tdm: '',
        tdy: '',
      },
    };
  }
  storeStorageData(sessionData);
  const dateForm = document.getElementById('date');
  hydrateFormFromStorage(dateForm);
  updateSubmitButtonState(dateForm);
};

const attachTodayDateEventListener = () => {
  if (todayCheckbox) {
    todayCheckbox.addEventListener('change', function (event) {
      const { checked } = event.target;
      hydrateTodayDate(checked);
    });
  }
};

const todayCheckboxStatus = () => {
  if (todayCheckbox && todayCheckbox.checked) {
    const sessionData = getStorageData();
    if (sessionData.fields.hasOwnProperty('date')) {
      const { tdd, tdm, tdy } = sessionData.fields['date'];
      const currentDate = new Date();
      const date = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      if (
        parseInt(tdd) !== date ||
        parseInt(tdm) !== month ||
        parseInt(tdy) !== year
      ) {
        hydrateTodayDate(true);
      }
    }
  }
};

const todayDateUncheck = (checked) => {
  const sessionData = getStorageData();
  if (!sessionData.fields.hasOwnProperty('date')) {
      sessionData.fields['date'] = {};
  }
  if (checked) {
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      sessionData.fields['date'] = {
          ...sessionData.fields['date'],
          tdcheck: 'true',
          tdd: day.toString(),
          tdm: month.toString(),
          tdy: year.toString(),
      };
  } else {
      sessionData.fields['date'] = {
          ...sessionData.fields['date'],
          tdcheck: '',
      };
  }
}

// Function to attach event listeners to date input fields
const attachDateInputListeners = () => {
  const dateDayInput = document.querySelector('input[name="to-date-day"]');
  const dateMonthInput = document.querySelector('input[name="to-date-month"]');
  const dateYearInput = document.querySelector('input[name="to-date-year"]');

  const uncheckTodayDate = () => {
    if (todayCheckbox && todayCheckbox.checked) {
      todayCheckbox.checked = false;
     todayDateUncheck(false);
    }
  };

  if (dateDayInput) {
    dateDayInput.addEventListener('input', uncheckTodayDate);
  }
  if (dateMonthInput) {
    dateMonthInput.addEventListener('input', uncheckTodayDate);
  }
  if (dateYearInput) {
    dateYearInput.addEventListener('input', uncheckTodayDate);
  }
};

const classifierBackLinkHandler = () => {
  const backLinkElements = document.querySelector('.back-link-classifier');
  if (backLinkElements) {
    backLinkElements.addEventListener('click', () => {
        window.history.go(-1);
    });
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
    attachTodayDateEventListener();
    todayCheckboxStatus();
    attachDateInputListeners();
    classifierBackLinkHandler();

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
        todayCheckboxStatus();
      }
    });
  }
});

export { getStorageData, fireEventAfterStorage, updateSubmitButtonState };
