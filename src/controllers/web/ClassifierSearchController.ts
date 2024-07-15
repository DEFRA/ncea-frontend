'use strict';

import { ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { getClassifierThemes } from '../../services/handlers/classifierApi';
import { getSearchResultsCount } from '../../services/handlers/searchApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, guidedSearchSteps, webRoutePaths, queryParamKeys } from '../../utils/constants';
import { generateCountPayload, readQueryParams, upsertQueryParams } from '../../utils/queryStringHelper';

const ClassifierSearchController = {
  renderClassifierSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { guidedClassifierSearch: guidedClassifierSearchPath, guidedDateSearch: skipPath } = webRoutePaths;
    const formId: string = formIds.classifierSearch;
    const level: string = readQueryParams(request.query, 'level');
    const parent: string = readQueryParams(request.query, 'parent');
    const classifierItems = await getClassifierThemes(level, parent);
    const nextLevel: string = (+level + 1).toString();
    const queryBuilderSearchObject: ISearchPayload = generateCountPayload(request.query);
     //  const searchResultsCount: { totalResults: number } = await getSearchResultsCount(queryBuilderSearchObject);
    // console.log(searchResultsCount);
    //hidden fields for selected level1, 2, 3 classifier categories
    return response.view('screens/guided_search/classifier_selection.njk', {
      guidedClassifierSearchPath,
      nextLevel,
      skipPath,
      formId,
      classifierItems,
      count: 0,
      // searchResultsCount.totalResults.toString()
      backLinkPath: 'javascript:history.back()',
    });
  },
  classifierSearchSubmitHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const payload = request.payload as Record<string, string>;
    const level = payload?.['level'] ?? '';
    console.log('payload')
    const nextLevel = (+level + 1);
    const parent = payload?.['parent'] ?? '';
    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.level]: nextLevel.toString(),
      [queryParamKeys.parent]: parent,
    };
    const queryString: string = upsertQueryParams(request.query, queryParamsObject, false);

    if (nextLevel > 3) {
      return response.redirect(`${webRoutePaths.guidedDateSearch}?${queryString}`);
    } else {
      return response.redirect(`${webRoutePaths.intermediate}/${guidedSearchSteps.classifierSearch}?${queryString}`);
    }
  },
};

export { ClassifierSearchController };
