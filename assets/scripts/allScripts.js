import { browserStorage } from './browserStorage';
import { fetchResults } from './fetchResults';
import { toggleFormSubmitButton } from './toggleFormSubmitButton';

const bundle = () => {
  browserStorage();
  fetchResults();
  toggleFormSubmitButton();
};

bundle();
