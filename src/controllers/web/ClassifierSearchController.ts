'use strict';

import { getClassifierThemes } from '../../services/handlers/classifierApi';
import { getSearchResultsCount } from '../../services/handlers/searchApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, queryParamKeys, webRoutePaths } from '../../utils/constants';
import { generateCountPayload, readQueryParams, upsertQueryParams } from '../../utils/queryStringHelper';

const ClassifierSearchController = {
  renderClassifierSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { guidedClassifierSearch: guidedClassifierSearchPath, guidedDateSearch: skipPath, results } = webRoutePaths;
    const formId: string = formIds.classifierSearch;
    const level: number = Number(readQueryParams(request.query, 'level'));
    const parent: string = readQueryParams(request.query, 'parent[]') || '';
    const nextLevel: string = (level + 1).toString();

    const payloadQuery = {
      ...request.query,
      level: (level - 1).toString(),
    };
    const countPayload = generateCountPayload(payloadQuery);
    const totalCount = (await getSearchResultsCount(countPayload)).totalResults.toString();

    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.journey]: 'gs',
      [queryParamKeys.level]: (level - 1).toString(),
      [queryParamKeys.parent]: parent,
      [queryParamKeys.count]: totalCount,
    };

    const queryString: string = level - 1 > 0 ? upsertQueryParams(request.query, queryParamsObject, false) : '';
    const resultsPath: string = `${results}?${readQueryParams(payloadQuery, '', true)}`;
    const skipPathUrl: string = queryString ? `${skipPath}?${queryString}` : skipPath;

    const classifierItems = await getClassifierThemes(level.toString(), parent);

    return response.view('screens/guided_search/classifier_selection.njk', {
      guidedClassifierSearchPath,
      nextLevel,
      skipPath: skipPathUrl,
      formId,
      classifierItems,
      count: level >= 1 ? totalCount : null,
      resultsPath,
      backLinkPath: '#',
      backLinkClasses: 'back-link-classifier',
    });
  },
};

export { ClassifierSearchController };
