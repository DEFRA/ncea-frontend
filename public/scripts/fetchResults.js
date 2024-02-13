import { getStorageData, storeStorageData } from './customScripts.js';

const guidedSearchFormIds = ['date-search', 'coordinate-search'];

const checkProperties = (dataObject, seen = new Set()) => {
  Object.keys(dataObject).forEach((key) => {
    if (
      dataObject[key] === null ||
      dataObject[key] === '' ||
      (typeof dataObject[key] === 'object' &&
        Object.keys(dataObject[key]).length === 0)
    ) {
      delete dataObject[key];
    } else if (
      typeof dataObject[key] === 'object' &&
      !seen.has(dataObject[key])
    ) {
      seen.add(dataObject[key]);
      checkProperties(dataObject[key]);
      if (Object.keys(dataObject[key]).length === 0) {
        delete dataObject[key];
      }
    }
  });
  return dataObject;
};

const invokeAjaxCall = async (path) => {
  const sessionData = getStorageData();
  const fieldsData = checkProperties(sessionData.fields);
  if (Object.keys(fieldsData).length) {
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData.fields),
      });
      if (response.ok) {
        return response;
      } else {
        console.error(`Failed to fetch the results: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching results: ${error.message}`);
      return null;
    }
  }
  return null;
};

const getSearchResults = async (path) => {
  const response = await invokeAjaxCall(path);
  if (response) {
    const searchResultsHtml = await response.text();
    document.getElementById('results-block').innerHTML = searchResultsHtml;
  } else {
    document.getElementById('results-block').innerHTML =
      '<p class="govuk-caption-m govuk-!-font-size-14">Unable to fetch the search results. Please try again.</p>';
  }
};

const hideSkipButton = (element) => {
  element.style.display = 'none;';
  document.querySelector('.count-block').style.paddingBottom = 0;
  const skipQuestion = document.querySelector('[data-do-storage-skip]');
  if (skipQuestion) {
    skipQuestion.style.display = 'none';
  }
};

const getResultsCount = async (path, element) => {
  const response = await invokeAjaxCall(path);
  if (response) {
    const searchResultsCount = await response.json();
    if (searchResultsCount && searchResultsCount['totalResults'] !== 0) {
      element.innerHTML = `Click to see ${searchResultsCount['totalResults']} results`;
    } else {
      hideSkipButton(element);
    }
  } else {
    hideSkipButton(element);
  }
};

const getProperKeys = (formId) => {
  const selectedIndex = guidedSearchFormIds.indexOf(formId);
  if (selectedIndex === -1 || selectedIndex === 0) {
    return [];
  }
  const properKeys = guidedSearchFormIds.slice(0, selectedIndex);
  return properKeys;
};

const attachClickResultsEvent = (element) => {
  element.addEventListener('click', () => {
    const formId = element.getAttribute('data-form-id');
    const properKeys = getProperKeys(formId);
    if (properKeys.length) {
      const sessionData = getStorageData();
      sessionData['fields'] = Object.keys(sessionData.fields)
        .filter((key) => properKeys.includes(key))
        .reduce((newObject, key) => {
          newObject[key] = sessionData.fields[key];
          return newObject;
        }, {});
      storeStorageData(sessionData);
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const fetchResults = document.querySelector('[data-fetch-results]');
  if (fetchResults) {
    const action = fetchResults.getAttribute('data-action');
    getSearchResults(action);
  }
  const fetchResultsCount = document.querySelector('[data-fetch-count]');
  if (fetchResultsCount) {
    attachClickResultsEvent(fetchResultsCount);
    const action = fetchResultsCount.getAttribute('data-action');
    getResultsCount(action, fetchResultsCount);
  }
});
