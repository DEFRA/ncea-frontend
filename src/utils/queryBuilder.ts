import { generateDateString } from './generateDateString';
import {
  IAggregateQuery,
  IBoolQuery,
  ICustomSortScript,
  IGeoShapeQuery,
  IMatchQuery,
  IQuery,
  IQueryString,
  IRangeQuery,
  ISearchFields,
  ISearchPayload,
  IShapeCoordinates,
  ISortQuery,
} from '../interfaces/queryBuilder.interface';

const quickSearchQuery = (fields: ISearchFields): IQueryString => {
  const queryString: IQueryString = {
    query_string: {
      query: fields['quick-search']?.search_term as string,
      default_operator: 'AND',
    },
  };
  return queryString;
};

const searchQueryWithFields = (searchTerm: string, fieldsToSearch: string[]): IBoolQuery => {
  const matchQueries: IMatchQuery[] = fieldsToSearch.map((field: string) => ({
    match: { [field]: searchTerm },
  })) as IMatchQuery[];

  const matchShould: IBoolQuery = {
    bool: {
      should: matchQueries,
      minimum_should_match: 1,
    },
  };
  return matchShould;
};

const dateQuery = (fields: ISearchFields): IRangeQuery => {
  const startDate: string = generateDateString({
    year: parseInt(fields['date-search'] ? (fields['date-search']['from-date-year'] as string) : ''),
    month: parseInt(fields['date-search'] ? (fields['date-search']['from-date-month'] as string) : ''),
    day: parseInt(fields['date-search'] ? (fields['date-search']['from-date-day'] as string) : ''),
  });
  const endDate: string = generateDateString(
    {
      year: parseInt(fields['date-search'] ? (fields['date-search']['to-date-year'] as string) : ''),
      month: parseInt(fields['date-search'] ? (fields['date-search']['to-date-month'] as string) : ''),
      day: parseInt(fields['date-search'] ? (fields['date-search']['to-date-day'] as string) : ''),
    },
    true,
  );

  const rangeQuery: IRangeQuery = {
    range: {
      resourceTemporalExtentDateRange: {
        gte: startDate,
        lte: endDate,
      },
    },
  };
  return rangeQuery;
};

const buildCustomSortScriptForStudyPeriod = (): ISortQuery => {
  const customScript: ICustomSortScript = {
    type: 'number',
    script: {
      source:
        "def millis = 0; if (params._source.containsKey('resourceTemporalExtentDateRange')) { for (date in params._source.resourceTemporalExtentDateRange) { if (date.containsKey('lte')) { def dateFormat = new java.text.SimpleDateFormat('yyyy-MM-dd\\'T\\'HH:mm:ss.SSS\\'Z\\''); def parsedDate = dateFormat.parse(date['lte']); millis = parsedDate.getTime(); break; } if (date.containsKey('gte')) { def dateFormat = new java.text.SimpleDateFormat('yyyy-MM-dd\\'T\\'HH:mm:ss.SSS\\'Z\\''); def parsedDate = dateFormat.parse(date['gte']); millis = parsedDate.getTime(); break; } } } return millis;",
    },
    order: 'desc',
  };
  const sortQuery: ISortQuery = {
    _script: customScript,
  };
  return sortQuery;
};

const buildBestScoreSort = (): ISortQuery => ({
  _score: {
    order: 'desc',
  },
});

const buildGeoShapeQuery = (north, south, east, west, depth) => {
  const geoShape: IShapeCoordinates = {
    type: 'envelope',
    coordinates: [
      [parseFloat(west), parseFloat(north)],
      [parseFloat(east), parseFloat(south)],
    ],
  };

  const geoShapeQuery: IGeoShapeQuery = {
    geo_shape: {
      geom: {
        shape: geoShape,
        relation: 'intersects',
      },
    },
  };

  if (depth && geoShapeQuery.geo_shape.geom) {
    geoShapeQuery.geo_shape.geom.depth = {
      from: 0,
      to: parseInt(depth),
    };
  }
  return geoShapeQuery;
};

const buildSortQuery = (finalQuery, sort, isCount) => {
  if (sort && !isCount) {
    const sortQuery: ISortQuery =
      sort === 'recent_study' ? buildCustomSortScriptForStudyPeriod() : buildBestScoreSort();
    finalQuery.sort?.push(sortQuery);
  } else {
    delete finalQuery.sort;
  }
  return finalQuery;
};

const buildAggregationQuery = (finalQuery, ignoreAggregation, isCount, aggregationField) => {
  if (!ignoreAggregation && !isCount && aggregationField) {
    const aggregateQuery: IAggregateQuery = {
      unique_values: {
        terms: {
          field: aggregationField,
        },
      },
    };
    finalQuery.aggs = aggregateQuery;
    finalQuery.size = 0;
  } else {
    delete finalQuery.aggs;
  }

  return finalQuery;
};

const buildSearchQuery = (
  searchFieldsObject: ISearchPayload,
  fieldsToSearch: string[] = [],
  isCount: boolean = false,
  ignoreAggregation: boolean = false,
  aggregationField: string = '',
): IQuery => {
  const { fields, sort, rowsPerPage, filters: filterOptions } = searchFieldsObject;
  const boolQuery: IBoolQuery = {
    bool: {
      must: [],
    },
  };

  if (!fieldsToSearch.length && fields['quick-search']) {
    const queryString: IQueryString = quickSearchQuery(fields);
    boolQuery.bool.must?.push(queryString);
  }

  if (fields['quick-search'] && fieldsToSearch.length) {
    const searchTerm = fields['quick-search']?.search_term as string;
    const matchShould: IBoolQuery = searchQueryWithFields(searchTerm, fieldsToSearch);
    boolQuery.bool.must?.push(matchShould);
  }

  if (filterOptions && Object.keys(filterOptions).length && !isCount && ignoreAggregation) {
    const filteredOptions = Object.keys(filterOptions).filter((key) => filterOptions[key] !== 'all') ?? [];

    filteredOptions.forEach((key) => {
      const matchShould: IBoolQuery = searchQueryWithFields(filterOptions[key] as string, [key]);
      boolQuery.bool.must?.push(matchShould);
    });
  }

  if (fields['date-search']?.['from-date-year'] && fields['date-search']['to-date-year']) {
    const rangeQuery: IRangeQuery = dateQuery(fields);
    boolQuery.bool.must?.push(rangeQuery);
  }

  const geoCoordinates = fields['coordinate-search'];

  if (geoCoordinates?.north && geoCoordinates?.south && geoCoordinates?.east && geoCoordinates?.west) {
    const geoShapeQuery = buildGeoShapeQuery(
      geoCoordinates?.north,
      geoCoordinates?.south,
      geoCoordinates?.east,
      geoCoordinates?.west,
      geoCoordinates.depth,
    );

    boolQuery.bool.must?.push(geoShapeQuery);
  }

  let finalQuery: IQuery = {
    query: boolQuery,
    sort: [],
    aggs: {},
    size: rowsPerPage,
  };

  finalQuery = buildSortQuery(finalQuery, sort, isCount);

  finalQuery = buildAggregationQuery(finalQuery, ignoreAggregation, isCount, aggregationField);

  if (isCount) {
    delete finalQuery.size;
    delete finalQuery.aggs;
  }

  return finalQuery;
};

export { buildSearchQuery, buildCustomSortScriptForStudyPeriod };
