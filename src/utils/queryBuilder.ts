import {
  IBoolQuery,
  IGeoShapeQuery,
  IMatchQuery,
  IQuery,
  IQueryString,
  IRangeQuery,
  ISearchFieldsObject,
  IShapeCoordinates,
} from '../models/interfaces/queryBuilder.interface';

const buildSearchQuery = (searchFieldsObject: ISearchFieldsObject, fieldsToSearch: string[] = []): IQuery => {
  const boolQuery: IBoolQuery = {
    bool: {
      must: [],
    },
  };

  if (!fieldsToSearch.length && searchFieldsObject.searchTerm) {
    const queryString: IQueryString = {
      query_string: {
        query: searchFieldsObject.searchTerm,
        default_operator: 'AND',
      },
    };
    boolQuery.bool.must?.push(queryString);
  }

  if (searchFieldsObject.searchTerm && fieldsToSearch.length) {
    const matchQueries: IMatchQuery[] = fieldsToSearch.map((field: string) => ({
      match: { [field]: searchFieldsObject.searchTerm },
    })) as IMatchQuery[];

    const matchShould: IBoolQuery = {
      bool: {
        should: matchQueries,
        minimum_should_match: 1,
      },
    };

    boolQuery.bool.must?.push(matchShould);
  }

  if (searchFieldsObject.startDate && searchFieldsObject.endDate) {
    const rangeQuery: IRangeQuery = {
      range: {
        resourceTemporalExtentDateRange: {
          gte: searchFieldsObject.startDate,
          lte: searchFieldsObject.endDate,
        },
      },
    };

    boolQuery.bool.must?.push(rangeQuery);
  }

  const geoCoordinates = searchFieldsObject.geoCoordinates;

  if (geoCoordinates?.north && geoCoordinates?.south && geoCoordinates?.east && geoCoordinates?.west) {
    const geoShape: IShapeCoordinates = {
      type: 'envelope',
      coordinates: [
        [geoCoordinates.west, geoCoordinates.north],
        [geoCoordinates.east, geoCoordinates.south],
      ],
    };

    const geoShapeQuery: IGeoShapeQuery = {
      geo_shape: {
        geom: {
          shape: geoShape,
          relation: 'intersects',
          ignore_unmapped: true,
        },
      },
    };

    if (geoCoordinates.depth) {
      geoShapeQuery.geo_shape.geom.depth = geoCoordinates.depth;
    }

    boolQuery.bool.must?.push(geoShapeQuery);
  }

  const finalQuery: IQuery = {
    query: boolQuery,
  };

  return finalQuery;
};

export { buildSearchQuery };
