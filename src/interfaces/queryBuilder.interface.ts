import { IFilterOptions } from './searchPayload.interface';

interface IQueryStringBlock {
  query_string: {
    query: string;
    fields?: string[];
    default_operator: string;
  };
}

interface ITermsBlock {
  terms: {
    [key: string]: string[];
  };
}

interface IFieldExistsBlock {
  exists: {
    field: string;
  };
}

interface IRangeBlock {
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

interface IGeoShapeBlock {
  geo_shape: {
    [key: string]: {
      shape: IShapeCoordinates;
      relation: string;
    };
  };
}

type IAggregationType = 'terms' | 'max' | 'min';
interface IAggregationBlock {
  [key: string]: {
    [key in IAggregationType]?: {
      field: string;
    };
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
interface ISortBlock {
  [key: string]: ISortOrder | ICustomSortScript;
}

type IMustBlock = (IQueryStringBlock | ITermsBlock | IFieldExistsBlock)[];
type IFilterBlock = (IRangeBlock | IGeoShapeBlock)[];

interface IQueryBlock {
  query: {
    bool?: {
      must?: IMustBlock;
      filter?: IFilterBlock;
    };
  };
}

interface IOtherQueryProperties {
  aggs?: IAggregationBlock;
  sort?: ISortBlock[];
  size?: number;
  from?: number;
  _source?: string[];
}

type IQuery = IQueryBlock & IOtherQueryProperties;

interface IGeoCoordinates {
  nth?: string;
  sth?: string;
  est?: string;
  wst?: string;
}

interface IDateValues {
  fdy?: string;
  fdd?: string;
  fdm?: string;
  tdy?: string;
  tdm?: string;
  tdd?: string;
}

interface IClassifyValue {
  level?: string;
  parent?: string[];
}

interface ISearchFields {
  keyword?: {
    q?: string;
  };
  date?: IDateValues;
  extent?: IGeoCoordinates;
  classify?: IClassifyValue;
}

interface ISearchFilter {
  [key: string]: string[] | IDateValues;
}

interface ISearchPayload {
  fields: ISearchFields;
  sort: string;
  level?: number;
  parent?: string[];
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
  isAggregation?: boolean;
  filterOptions?: IFilterOptions;
  docId?: string;
}

export {
  IAggregationBlock,
  ICustomSortScript,
  IDateValues,
  IFieldExistsBlock,
  IFilterBlock,
  IGeoCoordinates,
  IGeoShapeBlock,
  IMustBlock,
  IRangeBlock,
  IQuery,
  IQueryStringBlock,
  ISearchBuilderPayload,
  ISearchFields,
  ISearchFilter,
  ISearchPayload,
  IShapeCoordinates,
  ISortBlock,
  ITermsBlock,
  IQueryBlock,
  IOtherQueryProperties,
};
