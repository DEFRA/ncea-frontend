/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { GeneralTab } from '../interfaces/detailsTab.interface';

const getGeneralTabData = (searchItem: Record<string, any>): GeneralTab => ({
  language: searchItem?._source?.mainLanguage?.toUpperCase() ?? '',
  keywords: searchItem?._source?.tag?.map((item) => item.default).join(', ') ?? '',
  topicCategories: searchItem?._source?.cl_topic?.map((item) => item.default).join(', ') ?? '',
});

export { getGeneralTabData };
