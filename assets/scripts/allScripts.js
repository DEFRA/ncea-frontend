import { browserStorage } from './browserStorage';
import { fetchResults } from './fetchResults';

const bundle = () => {
  browserStorage();
  fetchResults();
};

bundle();
