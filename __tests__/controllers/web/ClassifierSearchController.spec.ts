'use strict';

import { ClassifierSearchController } from '../../../src/controllers/web/ClassifierSearchController';
import { Request, ResponseToolkit } from '@hapi/hapi';
import {
  formIds,
  webRoutePaths,
  queryParamKeys,
  guidedSearchSteps,
} from '../../../src/utils/constants';
import { level3ClassifierItems } from '../../data/classifierSearch';
import { getClassifierThemes } from '../../../src/services/handlers/classifierApi';
import { getSearchResultsCount } from '../../../src/services/handlers/searchApi';
import { ISearchPayload } from '../../../src/interfaces/queryBuilder.interface';
import { generateCountPayload, upsertQueryParams } from '../../../src/utils/queryStringHelper';

jest.mock('../../../src/services/handlers/classifierApi', () => ({
  getClassifierThemes: jest.fn(),
}));

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResultsCount: jest.fn(),
}));

describe('Classifier Search Controller', () => {
  describe('renderClassifierSearchHandler', () => {
    it('should call the classifier view with context and count', async () => {
      const request: Request = { query: { level: '3', 'parent[]': ['lv2-001', 'lv2-002'] } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const { guidedClassifierSearch: guidedClassifierSearchPath, guidedDateSearch: skipPath, results } = webRoutePaths;

      (getClassifierThemes as jest.Mock).mockResolvedValue(level3ClassifierItems);
      (getSearchResultsCount as jest.Mock).mockResolvedValue({ totalResults: 123 });

      await ClassifierSearchController.renderClassifierSearchHandler(request, response);

      const queryParamsObject: Record<string, string> = {
        [queryParamKeys.journey]: 'gs',
        [queryParamKeys.level]: '2',
        [queryParamKeys.parent]: ['lv2-001', 'lv2-002'].join(','),
      };
      const queryString = upsertQueryParams(request.query, queryParamsObject, false);
      const resultPathQueryString = upsertQueryParams({ ...request.query, level: '2' }, {}, true);
      const newSkipPath = `${webRoutePaths.intermediate}/${guidedSearchSteps.classifierSearch}?${queryString}`;
      const resultsPath = `${results}?${resultPathQueryString}`;

      expect(response.view).toHaveBeenCalledWith('screens/guided_search/classifier_selection.njk', {
        guidedClassifierSearchPath,
        nextLevel: '4',
        skipPath: newSkipPath,
        formId: formIds.classifierSearch,
        classifierItems: level3ClassifierItems,
        count: '123',
        resultsPath,
        backLinkPath: '#',
        backLinkClasses: 'back-link-classifier',
      });
    });

    it('should call the classifier view with context without count', async () => {
      const request: Request = { query: { level: '0', 'parent[]': ['lv2-001', 'lv2-002'] } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const { guidedClassifierSearch: guidedClassifierSearchPath, guidedDateSearch: skipPath, results } = webRoutePaths;

      (getClassifierThemes as jest.Mock).mockResolvedValue(level3ClassifierItems);

      await ClassifierSearchController.renderClassifierSearchHandler(request, response);

      const queryParamsObject: Record<string, string> = {
        [queryParamKeys.journey]: 'gs',
        [queryParamKeys.level]: '-1',
        [queryParamKeys.parent]: ['lv2-001', 'lv2-002'].join(','),
      };
      const queryString = upsertQueryParams(request.query, queryParamsObject, false);
      const resultPathQueryString = upsertQueryParams({ ...request.query, level: '-1' }, {}, true);
      const resultsPath = `${results}?${resultPathQueryString}`;

      expect(response.view).toHaveBeenCalledWith('screens/guided_search/classifier_selection.njk', {
        guidedClassifierSearchPath,
        nextLevel: '1',
        skipPath,
        formId: formIds.classifierSearch,
        classifierItems: level3ClassifierItems,
        count: null,
        resultsPath,
        backLinkPath: '#',
        backLinkClasses: 'back-link-classifier',
      });
    });
  });
});
