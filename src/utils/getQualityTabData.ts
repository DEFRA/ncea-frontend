/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { IQualityItem } from '../interfaces/searchResponse.interface';
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

const checkAtLeastOnePropertyValueExists = (sourceObject: Record<string, any>): boolean => {
  return sourceObject?.title || sourceObject?.pass || sourceObject?.explanation;
};

const generateConformityData = (data: Record<string, any>[]): string => {
  const shouldDisplayTable: boolean = data.some((item: Record<string, any>) =>
    checkAtLeastOnePropertyValueExists(item),
  );
  if (Array.isArray(data) && data.length > 0 && shouldDisplayTable) {
    let tableHTML = `<table class="details-table">
                      <thead>
                        <tr>
                          <th width="60%">Specification</th>
                          <th>Degree</th>
                          <th>Explanation</th>
                        </tr>
                      </thead><tbody>`;
    data.forEach((item: Record<string, any>) => {
      if (checkAtLeastOnePropertyValueExists(item)) {
        tableHTML += `<tr>
                      <td>${item?.title}</td>
                      <td>${item?.pass}</td>
                      <td>${item?.explanation}</td>
                    </tr>`;
      }
    });
    tableHTML += `</tbody></table>`;

    return tableHTML;
  }
  return '';
};

const getQualityTabData = (searchItem: Record<string, any>): IQualityItem => ({
  publicationInformation: getPublicationInformation(searchItem?._source?.resourceDate ?? []),
  lineage: getLineage(searchItem?._source?.lineageObject ?? ''),
  conformity: generateConformityData(searchItem?._source?.specificationConformance ?? []),
  additionalInformation: searchItem?._source?.supplementalInformationObject?.default ?? '',
});

export { getQualityTabData };
