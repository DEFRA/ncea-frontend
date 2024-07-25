'use strict';

import { getClassifierThemes } from '../../services/handlers/classifierApi';
import { getSearchResultsCount } from '../../services/handlers/searchApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, queryParamKeys, webRoutePaths } from '../../utils/constants';
import { generateCountPayload, readQueryParams, upsertQueryParams } from '../../utils/queryStringHelper';

const ClassifierSearchController = {
  renderClassifierSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const {
      guidedClassifierSearch: guidedClassifierSearchPath,
      guidedDateSearch: skipPath,
      results,
    } = webRoutePaths;
    const formId: string = formIds.classifierSearch;
    const level: number = Number(readQueryParams(request.query, 'level'));
    const parent: string = readQueryParams(request.query, 'parent[]') || '';
    const nextLevel: string = (level + 1).toString();

    const payloadQuery = {
      ...request.query,
      level: (level - 1).toString(),
    };

    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.journey]: 'gs',
      [queryParamKeys.level]: (level - 1).toString(),
      [queryParamKeys.parent]: parent,
    };

    const queryString: string = upsertQueryParams(request.query, queryParamsObject, false);
    const resultsPath: string = `${results}?${readQueryParams(payloadQuery, '', true)}`;
    const skipPathUrl: string = `${skipPath}?${queryString}`;

    const classifierItems = await getClassifierThemes(level.toString(), parent);

    const renderView = async (showCount: boolean) => {
      const count = showCount
        ? (await getSearchResultsCount(generateCountPayload(payloadQuery))).totalResults.toString()
        : null;

      return response.view('screens/guided_search/classifier_selection.njk', {
        guidedClassifierSearchPath,
        nextLevel,
        skipPath: showCount ? skipPathUrl : skipPath,
        formId,
        classifierItems,
        count,
        resultsPath,
        backLinkPath: '#',
        backLinkClasses: 'back-link-classifier',
      });
    };

    return renderView(level >= 1);
  },
};

export { ClassifierSearchController };
