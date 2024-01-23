interface IMatchQuery {
  match: {
    [key: string]: string;
  };
}

interface IRangeQuery {
  range: {
    [key: string]: {
      gte: string;
      lte: string;
    };
  };
}

interface IBoolQuery {
  bool: {
    must?: (IBoolQuery | IRangeQuery)[];
    should?: IMatchQuery[];
  };
}

interface IQuery {
  query: IBoolQuery;
}

interface ISearchFieldsObject {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

export { IMatchQuery, IBoolQuery, IRangeQuery, IQuery, ISearchFieldsObject };
