/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { IGeneralItem } from '../interfaces/searchResponse.interface';

const getResourceLanguages = (data: Record<string, any>): string => {
  const resourceLanguages: string | string[] = data?.resourceLanguage ?? [];
  if (
    (typeof resourceLanguages === 'string' && resourceLanguages.length === 0) ||
    (Array.isArray(resourceLanguages) && resourceLanguages.length === 0)
  ) {
    return '';
  }
  const languagesData: string[] = [];
  if (Array.isArray(resourceLanguages) && resourceLanguages.length) {
    resourceLanguages.forEach((language: string) => {
      languagesData.push(language.toUpperCase());
    });
  } else {
    languagesData.push((resourceLanguages as string).toUpperCase());
  }
  return languagesData.join(', ');
};

const getGeneralTabData = (searchItem: Record<string, any>): IGeneralItem => ({
  alternateTitle: searchItem?._source?.resourceAltTitleObject?.[0]?.default ?? '',
  language: getResourceLanguages(searchItem?._source),
  keywords: searchItem?._source?.tag?.map((item) => item.default).join(', ') ?? '',
  topicCategories: searchItem?._source?.cl_topic?.map((item) => item.default).join(', ') ?? '',
});

export { getGeneralTabData };
