'use strict';

const key = 'ncea-search-data';
const defaultSessionData = JSON.stringify({
  fields: {},
  count: {},
});

const storeFieldsData = ({
  formId,
  isSkipped = false,
  countValue = null,
  isCount = false,
}) => {
  const form = document.getElementById(formId);
  if (!form) {
    return;
  }

  const sessionDataString = sessionStorage.getItem(key) || defaultSessionData;
  const sessionData = JSON.parse(sessionDataString);
  if (!isCount) {
    const fieldsData = sessionData.fields;
    let formData = fieldsData[formId] || {};
    if (!isSkipped) {
      const formElementsArray = Array.from(form.elements);
      formElementsArray.forEach((element) => {
        if (element.tagName.toLowerCase() === 'input') {
          formData[element.name] =
            element.type === 'checkbox' ? element.checked : element.value;
        }
      });
    } else {
      formData = {};
    }
    fieldsData[formId] = formData;
  }
  if (isCount) {
    const countData = sessionData.count;
    countData[fieldId] = countValue;
  }
  sessionStorage.setItem(key, JSON.stringify(sessionData));
};

const readStorageData = ({ formId, isCount = false, countTarget }) => {
  const sessionDataString = sessionStorage.getItem(key) || defaultSessionData;
  const sessionData = JSON.parse(sessionDataString);
  if (!isCount) {
    const fieldsData = sessionData.fields;
    const formData = fieldsData[formId] || {};
    Object.keys(formData).forEach((fieldId) => {
      const element = document.getElementById(fieldId);
      if (element && ['text', 'number'].includes(element.type)) {
        element.value = formData[fieldId];
      }
      if (element && element.type === 'checkbox') {
        element.checked = formData[fieldId];
      }
    });
  }
  if (isCount) {
    const countData = sessionData.count;
    const countValue = countData[formId] || null;
  }
};

const resetStorageData = () => {
  sessionStorage.setItem(key, defaultSessionData);
};

const purgeEntireStorageData = () => {
  sessionStorage.removeItem(key);
};
