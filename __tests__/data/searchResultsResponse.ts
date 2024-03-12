import { ISearchResults } from '../../src/interfaces/searchResponse.interface';

const searchResultsWithData: ISearchResults = {
  total: 2,
  items: [
    {
      id: '1',
      title: 'Title 1',
      publishedBy: 'Organization 1',
      content: 'Content 1',
      studyPeriod: '04 Jan 1960',
      resourceLocator: '',
    },
    {
      id: '2',
      title: 'Title 2',
      publishedBy: 'Organization 2',
      content: 'Content 2',
      studyPeriod: '04 Jan 1950 to 12 Jan 2009',
      resourceLocator: '',
    },
  ],
};

const searchResultsWithEmptyData = {
  total: 0,
  items: [],
};

export { searchResultsWithData, searchResultsWithEmptyData };
