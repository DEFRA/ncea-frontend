import { browserStorage } from './browserStorage';
import { fetchResults } from './fetchResults';
import { toggleFormSubmitButton } from './toggleFormSubmitButton';
import { renderMapToDrawPolygon } from './renderMapToDrawPolygon';

const bundle = () => {
  browserStorage();
  fetchResults();
  toggleFormSubmitButton();
  renderMapToDrawPolygon();
};

bundle();
