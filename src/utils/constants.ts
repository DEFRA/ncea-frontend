import { IAggregationOptions } from '../interfaces/searchResponse.interface';

export const webRoutePaths = {
  home: '/',
  results: '/search',
  guidedDateSearch: '/date-search',
  geographySearch: '/coordinate-search',
  getResults: '/search-results',
  getResultsCount: '/results-count',
  getFilters: '/search-filters',
};

export const elasticSearchAPIPaths = {
  searchPath: '_search',
  countPath: '_count',
};

export const formKeys = {
  dateQuestionnaire: 'date-questionnaire',
};

export const formIds = {
  quickSearch: 'quick-search',
  dataQuestionnaire: 'date-search',
  geographyQuestionnaire: 'coordinate-search',
};

export const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const resourceTypeOptions: IAggregationOptions = [{ value: 'all', text: 'All' }];
