import { generateDateString } from './generateDateString';
import { mapResultMaxCount } from './constants';
import {
  IAggregationQuery,
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
import {
  IFilterOption,
  IFilterOptions,
} from '../interfaces/searchPayload.interface';

const buildKeywordSearchQuery = (searchTerm: string): IQueryString => {
  const queryString: IQueryString = {
    query_string: {
      query: searchTerm,
      default_operator: 'AND',
    },
  };
  return queryString;
};

const buildSearchQueryWithFields = (
  searchTerm: string | string[],
  fieldsToSearch: string[],
): IBoolQuery => {
  const matchQueryKey = Array.isArray(searchTerm) ? 'terms' : 'match';
  const matchQueries: IMatchQuery[] = fieldsToSearch.map((field: string) => ({
    [matchQueryKey]: {
      [field]: searchTerm,
    },
  })) as IMatchQuery[];

  const matchShould: IBoolQuery = {
    bool: {
      should: matchQueries,
      minimum_should_match: 1,
    },
  };
  return matchShould;
};

const buildDateQuery = (
  fields: ISearchFields,
  isToDate: boolean = false,
): IRangeQuery => {
  const key: string = isToDate
    ? 'resourceTemporalExtentDetails.end.date'
    : 'resourceTemporalExtentDetails.start.date';
  const operatorKey: string = isToDate ? 'lte' : 'gte';
  const yearKey = isToDate ? 'tdy' : 'fdy';
  const monthKey = isToDate ? 'tdm' : 'fdm';
  const dateKey = isToDate ? 'tdd' : 'fdd';
  const dateValue: string = generateDateString(
    {
      year: parseInt(fields.date ? (fields.date?.[yearKey] as string) : ''),
      month: parseInt(fields.date ? (fields.date?.[monthKey] as string) : ''),
      day: parseInt(fields.date ? (fields.date?.[dateKey] as string) : ''),
    },
    isToDate,
  );

  const rangeQuery: IRangeQuery = {
    range: {
      [key]: {
        [operatorKey]: dateValue,
        format: 'yyyy-MM-dd',
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

const buildGeoShapeQuery = (
  geoCoordinates: IGeoCoordinates,
): IGeoShapeQuery => {
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
  return geoShapeQuery;
};

const buildSearchQuery = (
  searchBuilderPayload: ISearchBuilderPayload,
): IQuery => {
  const {
    searchFieldsObject,
    fieldsToSearch = [],
    isCount = false,
    ignoreAggregation = false,
    filterOptions = [],
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
    filters,
    fieldsExist = [],
    requiredFields = [],
  } = (searchFieldsObject as ISearchPayload) ?? {};

  addKeywordSearchQuery(fields, fieldsToSearch, boolQuery);
  addFilterOptionsQuery(filters, isCount, ignoreAggregation, boolQuery);
  addDateSearchQuery(fields, boolQuery);
  addCoordinateSearchQuery(fields, boolQuery);
  !Object.keys(searchFieldsObject ?? {}).length &&
    docId &&
    addDetailsQuery(docId, boolQuery);

  const isSort = sort && !isCount;
  const isAggregation =
    !ignoreAggregation && !isCount && filterOptions.length > 0;
  fieldsExist.length > 0 && addFieldExistsQuery(boolQuery, fieldsExist);

  const finalQuery: IQuery = {
    query: boolQuery,
    ...(isSort && { sort: [] }),
    ...(isAggregation && { aggs: {} }),
    ...(!isCount && { size: isAggregation ? 0 : rowsPerPage }),
    ...(page &&
      rowsPerPage !== mapResultMaxCount && {
        from: page === 1 ? 0 : (page - 1) * rowsPerPage,
      }),
    ...(!isCount && { _source: requiredFields ?? [] }),
  };

  isSort && addSortQuery(finalQuery, sort, isCount);
  if (isAggregation) {
    const aggregateQuery: IAggregationQuery =
      generateAggregationQuery(filterOptions);
    finalQuery.aggs = { ...aggregateQuery };
  }

  return finalQuery;
};

const addFieldExistsQuery = (
  boolQuery: IBoolQuery,
  fieldsExist: string[],
): void => {
  fieldsExist.forEach((field: string) => {
    const fieldExists: IFieldExist = { exists: { field } };
    boolQuery.bool.must?.push(fieldExists);
  });
};

const addKeywordSearchQuery = (
  fields: ISearchFields,
  fieldsToSearch: string[],
  boolQuery: IBoolQuery,
): void => {
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
  if (
    filterOptions &&
    Object.keys(filterOptions).length &&
    !isCount &&
    ignoreAggregation
  ) {
    const filteredOptions =
      Object.keys(filterOptions).filter(
        (key) => filterOptions[key] !== 'all',
      ) ?? [];

    filteredOptions.forEach((key) => {
      if (key.includes('resourceType')) {
        const matchShould: IBoolQuery = buildSearchQueryWithFields(
          filterOptions[key] as string | string[],
          [key],
        );
        boolQuery.bool.must?.push(matchShould);
      }
      if (key.includes('Date')) {
        const startDateRangeQuery: IRangeQuery = buildDateQuery(
          filterOptions[key] as ISearchFields,
        );
        boolQuery.bool.must?.push(startDateRangeQuery);
        const endDateRangeQuery: IRangeQuery = buildDateQuery(
          filterOptions[key] as ISearchFields,
          true,
        );
        boolQuery.bool.must?.push(endDateRangeQuery);
      }
    });
  }
};

const addDateSearchQuery = (
  fields: ISearchFields,
  boolQuery: IBoolQuery,
): void => {
  if (fields?.date?.fdy && fields?.date?.tdy) {
    const startDateRangeQuery: IRangeQuery = buildDateQuery(fields);
    boolQuery.bool.must?.push(startDateRangeQuery);
    const endDateRangeQuery: IRangeQuery = buildDateQuery(fields, true);
    boolQuery.bool.must?.push(endDateRangeQuery);
  }
};

const addCoordinateSearchQuery = (
  fields: ISearchFields,
  boolQuery: IBoolQuery,
): void => {
  const geoCoordinates: IGeoCoordinates = fields?.extent as IGeoCoordinates;

  if (
    geoCoordinates?.nth &&
    geoCoordinates?.sth &&
    geoCoordinates?.est &&
    geoCoordinates?.wst
  ) {
    const geoShapeQuery: IGeoShapeQuery = buildGeoShapeQuery(geoCoordinates);
    boolQuery.bool.must?.push(geoShapeQuery);
  }
};

const addSortQuery = (
  finalQuery: IQuery,
  sort: string,
  isCount: boolean,
): void => {
  if (sort && !isCount) {
    const sortQuery: ISortQuery =
      sort === 'recent_study'
        ? buildCustomSortScriptForStudyPeriod()
        : buildBestScoreSort();
    finalQuery.sort?.push(sortQuery);
  }
};

const generateAggregationQuery = (
  filteredOptions: IFilterOptions,
): IAggregationQuery => {
  const aggregationQuery: IAggregationQuery = {};
  filteredOptions.forEach((filterOption: IFilterOption) => {
    const { key, field, isTerm, isDate, order } = filterOption;
    if (isTerm) {
      const fieldValue: string = field as string;
      aggregationQuery[key] = {
        terms: {
          field: fieldValue,
          size: mapResultMaxCount,
          ...(order && { order: { _key: order } }),
        },
      };
    } else if (isDate) {
      const fieldValues: string[] = field as string[];
      fieldValues.forEach((fieldValue: string) => {
        const [maxMinKey, field] = fieldValue.split('_');
        aggregationQuery[`${maxMinKey}-${key}`] = {
          [maxMinKey!]: {
            script: {
              source: `if (doc['${field}'].size() > 0) { doc['${field}'].value.year } else { null }`,
            },
          },
        };
      });
    }
  });
  return aggregationQuery;
};

const addDetailsQuery = (docId: string, boolQuery: IBoolQuery): void => {
  if (docId) {
    const queryString: IBoolQuery = buildSearchQueryWithFields(docId, ['_id']);
    boolQuery.bool.must?.push(queryString);
  }
};

export { buildSearchQuery, buildCustomSortScriptForStudyPeriod };
