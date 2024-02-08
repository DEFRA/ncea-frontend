'use strict';

import { toggleSubmitButton } from './toggleFormSubmitButton.js';

const sessionStorageKey = 'ncea-search-data';
const defaultSessionData = JSON.stringify({
  fields: {},
  count: {},
});

const extractStorageData = () => {
  const sessionDataString =
    sessionStorage.getItem(sessionStorageKey) || defaultSessionData;
  const sessionData = JSON.parse(sessionDataString);
  return sessionData;
};

const storeFieldsData = (form, clearData = false, forceStore = false) => {
  const sessionData = extractStorageData();
  const { fields: fieldsData } = sessionData;
  if (!clearData) {
    let formData = fieldsData[form.id] || {};
    form.querySelectorAll('input').forEach((element) => {
      element.addEventListener('change', (event) => {
        const { name, value, checked } = event.target;
        formData[name] = element.type === 'checkbox' ? checked : value;
        fieldsData[form.id] = { ...fieldsData[form.id], ...formData };
        sessionStorage.setItem(sessionStorageKey, JSON.stringify(sessionData));
      });
      if (forceStore) {
        formData[element.name] =
          element.type === 'checkbox' ? element.checked : element.value;
      }
    });
    if (forceStore) {
      fieldsData[form.id] = { ...fieldsData[form.id], ...formData };
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(sessionData));
    }
  } else {
    if (fieldsData.hasOwnProperty(form.id)) {
      delete fieldsData[form.id];
    }
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(sessionData));
  }
};

const hydrateFieldsData = (form) => {
  const sessionData = extractStorageData();
  const { fields: fieldsData } = sessionData;
  const formFieldsData = fieldsData[form.id] ?? {};
  form.querySelectorAll('input').forEach((element) => {
    if (formFieldsData.hasOwnProperty(element.name)) {
      if (['text', 'number'].includes(element.type)) {
        element.value = formFieldsData[element.name];
      }
      if (element.type === 'checkbox') {
        element.checked = formFieldsData[element.name];
      }
    }
  });
  clearTimeout(form.detectFieldsStateTimeout);
  form.detectFieldsStateTimeout = setTimeout(() => {
    toggleSubmitButton(form);
  }, 500);
};

const browserStorage = () => {
  if (typeof Storage !== 'undefined') {
    const forms = document.querySelectorAll('[data-do-browser-storage]');
    if (forms.length > 0) {
      forms.forEach((form) => {
        if (form instanceof HTMLFormElement) {
          storeFieldsData(form);
          hydrateFieldsData(form);
        }
      });
    }

    const resetElements = document.querySelectorAll('[data-do-storage-reset]');
    if (resetElements.length > 0) {
      resetElements.forEach((element) => {
        element.addEventListener('click', () => {
          sessionStorage.setItem(sessionStorageKey, defaultSessionData);
        });
      });
    }

    const skipElements = document.querySelectorAll('[data-do-storage-skip]');
    if (skipElements.length > 0) {
      skipElements.forEach((element) => {
        element.addEventListener('click', (event) => {
          const associatedForm = event.target.closest('form');
          if (associatedForm) {
            storeFieldsData(associatedForm, true);
            hydrateFieldsData(associatedForm);
          }
        });
      });
    }
  }
};

export { browserStorage, storeFieldsData, sessionStorageKey };
