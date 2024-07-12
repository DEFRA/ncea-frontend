/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { IAccessItem } from '../interfaces/searchResponse.interface';
import { getOrganisationDetails } from './getOrganisationDetails';
import { addSpaces, capitalizeWords } from './formatAggregationResponse';

const getHostCatalogueNumber = (searchItem: Record<string, any>): string => {
  return `${searchItem?._source?.resourceIdentifier?.[0]?.codeSpace ?? ''}${searchItem?._source?.resourceIdentifier?.[0]?.code ?? ''}`;
};

const getCoupledResource = (data: string | string[]): string => {
  const getCoupleResourceLink = (url: string): string => {
    const cleanedString: string = url.replace(/\\(.)/g, '$1');
    return `<a class="govuk-link" href="${decodeURIComponent(cleanedString)}" target="_blank">${decodeURIComponent(cleanedString)}</a>`;
  };
  if ((typeof data === 'string' && data.length === 0) || (Array.isArray(data) && data.length === 0)) {
    return '';
  }
  const coupleResourceUrl: string[] = [];
  if (Array.isArray(data) && data.length) {
    data.forEach((resourceUrl: string) => {
      coupleResourceUrl.push(getCoupleResourceLink(resourceUrl));
    });
  } else {
    coupleResourceUrl.push(getCoupleResourceLink(data as string));
  }
  return coupleResourceUrl.join('\n');
};

const getResourceLocators = (searchItem: Record<string, any>): string => {
  const linkDataObject: Record<string, any>[] = searchItem?._source?.link ?? [];
  const resourceLocatorStrings: string[] = [];
  let resourceLocatorString: string = '';
  if (Array.isArray(linkDataObject) && linkDataObject.length) {
    linkDataObject.forEach((linkData: Record<string, any>) => {
      let resLocStr: string = '';
      const urlData: string = linkData?.urlObject?.default ?? '';
      const nameData: string = linkData?.nameObject?.default ?? '';
      const funcData: string = linkData?.function ?? '';
      const descriptionData: string = linkData?.descriptionObject?.default ?? '';
      if (urlData) {
        resLocStr += '<p>';
        resLocStr += funcData ? `${capitalizeWords(funcData)} from ` : '';
        resLocStr += nameData ? `${nameData} (` : '';
        resLocStr += `<a class="govuk-link" href="${urlData}" target="_blank">${urlData}</a>`;
        resLocStr += nameData ? `)` : '';
        resLocStr += descriptionData ? ` :- ${descriptionData}` : '';
        resLocStr += '</p>';
        resourceLocatorStrings.push(resLocStr);
      }
    });
  }
  resourceLocatorString = resourceLocatorStrings.join('\n');
  if (resourceLocatorString === '') {
    const { organisationValue, email } = getOrganisationDetails(searchItem?._source, true);
    if (organisationValue && email) {
      resourceLocatorString = `For access contact ${organisationValue} :- ${email}`;
    }
  }
  return resourceLocatorString;
};

const getResourceTypeHierarchy = (searchItem: Record<string, any>): string => {
  let resourceTypeHierarchy = '';
  const resourceType: string = searchItem?._source?.resourceType?.[0] ?? '';
  if (
    resourceType.toLowerCase() === 'series' ||
    resourceType.toLowerCase() === 'dataseries' ||
    resourceType.toLowerCase() === 'data series'
  ) {
    const hierarchyLevel: string = searchItem?._source?.cl_hierarchyLevel?.[0]?.default ?? '';
    if (hierarchyLevel) {
      const wordsWithSpace = addSpaces(resourceType);
      const text: string = capitalizeWords(wordsWithSpace);
      resourceTypeHierarchy = `${hierarchyLevel} level of ${text}`;
    }
  } else {
    resourceTypeHierarchy = searchItem?._source?.cl_hierarchyLevel?.[0]?.default ?? '';
  }
  return resourceTypeHierarchy;
};

const getAccessTabData = (searchItem: Record<string, any>): IAccessItem => ({
  ncea_catalogue_number: searchItem?._source?.uuid,
  host_catalogue_number: getHostCatalogueNumber(searchItem),
  host_catalogue_entry: getCoupledResource(searchItem?._source?.OrgCoupledResource ?? ''),
  resource_type_and_hierarchy: getResourceTypeHierarchy(searchItem),
  hierarchy_level: searchItem?._source?.cl_hierarchyLevel?.[0]?.default ?? '',
  resource_locators: getResourceLocators(searchItem),
  metadata_language: searchItem?._source?.mainLanguage?.toUpperCase() ?? '',
});

export { getAccessTabData, getHostCatalogueNumber, getResourceLocators, getCoupledResource, getResourceTypeHierarchy };
