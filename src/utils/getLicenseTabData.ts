/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { ILicense } from '../interfaces/searchResponse.interface';

const getLicenseConstraints = (searchItem: Record<string, any>): string => {
  let licenseConstraints = '';

  if (searchItem?._source?.MD_LegalConstraintsOtherConstraintsObject?.[0]?.default) {
    licenseConstraints = `${searchItem?._source?.MD_LegalConstraintsOtherConstraintsObject?.[0]?.default} <br>`;
  }
  if (searchItem?._source?.MD_LegalConstraintsOtherConstraintsObject?.[2]?.text) {
    licenseConstraints =
      licenseConstraints + `${searchItem?._source?.MD_LegalConstraintsOtherConstraintsObject?.[2]?.text}`;
  }

  return licenseConstraints;
};

const getLimitationPublicAccess = (searchItem: Record<string, any>): string => {
  let limitationPublicAccess = '';

  if (searchItem?._source?.cl_accessConstraints?.[0]?.default) {
    limitationPublicAccess = `${searchItem?._source?.cl_accessConstraints?.[0]?.default} <br>`;
  }
  if (searchItem?._source?.cl_accessConstraints?.[0]?.text) {
    limitationPublicAccess = limitationPublicAccess + `${searchItem?._source?.cl_accessConstraints?.[0]?.text} <br>`;
  }
  if (searchItem?._source?.licenseObject?.[0]?.default) {
    limitationPublicAccess = limitationPublicAccess + `${searchItem?._source?.licenseObject?.[0]?.default}`;
  }

  return limitationPublicAccess;
};

const getPublishedBy = (publishedBy: Record<string, any>): string => {
  let dataOwner = '';

  if (publishedBy.role) {
    dataOwner = `${publishedBy.role}, `;
  }
  if (publishedBy.organisationValue) {
    dataOwner += `${publishedBy.organisationValue} <br>`;
  }
  if (publishedBy.email) {
    dataOwner += `${publishedBy.email}`;
  }

  return dataOwner;
};

const getAvailableFormats = (formats: Record<string, any> | Record<string, any>[]): string => {
  const availableFormats: string[] = [];
  let formatsArray: Record<string, any>[] = [];
  if (formats && !Array.isArray(formats) && typeof formats === 'object') {
    formatsArray.push(formats);
  }
  if (Array.isArray(formats) && formats.every((format) => typeof format === 'object')) {
    formatsArray = [...formats];
  }
  formatsArray.forEach((format: Record<string, any>) => {
    let formatString: string = '';
    if (format.name) formatString = format.name;
    if (format.version && format.version.toLowerCase() !== 'unknown') formatString += `(${format.version})`;
    if (formatString) availableFormats.push(formatString);
  });
  return availableFormats.join(', ');
};

const getLicenseTabData = (searchItem: Record<string, any>, publishedBy: Record<string, any>): ILicense => ({
  limitation_on_public_access: getLimitationPublicAccess(searchItem),
  license_constraints: getLicenseConstraints(searchItem),
  data_owner: getPublishedBy(publishedBy),
  available_formats: getAvailableFormats(searchItem?._source?.OrgDistributionFormats ?? []),
  frequency_of_update: searchItem?._source?.cl_maintenanceAndUpdateFrequency?.[0]?.default ?? '',
  character_encoding: 'utf8',
});

export { getLicenseTabData, getLicenseConstraints, getLimitationPublicAccess, getPublishedBy, getAvailableFormats };
