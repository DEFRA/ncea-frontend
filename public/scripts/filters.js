const fromYearId = 'start_year';
const toYearId = 'to_year';
const filterSPFormId = 'study_period_filter';
const filterRTFormId = 'resource_type_filter';
const searchResultSortFormId = 'sort_results';

const addFilterHeadingClickListeners = (instance) => {
  const filterHeadingElement = document.getElementById(
    `toggle_resource_type-${instance}`,
  );
  if (filterHeadingElement) {
    filterHeadingElement.addEventListener('click', function () {
      const parentNode = filterHeadingElement.parentNode;
      const openClass = 'defra-filter-options__heading--open';
      const closedClass = 'defra-filter-options__heading--closed';
      const parentOpenClass = 'defra-filter-options--open';
      const parentClosedClass = 'defra-filter-options--closed';
      if (filterHeadingElement.classList.contains(openClass)) {
        filterHeadingElement.classList.remove(openClass);
        filterHeadingElement.classList.add(closedClass);
        parentNode.classList.remove(parentOpenClass);
        parentNode.classList.add(parentClosedClass);
      } else if (filterHeadingElement.classList.contains(closedClass)) {
        filterHeadingElement.classList.remove(closedClass);
        filterHeadingElement.classList.add(openClass);
        parentNode.classList.add(parentOpenClass);
        parentNode.classList.remove(parentClosedClass);
      }
    });
  }
};

const submitSearchResultsFilter = (formId) => {
  const formElement = document.getElementById(formId);
  if (formElement) {
    formElement.submit();
  }
};

const updateFromYear = (toYearElement, doSubmit) => {
  const value = toYearElement.value;
  const id = toYearElement.getAttribute('id');
  const instance = id.split('-')[0].trim();
  const fromYearElement = document.getElementById(`${instance}-${fromYearId}`);
  if (parseInt(value) < parseInt(fromYearElement.value)) {
    for (let i = 0; i < fromYearElement.options.length; i++) {
      if (parseInt(fromYearElement.options[i].value) <= parseInt(value)) {
        fromYearElement.value = fromYearElement.options[i].value;
        if (doSubmit) {
          setTimeout(() => {
            submitSearchResultsFilter(`${filterSPFormId}-${instance}`);
          }, 100);
        }
        break;
      }
    }
  } else {
    doSubmit && submitSearchResultsFilter(`${filterSPFormId}-${instance}`);
  }
};

const updateToYear = (startYearElement, doSubmit) => {
  const value = startYearElement.value;
  const id = startYearElement.getAttribute('id');
  const instance = id.split('-')[0].trim();
  const toYearElement = document.getElementById(`${instance}-${toYearId}`);
  if (parseInt(value) > parseInt(toYearElement.value)) {
    for (let i = 0; i < toYearElement.options.length; i++) {
      if (parseInt(toYearElement.options[i].value) >= parseInt(value)) {
        toYearElement.value = toYearElement.options[i].value;
        if (doSubmit) {
          setTimeout(() => {
            submitSearchResultsFilter(`${filterSPFormId}-${instance}`);
          }, 100);
        }
        break;
      }
    }
  } else {
    doSubmit && submitSearchResultsFilter(`${filterSPFormId}-${instance}`);
  }
};

const attachStudyPeriodChangeListener = (instance, doSubmit = false) => {
  const fromYearElement = document.getElementById(`${instance}-${fromYearId}`);
  const toYearElement = document.getElementById(`${instance}-${toYearId}`);
  if (fromYearElement && toYearElement) {
    fromYearElement.addEventListener('change', function () {
      updateToYear(this, doSubmit);
    });
    toYearElement.addEventListener('change', function () {
      updateFromYear(this, doSubmit);
    });
  }
};

const attachSearchResultsFilterCheckboxChangeListener = () => {
  const searchResultsFilterCheckboxes = document.querySelectorAll(
    '[data-instance="search_results"]',
  );
  if (searchResultsFilterCheckboxes.length) {
    searchResultsFilterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', function () {
        submitSearchResultsFilter(`${filterRTFormId}-${'search_results'}`);
      });
    });
  }
};

const attachSearchResultsSortChangeListener = () => {
  const sortElement = document.getElementById('sort');
  if (sortElement) {
    sortElement.addEventListener('change', function () {
      submitSearchResultsFilter(searchResultSortFormId);
    });
  }
  const rowPerPageElement = document.getElementById('page-results');
  if (rowPerPageElement) {
    rowPerPageElement.addEventListener('change', function () {
      submitSearchResultsFilter(searchResultSortFormId);
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  addFilterHeadingClickListeners('search_results');
  attachStudyPeriodChangeListener('search_results', true);
  attachSearchResultsFilterCheckboxChangeListener();
  attachSearchResultsSortChangeListener();
});

export { addFilterHeadingClickListeners, attachStudyPeriodChangeListener };
