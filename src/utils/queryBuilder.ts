import {
  IBoolQuery,
  IMatchQuery,
  IQuery,
  IRangeQuery,
  ISearchFieldsObject,
} from '../models/interfaces/queryBuilder.interface';

const buildSearchQuery = (searchFieldsObject: ISearchFieldsObject): IQuery => {
  const boolQuery: IBoolQuery = {
    bool: {
      must: [],
    },
  };

  if (searchFieldsObject.searchTerm) {
    const matchQueries: IMatchQuery[] = [
      { match: { field1: searchFieldsObject.searchTerm } },
      { match: { field2: searchFieldsObject.searchTerm } },
      { match: { field3: searchFieldsObject.searchTerm } },
    ];

    const matchShould: IBoolQuery = {
      bool: {
        should: matchQueries,
      },
    };

    boolQuery.bool.must?.push(matchShould);
  }

  if (searchFieldsObject.startDate && searchFieldsObject.endDate) {
    const rangeQuery: IRangeQuery = {
      range: {
        your_date_field: {
          gte: searchFieldsObject.startDate,
          lte: searchFieldsObject.endDate,
        },
      },
    };

    boolQuery.bool.must?.push(rangeQuery);
  }

  const finalQuery: IQuery = {
    query: boolQuery,
  };

  return finalQuery;
};

export { buildSearchQuery };
