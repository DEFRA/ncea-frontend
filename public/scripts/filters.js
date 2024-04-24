const fromYearId = 'start_year';
const toYearId = 'to_year';
const searchResultsFilterFormId = 'results-filter';
const searchResultSortFormId = 'result-sort';

const addFilterHeadingClickListeners = () => {
  const filterHeadingElement = document.querySelectorAll(
    '.defra-filter-options__heading',
  );
  if (filterHeadingElement.length) {
    filterHeadingElement.forEach((filterHeading) => {
      filterHeading.addEventListener('click', function () {
        const parentNode = filterHeading.parentNode;
        const openClass = 'defra-filter-options__heading--open';
        const closedClass = 'defra-filter-options__heading--closed';
        const parentOpenClass = 'defra-filter-options--open';
        const parentClosedClass = 'defra-filter-options--closed';
        if (filterHeading.classList.contains(openClass)) {
          filterHeading.classList.remove(openClass);
          filterHeading.classList.add(closedClass);
          parentNode.classList.remove(parentOpenClass);
          parentNode.classList.add(parentClosedClass);
        } else if (filterHeading.classList.contains(closedClass)) {
          filterHeading.classList.remove(closedClass);
          filterHeading.classList.add(openClass);
          parentNode.classList.add(parentOpenClass);
          parentNode.classList.remove(parentClosedClass);
        }
      });
    });
  }
};

// const selectToYear = (instance) => {
//   const toYearElement = document.getElementById(`${instance}-${toYearId}`);
//   if (toYearElement) {
//     toYearElement.value =
//       toYearElement.options[toYearElement.options.length - 1].value;
//   }
// };

const submitSearchResultsFilter = (formId) => {
  const formElement = document.getElementById(formId);
  if (formElement) {
    formElement.submit();
  }
};

const updateFromYear = (event) => {
  const { id, value } = event.target;
  const instance = id.split('-')[0].trim();
  const fromYearElement = document.getElementById(`${instance}-${fromYearId}`);
  if (parseInt(value) < parseInt(fromYearElement.value)) {
    for (let i = 0; i < fromYearElement.options.length; i++) {
      if (parseInt(fromYearElement.options[i].value) <= parseInt(value)) {
        fromYearElement.value = fromYearElement.options[i].value;
        setTimeout(() => {
          submitSearchResultsFilter(searchResultsFilterFormId);
        }, 100);
        break;
      }
    }
  } else {
    submitSearchResultsFilter(searchResultsFilterFormId);
  }
};

const updateToYear = (event) => {
  const { id, value } = event.target;
  const instance = id.split('-')[0].trim();
  const toYearElement = document.getElementById(`${instance}-${toYearId}`);
  if (parseInt(value) > parseInt(toYearElement.value)) {
    for (let i = 0; i < toYearElement.options.length; i++) {
      if (parseInt(toYearElement.options[i].value) >= parseInt(value)) {
        toYearElement.value = toYearElement.options[i].value;
        setTimeout(() => {
          submitSearchResultsFilter(searchResultsFilterFormId);
        }, 100);
        break;
      }
    }
  } else {
    submitSearchResultsFilter(searchResultsFilterFormId);
  }
};

const attachStudyPeriodChangeListener = (instance) => {
  const fromYearElement = document.getElementById(`${instance}-${fromYearId}`);
  const toYearElement = document.getElementById(`${instance}-${toYearId}`);
  if (fromYearElement && toYearElement) {
    fromYearElement.addEventListener('change', updateToYear);
    toYearElement.addEventListener('change', updateFromYear);
  }
};

const attachSearchResultsFilterCheckboxChangeListener = () => {
  const searchResultsFilterCheckboxes = document.querySelectorAll(
    '[data-instance="search_results"]',
  );
  if (searchResultsFilterCheckboxes.length) {
    searchResultsFilterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', function () {
        submitSearchResultsFilter(searchResultsFilterFormId);
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
  addFilterHeadingClickListeners();
  attachStudyPeriodChangeListener('search_results');
  attachSearchResultsFilterCheckboxChangeListener();
  attachSearchResultsSortChangeListener();
});
