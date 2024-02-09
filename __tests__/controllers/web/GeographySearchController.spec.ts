'use strict';

import * as errorTransformer from '../../../src/utils/transformErrors';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { formIds, webRoutePaths } from '../../../src/utils/constants';
import Joi from 'joi';
import { GeographySearchController } from '../../../src/controllers/web/GeographySearchController';
import { geographyQuestionnaireOptions } from '../../../src/data/geographyQuestionnaireOptions';
import { IFormFieldOptions } from '../../../src/interfaces/fieldsComponent.interface';
import { geographyFormOptionWithDepthError } from '../../data/geographyQuestionnaire';

describe('Deals with guided geography search handler', () => {
  it('should render the guided geography search handler', async () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = { view: jest.fn() } as any;

    const formFields = { ...geographyQuestionnaireOptions };
    const {
      geographySearch: geographySearchPath,
      guidedDateSearch: guidedDateSearchPath,
      results: resultsPath,
    } = webRoutePaths;
    const formId: string = formIds.geographyQuestionnaire;

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
        resultsPath,
      },
    );
  });

  it('should redirect to next route', async () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = { redirect: jest.fn() } as any;
    await GeographySearchController.doGeographySearchHandler(request, response);
    expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.results);
  });

  it('should validate the geography questionnaire form', async () => {
    const request: Request = {} as any;
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
      geographySearch: geographySearchPath,
      guidedDateSearch: guidedDateSearchPath,
    } = webRoutePaths;
    const formId: string = formIds.geographyQuestionnaire;

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
      },
    );
  });
});
