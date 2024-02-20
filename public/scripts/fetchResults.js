import {
  getStorageData,
  resetStorage,
  storeStorageData,
} from './customScripts.js';

const guidedSearchFormIds = ['date-search', 'coordinate-search'];
const resultsBlockId = 'results-block';

const checkProperties = (dataObject, seen = new Set()) => {
  Object.keys(dataObject).forEach((key) => {
    if (
      dataObject[key] === null ||
      dataObject[key] === '' ||
      (typeof dataObject[key] === 'object' &&
        Object.keys(dataObject[key]).length === 0)
    ) {
      delete dataObject[key];
    } else {
      const hasSeen = seen.has(dataObject[key]);
      if (typeof dataObject[key] === 'object' && !hasSeen) {
        seen.add(dataObject[key]);
        checkProperties(dataObject[key]);
        if (Object.keys(dataObject[key]).length === 0) {
          delete dataObject[key];
        }
      }
    }
  });
  return dataObject;
};

const invokeAjaxCall = async (path) => {
  const { fields, sort } = getStorageData();
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields, sort }),
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
};

const invokeSearchResults = () => {
  const fetchResults = document.querySelector('[data-fetch-results]');
  if (fetchResults) {
    const action = fetchResults.getAttribute('data-action');
    getSearchResults(action);
  }
};

const hydrateSortOption = () => {
  const { sort } = getStorageData();
  const hasSortElement = document.getElementById('sort');
  if (hasSortElement && sort) {
    for (const option of hasSortElement.options) {
      if (option.value === sort) {
        option.selected = true;
        break;
      }
    }
  }
};

const attacheSortChangeListener = () => {
  const hasSortElement = document.getElementById('sort');
  if (hasSortElement) {
    hasSortElement.addEventListener('change', () => {
      const selectedValue =
        hasSortElement.options[hasSortElement.selectedIndex];
      const sessionData = getStorageData();
      sessionData.sort = selectedValue.value;
      storeStorageData(sessionData);
      invokeSearchResults();
    });
  }
};

const getSearchResults = async (path) => {
  document.getElementById(resultsBlockId).innerHTML =
    '<p class="govuk-caption-m govuk-!-font-size-14">Your search request is being served...</p>';
  const response = await invokeAjaxCall(path);
  if (response) {
    const searchResultsHtml = await response.text();
    document.getElementById(resultsBlockId).innerHTML = searchResultsHtml;

    hydrateSortOption();
    attacheSortChangeListener();
  } else {
    document.getElementById(resultsBlockId).innerHTML =
      '<p class="govuk-caption-m govuk-!-font-size-14">Unable to fetch the search results. Please try again.</p>';
  }
};

const adjustPadding = () => {
  document.querySelector('.count-block').style.paddingBottom = 0;
};

const getResultsCount = async (path, element) => {
  const response = await invokeAjaxCall(path);
  if (response) {
    const searchResultsCount = await response.json();
    if (searchResultsCount && searchResultsCount['totalResults'] !== 0) {
      element.innerHTML = `Click to see ${searchResultsCount['totalResults']} results`;
    } else {
      adjustPadding();
    }
  } else {
    adjustPadding();
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
  invokeSearchResults();
  const fetchResultsCount = document.querySelector('[data-fetch-count]');
  if (fetchResultsCount) {
    attachClickResultsEvent(fetchResultsCount);
    const action = fetchResultsCount.getAttribute('data-action');
    if (action) {
      getResultsCount(action, fetchResultsCount);
    }
  }
});

export { hydrateSortOption, invokeSearchResults };
