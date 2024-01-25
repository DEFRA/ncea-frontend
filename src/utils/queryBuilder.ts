import {
  IBoolQuery,
  IGeoShapeQuery,
  IMatchQuery,
  IQuery,
  IRangeQuery,
  ISearchFieldsObject,
  IShapeCoordinates,
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

  if (
    geoCoordinates !== undefined &&
    geoCoordinates.north &&
    geoCoordinates.south &&
    geoCoordinates.east &&
    geoCoordinates.west
  ) {
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
