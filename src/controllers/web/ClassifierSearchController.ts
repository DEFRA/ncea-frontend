'use strict';

import { getClassifierThemes } from '../../services/handlers/classifierApi';
import { getSearchResultsCount } from '../../services/handlers/searchApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, pageTitles, queryParamKeys, webRoutePaths } from '../../utils/constants';
import { generateCountPayload, readQueryParams, upsertQueryParams } from '../../utils/queryStringHelper';

const ClassifierSearchController = {
  renderClassifierSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { guidedClassifierSearch: guidedClassifierSearchPath, results } = webRoutePaths;
    const formId: string = formIds.classifierSearch;
    const level: number = Number(readQueryParams(request.query, 'level'));
    const parent: string = readQueryParams(request.query, 'parent[]') || '';
    const nextLevel: string = (level + 1).toString();
    const payloadQuery = {
      ...request.query,
      level: (level - 1).toString(),
    };
    const classifierPageTitle = pageTitles.Classifier[level - 1];
    const countPayload = generateCountPayload(payloadQuery);
    const totalCount = (await getSearchResultsCount(countPayload)).totalResults.toString();
    const queryParamsObject: Record<string, string> = {
      ...request.query,
      level: (level - 1).toString(),
      [queryParamKeys.journey]: 'gs',
      [queryParamKeys.count]: totalCount,
    };

    const queryString: string = level - 1 > 0 ? upsertQueryParams(payloadQuery, queryParamsObject, true) : '';
    const resultsPath: string = `${results}?${readQueryParams(queryParamsObject, '', true)}`;
    const classifierItems = await getClassifierThemes(level.toString(), parent);

    if (classifierItems.length <= 0) {
      return response.redirect(resultsPath);
    }
    const hasSearchResultOrlevelFirst = Number(totalCount) > 0 || level == 1;

    if (hasSearchResultOrlevelFirst) {
      return response.view('screens/guided_search/classifier_selection.njk', {
        pageTitle: classifierPageTitle,
        guidedClassifierSearchPath,
        nextLevel,
        skipPath: resultsPath,
        formId,
        journey: 'gs',
        classifierItems,
        count: level >= 1 ? totalCount : null,
        resultsPath,
        backLinkPath: '#',
        backLinkClasses: 'back-link-classifier',
      });
    } else {
      return response.redirect(`${webRoutePaths.results}?${queryString}`);
    }
  },
};

export { ClassifierSearchController };
