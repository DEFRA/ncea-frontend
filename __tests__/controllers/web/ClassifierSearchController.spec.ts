'use strict';

import { ClassifierSearchController } from '../../../src/controllers/web/ClassifierSearchController';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { formIds, queryParamKeys, webRoutePaths } from '../../../src/utils/constants';
import { level3ClassifierItems } from '../../data/classifierSearch';
import { getClassifierThemes } from '../../../src/services/handlers/classifierApi';
import { getSearchResultsCount } from '../../../src/services/handlers/searchApi';
import { readQueryParams, upsertQueryParams } from '../../../src/utils/queryStringHelper';

jest.mock('../../../src/services/handlers/classifierApi', () => ({
  getClassifierThemes: jest.fn(),
}));

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResultsCount: jest.fn(),
}));

describe('Classifier Search Controller', () => {
  describe('renderClassifierSearchHandler', () => {
    let request: Request;
    let response: ResponseToolkit;
    const { guidedClassifierSearch: guidedClassifierSearchPath, guidedDateSearch: skipPath, results } = webRoutePaths;
    const { classifierSearch } = formIds;

    beforeEach(() => {
      response = { view: jest.fn(), redirect: jest.fn() } as any;
    });

    it('should call the classifier view with context when level is greater than or equal to 1 and count is 0', async () => {
      request = {
        query: { level: '3', 'parent[]': 'lv2-001,lv2-002' },
      } as any;

      const level3ClassifierItems = [];
      (getClassifierThemes as jest.Mock).mockResolvedValue(level3ClassifierItems);
      (getSearchResultsCount as jest.Mock).mockResolvedValue({ totalResults: 0 });

      await ClassifierSearchController.renderClassifierSearchHandler(request, response);

      const payloadQuery = {
        level: '2',
        'parent[]': 'lv2-001,lv2-002',
      };

      const queryParamsObject = {
        [queryParamKeys.level]: '2',
        [queryParamKeys.parent]: 'lv2-001,lv2-002',
        [queryParamKeys.journey]: 'gs',
        [queryParamKeys.count]: '0',
      };

      const queryString = upsertQueryParams(request.query, queryParamsObject, false);
      const resultsPath = `${results}?${readQueryParams(payloadQuery, '', true)}`;
      const skipPathUrl = `${skipPath}?${queryString}`;

      expect(response.redirect).toHaveBeenCalledWith(`${skipPathUrl}`);
    });

    it('should call the classifier view with context when count is present', async () => {
      request = {
        query: { level: '3', 'parent[]': 'lv2-001,lv2-002' },
      } as any;

      (getClassifierThemes as jest.Mock).mockResolvedValue(level3ClassifierItems);
      (getSearchResultsCount as jest.Mock).mockResolvedValue({ totalResults: 10 });

      await ClassifierSearchController.renderClassifierSearchHandler(request, response);

      const payloadQuery = {
        level: '2',
        'parent[]': 'lv2-001,lv2-002',
      };

      const queryParamsObject = {
        [queryParamKeys.level]: '2',
        [queryParamKeys.parent]: 'lv2-001,lv2-002',
        [queryParamKeys.journey]:'gs',
        [queryParamKeys.count]: '10',
      };

      const queryString = upsertQueryParams(request.query, queryParamsObject, false);
      const resultsPath = `${results}?${readQueryParams(payloadQuery, '', true)}`;
      const skipPathUrl = `${skipPath}?${queryString}`;

      expect(response.view).toHaveBeenCalledWith('screens/guided_search/classifier_selection.njk', {
        guidedClassifierSearchPath,
        nextLevel: "4",
        pageTitle: "NCEA questionnaire  Search- subcategories",
        skipPath: skipPathUrl,
        formId: classifierSearch,
        classifierItems: level3ClassifierItems,
        count: '10',
        journey: 'gs',
        resultsPath,
        backLinkPath: '#',
        backLinkClasses: 'back-link-classifier',
      });
    });

    it('should redirect to results path when count is 0 and level is not 1', async () => {
      request = {
        query: { level: '2', 'parent[]': 'lv2-001,lv2-002' },
      } as any;

      (getClassifierThemes as jest.Mock).mockResolvedValue(level3ClassifierItems);
      (getSearchResultsCount as jest.Mock).mockResolvedValue({ totalResults: 0 });

      await ClassifierSearchController.renderClassifierSearchHandler(request, response);

      const payloadQuery = {
        level: '1',
        'parent[]': 'lv2-001,lv2-002',
      };

      const queryParamsObject = {
        [queryParamKeys.level]: '1',
        [queryParamKeys.parent]: 'lv2-001,lv2-002',
        [queryParamKeys.journey]: 'gs',
        [queryParamKeys.count]: '0',
      };

      const queryString = upsertQueryParams(request.query, queryParamsObject, false);
      const resultsPath = `${results}?${readQueryParams(payloadQuery, '', true)}`;

      expect(response.redirect).toHaveBeenCalledWith(`${results}?${queryString}`);
    });

    it('should redirect to date search page when there are no items for the parent category', async () => {
      request = {
        query: { level: '2', 'parent[]': 'lv1-001,lv1-002' },
      } as any;

      (getClassifierThemes as jest.Mock).mockResolvedValue([]);
      (getSearchResultsCount as jest.Mock).mockResolvedValue({ totalResults: 10 });

      await ClassifierSearchController.renderClassifierSearchHandler(request, response);

      const payloadQuery = {
        level: '2',
        'parent[]': 'lv1-001,lv1-002',
      };

      const queryParamsObject = {
        [queryParamKeys.level]: '1',
        [queryParamKeys.parent]: 'lv1-001,lv1-002',
        [queryParamKeys.journey]: 'gs',
        [queryParamKeys.count]: '10',
      };

      const queryString = upsertQueryParams(request.query, queryParamsObject, false);
      const skipPathUrl = `${skipPath}?${queryString}`;

      expect(response.redirect).toHaveBeenCalledWith(skipPathUrl);
    });
  });
});
