import Joi from 'joi';

export const quickSearchJoiError: Joi.ValidationError = {
  _original: {
    search_term: '',
    pageName: 'home',
  },
  details: [
    {
      message: 'Please enter keywords into the search field.',
      path: ['search_term'],
      type: 'string.empty',
      context: {
        label: 'Search Field',
        value: '',
        key: 'search_term',
      },
    },
  ],
  name: 'ValidationError',
  isJoi: false,
  annotate: function (stripColors?: boolean | undefined): string {
    throw new Error('Function not implemented.');
  },
  message: '',
};
