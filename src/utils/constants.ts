import { IAggregationOptions } from '../interfaces/searchResponse.interface';
import { TabOptions } from '../interfaces/detailsTab.interface';

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

export const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const resourceTypeOptions: IAggregationOptions = [{ value: 'all', text: 'All' }];

export const detailsTabOptions: TabOptions = {
  general: [
    {
      label: 'Abstract',
      column: 'content',
    },
    {
      label: 'Study periods',
      column: 'studyPeriod',
    },
    {
      label: 'Topic categories',
      column: 'topic_categories',
    },
    {
      label: 'Keywords',
      column: 'keywords',
    },
    {
      label: 'Languages',
      column: 'language',
    },
  ],
};
