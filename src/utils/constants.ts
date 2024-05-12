import { IFilterOptions } from '../interfaces/searchPayload.interface';
import { TabOptions } from '../interfaces/detailsTab.interface';

export const webRoutePaths = {
  home: '/',
  results: '/search',
  guidedDateSearch: '/date-search',
  geographySearch: '/coordinate-search',
  intermediate: '/intermediate',
  getMapResults: '/map-results',
  getMapFilters: '/map-filters',
  filterResourceType: '/resource-type-filter',
  filterStudyPeriod: '/study-period-filter',
  sortResults: '/sort-results',
  help: '/help',
  accessibilityStatement: '/accessibility-statement',
};

export const elasticSearchAPIPaths = {
  searchPath: '_search',
  countPath: '_count',
};

export const formKeys = {
  dateQuestionnaire: 'date-questionnaire',
};

export const formIds = {
  quickSearchFID: 'keyword',
  dataQuestionnaireFID: 'date',
  geographyQuestionnaireFID: 'extent',
};

export const showMoreText: string = 'Show more';
export const showLessText: string = 'Show less';
export const maxWords: number = 100;
export const geoNetworkIndex: string = 'gn-records/';
export const mapResultMaxCount: number = 10000;
export const requiredFieldsForMap: string[] = [
  'resourceTitleObject',
  'contactForResource',
  'resourceAbstractObject',
  'geom',
  'resourceIdentifier',
  'resourceType',
  'resourceTemporalExtentDetails',
];

export const guidedSearchSteps = {
  date: 'date',
  coordinate: 'extent',
};

export const queryParamKeys = {
  quickSearch: 'q',
  fromDateDay: 'fdd',
  fromDateMonth: 'fdm',
  fromDateYear: 'fdy',
  toDateDay: 'tdd',
  toDateMonth: 'tdm',
  toDateYear: 'tdy',
  coordinates: 'ext',
  north: 'nth',
  south: 'sth',
  east: 'est',
  west: 'wst',
  count: 'cnt',
  page: 'pg',
  rowsPerPage: 'rpp',
  sort: 'srt',
  journey: 'jry',
  resourceType: 'rty',
  startYear: 'sy',
  toYear: 'ty',
};

export const uniqueResourceTypesKey: string = 'unique_resource_types';
export const startYearRangeKey: string = 'start_year_range';
export const toYearRangeKey: string = 'to_year_range';
export const yearRange: string = 'year_range';

export const resourceTypeFilterField = 'resourceType';
export const dateFilterField = 'resourceTemporalExtentDateRange';

export const defaultFilterOptions: IFilterOptions = [
  {
    key: uniqueResourceTypesKey,
    field: 'resourceType',
    needCount: true,
    propertyToRead: 'key',
    hasBucket: true,
    isTerm: true,
  },
  {
    key: yearRange,
    field: ['max_resourceTemporalExtentDetails.end.date', 'min_resourceTemporalExtentDetails.start.date'],
    needCount: false,
    propertyToRead: 'value',
    hasBucket: false,
    isDate: true,
  },
];

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
  geography: [
    {
      label: 'Spatial data service',
      column: 'spatialDataService',
    },
    {
      label: 'Spatial representation service',
      column: 'spatialRepresentationService',
    },
    {
      label: 'Spatial referencing system',
      column: 'spatialReferencingSystem',
    },
    {
      label: 'Geographic locations',
      column: 'geographicLocations',
    },
    {
      label: 'Geographic boundary',
      column: 'geographicBoundaryHtml',
    },
    {
      label: 'map',
      column: 'geographicBoundary',
    },
    {
      label: 'Vertical extent<br /><span>(Meters above sea level)</span>',
      column: 'verticalExtent',
    },
    {
      label: 'Sampling resolution',
      column: 'samplingResolution',
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

export const pageTitles = {
  home: 'NCEA Search Service Home',
  date: 'NCEA Guided Search - Study Period',
  geography: 'NCEA Guided Search - Geographic Data',
  results: 'NCEA Search Results Summary',
  generalTab: 'NCEA Catalogue Detail - General',
  accessTab: 'NCEA Catalogue Detail - Access',
  naturalCapitalTab: 'NCEA Catalogue Detail - Natural Capital',
  qualityTab: 'NCEA Catalogue Detail - Quality',
  geographyTab: 'NCEA Catalogue Detail - Geography',
  governanceTab: 'NCEA Catalogue Detail - Governance',
  licenseTab: 'NCEA Catalogue Detail - License',
  help: 'Help',
  accessibility: 'Accessibility statement',
};
