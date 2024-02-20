const searchResultsWithData = {
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

const searchResultsWithEmptyData = {
  total: 0,
  items: [],
};

export { searchResultsWithData, searchResultsWithEmptyData };
