/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { IAccessItem } from '../interfaces/searchResponse.interface';
import { getOrganisationDetails } from './getOrganisationDetails';
import { addSpaces, capitalizeWords } from './formatAggregationResponse';

const getHostCatalogueNumber = (searchItem: Record<string, any>): string => {
  return `${searchItem?._source?.resourceIdentifier?.[0]?.codeSpace ?? ''}${searchItem?._source?.resourceIdentifier?.[0]?.code ?? ''}`;
};

const getCoupledResource = (data: string): string => {
  let cleanedURL: string = '';
  if (data) {
    const cleanedString: string = data.replace(/\\(.)/g, '$1');
    cleanedURL = `<a class="govuk-link" href="${decodeURIComponent(cleanedString)}" target="_blank">${decodeURIComponent(cleanedString)}</a>`;
  }
  return cleanedURL;
};

const getResourceLocators = (searchItem: Record<string, any>): string => {
  const functionsData: Record<string, any>[] = searchItem?._source?.cl_function ?? [];
  const resourceLocatorStrings: string[] = [];
  let resourceLocatorString: string = '';
  if (Array.isArray(functionsData) && functionsData.length) {
    functionsData.forEach((funData: Record<string, any>) => {
      const linkDataObject: Record<string, any>[] = searchItem?._source?.link ?? [];
      const linkData: Record<string, any> | undefined = linkDataObject.find(
        (linkItem: Record<string, any>) => linkItem?.['function']?.toLowerCase() === funData.key.toLowerCase(),
      );
      if (linkData && linkData !== undefined) {
        const urlData: string = linkData?.urlObject?.default ?? '';
        const nameData: string = linkData?.nameObject?.default ?? '';
        if (urlData && nameData) {
          const resLocStr: string = `${funData.default} from ${nameData} (<a class="govuk-link" href="${urlData}" target="_blank">${urlData}</a>)`;
          resourceLocatorStrings.push(resLocStr);
        }
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
});

export { getAccessTabData, getHostCatalogueNumber, getResourceLocators, getCoupledResource, getResourceTypeHierarchy };
