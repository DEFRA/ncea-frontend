import { ISearchResults } from '../../src/models/interfaces/searchResponse.interface';
import { formatSearchResponse } from '../../src/utils/formatSearchResponse';
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
              resourceTemporalExtentDetails: [
                {
                  start: {
                    date: '1960-01-04',
                  },
                  end: {},
                },
              ],
            },
          },
          {
            _id: '2',
            _source: {
              resourceTitleObject: { default: 'Title 2' },
              OrgObject: { default: 'Organization 2' },
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
          publishedBy: 'Organization 1',
          content: 'Content 1',
          temporalExtentDetails: {
            startDate: '1960-01-04',
            endDate: '',
          },
        },
        {
          id: '2',
          title: 'Title 2',
          publishedBy: 'Organization 2',
          content: 'Content 2',
          temporalExtentDetails: {
            startDate: '1960-01-04',
            endDate: '2009-01-12',
          },
        },
      ],
    };
    const result = await formatSearchResponse(apiResponse);
    expect(result).toEqual(expectedResponse);
  });
});
