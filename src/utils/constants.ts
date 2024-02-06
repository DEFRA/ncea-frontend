export const apiBasePath = '/api';
export const webRoutePaths = {
  home: '/',
  quickSearch: '/quick_search',
  results: '/search',
  guidedDateSearch: '/date-search',
  geographySearch: '/coordinate-search',
};

export const elasticSearchAPIPaths = {
  searchPath: '_search',
  countPath: '_count',
};

export const sharedDataStructure = {
  searchTerm: 'searchTerm',
  searchResults: 'searchResults',
};

export const formKeys = {
  dateQuestionnaire: 'date-questionnaire',
};

export const formValidatorOptions = {
  dateQuestionnaire: {
    formId: 'date-form',
    submitButtonId: 'date-submit',
  },
  geographyQuestionnaire: {
    formId: 'coordinate-form',
    submitButtonId: 'coordinate-submit',
  },
};
