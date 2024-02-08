import { generateDateString } from './generateDateString';
import {
  IBoolQuery,
  IGeoShapeQuery,
  IMatchQuery,
  IQuery,
  IQueryString,
  IRangeQuery,
  ISearchFieldsObject,
  IShapeCoordinates,
} from '../interfaces/queryBuilder.interface';

const buildSearchQuery = (
  searchFieldsObject: ISearchFieldsObject,
  fieldsToSearch: string[] = [],
): IQuery => {
  const boolQuery: IBoolQuery = {
    bool: {
      must: [],
    },
  };

  if (!fieldsToSearch.length && searchFieldsObject['quick-search']) {
    const queryString: IQueryString = {
      query_string: {
        query: searchFieldsObject['quick-search'].search_term ?? '',
        default_operator: 'AND',
      },
    };
    boolQuery.bool.must?.push(queryString);
  }

  if (searchFieldsObject['quick-search'] && fieldsToSearch.length) {
    const matchQueries: IMatchQuery[] = fieldsToSearch.map((field: string) => ({
      match: { [field]: searchFieldsObject['quick-search']?.search_term },
    })) as IMatchQuery[];

    const matchShould: IBoolQuery = {
      bool: {
        should: matchQueries,
        minimum_should_match: 1,
      },
    };

    boolQuery.bool.must?.push(matchShould);
  }

  if (
    searchFieldsObject['date-search']?.['from-date-year'] &&
    searchFieldsObject['date-search']['to-date-year']
  ) {
    const startDate: string = generateDateString({
      year: parseInt(searchFieldsObject['date-search']['from-date-year']),
      month: parseInt(
        searchFieldsObject['date-search']['from-date-month'] ?? '',
      ),
      day: parseInt(searchFieldsObject['date-search']['from-date-day'] ?? ''),
    });
    const endDate: string = generateDateString({
      year: parseInt(searchFieldsObject['date-search']['to-date-year']),
      month: parseInt(searchFieldsObject['date-search']['to-date-month'] ?? ''),
      day: parseInt(searchFieldsObject['date-search']['to-date-day'] ?? ''),
    });

    const rangeQuery: IRangeQuery = {
      range: {
        resourceTemporalExtentDateRange: {
          gte: startDate,
          lte: endDate,
        },
      },
    };

    boolQuery.bool.must?.push(rangeQuery);
  }

  const geoCoordinates = searchFieldsObject['coordinate-search'];

  if (
    geoCoordinates?.north &&
    geoCoordinates?.south &&
    geoCoordinates?.east &&
    geoCoordinates?.west
  ) {
    const geoShape: IShapeCoordinates = {
      type: 'envelope',
      coordinates: [
        [parseFloat(geoCoordinates.west), parseFloat(geoCoordinates.north)],
        [parseFloat(geoCoordinates.east), parseFloat(geoCoordinates.south)],
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

    if (geoCoordinates.depth && geoShapeQuery.geo_shape.geom) {
      geoShapeQuery.geo_shape.geom.depth = {
        from: 0,
        to: parseInt(geoCoordinates.depth),
      };
    }

    boolQuery.bool.must?.push(geoShapeQuery);
  }

  const finalQuery: IQuery = {
    query: boolQuery,
  };

  return finalQuery;
};

export { buildSearchQuery };
