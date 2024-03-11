import {
  getStorageData,
  previousQuestion,
  storeStorageData,
} from './customScripts.js';

const guidedSearchFormIds = ['date-search', 'coordinate-search'];
const resultsBlockId = 'results-block';
const filterBlockId = 'filter-block';
const actionDataAttribute = 'data-action';

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

const toggleOverlay = (showOverlay) => {
  const overlayContainer = document.getElementById('overlay');
  if (showOverlay && overlayContainer) {
    overlayContainer.classList.toggle('active');
  }
};

const invokeAjaxCall = async (path, payload, showOverlay = false) => {
  try {
    toggleOverlay(showOverlay);
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (response.ok && !response.redirected) {
      toggleOverlay(showOverlay);
      return response;
    } else if (response.ok && response.redirected) {
      window.location.href = response.url;
    } else {
      console.error(`Failed to fetch the results: ${response.status}`);
      return null;
    }
  } catch (error) {
    toggleOverlay(showOverlay);
    console.error(`Error fetching results: ${error.message}`);
    return null;
  }
  return null;
};

const invokeSearchResults = () => {
  const fetchResults = document.querySelector('[data-fetch-results]');
  if (fetchResults) {
    const action = fetchResults.getAttribute(actionDataAttribute);
    getSearchResults(action);
  }
};

const hydrateFilterOption = () => {
  const { filters } = getStorageData();
  const hasResourceType = document.getElementById('resourceType');
  if (hasResourceType && filters?.resourceType) {
    for (const option of hasResourceType.options) {
      if (option.value === filters.resourceType) {
        option.selected = true;
        break;
      }
    }
  }
};

const attachFilterListener = (isReset = false) => {
  const filterElements = document.querySelectorAll('.filterOptions');
  filterElements.forEach((filterElement) => {
    const selectedValue =
      filterElement.options[isReset ? 0 : filterElement.selectedIndex];
    const sessionData = getStorageData();
    sessionData.filters = {
      ...sessionData.filters,
      [filterElement.getAttribute('id')]: selectedValue.value,
    };
    storeStorageData(sessionData);
    hydrateFilterOption();
    invokeSearchResults();
  });
};

const getSearchFilters = async (path) => {
  const { fields } = getStorageData();
  const payload = { fields, sort: '', rowsPerPage: 0, filters: {}, page: null };
  const response = await invokeAjaxCall(path, payload);
  if (response) {
    const searchFiltersHtml = await response.text();
    document.getElementById(filterBlockId).innerHTML = searchFiltersHtml;

    hydrateFilterOption();
    const filterButton = document.getElementById('filter_results');
    if (filterButton) {
      filterButton.addEventListener('click', () => attachFilterListener(false));
    }

    const resetFilterElement = document.getElementById('reset_filter');
    if (resetFilterElement) {
      resetFilterElement.addEventListener('click', () =>
        attachFilterListener(true),
      );
    }
  }
};

const invokeSearchFilters = () => {
  const fetchFilters = document.querySelector('[data-fetch-filters]');
  if (fetchFilters) {
    const action = fetchFilters.getAttribute(actionDataAttribute);
    getSearchFilters(action);
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

const attachPageResultsChangeListener = () => {
  const hasPageResultElement = document.getElementById('page-results');
  if (hasPageResultElement) {
    hasPageResultElement.addEventListener('change', () => {
      const selectedPageValue =
        hasPageResultElement.options[hasPageResultElement.selectedIndex];
      const sessionData = getStorageData();
      sessionData.rowsPerPage = selectedPageValue.value;
      storeStorageData(sessionData);
      invokeSearchResults();
    });
  }
};

const hydratePageResultsOption = () => {
  const { rowsPerPage } = getStorageData();
  const hasPageResultElement = document.getElementById('page-results');
  if (hasPageResultElement && rowsPerPage) {
    for (const option of hasPageResultElement.options) {
      if (option.value === rowsPerPage) {
        option.selected = true;
        break;
      }
    }
  }
};

const getSearchResults = async (path) => {
  document.getElementById(resultsBlockId).innerHTML =
    '<p class="govuk-caption-m govuk-!-font-size-14">Your search request is being served...</p>';
  const { fields, sort, rowsPerPage, filters, page } = getStorageData();
  const payload = {
    fields,
    sort,
    rowsPerPage: parseInt(rowsPerPage),
    filters,
    page: page ?? 1,
  };
  const response = await invokeAjaxCall(path, payload);
  if (response) {
    const searchResultsHtml = await response.text();
    document.getElementById(resultsBlockId).innerHTML = searchResultsHtml;

    hydrateSortOption();
    attacheSortChangeListener();
    hydratePageResultsOption();
    attachPageResultsChangeListener();
    previousQuestion();
    attachClickPaginationEvent();
  } else {
    document.getElementById(resultsBlockId).innerHTML =
      '<p class="govuk-caption-m govuk-!-font-size-14">Unable to fetch the search results. Please try again.</p>';
  }
};

const filterObjectByKeys = (sourceObject, keysArray) => {
  const filteredObject = {};
  keysArray.forEach((key) => {
    if (sourceObject.hasOwnProperty(key)) {
      filteredObject[key] = sourceObject[key];
    }
  });
  return filteredObject;
};

const getCountPayload = (formId) => {
  let filteredObject = {};
  const { fields } = getStorageData();
  const properKeys = getProperKeys(formId);
  if (properKeys.length) {
    filteredObject = filterObjectByKeys(fields, properKeys);
  }
  return {
    fields: filteredObject,
    sort: '',
    rowsPerPage: 0,
    filters: {},
    page: null,
  };
};

const getResultsCount = async (path, element) => {
  const { stepState } = getStorageData();
  const formId = element.getAttribute('data-form-id');
  const selectedIndex = guidedSearchFormIds.indexOf(formId);
  if (selectedIndex !== -1 || selectedIndex !== 0) {
    const previousFormId = guidedSearchFormIds[selectedIndex - 1];
    if (
      stepState.hasOwnProperty(previousFormId) &&
      stepState[previousFormId] !== 'skipped'
    ) {
      const payload = getCountPayload(formId);
      const response = await invokeAjaxCall(path, payload, true);
      if (response) {
        const searchResultsCount = await response.json();
        element.innerHTML =
          searchResultsCount && searchResultsCount['totalResults'] !== 0
            ? `Click to see ${searchResultsCount['totalResults']} results`
            : '';
      }
    } else {
      document.querySelector('.count-block').style.paddingBottom = 0;
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
  invokeSearchResults();
  invokeSearchFilters();
  const fetchResultsCount = document.querySelector('[data-fetch-count]');
  if (fetchResultsCount) {
    attachClickResultsEvent(fetchResultsCount);
    const action = fetchResultsCount.getAttribute(actionDataAttribute);
    if (action) {
      getResultsCount(action, fetchResultsCount);
    }
  }
});

const attachClickPaginationEvent = () => {
  const pageLinks = document.getElementsByClassName(
    'govuk-link govuk-pagination__link',
  );
  for (const element of pageLinks) {
    element.addEventListener('click', () => {
      const pageNumber = element.getAttribute('data-page-id');
      if (pageNumber) {
        const sessionData = getStorageData();
        sessionData.page = parseInt(pageNumber);
        storeStorageData(sessionData);
        invokeSearchResults();
        window.scrollTo(0, 0);
      }
    });
  }
};

export { hydrateSortOption, hydratePageResultsOption, invokeSearchResults };
