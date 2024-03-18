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

export const resourceTypeOptions: IAggregationOptions = [{ value: 'all', text: 'All' }];

export const showMoreText: string = 'Show more';
export const showLessText: string = 'Show less';
export const maxWords: number = 100;

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
      column: 'topicCategories',
      key: 'generalTab',
    },
    {
      label: 'Keywords',
      column: 'keywords',
      key: 'generalTab',
    },
    {
      label: 'Languages',
      column: 'language',
      key: 'generalTab',
    },
  ],
  access: [
    {
      label: 'NCEA catalogue number',
      column: 'ncea_catalogue_number',
    },
    {
      label: 'Host catalogue number',
      column: 'host_catalogue_number',
    },
    {
      label: 'Host catalogue entry',
      column: 'host_catalogue_entry',
    },
    {
      label: 'Resource type and hierarchy',
      column: 'resource_type_and_hierarchy',
    },
    {
      label: 'Hierarchy level',
      column: 'hierarchy_level',
    },
    {
      label: 'Resource locators',
      column: 'resource_locators',
    },
  ],
  quality: [
    {
      label: 'Publication information',
      column: 'publicationInformation',
      key: 'qualityTab',
    },
    {
      label: 'Lineage',
      column: 'lineage',
      key: 'qualityTab',
    },
    {
      label: 'Conformity',
      column: 'conformity',
      key: 'qualityTab',
    },
    {
      label: 'Additional information',
      column: 'additionalInformation',
      key: 'qualityTab',
    },
  ],
};
