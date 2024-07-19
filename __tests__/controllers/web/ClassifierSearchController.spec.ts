'use strict';

import { ClassifierSearchController } from '../../../src/controllers/web/ClassifierSearchController';
import { Request, ResponseToolkit } from '@hapi/hapi';
import {
  formIds,
  webRoutePaths,
} from '../../../src/utils/constants';
import { level3ClassifierItems} from '../../data/classifierSearch'
import { getClassifierThemes } from '../../../src/services/handlers/classifierApi';

jest.mock('../../../src/services/handlers/classifierApi', () => ({
  getClassifierThemes: jest.fn(),
}));
describe('Classifier Search Controller', () => {
  describe('renderClassifierSearchHandler', () => {
    it('should call the classifier view with context', async () => {
      const request: Request = {level:3, 'parents[]': 'lv2-001, lv2-002'} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const { guidedClassifierSearch: guidedClassifierSearchPath, guidedDateSearch: skipPath } = webRoutePaths;
      (getClassifierThemes as jest.Mock).mockResolvedValue(level3ClassifierItems);
      await ClassifierSearchController.renderClassifierSearchHandler(request, response);
      const { classifierSearch } = formIds;
      expect(response.view).toHaveBeenCalledWith('screens/guided_search/classifier_selection.njk', {
        guidedClassifierSearchPath,
        nextLevel: "1",
        skipPath,
        formId: classifierSearch,
        classifierItems: level3ClassifierItems,
        count: 0,
        backLinkPath: 'javascript:history.back()',
      });
    });
  });
});