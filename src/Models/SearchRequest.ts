class SearchRequest {
  query!: Query;
  _source!: Source;
}

class Source {
  includes: string[] = [];
}

class Query {
  bool!: BoolModel;
}

class BoolModel {
  must: Must[] = [];
}

class Must {
  query_string!: Querystring;
}

class Querystring {
  query!: string;
  default_operator!: string;
}

export { SearchRequest, BoolModel, Must, Query, Querystring, Source };
