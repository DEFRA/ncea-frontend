'use strict';

import * as errorTransformer from '../../../src/utils/transformErrors';
import { DateSearchController } from '../../../src/controllers/web/DateSearchController';
import { Request, ResponseToolkit } from '@hapi/hapi';
import {
  dateQuestionChronologicalError,
  dateQuestionnaireGovUKError,
} from '../../data/dateQuestionnaire';
import {
  fromDate,
  toDate,
} from '../../../src/data/dateQuestionnaireFieldOptions';
import { formIds, webRoutePaths } from '../../../src/utils/constants';
import Joi from 'joi';
import { FormFieldError } from '../../../src/interfaces/guidedSearch.interface';

describe('Deals with the Date Search Controller', () => {
  it('should render the guided data search handler', async () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = { view: jest.fn() } as any;
    const {
      guidedDateSearch: guidedDateSearchPath,
      geographySearch: skipPath,
    } = webRoutePaths;
    const formId: string = formIds.dataQuestionnaire;
    await DateSearchController.renderGuidedSearchHandler(request, response);
    expect(response.view).toHaveBeenCalledWith(
      'screens/guided_search/date_questionnaire',
      {
        fromDate,
        toDate,
        guidedDateSearchPath,
        skipPath,
        formId,
      },
    );
  });

  it('should update shared data, consume API and redirect to next route', async () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = { redirect: jest.fn() } as any;

    await DateSearchController.doDateSearchHandler(request, response);
    expect(response.redirect).toHaveBeenCalledWith(
      webRoutePaths.geographySearch,
    );
  });

  it('should validate the date questionnaire form', async () => {
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
          path: ['from-date-year'],
          type: 'any.required',
          message: '"from-date-year" is required',
          context: { errors: ['from-date-year'] },
        },
      ],
    } as unknown as Joi.ValidationError;
    jest
      .spyOn(errorTransformer, 'transformErrors')
      .mockReturnValue(dateQuestionChronologicalError as FormFieldError);
    const formId: string = formIds.dataQuestionnaire;

    const {
      guidedDateSearch: guidedDateSearchPath,
      geographySearch: skipPath,
    } = webRoutePaths;

    await DateSearchController.doDateSearchFailActionHandler(
      request,
      response,
      error,
    );
    expect(response.view).toHaveBeenCalledWith(
      'screens/guided_search/date_questionnaire',
      {
        fromDate: dateQuestionnaireGovUKError.fromDate,
        toDate: dateQuestionnaireGovUKError.toDate,
        guidedDateSearchPath,
        skipPath,
        formId,
      },
    );
  });
});
