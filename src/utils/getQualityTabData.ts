/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { IQualityItem } from '../interfaces/searchResponse.interface';
import { formatDate } from './formatDate';
import { toggleContent } from './toggleContent';

const getPublicationInformation = (data: Record<string, any>[],type): string => {
  if (Array.isArray(data) && data.length > 0) {
    const obj = data.find((item: Record<string, any>) => item?.type?.toLowerCase() === type);
    return obj?.date ? `${formatDate(obj?.date, false, false)}` : '';
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
                          <th width="10%">Degree</th>
                          <th>Explanation</th>
                        </tr>
                      </thead><tbody>`;
    data.forEach((item: Record<string, any>) => {
      if (checkAtLeastOnePropertyValueExists(item)) {
        tableHTML += `<tr>
                      <td>${item?.title ?? ''}</td>
                      <td>${item?.pass ?? ''}</td>
                      <td>${item?.explanation ?? ''}</td>
                    </tr>`;
      }
    });
    tableHTML += `</tbody></table>`;

    return tableHTML;
  }
  return '';
};

const getQualityTabData = (searchItem: Record<string, any>): IQualityItem => ({

  publicationInformation: getPublicationInformation(searchItem?._source?.resourceDate,'publication' ?? []),
  creationInformation : getPublicationInformation(searchItem?._source?.resourceDate,'creation' ?? []),
  revisionInformation : getPublicationInformation(searchItem?._source?.resourceDate,'revision' ?? []),
  metadataDate:searchItem?._source?.dateStamp ? `${formatDate(searchItem?._source?.dateStamp, false, false)}` : '',
  lineage: getLineage(searchItem?._source?.lineageObject ?? ''),
  conformity: generateConformityData(searchItem?._source?.specificationConformance ?? []),
  additionalInformation: searchItem?._source?.supplementalInformationObject?.default ?? '',
});

export { getQualityTabData };
