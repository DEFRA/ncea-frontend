'use strict';

import { getClassifierDetails } from '../../services/handlers/searchApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, webRoutePaths } from '../../utils/constants';

const ClassifierSearchController = {
  renderClassifierSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { guidedClassifierSearch: guidedClassifierSearchPath, guidedDateSearch: skipPath } = webRoutePaths;
    const formId: string = formIds.classifierSearch;
    // const classifierValues = await getClassifierDetails(1);
    const classifierValues = ['Natural Asset', 'Ecosystem service or benefit', 'Pressure', 'Natural capital valuation'];
    const classifierItems = classifierValues.map((cv) => {
      return {
        value: cv,
        text: 'We need to know your nationality so we can work out which elections you’re entitled to vote in. If you cannot provide your nationality, you’ll have to send copies of identity documents through the post.',
      };
    });
    return response.view('screens/guided_search/classifier_selection.njk', {
      guidedClassifierSearchPath,
      skipPath,
      formId,
      classifierItems,
    });
  },
};

export { ClassifierSearchController };
