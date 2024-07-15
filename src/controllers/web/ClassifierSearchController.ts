'use strict';

import { ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { getClassifierThemes } from '../../services/handlers/classifierApi';
import { getSearchResultsCount } from '../../services/handlers/searchApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, guidedSearchSteps, webRoutePaths ,queryParamKeys} from '../../utils/constants';
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
  classifierSearchSubmitHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    const payload = request.payload as Record<string, string>;
    console.log('submit handler payload',payload);
    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.level]: payload?.['level'] ?? '',
      [queryParamKeys.parent]: payload?.['parent'] ?? ''
    };
    const queryString: string = upsertQueryParams(request.query, queryParamsObject, false);
    return response.redirect(`${webRoutePaths.intermediate}/${guidedSearchSteps.classifierSearch}?${queryString}`);
  },
};

export { ClassifierSearchController };
