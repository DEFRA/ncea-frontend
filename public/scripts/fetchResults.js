import { getStorageData, storeStorageData } from './customScripts.js';

const guidedSearchFormIds = ['date-search', 'coordinate-search'];

const invokeAjaxCall = async (path) => {
  try {
    const sessionData = getStorageData();
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
    }
  } catch (error) {
    console.error(`Error fetching results: ${error.message}`);
  }
};

const getSearchResults = async (path) => {
  const response = await invokeAjaxCall(path);
  const searchResultsHtml = await response.text();
  document.getElementById('results-block').innerHTML = searchResultsHtml;
};

const getResultsCount = async (path, element) => {
  const response = await invokeAjaxCall(path);
  const searchResultsCount = await response.json();
  if (searchResultsCount['totalResults'] !== 0) {
    element.innerHTML = `Click to see ${searchResultsCount['totalResults']} results`;
  } else {
    element.style.display = 'none;';
    document.querySelector('.count-block').style.paddingBottom = 0;
    const skipQuestion = document.querySelector('[data-do-storage-skip]');
    if (skipQuestion) {
      skipQuestion.style.display = 'none';
    }
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
