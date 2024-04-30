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

interface IFieldExist {
  exists: {
    field: string;
  };
}

interface IBoolQuery {
  bool: {
    must?: (IBoolQuery | IRangeQuery | IGeoShapeQuery | IQueryString | IFieldExist)[];
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
  _source?: string[];
}

interface IGeoCoordinates {
  nth: string;
  sth: string;
  est: string;
  wst: string;
  dpt?: string;
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
    dpt?: string;
    nth?: string;
    sth?: string;
    est?: string;
    wst?: string;
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
  page: number | null;
  fieldsExist?: string[];
  requiredFields?: string[];
}

interface ISearchBuilderPayload {
  searchFieldsObject?: ISearchPayload;
  fieldsToSearch?: string[];
  isCount?: boolean;
  ignoreAggregation?: boolean;
  aggregationField?: string;
  docId?: string;
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
  IFieldExist,
};
