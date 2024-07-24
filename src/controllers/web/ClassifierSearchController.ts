'use strict';

import { getClassifierThemes } from '../../services/handlers/classifierApi';
import { readQueryParams } from '../../utils/queryStringHelper';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, webRoutePaths } from '../../utils/constants';

const ClassifierSearchController = {
  renderClassifierSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { guidedClassifierSearch: guidedClassifierSearchPath, guidedDateSearch: skipPath } = webRoutePaths;
    const formId: string = formIds.classifierSearch;
    const level: string = readQueryParams(request.query, 'level');
    const parent: string = readQueryParams(request.query, 'parent[]');
    const classifierItems = await getClassifierThemes(level, parent);
    const nextLevel: string = (+level + 1).toString();
    //hidden fields for selected level1, 2, 3 classifier categories
    return response.view('screens/guided_search/classifier_selection.njk', {
      guidedClassifierSearchPath,
      nextLevel,
      skipPath,
      formId,
      classifierItems,
      count: 0,
      backLinkPath: '#',
      backLinkClasses: 'back-link-classifier',
    });
  },
};

export { ClassifierSearchController };
