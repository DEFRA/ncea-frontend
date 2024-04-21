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

interface IShapeCoordinates {
  type: string;
  coordinates: [[number, number], [number, number]];
}

interface IGeoShapeQuery {
  geo_shape: {
    [key: string]: {
      shape: IShapeCoordinates;
      depth?: {
        from: number;
        to: number;
      };
      relation: string;
    };
  };
}

interface IQueryString {
  query_string: {
    query: string;
    default_operator: string;
  };
}

interface IBoolQuery {
  bool: {
    must?: (IBoolQuery | IRangeQuery | IGeoShapeQuery | IQueryString)[];
    should?: IMatchQuery[];
    minimum_should_match?: number;
  };
}

interface ISortOrder {
  order: string;
}
interface ICustomSortScript extends ISortOrder {
  type: string;
  script: {
    source: string;
  };
}
interface ISortQuery {
  [key: string]: ISortOrder | ICustomSortScript;
}

interface IAggregateQuery {
  unique_values?: {
    terms?: {
      field?: string;
    };
  };
}

interface IQuery {
  size?: number;
  query: IBoolQuery;
  sort?: ISortQuery[];
  aggs?: IAggregateQuery;
  from?: number;
}

interface IGeoCoordinates {
  north: string;
  south: string;
  east: string;
  west: string;
  depth?: string;
}

interface ISearchFields {
  'quick-search'?: {
    search_term?: string;
  };
  'date-search'?: {
    'from-date-year'?: string;
    'from-date-day'?: string;
    'from-date-month'?: string;
    'to-date-year'?: string;
    'to-date-day'?: string;
    'to-date-month'?: string;
  };
  'coordinate-search'?: {
    depth?: string;
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };
}

interface ISearchFilter {
  [key: string]: string;
}

interface ISearchPayload {
  fields: ISearchFields;
  sort: string;
  filters: ISearchFilter;
  rowsPerPage: number;
  page: number;
}

interface ISearchBuilderPayload {
  searchFieldsObject?: ISearchPayload;
  fieldsToSearch?: string[];
  isCount?: boolean;
  ignoreAggregation?: boolean;
  aggregationField?: string;
  docId?: string;
}

interface IAggregateClassifierQuery {
  size: number;
  aggs: {
    classifier_level: {
      filter: {
        bool: {
          must: Record<string, Record<string, string | string[]>>[];
        };
      };
      aggs: {
        classifier_values: {
          terms: {
            field: string;
          };
        };
      };
    };
  };
}

export {
  IMatchQuery,
  IBoolQuery,
  IRangeQuery,
  IQuery,
  ISearchPayload,
  ISearchFields,
  IShapeCoordinates,
  IGeoShapeQuery,
  IGeoCoordinates,
  IQueryString,
  ISortQuery,
  ICustomSortScript,
  IAggregateQuery,
  ISearchFilter,
  ISearchBuilderPayload,
  IAggregateClassifierQuery,
};
