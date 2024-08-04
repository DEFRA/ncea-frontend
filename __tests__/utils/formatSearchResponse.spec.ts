import {
  IDateRange,
  ISearchResults,
} from '../../src/interfaces/searchResponse.interface';
import { formatDate } from '../../src/utils/formatDate';
import {
  formatSearchResponse,
  getStudyPeriodDetails,
} from '../../src/utils/formatSearchResponse';
import {
  detailsSuccessAPIFullData,
  detailsSuccessAPIResponse,
  formattedDetailsFullResponse,
  formattedDetailsResponse,
} from '../data/documentDetailsResponse';
describe('Format the search response', () => {
  it('should format the search response correctly', async () => {
    const apiResponse = {
      hits: {
        total: { value: 2 },
        hits: [
          {
            _id: '1',
            _source: {
              resourceTitleObject: { default: 'Title 1' },
              OrgObject: { default: 'Organization 1' },
              contactForResource: [
                {
                  organisationObject: {
                    default: 'United Kingdom Hydrographic Office',
                  },
                  role: 'custodian',
                },
                {
                  organisationObject: {
                    default: 'Geological Survey of Ireland (GSI)',
                  },
                  role: 'owner',
                },
              ],
              ownerOrgForResourceObject: {
                default: 'Geological Survey of Ireland (GSI)',
              },
              custodianOrgForResourceObject: {
                default: 'United Kingdom Hydrographic Office',
              },
              resourceAbstractObject: { default: 'Content 1' },
              resourceTemporalExtentDetails: [
                {
                  start: {
                    date: '1960-01-04',
                  },
                  end: {},
                },
              ],
              resourceIdentifier: [
                {
                  code: 'CEFAS268',
                  codeSpace: 'https://data.cefas.co.uk',
                  link: '',
                },
              ],
              linkUrl: 'https://data.cefas.co.uk',
            },
          },
          {
            _id: '2',
            _source: {
              resourceTitleObject: { default: 'Title 2' },
              contactForResource: [
                {
                  organisationObject: {
                    default: 'United Kingdom Hydrographic Office',
                  },
                  role: 'originator',
                },
                {
                  organisationObject: {
                    default: 'Geological Survey of Ireland (GSI)',
                  },
                  role: 'owner',
                },
              ],
              ownerOrgForResourceObject: {
                default: 'Geological Survey of Ireland (GSI)',
              },
              originatorOrgForResourceObject: {
                default: 'United Kingdom Hydrographic Office',
              },
              resourceAbstractObject: { default: 'Content 2' },
              resourceTemporalExtentDetails: [
                {
                  start: {
                    date: '1960-01-04',
                  },
                  end: {
                    date: '2009-01-12',
                  },
                },
              ],
            },
          },
        ],
      },
    };
    const expectedResponse: ISearchResults = {
      total: 2,
      items: [
        {
          id: '1',
          title: 'Title 1',
          publishedBy: 'Geological Survey of Ireland (GSI)',
          content: 'Content 1',
          studyPeriod: '4 January 1960 to 4 January 1960',
          resourceLocator: 'https://data.cefas.co.uk',
          organisationName: 'United Kingdom Hydrographic Office',
          startYear: '1960',
          toYear: '',
        },
        {
          id: '2',
          title: 'Title 2',
          publishedBy: 'Geological Survey of Ireland (GSI)',
          content: 'Content 2',
          studyPeriod: '4 January 1960 to 12 January 2009',
          resourceLocator: '',
          organisationName: 'United Kingdom Hydrographic Office',
          startYear: '1960',
          toYear: '2009',
        },
      ],
    };
    const result = await formatSearchResponse(apiResponse);
    expect(result).toEqual(expectedResponse);
  });

  it('should format the search detailed response correctly', async () => {
    const apiResponse = {
      hits: {
        total: { value: 2 },
        hits: [
          {
            _id: '1',
            _source: {
              resourceTitleObject: { default: 'Title 1' },
              contactForResource: [
                {
                  organisationObject: {
                    default: 'United Kingdom Hydrographic Office',
                  },
                  role: 'custodian',
                },
                {
                  organisationObject: {
                    default: 'Geological Survey of Ireland (GSI)',
                  },
                  role: 'owner',
                },
              ],
              ownerOrgForResourceObject: {
                default: 'Geological Survey of Ireland (GSI)',
              },
              custodianOrgForResourceObject: {
                default: 'United Kingdom Hydrographic Office',
              },
              resourceAbstractObject: { default: 'Content 1' },
              resourceTemporalExtentDetails: [
                {
                  start: {
                    date: '1960-01-04',
                  },
                  end: {},
                },
              ],
              cl_function: [
                {
                  key: 'download',
                  default: 'Download',
                  link: 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_OnLineFunctionCode',
                  text: 'download',
                },
              ],
              link: [
                {
                  protocol: '',
                  mimeType: '',
                  urlObject: {
                    default: 'https://seabed.admiralty.co.uk',
                  },
                  nameObject: {
                    default: 'Seabed Mapping Service',
                  },
                  function: 'download',
                  applicationProfile: '',
                  group: 0,
                },
              ],
              uuid: 'af7cd14f-6c20-445f-abd0-7c41385ba999',
              character_encoding: 'utf8',
              data_owner: 'owner, Geological Survey of Ireland (GSI) <br>',
              frequency_of_update: '',
              limitation_on_public_access: '',
              limitation_on_public_access_other_constraint: "",
              other_constraint: "",
              tag: [
                {
                  default: 'Elevation',
                  link: 'http://vocab.nerc.ac.uk/collection/P22/current/10/',
                  key: 'http://vocab.nerc.ac.uk/collection/P22/current/10/',
                },
                {
                  default: 'Marine Environmental Data and Information Network',
                  link: 'http://vocab.nerc.ac.uk/collection/N01/current/NDGO0001/',
                  key: 'http://vocab.nerc.ac.uk/collection/N01/current/NDGO0001/',
                },
                {
                  default: 'Bathymetry and Elevation',
                  link: 'http://vocab.nerc.ac.uk/collection/P02/current/MBAN/',
                  key: 'http://vocab.nerc.ac.uk/collection/P02/current/MBAN/',
                },
              ],
            },
          },
          {
            _id: '2',
            _source: {
              resourceTitleObject: { default: 'Title 2' },
              contactForResource: [
                {
                  organisationObject: {
                    default: 'United Kingdom Hydrographic Office',
                  },
                  role: 'originator',
                },
                {
                  organisationObject: {
                    default: 'Geological Survey of Ireland (GSI)',
                  },
                  role: 'owner',
                },
              ],
              ownerOrgForResourceObject: {
                default: 'Geological Survey of Ireland (GSI)',
              },
              originatorOrgForResourceObject: {
                default: 'United Kingdom Hydrographic Office',
              },
              resourceType: ['dataset'],
              resourceAbstractObject: { default: 'Content 2' },
              cl_hierarchyLevel: [
                {
                  default: 'Dataset',
                },
              ],
              cl_function: [
                {
                  key: 'download',
                  default: 'Download',
                  link: 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_OnLineFunctionCode',
                  text: 'download',
                },
              ],
              link: [
                {
                  protocol: '',
                  mimeType: '',
                  urlObject: {
                    default: 'https://seabed.admiralty.co.uk',
                  },
                  nameObject: {
                    default: 'Seabed Mapping Service',
                  },
                  function: 'download',
                  applicationProfile: '',
                  group: 0,
                },
              ],
              resourceTemporalExtentDetails: [
                {
                  start: {
                    date: '1960-01-04',
                  },
                  end: {
                    date: '2009-01-12',
                  },
                },
              ],
              resourceIdentifier: [
                {
                  code: 'af7cd14f-6c20-445f-abd0-7c41385ba999',
                  codeSpace: 'https://seabed.admiralty.co.uk',
                  link: '',
                },
              ],
              uuid: 'ac7db62c-1908-48a3-a4be-8ca8526b4948',
              resourceAltTitleObject: [
                {
                  default: 'This is an alternate title',
                },
              ],
              character_encoding: 'utf8',
              data_owner: 'owner, Geological Survey of Ireland (GSI) <br>',
              frequency_of_update: '',
              limitation_on_public_access: '',
              linkUrl: ['https://seabed.admiralty.co.uk'],
            },
          },
        ],
      },
    };
    const expectedResponse: ISearchResults = {
      total: 2,
      items: [
        {
          id: '1',
          title: 'Title 1',
          publishedBy: 'Geological Survey of Ireland (GSI)',
          content: 'Content 1',
          studyPeriod: '4 January 1960 to 4 January 1960',
          startYear: '1960',
          toYear: '',
          resourceLocator: '',
          organisationName: 'United Kingdom Hydrographic Office',
          alternateTitle: '',
          keywords:
            'Elevation, Marine Environmental Data and Information Network, Bathymetry and Elevation',
          language: '',
          topicCategories: '',
          ncea_catalogue_number: 'af7cd14f-6c20-445f-abd0-7c41385ba999',
          ncea_catalogue_entry: '',
          host_catalogue_number: '',
          host_catalogue_entry: '',
          resource_type_and_hierarchy: '',
          hierarchy_level: '',
          resource_locators:
            '<p>Download from Seabed Mapping Service (<a class="govuk-link" href="https://seabed.admiralty.co.uk" target="_blank">https://seabed.admiralty.co.uk</a>)</p>',
          additionalInformation: '',
          lineage: '',
          publicationInformation: '',
          creationInformation:'',
          revisionInformation:'',
          metadataDate:'',
          conformity: '',
          project_number: '',
          metadata_standard: '',
          metadata_language: '',
          ncea_group_reference: '',
          available_formats: '',
          character_encoding: 'utf8',
          conditions_for_access_and_use_other_constraints: "",
          conditions_for_access_and_use_use_constraints: "",
          frequency_of_update: '',
          limitation_on_public_access: '',
          limitation_on_public_access_other_constraint: "",
          spatialDataService: '',
          other_constraint: "",
          spatialRepresentationService: '',
          spatialReferencingSystem: '',
          geographicLocations: '',
          geographicBoundary: '',
          geographicBoundaryHtml:
            '<p>West bounding longitude: <span id="west"></span></p><p>East bounding longitude: <span id="east"></span></p><p>North bounding latitude: <span id="north"></span></p><p>South bounding latitude: <span id="south"></span></p>',
          geographicCenter: '0,0',
          geographicMarkers: '',
          verticalExtent: '',
          samplingResolution: '',
        },
        {
          id: '2',
          title: 'Title 2',
          publishedBy: 'Geological Survey of Ireland (GSI)',
          content: 'Content 2',
          studyPeriod: '4 January 1960 to 12 January 2009',
          startYear: '1960',
          toYear: '2009',
          resourceLocator: 'https://seabed.admiralty.co.uk',
          organisationName: 'United Kingdom Hydrographic Office',
          alternateTitle: 'This is an alternate title',
          keywords: '',
          language: '',
          topicCategories: '',
          ncea_catalogue_number: 'ac7db62c-1908-48a3-a4be-8ca8526b4948',
          ncea_catalogue_entry: '',
          host_catalogue_number:
            'https://seabed.admiralty.co.ukaf7cd14f-6c20-445f-abd0-7c41385ba999',
          host_catalogue_entry: '',
          resource_type_and_hierarchy: 'Dataset',
          hierarchy_level: 'Dataset',
          resource_locators:
            '<p>Download from Seabed Mapping Service (<a class="govuk-link" href="https://seabed.admiralty.co.uk" target="_blank">https://seabed.admiralty.co.uk</a>)</p>',
          additionalInformation: '',
          lineage: '',
          publicationInformation: '',
          creationInformation:'',
          revisionInformation:'',
          metadataDate:'',
          conformity: '',
          project_number: '',
          metadata_standard: '',
          metadata_language: '',
          ncea_group_reference: '',
          available_formats: '',
          character_encoding: 'utf8',
          conditions_for_access_and_use_other_constraints: "",
          conditions_for_access_and_use_use_constraints: "",
          frequency_of_update: '',
          limitation_on_public_access: '',
          limitation_on_public_access_other_constraint: "",
          other_constraint: "",
          spatialDataService: '',
          spatialRepresentationService: '',
          spatialReferencingSystem: '',
          geographicLocations: '',
          geographicBoundary: '',
          geographicBoundaryHtml:
            '<p>West bounding longitude: <span id="west"></span></p><p>East bounding longitude: <span id="east"></span></p><p>North bounding latitude: <span id="north"></span></p><p>South bounding latitude: <span id="south"></span></p>',
          geographicCenter: '0,0',
          geographicMarkers: '',
          verticalExtent: '',
          samplingResolution: '',
        },
      ],
    };
    const result = await formatSearchResponse(apiResponse, true);
    expect(result).toEqual(expectedResponse);
  });

  it('should format the document details response correctly', async () => {
    const apiResponse = detailsSuccessAPIResponse;
    const expectedResponse: ISearchResults = formattedDetailsResponse;
    const result = await formatSearchResponse(apiResponse, true);
    expect(result).toEqual(expectedResponse);
  });

  it('should format the document details response correctly with full response', async () => {
    const apiResponse = detailsSuccessAPIFullData;
    const expectedResponse: ISearchResults = formattedDetailsFullResponse;
    const result = await formatSearchResponse(apiResponse, true);
    expect(result).toEqual(expectedResponse);
  });

  it('should return empty title if data is not available', async () => {
    const apiResponse = {
      ...detailsSuccessAPIFullData,
      hits: {
        ...detailsSuccessAPIFullData.hits,
        hits: [
          {
            ...detailsSuccessAPIFullData.hits.hits?.[0],
            _source: {
              ...detailsSuccessAPIFullData.hits.hits?.[0]?._source,
              resourceTitleObject: { default: '' },
            },
          },
        ],
      },
    };
    const result = await formatSearchResponse(apiResponse, true);
    expect(result.items?.[0]?.title).toBe('');
  });

  it('should return empty content if data is not available', async () => {
    const apiResponse = {
      ...detailsSuccessAPIFullData,
      hits: {
        ...detailsSuccessAPIFullData.hits,
        hits: [
          {
            ...detailsSuccessAPIFullData.hits.hits?.[0],
            _source: {
              ...detailsSuccessAPIFullData.hits.hits?.[0]?._source,
              resourceAbstractObject: { default: '' },
            },
          },
        ],
      },
    };
    const result = await formatSearchResponse(apiResponse, true);
    expect(result.items?.[0]?.content).toBe('');
  });

  it('should return only end date if start date is not available', async () => {
    const apiResponse = {
      ...detailsSuccessAPIFullData,
      hits: {
        ...detailsSuccessAPIFullData.hits,
        hits: [
          {
            ...detailsSuccessAPIFullData.hits.hits?.[0],
            _source: {
              ...detailsSuccessAPIFullData.hits.hits?.[0]?._source,
              resourceTemporalExtentDetails: [
                {
                  end: {
                    date: '2019-07-31',
                  },
                },
              ],
            },
          },
        ],
      },
    };
    const result = await formatSearchResponse(apiResponse, true);
    expect(result.items?.[0]?.studyPeriod).toBe('31 July 2019 to 31 July 2019');
  });

  it('should return organisation having role custodian', async () => {
    const apiResponse = {
      ...detailsSuccessAPIFullData,
      hits: {
        ...detailsSuccessAPIFullData.hits,
        hits: [
          {
            ...detailsSuccessAPIFullData.hits.hits?.[0],
            _source: {
              ...detailsSuccessAPIFullData.hits.hits?.[0]?._source,
              contactForResource: [
                {
                  organisationObject: {
                    default: 'United Kingdom Hydrographic Office',
                  },
                  role: 'custodian',
                },
                {
                  organisationObject: {
                    default: 'Maritime and Coastguard Agency',
                  },
                  role: 'owner',
                },
              ],
            },
          },
        ],
      },
    };
    const result = await formatSearchResponse(apiResponse, true);
    expect(result.items?.[0]?.organisationName).toBe(
      'United Kingdom Hydrographic Office',
    );
  });

  it('should return organisation having role pointOfContact when custodian is not present', async () => {
    const apiResponse = {
      ...detailsSuccessAPIFullData,
      hits: {
        ...detailsSuccessAPIFullData.hits,
        hits: [
          {
            ...detailsSuccessAPIFullData.hits.hits?.[0],
            _source: {
              ...detailsSuccessAPIFullData.hits.hits?.[0]?._source,
              contactForResource: [
                {
                  organisationObject: {
                    default: 'United Kingdom Hydrographic Office (originator)',
                  },
                  role: 'originator',
                },
                {
                  organisationObject: {
                    default:
                      'United Kingdom Hydrographic Office (pointOfContact)',
                  },
                  role: 'pointOfContact',
                },
                {
                  organisationObject: {
                    default: 'Maritime and Coastguard Agency',
                  },
                  role: 'owner',
                },
              ],
              pointOfContactOrgForResourceObject: {
                default: 'United Kingdom Hydrographic Office (pointOfContact)',
              },
            },
          },
        ],
      },
    };
    const result = await formatSearchResponse(apiResponse, true);
    expect(result.items?.[0]?.organisationName).toBe(
      'United Kingdom Hydrographic Office (pointOfContact)',
    );
  });

  it('should have the geo coordinates for map results', async () => {
    const apiResponse = detailsSuccessAPIFullData;
    const result = await formatSearchResponse(apiResponse, false, true);
    expect(result.items?.[0]?.geographicBoundary).toBeDefined();
    expect(result.items?.[0]?.geographicCenter).toBeDefined();
    expect(result.items?.[0]?.geographicCenter).toBe('-11.14563,49.0466505');
  });

  describe('getStudyPeriodDetails', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    test('returns empty string when dateRanges is empty', () => {
      expect(getStudyPeriodDetails(true, [])).toBe('');
      expect(getStudyPeriodDetails(false, [])).toBe('');
    });
    test('returns formatted string for single date range when isDetails is false', () => {
      const dateRanges: IDateRange[] = [
        { start: { date: '2022-01-01' }, end: { date: '2022-01-31' } },
        { start: { date: '2022-02-01' }, end: { date: '2022-02-28' } },
      ];
      expect(getStudyPeriodDetails(false, dateRanges)).toBe(
        '1 January 2022 to 31 January 2022',
      );
    });
    test('returns formatted strings for all date ranges when isDetails is true', () => {
      const dateRanges: IDateRange[] = [
        { start: { date: '2022-01-01' }, end: { date: '2022-01-31' } },
        { start: { date: '2022-02-01' }, end: { date: '2022-02-28' } },
      ];
      expect(getStudyPeriodDetails(true, dateRanges)).toBe(
        '1 January 2022 to 31 January 2022<br>1 February 2022 to 28 February 2022',
      );
    });
    test('handles missing start date', () => {
      const dateRanges: IDateRange[] = [
        { start: { date: '' }, end: { date: '2022-01-31' } },
      ];
      expect(getStudyPeriodDetails(true, dateRanges)).toBe(
        '31 January 2022 to 31 January 2022',
      );
    });
    test('handles missing end date', () => {
      const dateRanges: IDateRange[] = [
        { start: { date: '2022-01-01' }, end: { date: '' } },
      ];
      expect(getStudyPeriodDetails(true, dateRanges)).toBe(
        '1 January 2022 to 1 January 2022',
      );
    });
    test('handles missing both start and end date', () => {
      const dateRanges: IDateRange[] = [
        { start: { date: '' }, end: { date: '' } },
      ];
      expect(getStudyPeriodDetails(true, dateRanges)).toBe('');
    });
    test('handles undefined date ranges', () => {
      expect(getStudyPeriodDetails(true, undefined)).toBe('');
      expect(getStudyPeriodDetails(false, undefined)).toBe('');
    });
  });
});
