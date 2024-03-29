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
    },
    {
      label: 'Lineage',
      column: 'lineage',
    },
    {
      label: 'Conformity',
      column: 'conformity',
    },
    {
      label: 'Additional information',
      column: 'additionalInformation',
    },
  ],
  governance: [
    {
      label: 'NCEA catalogue number',
      column: 'ncea_catalogue_number',
    },
    {
      label: 'Host service catalogue number',
      column: 'host_service_catalogue_number',
    },
    {
      label: 'NCEA group reference',
      column: 'ncea_group_reference',
    },
    {
      label: 'Metadata standard',
      column: 'metadata_standard',
    },
    {
      label: 'Project number',
      column: 'project_number',
    },
    {
      label: 'Metadata language',
      column: 'Metadata_language',
    },
    {
      label: 'NCEA catalogue date',
      column: 'ncea_catalogue_date',
    },
  ],
  license: [
    {
      label: 'Limitations on public access',
      column: 'limitation_on_public_access',
    },
    {
      label: 'License constraints',
      column: 'license_constraints',
    },
    {
      label: 'Data owner',
      column: 'data_owner',
    },
    {
      label: 'Available formats',
      column: 'available_formats',
    },
    {
      label: 'Frequency of update',
      column: 'frequency_of_update',
    },
    {
      label: 'Character encoding',
      column: 'character_encoding',
    },
  ],
};
