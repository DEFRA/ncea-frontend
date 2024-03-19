/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { IGeneralItem } from '../interfaces/searchResponse.interface';

const getGeneralTabData = (searchItem: Record<string, any>): IGeneralItem => ({
  language: searchItem?._source?.mainLanguage?.toUpperCase() ?? '',
  keywords: searchItem?._source?.tag?.map((item) => item.default).join(', ') ?? '',
  topicCategories: searchItem?._source?.cl_topic?.map((item) => item.default).join(', ') ?? '',
});

export { getGeneralTabData };
