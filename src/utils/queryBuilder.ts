import { generateDateString } from './generateDateString';
import {
  IAggregateQuery,
  IBoolQuery,
  ICustomSortScript,
  IFieldExist,
  IGeoCoordinates,
  IGeoShapeQuery,
  IMatchQuery,
  IQuery,
  IQueryString,
  IRangeQuery,
  ISearchBuilderPayload,
  ISearchFields,
  ISearchFilter,
  ISearchPayload,
  IShapeCoordinates,
  ISortQuery,
} from '../interfaces/queryBuilder.interface';

const buildKeywordSearchQuery = (searchTerm: string): IQueryString => {
  const queryString: IQueryString = {
    query_string: {
      query: searchTerm,
      default_operator: 'AND',
    },
  };
  return queryString;
};

const buildSearchQueryWithFields = (searchTerm: string, fieldsToSearch: string[]): IBoolQuery => {
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

const buildDateQuery = (fields: ISearchFields): IRangeQuery => {
  const startDate: string = generateDateString({
    year: parseInt(fields.date ? (fields.date?.fdy as string) : ''),
    month: parseInt(fields.date ? (fields.date?.fdm as string) : ''),
    day: parseInt(fields.date ? (fields.date?.fdd as string) : ''),
  });
  const endDate: string = generateDateString(
    {
      year: parseInt(fields.date ? (fields.date?.tdy as string) : ''),
      month: parseInt(fields.date ? (fields.date?.tdm as string) : ''),
      day: parseInt(fields.date ? (fields.date?.tdd as string) : ''),
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

const buildGeoShapeQuery = (geoCoordinates: IGeoCoordinates): IGeoShapeQuery => {
  const geoShape: IShapeCoordinates = {
    type: 'envelope',
    coordinates: [
      [parseFloat(geoCoordinates.wst), parseFloat(geoCoordinates.nth)],
      [parseFloat(geoCoordinates.est), parseFloat(geoCoordinates.sth)],
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

  if (geoCoordinates.dpt && geoShapeQuery.geo_shape.geom) {
    geoShapeQuery.geo_shape.geom.depth = {
      from: 0,
      to: parseInt(geoCoordinates.dpt),
    };
  }
  return geoShapeQuery;
};

const buildSearchQuery = (searchBuilderPayload: ISearchBuilderPayload): IQuery => {
  const {
    searchFieldsObject,
    fieldsToSearch = [],
    isCount = false,
    ignoreAggregation = false,
    aggregationField = '',
    docId = '',
  } = searchBuilderPayload;
  const boolQuery: IBoolQuery = {
    bool: {
      must: [],
    },
  };
  const {
    fields,
    sort,
    rowsPerPage,
    page,
    filters: filterOptions,
    fieldsExist = [],
    requiredFields = [],
  } = (searchFieldsObject as ISearchPayload) ?? {};

  addKeywordSearchQuery(fields, fieldsToSearch, boolQuery);
  addFilterOptionsQuery(filterOptions, isCount, ignoreAggregation, boolQuery);
  addDateSearchQuery(fields, boolQuery);
  addCoordinateSearchQuery(fields, boolQuery);
  !Object.keys(searchFieldsObject ?? {}).length && docId && addDetailsQuery(docId, boolQuery);

  const isSort = sort && !isCount;
  const isAggregation = !ignoreAggregation && !isCount && aggregationField;
  fieldsExist.length > 0 && addFieldExistsQuery(boolQuery, fieldsExist);

  const finalQuery: IQuery = {
    query: boolQuery,
    ...(isSort && { sort: [] }),
    ...(isAggregation && { aggs: {} }),
    ...(!isCount && { size: isAggregation ? 0 : rowsPerPage }),
    ...(page && { from: page === 1 ? 0 : (page - 1) * rowsPerPage }),
    ...(!isCount && { _source: requiredFields ?? [] }),
  };

  isSort && addSortQuery(finalQuery, sort, isCount);
  isAggregation && addAggregationQuery(finalQuery, ignoreAggregation, isCount, aggregationField);

  return finalQuery;
};

const addFieldExistsQuery = (boolQuery: IBoolQuery, fieldsExist: string[]): void => {
  fieldsExist.forEach((field: string) => {
    const fieldExists: IFieldExist = { exists: { field } };
    boolQuery.bool.must?.push(fieldExists);
  });
};

const addKeywordSearchQuery = (fields: ISearchFields, fieldsToSearch: string[], boolQuery: IBoolQuery): void => {
  if (fields?.keyword) {
    const searchTerm: string = fields?.keyword?.q as string;
    let queryString: IQueryString | IBoolQuery;
    if (fieldsToSearch.length) {
      queryString = buildSearchQueryWithFields(searchTerm, fieldsToSearch);
    } else {
      queryString = buildKeywordSearchQuery(searchTerm);
    }
    boolQuery.bool.must?.push(queryString);
  }
};

const addFilterOptionsQuery = (
  filterOptions: ISearchFilter,
  isCount: boolean,
  ignoreAggregation: boolean,
  boolQuery: IBoolQuery,
): void => {
  if (filterOptions && Object.keys(filterOptions).length && !isCount && ignoreAggregation) {
    const filteredOptions = Object.keys(filterOptions).filter((key) => filterOptions[key] !== 'all') ?? [];

    filteredOptions.forEach((key) => {
      const matchShould: IBoolQuery = buildSearchQueryWithFields(filterOptions[key] as string, [key]);
      boolQuery.bool.must?.push(matchShould);
    });
  }
};

const addDateSearchQuery = (fields: ISearchFields, boolQuery: IBoolQuery): void => {
  if (fields?.date?.fdy && fields?.date?.tdy) {
    const rangeQuery: IRangeQuery = buildDateQuery(fields);
    boolQuery.bool.must?.push(rangeQuery);
  }
};

const addCoordinateSearchQuery = (fields: ISearchFields, boolQuery: IBoolQuery): void => {
  const geoCoordinates: IGeoCoordinates = fields?.extent as IGeoCoordinates;

  if (geoCoordinates?.nth && geoCoordinates?.sth && geoCoordinates?.est && geoCoordinates?.wst) {
    const geoShapeQuery: IGeoShapeQuery = buildGeoShapeQuery(geoCoordinates);
    boolQuery.bool.must?.push(geoShapeQuery);
  }
};

const addSortQuery = (finalQuery: IQuery, sort: string, isCount: boolean): void => {
  if (sort && !isCount) {
    const sortQuery: ISortQuery =
      sort === 'recent_study' ? buildCustomSortScriptForStudyPeriod() : buildBestScoreSort();
    finalQuery.sort?.push(sortQuery);
  }
};

const addAggregationQuery = (
  finalQuery: IQuery,
  ignoreAggregation: boolean,
  isCount: boolean,
  aggregationField: string,
): void => {
  if (!ignoreAggregation && !isCount && aggregationField) {
    const aggregateQuery: IAggregateQuery = {
      unique_values: {
        terms: {
          field: aggregationField,
        },
      },
    };
    finalQuery.aggs = aggregateQuery;
  }
};

const addDetailsQuery = (docId: string, boolQuery: IBoolQuery): void => {
  if (docId) {
    const queryString: IBoolQuery = buildSearchQueryWithFields(docId, ['_id']);
    boolQuery.bool.must?.push(queryString);
  }
};

export { buildSearchQuery, buildCustomSortScriptForStudyPeriod };
