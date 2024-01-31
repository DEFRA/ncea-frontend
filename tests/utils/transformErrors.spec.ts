'use strict';

import {
  dateQuestionChronologicalError,
  dateQuestionChronologicalJoiError,
} from '../data/dateQuestionnaire';
import { transformErrors } from '../../src/utils/transformErrors';
import { formKeys } from '../../src/utils/constants';

describe('Transform Errors utilities', () => {
  it('should transform Joi error to GovUK error message and items', async () => {
    expect(
      transformErrors(
        dateQuestionChronologicalJoiError,
        formKeys.dateQuestionnaire
      )
    ).toStrictEqual(dateQuestionChronologicalError);
  });
});
