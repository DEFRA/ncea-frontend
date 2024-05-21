import { generateDateString } from './generateDateString';
import {
  ICustomSortScript,
  IDateValues,
  IFieldExistsBlock,
  IFilterBlock,
  IGeoCoordinates,
  IGeoShapeBlock,
  IMustBlock,
  IOtherQueryProperties,
  IQuery,
  IQueryStringBlock,
  IRangeBlock,
  ISearchBuilderPayload,
  ISearchPayload,
  IShapeCoordinates,
  ISortBlock,
  ITermsBlock,
} from '../interfaces/queryBuilder.interface';
import { mapResultMaxCount, resourceTypeFilterField, studyPeriodFilterField } from './constants';

const _generateQueryStringBlock = (searchTerm: string, fieldsToSearch: string[] = []): IQueryStringBlock => {
  return {
    query_string: {
      query: searchTerm,
      ...(fieldsToSearch.length > 0 && { fields: fieldsToSearch }),
      default_operator: 'AND',
    },
  };
};

const _generateTermsBlock = (field: string, values: string[]): ITermsBlock => {
  return {
    terms: {
      [field]: values,
    },
  };
};

const _generateFieldExistsBlock = (field: string): IFieldExistsBlock => {
  return {
    exists: { field },
  };
};

const _generateRangeBlock = (fields: IDateValues): IRangeBlock[] => {
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

  const rangeBlock: IRangeBlock[] = [
    {
      range: {
        'resourceTemporalExtentDetails.start.date': {
          gte: startDateValue,
          lte: toDateValue,
        },
      },
    },
    {
      range: {
        'resourceTemporalExtentDetails.end.date': {
          gte: startDateValue,
          lte: toDateValue,
        },
      },
    },
  ];
  return rangeBlock;
};

const _generateGeoShapeBlock = (geoCoordinates: IGeoCoordinates): IGeoShapeBlock => {
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
  return geoShapeBlock;
};

const buildCustomSortScriptForStudyPeriod = (): ISortBlock => {
  const customScript: ICustomSortScript = {
    type: 'number',
    script: {
      source:
        "def millis = 0; if (params._source.containsKey('resourceTemporalExtentDateRange')) { for (date in params._source.resourceTemporalExtentDateRange) { if (date.containsKey('lte')) { def dateFormat = new java.text.SimpleDateFormat('yyyy-MM-dd\\'T\\'HH:mm:ss.SSS\\'Z\\''); def parsedDate = dateFormat.parse(date['lte']); millis = parsedDate.getTime(); break; } if (date.containsKey('gte')) { def dateFormat = new java.text.SimpleDateFormat('yyyy-MM-dd\\'T\\'HH:mm:ss.SSS\\'Z\\''); def parsedDate = dateFormat.parse(date['gte']); millis = parsedDate.getTime(); break; } } } return millis;",
    },
    order: 'desc',
  };
  const sortBlock: ISortBlock = {
    _script: customScript,
  };
  return sortBlock;
};

const _buildBestScoreSort = (): ISortBlock => ({
  _score: {
    order: 'desc',
  },
});

const _generateSortBlock = (sort: string): ISortBlock => {
  const sortBlock: ISortBlock = sort === 'recent_study' ? buildCustomSortScriptForStudyPeriod() : _buildBestScoreSort();
  return sortBlock;
};

const _generateOtherQueryProperties = (searchBuilderPayload: ISearchBuilderPayload): IOtherQueryProperties => {
  const { searchFieldsObject, isCount = false, isAggregation = false, docId = '' } = searchBuilderPayload;
  const { sort, rowsPerPage, page, requiredFields = [] } = (searchFieldsObject as ISearchPayload) ?? {};

  const isSort: boolean = sort !== '' && !isCount && docId === '' && !isAggregation;
  const sortBlock: ISortBlock[] = isSort ? [_generateSortBlock(sort)] : [];

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
  };
};

const _generateQuery = (searchBuilderPayload: ISearchBuilderPayload): IQuery => {
  const { searchFieldsObject, fieldsToSearch = [], docId = '' } = searchBuilderPayload;
  const { fields, fieldsExist = [] } = (searchFieldsObject as ISearchPayload) ?? {};

  const searchTerm: string = fields?.keyword?.q as string;

  const mustBlock: IMustBlock = docId ? [_generateQueryStringBlock(docId, ['_id'])] : [];
  if (searchTerm && docId === '') mustBlock.push(_generateQueryStringBlock(searchTerm, fieldsToSearch));
  if (fieldsExist.length > 0 && docId === '') {
    fieldsExist.forEach((field: string) => {
      mustBlock.push(_generateFieldExistsBlock(field));
    });
  }

  const geoCoordinates: IGeoCoordinates = fields?.extent as IGeoCoordinates;
  const { nth = '', sth = '', est = '', wst = '' } = geoCoordinates ?? {};
  const filterBlock: IFilterBlock = nth && sth && est && wst ? [_generateGeoShapeBlock(geoCoordinates)] : [];

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

const _generateDateRangeQuery = (searchBuilderPayload: ISearchBuilderPayload, queryPayload: IQuery): IFilterBlock => {
  const { searchFieldsObject } = searchBuilderPayload;
  const { filters, fields } = (searchFieldsObject as ISearchPayload) ?? {};
  const filterBlock: IFilterBlock = queryPayload.query?.bool?.filter ?? [];
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
  return filterBlock;
};

const generateSearchQuery = (searchBuilderPayload: ISearchBuilderPayload): IQuery => {
  const queryPayload: IQuery = _generateQuery(searchBuilderPayload);
  const { searchFieldsObject, docId = '' } = searchBuilderPayload;
  const { filters } = (searchFieldsObject as ISearchPayload) ?? {};
  if (docId === '') {
    const filterBlock: IFilterBlock = _generateDateRangeQuery(searchBuilderPayload, queryPayload);
    const mustBlock: IMustBlock = queryPayload.query?.bool?.must ?? [];

    const resourceTypeFilters: string[] = (filters?.[resourceTypeFilterField] as string[]) ?? [];
    if (resourceTypeFilters.length > 0) {
      mustBlock.push(_generateTermsBlock('resourceType', filters[resourceTypeFilterField] as string[]));
    }
    queryPayload.query.bool = {
      must: [...mustBlock],
      filter: [...filterBlock],
    };
  }
  return queryPayload;
};

const _generateStudyPeriodFilterQuery = (searchBuilderPayload: ISearchBuilderPayload): IQuery => {
  const queryPayload: IQuery = _generateQuery(searchBuilderPayload);
  const { searchFieldsObject, docId = '' } = searchBuilderPayload;
  const { fields, filters } = searchFieldsObject as ISearchPayload;
  if (docId === '') {
    const mustBlock: IMustBlock = queryPayload.query?.bool?.must ?? [];
    const filterBlock: IFilterBlock = queryPayload.query?.bool?.filter ?? [];
    const resourceTypeFilters: string[] = (filters?.[resourceTypeFilterField] as string[]) ?? [];
    if (fields?.date?.fdy && fields?.date?.tdy) {
      filterBlock.push(..._generateRangeBlock(fields.date));
    }
    if (resourceTypeFilters.length > 0) {
      mustBlock.push(_generateTermsBlock('resourceType', filters[resourceTypeFilterField] as string[]));
    }
    queryPayload.query.bool = {
      ...queryPayload.query.bool,
      filter: [...filterBlock],
      must: [...mustBlock],
    };
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

const _generateResourceTypeFilterQuery = (searchBuilderPayload: ISearchBuilderPayload): IQuery => {
  const queryPayload: IQuery = _generateQuery(searchBuilderPayload);
  const { docId = '' } = searchBuilderPayload;
  if (docId === '') {
    const filterBlock: IFilterBlock = _generateDateRangeQuery(searchBuilderPayload, queryPayload);
    queryPayload.query.bool = {
      ...queryPayload.query.bool,
      filter: [...filterBlock],
    };
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

const generateFilterQuery = (searchBuilderPayload: ISearchBuilderPayload, { isStudyPeriod = false }): IQuery => {
  return isStudyPeriod
    ? _generateStudyPeriodFilterQuery(searchBuilderPayload)
    : _generateResourceTypeFilterQuery(searchBuilderPayload);
};

export { generateSearchQuery, generateFilterQuery, buildCustomSortScriptForStudyPeriod };
