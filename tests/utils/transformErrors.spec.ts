'use strict';

import { dateQuestionChronologicalError, dateQuestionChronologicalJoiError } from '../data/dateQuestionnaire';
import { transformErrors } from '../../src/utils/transformErrors';

describe('Transform Errors utilities', () => {
  it('should transform Joi error to GovUK error message and items', async () => {
    expect(transformErrors(dateQuestionChronologicalJoiError, 'date-questionnaire')).toStrictEqual(dateQuestionChronologicalError);
  });
});