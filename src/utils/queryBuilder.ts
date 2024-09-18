import { estypes } from '@elastic/elasticsearch';
import { generateDateString } from './generateDateString';
import {
  IDateValues,
  IGeoCoordinates,
  IGeoShapeBlock,
  ISearchBuilderPayload,
  ISearchPayload,
  IShapeCoordinates,
} from '../interfaces/queryBuilder.interface';
import {
  levelMap,
  mapResultMaxCount,
  originatorTypeFilterField,
  resourceTypeFilterField,
  studyPeriodFilterField,
} from './constants';

const _generateQueryStringBlock = (
  searchTerm: string,
  fieldsToSearch: string[] = [],
): estypes.QueryDslQueryContainer => {
  return {
    query_string: {
      query: searchTerm,
      default_operator: 'AND',
      ...(fieldsToSearch.length > 0 && { fields: fieldsToSearch }),
    },
  };
};

const _generateTermsBlock = (field: string, values: string[]): estypes.QueryDslQueryContainer => {
  return {
    terms: {
      [field]: values,
    },
  };
};


const _generateFieldExistsBlock = (field: string): estypes.QueryDslQueryContainer => {
  return {
    exists: { field },
  };
};

const _generateRangeBlock = (fields: IDateValues): estypes.QueryDslQueryContainer[] => {
  const startDateValue: string = generateDateString({
    year: parseInt(fields.fdy!),
    month: parseInt(fields.fdm ?? ''),
    day: parseInt(fields.fdd ?? ''),
  });
  const toDateValue: string = generateDateString(
    {
      year: parseInt(fields.tdy!),
      month: parseInt(fields.tdm ?? ''),
      day: parseInt(fields.tdd ?? ''),
    },
    true,
  );

  const rangeBlock: estypes.QueryDslQueryContainer[] = [
    {
      bool: {
        should: [
          {
            bool: {
              must: [
                {
                  range: {
                    'resourceTemporalExtentDetails.start.date': {
                      lte: startDateValue,
                    },
                  },
                },
                {
                  range: {
                    'resourceTemporalExtentDetails.end.date': {
                      gte: startDateValue,
                    },
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  range: {
                    'resourceTemporalExtentDetails.start.date': {
                      gte: startDateValue,
                    },
                  },
                },
                {
                  range: {
                    'resourceTemporalExtentDetails.end.date': {
                      lte: toDateValue,
                    },
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  range: {
                    'resourceTemporalExtentDetails.start.date': {
                      gte: startDateValue,
                    },
                  },
                },
                {
                  range: {
                    'resourceTemporalExtentDetails.start.date': {
                      lte: toDateValue,
                    },
                  },
                },
              ],
            },
          },
        ],
        minimum_should_match: 1,
      },
    },
  ];
  return rangeBlock;
};

const _generateGeoShapeBlock = (geoCoordinates: IGeoCoordinates): estypes.QueryDslQueryContainer => {
  const geoShape: IShapeCoordinates = {
    type: 'envelope',
    coordinates: [
      [parseFloat(geoCoordinates.wst!), parseFloat(geoCoordinates.nth!)],
      [parseFloat(geoCoordinates.est!), parseFloat(geoCoordinates.sth!)],
    ],
  };

  const geoShapeBlock: IGeoShapeBlock = {
    geo_shape: {
      geom: {
        shape: geoShape,
        relation: 'intersects',
      },
    },
  };
  return geoShapeBlock as estypes.QueryDslQueryContainer;
};

const buildCustomSortScriptForStudyPeriod = (orderType): estypes.Sort => {
  const customScript: estypes.ScriptSort = {
    type: 'number',
    script: {
      source:
        orderType === 'asc'
          ? "def millis = Long.MAX_VALUE; if (params._source.containsKey('resourceTemporalExtentDateRange')) { for (date in params._source.resourceTemporalExtentDateRange) { if (date.containsKey('gte')) { def dateFormat = new java.text.SimpleDateFormat('yyyy-MM-dd\\'T\\'HH:mm:ss.SSS\\'Z\\''); def parsedDate = dateFormat.parse(date['gte']); millis = parsedDate.getTime(); break; }} } return millis;"
          : "def millis = Long.MIN_VALUE; if (params._source.containsKey('resourceTemporalExtentDateRange')) { for (date in params._source.resourceTemporalExtentDateRange) { if (date.containsKey('lte')) { def dateFormat = new java.text.SimpleDateFormat('yyyy-MM-dd\\'T\\'HH:mm:ss.SSS\\'Z\\''); def parsedDate = dateFormat.parse(date['lte']); millis = parsedDate.getTime(); break; } if (date.containsKey('gte')) { def dateFormat = new java.text.SimpleDateFormat('yyyy-MM-dd\\'T\\'HH:mm:ss.SSS\\'Z\\''); def parsedDate = dateFormat.parse(date['gte']); millis = parsedDate.getTime(); break; } } } return millis;",
    },
    order: orderType,
  };
  const sortBlock: estypes.SortOptions = {
    _script: customScript,
  };
  return sortBlock;
};

const _buildBestScoreSort = (): estypes.Sort => ({
  _score: {
    order: 'desc',
  },
});

const _generateSortBlock = (sort: string): estypes.Sort => {
  const orderType = sort === 'oldest_study_period' ? 'asc' : 'desc';
  const sortBlock: estypes.Sort =
    sort === 'oldest_study_period' || sort === 'newest_study_period'
      ? buildCustomSortScriptForStudyPeriod(orderType)
      : _buildBestScoreSort();
  return sortBlock;
};

const _generateOtherQueryProperties = (searchBuilderPayload: ISearchBuilderPayload): estypes.SearchRequest => {
  const { searchFieldsObject, isCount = false, isAggregation = false, docId = '' } = searchBuilderPayload;
  const { sort, rowsPerPage, page, requiredFields = [] } = (searchFieldsObject as ISearchPayload) ?? {};

  const isSort: boolean = sort !== '' && !isCount && docId === '' && !isAggregation;
  const sortBlock: estypes.Sort = isSort ? _generateSortBlock(sort) : '';

  return {
    ...(isSort && { sort: sortBlock }),
    ...(!isCount && docId === '' && { size: isAggregation ? 0 : rowsPerPage }),
    ...(!isCount &&
      !isAggregation &&
      docId === '' &&
      page &&
      rowsPerPage !== mapResultMaxCount && {
        from: page === 1 ? 0 : (page - 1) * rowsPerPage,
      }),
    ...(!isCount && docId === '' && !isAggregation && { _source: requiredFields }),
  } as estypes.SearchRequest;
};

const _generateQuery = (searchBuilderPayload: ISearchBuilderPayload): estypes.SearchRequest => {
  const { searchFieldsObject, fieldsToSearch = [], docId = '' } = searchBuilderPayload;
  const { fields, fieldsExist = [] } = (searchFieldsObject as ISearchPayload) ?? {};

  const searchTerm: string = fields?.keyword?.q as string;

  const mustBlock: estypes.QueryDslQueryContainer[] = docId ? [_generateQueryStringBlock(docId, ['_id'])] : [];
  if (searchTerm && docId === '') mustBlock.push(_generateQueryStringBlock(searchTerm, fieldsToSearch));
  if (fieldsExist.length > 0 && docId === '') {
    fieldsExist.forEach((field: string) => {
      mustBlock.push(_generateFieldExistsBlock(field));
    });
  }

  const geoCoordinates: IGeoCoordinates = fields?.extent as IGeoCoordinates;
  const { nth = '', sth = '', est = '', wst = '' } = geoCoordinates ?? {};
  const filterBlock: estypes.QueryDslQueryContainer[] =
    nth && sth && est && wst ? [_generateGeoShapeBlock(geoCoordinates)] : [];

  return {
    query: {
      bool: {
        ...(mustBlock.length && { must: mustBlock }),
        ...(filterBlock.length && { filter: filterBlock }),
      },
    },
    ..._generateOtherQueryProperties(searchBuilderPayload),
  };
};

const _generateDateRangeQuery = (
  searchBuilderPayload: ISearchBuilderPayload,
  queryPayload: estypes.SearchRequest,
): estypes.QueryDslQueryContainer[] => {
  const { searchFieldsObject } = searchBuilderPayload;
  const { filters, fields } = (searchFieldsObject as ISearchPayload) ?? {};
  const { level, parent } = (searchFieldsObject?.fields.classify as ISearchPayload) ?? {};
  const parentArray = typeof parent === 'string' ? (parent as string).split(',').map((item) => item.trim()) : [];
  const newParentArray = [...new Set(parentArray)];
  const filterBlock: estypes.QueryDslQueryContainer[] =
    (queryPayload.query?.bool?.filter as estypes.QueryDslQueryContainer[]) ?? [];
  const studyPeriodFilter: IDateValues = (filters?.[studyPeriodFilterField] as IDateValues) ?? { fdy: '', tdy: '' };
  if (studyPeriodFilter?.fdy && studyPeriodFilter?.tdy) {
    const newFields: IDateValues = {
      fdy: studyPeriodFilter?.fdy,
      tdy: studyPeriodFilter?.tdy,
    };
    filterBlock.push(..._generateRangeBlock(newFields));
  } else if (fields?.date?.fdy && fields?.date?.tdy) {
    filterBlock.push(..._generateRangeBlock(fields.date));
  }
  if (fields?.classify?.level && fields.classify.parent) {
    filterBlock.push(_generateTermsBlock(level && levelMap[level], newParentArray));
  }
  return filterBlock;
};

const _generateOriginatorTypeFilter = (originatorTypeFilters: string[]): estypes.QueryDslQueryContainer => {
  const scriptSource =
  "if (doc['contactForResource.organisationName.keyword'].size() > 0) { String orgName = doc['contactForResource.organisationName.keyword'].value; String cleanOrgName = orgName.replace(',', '').replace(\"'\", '').replace('-', '').trim().toLowerCase(); List targetOrgNames = []; for (String org : params.orgNames) { String cleanOrg = org.replace(',', '').replace(\"'\", '').replace('-', '').trim().toLowerCase(); targetOrgNames.add(cleanOrg); } for (String targetOrgName : targetOrgNames) { if (cleanOrgName.equals(targetOrgName)) { return true; } } return false; } else { return false; }";

  return {
    bool: {
      should: [
        {
          nested: {
            path: 'contactForResource',
            query: {
              bool: {
                must: [
                  {
                    match: {
                      'contactForResource.role': 'originator',
                    },
                  },
                  {
                    script: {
                      script: {
                        source: scriptSource,
                        lang: 'painless',
                        params: {
                          orgNames: originatorTypeFilters,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
        {
          nested: {
            path: 'contact',
            query: {
              bool: {
                must: [
                  {
                    match: {
                      'contact.role': 'originator',
                    },
                  },
                  {
                    script: {
                      script: {
                        source: scriptSource,
                        lang: 'painless',
                        params: {
                          orgNames: originatorTypeFilters,
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  };
};

const generateSearchQuery = (searchBuilderPayload: ISearchBuilderPayload): estypes.SearchRequest => {
  const queryPayload: estypes.SearchRequest = _generateQuery(searchBuilderPayload);
  const { searchFieldsObject, docId = '' } = searchBuilderPayload;
  const { filters } = (searchFieldsObject as ISearchPayload) ?? {};
  if (docId === '') {
    const filterBlock: estypes.QueryDslQueryContainer[] = _generateDateRangeQuery(searchBuilderPayload, queryPayload);
    const mustBlock: estypes.QueryDslQueryContainer[] =
      (queryPayload.query?.bool?.must as estypes.QueryDslQueryContainer[]) ?? [];

    const resourceTypeFilters: string[] = (filters?.[resourceTypeFilterField] as string[]) ?? [];

    if (resourceTypeFilters.length > 0) {
      mustBlock.push(_generateTermsBlock('resourceType', filters[resourceTypeFilterField] as string[]));
    }

    const originatorTypeFilters: string[] = (filters?.[originatorTypeFilterField] as string[]) ?? [];
    if (originatorTypeFilters.length > 0) {
      mustBlock.push(_generateOriginatorTypeFilter(originatorTypeFilters));
    }

    if (queryPayload?.query?.bool) {
      queryPayload.query.bool = {
        must: [...mustBlock],
        filter: [...filterBlock],
      };
    }
  }
  return queryPayload;
};

const _generateStudyPeriodFilterQuery = (searchBuilderPayload: ISearchBuilderPayload): estypes.SearchRequest => {
  const queryPayload: estypes.SearchRequest = _generateQuery(searchBuilderPayload);
  const { searchFieldsObject, docId = '' } = searchBuilderPayload;
  const { fields, filters } = searchFieldsObject as ISearchPayload;
  const { level, parent } = (searchFieldsObject?.fields.classify as ISearchPayload) ?? {};

  const parentArray = typeof parent === 'string' ? (parent as string).split(',').map((item) => item.trim()) : [];
  const newParentArray = [...new Set(parentArray)];

  if (docId === '') {
    const mustBlock: estypes.QueryDslQueryContainer[] =
      (queryPayload.query?.bool?.must as estypes.QueryDslQueryContainer[]) ?? [];

    const filterBlock: estypes.QueryDslQueryContainer[] =
      (queryPayload.query?.bool?.filter as estypes.QueryDslQueryContainer[]) ?? [];

    const resourceTypeFilters: string[] = (filters?.[resourceTypeFilterField] as string[]) ?? [];
    const originatorTypeFilters: string[] = (filters?.[originatorTypeFilterField] as string[]) ?? [];

    if (fields?.date?.fdy && fields?.date?.tdy) {
      filterBlock.push(..._generateRangeBlock(fields.date));
    }

    if (resourceTypeFilters.length > 0) {
      mustBlock.push(_generateTermsBlock('resourceType', filters[resourceTypeFilterField] as string[]));
    }
    if (originatorTypeFilters.length > 0) {
      mustBlock.push(_generateOriginatorTypeFilter(originatorTypeFilters));
    }
    if (level && levelMap[level]) {
      filterBlock.push(_generateTermsBlock(levelMap[level], newParentArray));
    }
    if (queryPayload?.query?.bool) {
      queryPayload.query.bool = {
        ...queryPayload.query.bool,
        filter: [...filterBlock],
        must: [...mustBlock],
      };
    }
  }
  queryPayload.aggs = {
    min_year: {
      min: {
        field: 'resourceTemporalExtentDetails.start.date',
      },
    },
    max_year: {
      max: {
        field: 'resourceTemporalExtentDetails.end.date',
      },
    },
  };
  return queryPayload;
};

const _generateResourceTypeFilterQuery = (searchBuilderPayload: ISearchBuilderPayload): estypes.SearchRequest => {
  const queryPayload: estypes.SearchRequest = _generateQuery(searchBuilderPayload);
  const { docId = '' } = searchBuilderPayload;
  if (docId === '') {
    const filterBlock: estypes.QueryDslQueryContainer[] = _generateDateRangeQuery(searchBuilderPayload, queryPayload);
    if (queryPayload?.query?.bool) {
      queryPayload.query.bool = {
        ...queryPayload.query.bool,
        filter: [...filterBlock],
      };
    }
  }
  queryPayload.aggs = {
    unique_resource_types: {
      terms: {
        field: 'resourceType',
      },
    },
  };
  return queryPayload;
};

const _generateOriginatorFilterQuery = (searchBuilderPayload: ISearchBuilderPayload): estypes.SearchRequest => {
  const queryPayload: estypes.SearchRequest = _generateQuery(searchBuilderPayload);
  const { docId = '' } = searchBuilderPayload;
  if (docId === '') {
    const filterBlock: estypes.QueryDslQueryContainer[] = _generateDateRangeQuery(searchBuilderPayload, queryPayload);
    if (queryPayload?.query?.bool) {
      queryPayload.query.bool = {
        ...queryPayload.query.bool,
        filter: [...filterBlock],
      };
    }
  }
  queryPayload.aggs = {
    unique_originator_types: {
      scripted_metric: {
        init_script: 'state.contacts = []; state.currentDocumentOrgName = [];',
        map_script:
          "state.currentDocumentOrgName = new HashSet(); if (params._source.containsKey('contactForResource')) {for (cfr in params._source.contactForResource) {if (cfr.role == 'originator' && cfr.organisationName != null && cfr.organisationName != '') {state.currentDocumentOrgName.add(cfr.organisationName.trim());}}} if (params._source.containsKey('contact')) {for (c in params._source.contact) {if (c.role == 'originator' && c.organisationName != null && c.organisationName != '') {state.currentDocumentOrgName.add(c.organisationName.trim());}}} state.contacts.addAll(state.currentDocumentOrgName);",
        combine_script: 'return state.contacts;',
        reduce_script:
          "Map combined = [:]; for (contacts in states) { for (c in contacts) { if (combined.containsKey(c)) { combined[c] += 1; } else { combined[c] = 1; } } } List bucketList = []; for (entry in combined.entrySet()) { Map bucket = [:]; bucket['key'] = entry.getKey(); bucket['doc_count'] = entry.getValue(); bucketList.add(bucket); } return ['buckets': bucketList, 'doc_count_error_upper_bound': 0, 'sum_other_doc_count': 0];",
      },
    },
  };
  return queryPayload;
};

const generateFilterQuery = (
  searchBuilderPayload: ISearchBuilderPayload,
  { isStudyPeriod = false },
): estypes.SearchRequest => {
  if (isStudyPeriod) {
    return _generateStudyPeriodFilterQuery(searchBuilderPayload);
  }

  const resourceTypeFilterQuery = _generateResourceTypeFilterQuery(searchBuilderPayload);
  const originatorFilterQuery = _generateOriginatorFilterQuery(searchBuilderPayload);

  const combinedQuery: estypes.SearchRequest = {
    ...resourceTypeFilterQuery,
    aggs: {
      ...resourceTypeFilterQuery.aggs,
      ...originatorFilterQuery.aggs,
    },
  };

  return combinedQuery;
};

export { generateSearchQuery, generateFilterQuery, buildCustomSortScriptForStudyPeriod };
