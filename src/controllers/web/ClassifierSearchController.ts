'use strict';

import { ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { getClassifierThemes } from '../../services/handlers/classifierApi';
import { getSearchResultsCount } from '../../services/handlers/searchApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, webRoutePaths } from '../../utils/constants';
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
    // const searchResultsCount: { totalResults: number } = await getSearchResultsCount(queryBuilderSearchObject);
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
      backLinkPath: 'javascript:history.back()'
    });
  },
};

export { ClassifierSearchController };
