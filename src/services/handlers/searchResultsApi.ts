import { geoNetworkClient } from '../../config/geoNetworkClient';
import { BoolModel, Must, Query, Querystring, SearchRequest } from '../../Models/SearchRequest';

//let data = '{"query": {"function_score": {"query": {"bool": {"must": [{"query_string": {"query": "One of the Fisheries Science Partnership","default_operator": "AND"}},{"geo_shape": {"geom": {"shape": {"type": "envelope","coordinates": [[-7.951613387380291,50.758246638853024],[-1.8064520970577118,48.949095667462274]]},"relation": "intersects"}}}]}}}},"_source": {"includes": ["uuid","id","groupOwner","logo","cat","inspireThemeUri","inspireTheme_syn","cl_topic","resourceType","resourceTitle*","resourceAbstract*","draft","owner","link","status*","rating","geom","contact*","Org*","isTemplate","valid","isHarvested","dateStamp","documentStandard","standardNameObject.default","cl_status*","mdStatus*"]}}';

const url = 'http://20.77.9.229:8080/geonetwork/srv/api/search/records/_search?bucket=s101';

const getSearchRequest = function (searchTerm: string) {
  const queryString = new Querystring();
  queryString.query = searchTerm;
  queryString.default_operator = 'AND';

  const must = new Must();
  must.query_string = queryString;

  const boolModel = new BoolModel();
  boolModel.must.push(must);

  const queryModel = new Query();
  queryModel.bool = boolModel;

  //   const sourceModel = new Source();
  //   sourceModel.includes = [
  //     'uuid',
  //     'id',
  //     'groupOwner',
  //     'logo',
  //     'cat',
  //     'inspireThemeUri',
  //     'inspireTheme_syn',
  //     'cl_topic',
  //     'resourceType',
  //     'resourceTitle*',
  //     'resourceAbstract*',
  //     'draft',
  //     'owner',
  //     'link',
  //     'status*',
  //     'rating',
  //     'geom',
  //     'contact*',
  //     'Org*',
  //     'isTemplate',
  //     'valid',
  //     'isHarvested',
  //     'dateStamp',
  //     'documentStandard',
  //     'standardNameObject.default',
  //     'cl_status*',
  //     'mdStatus*',
  //   ];

  const searchRequestObj = new SearchRequest();
  searchRequestObj.query = queryModel;
  //   searchRequestObj._source = sourceModel;

  return searchRequestObj;
};

const getSearchResults = async (query: string) => {
  const searchRequestObj = getSearchRequest(query);
  return await geoNetworkClient.post(url, searchRequestObj);
};

export { getSearchResults };
