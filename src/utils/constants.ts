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
  termsAndConditions: '/terms-conditions',
  privacyPolicy: '/privacy-policy',
  cookiePolicy: '/cookie-policy',
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
export const geoNetworkIndex: string = 'gn-records';
export const mapResultMaxCount: number = 10000;
export const requiredFieldsForMap: string[] = [
  'resourceTitleObject',
  'contactForResource',
  'resourceAbstractObject',
  'geom',
  'resourceIdentifier',
  'resourceType',
  'resourceTemporalExtentDetails',
  'ownerOrgForResourceObject',
  'originatorOrgForResourceObject',
  'custodianOrgForResourceObject',
  'distributorOrgForResourceObject',
  'pointOfContactOrgObject',
  'linkUrl',
  'OrgNceaClassifiers'
];

export const quickSearchTargetFields: string[] = [
  'metadataIdentifier',
  'resourceTitleObject.default',
  'resourceAltTitleObject.default',
  'resourceAbstractObject.default',
  'lineageObject.default',
  'tag.default',
  'cl_topic.default',
  'resourceType',
  'supplementalInformationObject.default',
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
export const yearRange: string = 'year';

export const resourceTypeFilterField = 'resourceTypeFilter';
export const studyPeriodFilterField = 'studyPeriodFilter';

export const defaultFilterOptions: IFilterOptions = [
  {
    key: uniqueResourceTypesKey,
    needCount: true,
    propertyToRead: 'key',
    hasBucket: true,
    isTerm: true,
  },
  {
    key: yearRange,
    needCount: false,
    propertyToRead: 'value_as_string',
    hasBucket: false,
    isDate: true,
  },
];

export const detailsTabOptions: TabOptions = {
  general: {
    Abstract: 'content',
    'Study periods': 'studyPeriod',
    'Topic categories': 'topicCategories',
    Keywords: 'keywords',
    'Resource languages': 'language',
  },
  access: {
    'File Identifier': 'ncea_catalogue_number',
    'Resource Identifier': 'host_catalogue_number',
    'Coupled resources': 'host_catalogue_entry',
    'Resource type': 'resource_type_and_hierarchy',
    'Hierarchy level name': 'hierarchy_level',
    'Resource locators': 'resource_locators',
    'Catalouge entry': 'ncea_catalogue_number',
    'NCEA search service catalogue number': 'host_service_catalogue_number',
    'Parent ID': 'ncea_group_reference',
    'Metadata standard': 'metadata_standard',
    'Project number': 'project_number',
    'Metadata language': 'metadata_language',
  },
  quality: {
    'Date of publication': 'publicationInformation',
    'Date of creation': 'creationInformation',
    'Date of last revision': 'revisionInformation',
    'Metadata date': 'metadataDate',
    Lineage: 'lineage',
    Conformity: 'conformity',
    'Additional information': 'additionalInformation',
  },
  geography: {
    'Spatial data service': 'spatialDataService',
    'Spatial representation service': 'spatialRepresentationService',
    'Spatial referencing system': 'spatialReferencingSystem',
    'Geographic locations': 'geographicLocations',
    'Geographic boundary': 'geographicBoundaryHtml',
    map: 'geographicBoundary',
    'Vertical extent<br /><span>(Meters above sea level)</span>': 'verticalExtent',
    'Spatial resolution': 'samplingResolution',
  },
  license: {
    'Limitations on public access': 'limitation_on_public_access',
    'License constraints': 'license_constraints',
    'Distribution formats': 'available_formats',
    'Frequency of update': 'frequency_of_update',
    'Character encoding': 'character_encoding',
  },
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
  termsAndConditions: 'Terms and conditions',
  privacyPolicy: 'Privacy policy',
  cookiePolicy: 'Cookies',
};
