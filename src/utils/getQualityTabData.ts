/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { QualityTab } from '../interfaces/detailsTab.interface';
import { formatDate } from './formatDate';
import { toggleContent } from './toggleContent';

const getPublicationInformation = (data: Record<string, any>[]): string => {
  if (Array.isArray(data) && data.length > 0) {
    const obj = data.find((item: Record<string, any>) => item?.type?.toLowerCase() === 'publication');
    return obj?.date ? `${formatDate(obj?.date, false, true)} - Last Revision` : '';
  }
  return '';
};

const getLineage = (data: Record<string, any>): string => {
  if (Object.keys(data).length && data?.default) {
    return toggleContent(data?.default, 'lineage');
  }
  return '';
};

const getQualityTabData = (searchItem: Record<string, any>): QualityTab => ({
  publicationInformation: getPublicationInformation(searchItem?._source?.resourceDate ?? []),
  lineage: getLineage(searchItem?._source?.lineageObject ?? ''),
  // TODO
  additionalInformation: '',
});

export { getQualityTabData };
