import { IFilterOptions } from './searchPayload.interface';

interface IMatchQuery {
  match?: {
    [key: string]: string;
  };
  terms?: {
    [key: string]: string[];
  };
}

interface IRangeQuery {
  range: {
    [key: string]: {
      gte?: string;
      lte?: string;
      format?: string;
      value?: string;
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

interface IFieldExist {
  exists: {
    field: string;
  };
}

interface IBoolQuery {
  bool: {
    must?: (IBoolQuery | IRangeQuery | IGeoShapeQuery | IQueryString | IFieldExist | IFilterQuery)[];
    should?: IMatchQuery[];
    minimum_should_match?: number;
  };
}

interface IFilterQuery {
  term: {
    [key: string]: string | string[]
  }
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

type IAggregationType = 'terms' | 'max' | 'min';

interface IAggregationQueryTerm {
  field: string;
  size?: number;
  order?: { _key: string };
}

interface IAggregationDateScript {
  script: { source: string };
}

type IAggregationData = IAggregationQueryTerm | IAggregationDateScript;

interface IAggregationQuery {
  [key: string]: {
    [key in IAggregationType]?: IAggregationData;
  };
}

interface IQuery {
  size?: number;
  query: IBoolQuery;
  sort?: ISortQuery[];
  aggs?: IAggregationQuery;
  from?: number;
  _source?: string[];
}

interface IGeoCoordinates {
  nth: string;
  sth: string;
  est: string;
  wst: string;
}

interface ISearchFields {
  keyword?: {
    q?: string;
  };
  date?: {
    fdy?: string;
    fdd?: string;
    fdm?: string;
    tdy?: string;
    tdm?: string;
    tdd?: string;
  };
  extent?: {
    nth?: string;
    sth?: string;
    est?: string;
    wst?: string;
  };
  classify?: {
    level: string;
    parent?: string;
  };
}

interface ISearchFilter {
  [key: string]: string | string[] | ISearchFields;
}

interface ISearchPayload {
  fields: ISearchFields;
  sort: string;
  filters: ISearchFilter;
  rowsPerPage: number;
  page: number | null;
  fieldsExist?: string[];
  requiredFields?: string[];
}

interface ISearchBuilderPayload {
  searchFieldsObject?: ISearchPayload;
  fieldsToSearch?: string[];
  isCount?: boolean;
  ignoreAggregation?: boolean;
  filterOptions?: IFilterOptions;
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
  IAggregationQuery,
  ISearchFilter,
  ISearchBuilderPayload,
  IAggregateClassifierQuery,
  IFieldExist,
  IAggregationQueryTerm,
  IAggregationDateScript,
  IAggregationData,
  IAggregationType,
  IFilterQuery
};
