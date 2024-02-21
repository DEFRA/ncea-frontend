'use strict';

import Joi from 'joi';
import { Lifecycle, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { geographyQuestionnaireOptions } from '../../data/geographyQuestionnaireOptions';
import { transformTextInputError } from '../../utils/transformErrors';
import { formIds, webRoutePaths } from '../../utils/constants';

const GeographySearchController = {
  renderGeographySearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const formFields = { ...geographyQuestionnaireOptions };
    const {
      geographySearch: geographySearchPath,
      guidedDateSearch: guidedDateSearchPath,
      results: skipPath,
      results: resultsPath,
      getResultsCount: resultsCountPath,
    } = webRoutePaths;
    const formId: string = formIds.geographyQuestionnaire;
    return response.view('screens/guided_search/geography_questionnaire', {
      guidedDateSearchPath,
      geographySearchPath,
      formFields,
      formId,
      skipPath,
      resultsPath,
      resultsCountPath,
    });
  },
  doGeographySearchFailActionHandler: async (
    request: Request,
    response: ResponseToolkit,
    error: Joi.ValidationError,
  ): Promise<Lifecycle.ReturnValue> => {
    const finalFormFields = await transformTextInputError({ ...geographyQuestionnaireOptions }, error);
    const {
      geographySearch: geographySearchPath,
      guidedDateSearch: guidedDateSearchPath,
      results: skipPath,
      results: resultsPath,
      getResultsCount: resultsCountPath,
    } = webRoutePaths;
    const formId: string = formIds.geographyQuestionnaire;
    return response
      .view('screens/guided_search/geography_questionnaire', {
        guidedDateSearchPath,
        geographySearchPath,
        formFields: finalFormFields,
        formId,
        skipPath,
        resultsPath,
        resultsCountPath,
      })
      .code(400)
      .takeover();
  },
  doGeographySearchHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    return response.redirect(webRoutePaths.results);
  },
};

export { GeographySearchController };
