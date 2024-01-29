class SearchRequest {
  query!: Query;
  _source!: Source;

  constructor(query: Query, _source: Source | null) {
    this.query = query;

    if (_source != null) {
      this._source = _source;
    }
  }
}

class Source {
  includes: string[] = [];

  constructor(includes: string[]) {
    this.includes = includes;
  }
}

class Query {
  bool!: BoolModel;

  constructor(bool: BoolModel) {
    this.bool = bool;
  }
}

class BoolModel {
  must: Must[] = [];

  constructor(must: Must[]) {
    this.must = must;
  }
}

class Must {
  query_string!: Querystring;

  constructor(query_string: Querystring) {
    this.query_string = query_string;
  }
}

class Querystring {
  query!: string | null;
  default_operator!: string;

  constructor(query: string, default_operator: string) {
    this.query = query;
    this.default_operator = default_operator;
  }
}

export { SearchRequest, BoolModel, Must, Query, Querystring, Source };
