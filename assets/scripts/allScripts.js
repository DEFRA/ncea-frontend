import { browserStorage } from './browserStorage.js';
import { fetchResults } from './fetchResults.js';
import { renderMapToDrawPolygon } from './renderMapToDrawPolygon.js';
import { toggleFormSubmitButton } from './toggleFormSubmitButton.js';

const bundle = () => {
  toggleFormSubmitButton();
  renderMapToDrawPolygon();
  browserStorage();
  fetchResults();
};

bundle();
