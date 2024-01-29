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
      ignore_unmapped: boolean;
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

interface IQuery {
  query: IBoolQuery;
}

interface IGeoCoordinates {
  north: number;
  south: number;
  east: number;
  west: number;
  depth?: {
    from: number;
    to: number;
  };
}

interface ISearchFieldsObject {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  geoCoordinates?: IGeoCoordinates;
}

export {
  IMatchQuery,
  IBoolQuery,
  IRangeQuery,
  IQuery,
  ISearchFieldsObject,
  IShapeCoordinates,
  IGeoShapeQuery,
  IGeoCoordinates,
  IQueryString,
};
