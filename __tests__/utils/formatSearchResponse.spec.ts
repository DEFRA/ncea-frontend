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
              resourceAbstractObject: { default: 'Content 1' },
              resourceType: ['dataset'],
              cl_hierarchyLevel: [
                {
                  default: 'Dataset'
                }
              ],
              resourceTemporalExtentDetails: [
                {
                  start: {
                    date: '1960-01-04',
                  },
                  end: {},
                },
              ],
              cl_function:[
                {
                   "key":"download",
                   "default":"Download",
                   "langeng":"Download",
                   "link":"http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_OnLineFunctionCode",
                   "text":"download"
                }
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
                  langeng: 'Seabed Mapping Service',
                },
                function: 'download',
                applicationProfile: '',
                group: 0,
              },
            ],
              resourceIdentifier: [
                {
                  code: 'af7cd14f-6c20-445f-abd0-7c41385ba999',
                  codeSpace: 'https://seabed.admiralty.co.uk',
                  link: '',
                },
              ],
              uuid: 'af7cd14f-6c20-445f-abd0-7c41385ba999',
            },
          },
          {
            _id: '2',
            _source: {
              resourceTitleObject: { default: 'Title 2' },
              OrgObject: { default: 'Organization 2' },
              resourceType: ['dataset'],
              resourceAbstractObject: { default: 'Content 2' },
              cl_hierarchyLevel: [
                {
                  default: 'Dataset'
                }
              ],
              cl_function:[
                {
                   "key":"download",
                   "default":"Download",
                   "langeng":"Download",
                   "link":"http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_OnLineFunctionCode",
                   "text":"download"
                }
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
                  langeng: 'Seabed Mapping Service',
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
          publishedBy: 'Organization 1',
          content: 'Content 1',
          studyPeriod: '04 Jan 1960',
          resourceLocator: 'https://seabed.admiralty.co.uk',
          ncea_catalogue_number: 'af7cd14f-6c20-445f-abd0-7c41385ba999',
          host_catalogue_number: 'https://seabed.admiralty.co.uk af7cd14f-6c20-445f-abd0-7c41385ba999',
          host_catalogue_entry: '',
          resource_type_and_hierarchy: 'dataset',
          hierarchy_level: 'Dataset',
          resource_locators : 'Download from Seabed Mapping Service (<a class=\"govuk-link\" href=\"https://seabed.admiralty.co.uk\" target=\"_blank\">https://seabed.admiralty.co.uk</a>)'
        },
        {
          id: '2',
          title: 'Title 2',
          publishedBy: 'Organization 2',
          content: 'Content 2',
          studyPeriod: '04 Jan 1960 to 12 Jan 2009',
          resourceLocator: 'https://seabed.admiralty.co.uk',
          ncea_catalogue_number: 'ac7db62c-1908-48a3-a4be-8ca8526b4948',
          host_catalogue_number: 'https://seabed.admiralty.co.uk af7cd14f-6c20-445f-abd0-7c41385ba999',
          host_catalogue_entry: '',
          resource_type_and_hierarchy: 'dataset',
          hierarchy_level: 'Dataset',
          resource_locators : 'Download from Seabed Mapping Service (<a class=\"govuk-link\" href=\"https://seabed.admiralty.co.uk\" target=\"_blank\">https://seabed.admiralty.co.uk</a>)'
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
});
