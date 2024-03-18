import { ISearchResults } from '../../src/interfaces/searchResponse.interface';
import { formatSearchResponse } from '../../src/utils/formatSearchResponse';
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
          studyPeriod: '04 Jan 1960',
          resourceLocator: 'https://data.cefas.co.uk',
          organisationName: 'United Kingdom Hydrographic Office',
        },
        {
          id: '2',
          title: 'Title 2',
          publishedBy: 'Geological Survey of Ireland (GSI)',
          content: 'Content 2',
          studyPeriod: '04 Jan 1960 to 12 Jan 2009',
          resourceLocator: '',
          organisationName: 'United Kingdom Hydrographic Office',
        },
      ],
    };
    const result = await formatSearchResponse(apiResponse);
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
                    date: '2019-07-31T00:00:00',
                  },
                },
              ],
            },
          },
        ],
      },
    };
    const result = await formatSearchResponse(apiResponse, true);
    expect(result.items?.[0]?.studyPeriod).toBe('31 Jul 2019');
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
});
