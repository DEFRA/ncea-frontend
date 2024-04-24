'use strict';

import * as errorTransformer from '../../../src/utils/transformErrors';
import { Request, ResponseToolkit } from '@hapi/hapi';
import {
  formIds,
  queryParamKeys,
  webRoutePaths,
} from '../../../src/utils/constants';
import Joi from 'joi';
import { GeographySearchController } from '../../../src/controllers/web/GeographySearchController';
import { geographyQuestionnaireOptions } from '../../../src/data/geographyQuestionnaireOptions';
import { IFormFieldOptions } from '../../../src/interfaces/fieldsComponent.interface';
import { geographyFormOptionWithDepthError } from '../../data/geographyQuestionnaire';
import {
  readQueryParams,
  upsertQueryParams,
} from '../../../src/utils/queryStringHelper';

describe('Deals with guided geography search handler', () => {
  it('should render the guided geography search handler', async () => {
    const request: Request = {
      query: { jry: 'gs', fdy: '2000', tdy: '2023', cnt: '20' },
    } as any;
    const response: ResponseToolkit = { view: jest.fn() } as any;

    const formFields = { ...geographyQuestionnaireOptions };
    const {
      geographySearch,
      guidedDateSearch: guidedDateSearchPath,
      results,
    } = webRoutePaths;
    const queryString: string = readQueryParams(request.query, '');
    const geographySearchPath: string = `${geographySearch}?${queryString}`;
    const skipPath: string = `${results}?${queryString}`;
    const resultPathQueryString: string = readQueryParams(
      request.query,
      '',
      true,
    );
    const resultsPath: string = `${results}?${resultPathQueryString}`;
    const formId: string = formIds.geographyQuestionnaireFID;

    await GeographySearchController.renderGeographySearchHandler(
      request,
      response,
    );
    expect(response.view).toHaveBeenCalledWith(
      'screens/guided_search/geography_questionnaire',
      {
        guidedDateSearchPath,
        geographySearchPath,
        formFields,
        formId,
        skipPath,
        count: '20',
        resultsPath,
      },
    );
  });

  it('should redirect to next route', async () => {
    const extentFormFields = {
      north: '56.3908802',
      south: '51.564868',
      east: '10.884730',
      west: '-1.200230',
      depth: '',
    };
    const request: Request = { payload: { ...extentFormFields } } as any;
    const response: ResponseToolkit = { redirect: jest.fn() } as any;

    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.north]: extentFormFields?.['north'] ?? '',
      [queryParamKeys.south]: extentFormFields?.['south'] ?? '',
      [queryParamKeys.east]: extentFormFields?.['east'] ?? '',
      [queryParamKeys.west]: extentFormFields?.['west'] ?? '',
      [queryParamKeys.depth]: extentFormFields?.['depth'] ?? '',
    };
    const queryString: string = upsertQueryParams(
      request.query,
      queryParamsObject,
      true,
    );
    await GeographySearchController.doGeographySearchHandler(request, response);
    expect(response.redirect).toHaveBeenCalledWith(
      `${webRoutePaths.results}?${queryString}`,
    );
  });

  it('should build the query params and navigate to result route without data', async () => {
    const extentFormFields = {};
    const request: Request = { payload: { ...extentFormFields } } as any;
    const response: ResponseToolkit = { redirect: jest.fn() } as any;

    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.north]: extentFormFields?.['north'] ?? '',
      [queryParamKeys.south]: extentFormFields?.['south'] ?? '',
      [queryParamKeys.east]: extentFormFields?.['east'] ?? '',
      [queryParamKeys.west]: extentFormFields?.['west'] ?? '',
      [queryParamKeys.depth]: extentFormFields?.['depth'] ?? '',
    };
    const queryString: string = upsertQueryParams(
      request.query,
      queryParamsObject,
      true,
    );
    await GeographySearchController.doGeographySearchHandler(request, response);
    expect(response.redirect).toHaveBeenCalledWith(
      `${webRoutePaths.results}?${queryString}`,
    );
  });

  it('should validate the geography questionnaire form', async () => {
    const request: Request = { query: { cnt: '20' } } as any;
    const response: ResponseToolkit = {
      view: jest.fn().mockReturnValue({
        code: jest.fn().mockReturnThis(),
        takeover: jest.fn(),
      }),
    } as any;
    const error = {
      details: [
        {
          path: ['depth'],
          type: 'number.positive',
          message: 'This is not a valid input',
          context: { errors: ['depth'] },
        },
      ],
    } as unknown as Joi.ValidationError;
    jest
      .spyOn(errorTransformer, 'transformTextInputError')
      .mockResolvedValue(
        geographyFormOptionWithDepthError as IFormFieldOptions,
      );

    const {
      geographySearch,
      guidedDateSearch: guidedDateSearchPath,
      results,
    } = webRoutePaths;
    const queryString: string = readQueryParams(request.query, '');
    const geographySearchPath: string = `${geographySearch}?${queryString}`;
    const formId: string = formIds.geographyQuestionnaireFID;
    const skipPath: string = `${results}?${queryString}`;
    const resultPathQueryString: string = readQueryParams(
      request.query,
      '',
      true,
    );
    const resultsPath: string = `${results}?${resultPathQueryString}`;

    await GeographySearchController.doGeographySearchFailActionHandler(
      request,
      response,
      error,
    );
    expect(response.view).toHaveBeenCalledWith(
      'screens/guided_search/geography_questionnaire',
      {
        guidedDateSearchPath,
        geographySearchPath,
        formFields: geographyFormOptionWithDepthError,
        formId,
        skipPath,
        count: '20',
        resultsPath,
      },
    );
  });
});
