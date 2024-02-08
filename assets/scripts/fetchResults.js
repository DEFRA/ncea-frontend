import { sessionStorageKey } from './browserStorage.js';

const getSearchResults = async (path) => {
  try {
    const sessionDataString = sessionStorage.getItem(sessionStorageKey);
    const sessionData = JSON.parse(sessionDataString);
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData.fields),
    });
    if (response.ok) {
      const searchResultsHtml = await response.text();
      document.getElementById('results-block').innerHTML = searchResultsHtml;
    } else {
      console.error(`Failed to fetch the results view: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error fetching HTML view: ${error.message}`);
  }
};

const fetchResults = () => {
  document.addEventListener('DOMContentLoaded', () => {
    const fetchResults = document.querySelector('[data-fetch-results]');
    if (fetchResults) {
      const action = fetchResults.getAttribute('data-action');
      getSearchResults(action);
    }
  });
};

export { fetchResults };
