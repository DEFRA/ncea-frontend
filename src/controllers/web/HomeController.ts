'use strict';

import { ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { getSearchResultsCount } from '../../services/handlers/searchApi';
import { IGuidedSearchStepsMatrix, IStepRouteMatrix } from '../../interfaces/guidedSearch.interface';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, guidedSearchSteps, pageTitles, queryParamKeys, webRoutePaths } from '../../utils/constants';
import { generateCountPayload, readQueryParams, upsertQueryParams } from '../../utils/queryStringHelper';

/**
 * This code snippet exports a module named HomeController.
 * The renderHomeHandler method is an asynchronous function that takes a Request object and a ResponseToolkit object as parameters.
 * It returns a Promise that resolves to a ResponseObject.
 *
 * The renderHomeHandler method is responsible for rendering the home template by calling the view method on the response object.
 * The view method takes the name of the template as an argument and returns a ResponseObject.
 */

const HomeController = {
  renderHomeHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    const { quickSearchFID } = formIds;
    return response.view('screens/home/template', {
      pageTitle: pageTitles.home,
      quickSearchFID,
      searchInputError: undefined,
    });
  },
  intermediateHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const stepRouteMatrix: IGuidedSearchStepsMatrix = {
      [guidedSearchSteps.classifierSearch]: {
        self: webRoutePaths.guidedClassifierSearch,
        next: webRoutePaths.guidedDateSearch,
      },
      [guidedSearchSteps.date]: {
        self: webRoutePaths.guidedDateSearch,
        next: webRoutePaths.geographySearch,
      },
      [guidedSearchSteps.coordinate]: {
        self: webRoutePaths.geographySearch,
      },
    };
    const step: string = request.params?.step ?? '';
    if (step) {
      const stepMatrix: IStepRouteMatrix = stepRouteMatrix?.[step] ?? {};
      if (Object.keys(stepMatrix).length) {
        const level: string = readQueryParams(request.query, 'level');
        const adjustedLevel = Number(level) === 4 ? 3 : level;
        const queryString: string = readQueryParams(
          {
            ...request.query,
            level: adjustedLevel,
          },
          '',
          true,
        );

        const queryBuilderSearchObject: ISearchPayload = generateCountPayload({
          ...request.query,
          level: adjustedLevel,
        });
        try {
          const searchResultsCount: { totalResults: number } = await getSearchResultsCount(queryBuilderSearchObject);
          if (searchResultsCount.totalResults > 0) {
            const queryString: string = upsertQueryParams(
              {
                ...request.query,
                level: Number(level) === 4 ? 3 : Number(level),
              },
              {
                [queryParamKeys.count]: searchResultsCount.totalResults.toString(),
              },
              false,
            );
            return response.redirect(`${stepMatrix.next}?${queryString}`);
          } else {
            return response.redirect(`${webRoutePaths.results}?${queryString}`);
          }
        } catch (error) {
          return response.redirect(`${webRoutePaths.results}?${queryString}`);
        }
      }
    }
    return response.redirect(webRoutePaths.home);
  },

  helpHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    return response.view('screens/home/help', {
      pageTitle: pageTitles.help,
    });
  },
  accessibilityHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    return response.view('screens/home/accessibility', {
      pageTitle: pageTitles.accessibility,
    });
  },
  termsConditionsHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    return response.view('screens/home/terms_conditions', {
      pageTitle: pageTitles.termsAndConditions,
    });
  },
  privacyPolicyHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    return response.view('screens/home/privacy_policy', {
      pageTitle: pageTitles.privacyPolicy,
    });
  },
  cookiePolicyHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    return response.view('screens/home/cookie_policy', {
      pageTitle: pageTitles.cookiePolicy,
    });
  },
};

export { HomeController };
