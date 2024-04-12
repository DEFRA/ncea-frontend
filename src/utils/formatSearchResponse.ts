/* eslint-disable  @typescript-eslint/no-explicit-any */
import { formatDate } from './formatDate';
import { getAccumulatedCoordinatesNCenter } from './getBoundingBoxData';
import { getGeneralTabData } from './getGeneralTabData';
import { getGeographyTabData } from './getGeographyTabData';
import { getOrganisationDetails } from './getOrganisationDetails';
import { getQualityTabData } from './getQualityTabData';
import {
  IAccumulatedCoordinatesWithCenter,
  IOtherSearchItem,
  ISearchItem,
  ISearchResults,
} from '../interfaces/searchResponse.interface';

const getStudyPeriod = (startDate: string, endDate: string): string => {
  const formattedStartDate: string = formatDate(startDate);
  const formattedEndDate: string = formatDate(endDate);
  let studyPeriod = '';
  if (formattedStartDate && formattedEndDate) {
    studyPeriod = `${formattedStartDate} to ${formattedEndDate}`;
  } else if (formattedStartDate && !formattedEndDate) {
    studyPeriod = formattedStartDate;
  } else if (!formattedStartDate && formattedEndDate) {
    studyPeriod = formattedEndDate;
  }

  return studyPeriod;
};

const formatSearchResponse = async (
  apiResponse: Record<string, any>,
  isDetails: boolean = false,
  isMapResults: boolean = false,
): Promise<ISearchResults> => {
  const finalResponse: ISearchResults = {
    total: apiResponse?.hits?.total?.value,
    items: [],
  };

  const apiSearchItems = apiResponse?.hits?.hits;
  const responseItems: Promise<ISearchItem>[] = apiSearchItems.map(async (searchItem: Record<string, any>) => {
    const startDate: string = searchItem?._source?.resourceTemporalExtentDetails?.[0]?.start?.date ?? '';
    const endDate: string = searchItem?._source?.resourceTemporalExtentDetails?.[0]?.end?.date ?? '';
    const studyPeriod = getStudyPeriod(startDate, endDate);
    const publishedBy = getOrganisationDetails(searchItem?._source?.contactForResource ?? []);
    const organisationDetails = getOrganisationDetails(searchItem?._source?.contactForResource ?? [], true);

    let item: ISearchItem = {
      id: searchItem?._id,
      title: searchItem?._source?.resourceTitleObject?.default ?? '',
      publishedBy: publishedBy.organisationValue,
      content: searchItem?._source?.resourceAbstractObject?.default ?? '',
      studyPeriod,
      resourceLocator: searchItem?._source?.resourceIdentifier?.[0]?.codeSpace ?? '',
      organisationName: organisationDetails.organisationValue,
    };

    if (isMapResults) {
      const coordinatesData: IAccumulatedCoordinatesWithCenter | null = getAccumulatedCoordinatesNCenter(
        searchItem?._source?.geom ?? {},
      );
      item = {
        ...item,
        geographicBoundary: coordinatesData?.coordinates,
        geographicCenter: coordinatesData?.center,
      };
    }

    if (isDetails) {
      const otherDetails: IOtherSearchItem = await getOtherDetails(searchItem, publishedBy);
      item = { ...item, ...otherDetails };
    }

    return item;
  });

  finalResponse.items = await Promise.all(responseItems);
  return finalResponse;
};

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

const getHostCatalogueNumber = (searchItem: Record<string, any>): string => {
  return `${searchItem?._source?.resourceIdentifier?.[0]?.codeSpace ?? ''} ${searchItem?._source?.resourceIdentifier?.[0]?.code ?? ''}`;
};

const getOtherDetails = async (
  searchItem: Record<string, any>,
  publishedBy: Record<string, any>,
): Promise<IOtherSearchItem> => {
  return {
    alternateTitle: searchItem?._source?.resourceAltTitleObject?.[0]?.default ?? '',
    ...getGeneralTabData(searchItem),
    ncea_catalogue_number: searchItem?._source?.uuid,
    host_catalogue_number: getHostCatalogueNumber(searchItem),
    // Keeping this as a placeholder, as the Coupled Resource is not available now
    host_catalogue_entry: '',
    resource_type_and_hierarchy: searchItem?._source?.resourceType?.[0] ?? '',
    hierarchy_level: searchItem?._source?.cl_hierarchyLevel?.[0]?.default ?? '',
    resource_locators: `${searchItem?._source?.cl_function?.[0]?.default} from ${searchItem?._source?.link?.[0]?.nameObject?.default} (<a class="govuk-link" href="${searchItem?._source?.link?.[0]?.urlObject?.default}" target="_blank">${searchItem?._source?.link?.[0]?.urlObject?.default}</a>)`,
    ...getQualityTabData(searchItem),
    host_service_catalogue_number: searchItem?._source?.sourceCatalogue ?? '',
    ncea_group_reference: searchItem?._source?.metadataIdentifier ?? '',
    metadata_standard: searchItem?._source?.standardNameObject?.default ?? '',
    project_number: '',
    Metadata_language: searchItem?._source?.mainLanguage ?? '',
    ncea_catalogue_date: formatDate(searchItem?._source?.dateStamp, false, false, '-'),
    limitation_on_public_access: getLimitationPublicAccess(searchItem),
    license_constraints: getLicenseConstraints(searchItem),
    data_owner: getPublishedBy(publishedBy),
    available_formats: searchItem?._source?.format ?? '',
    frequency_of_update: searchItem?._source?.cl_maintenanceAndUpdateFrequency?.[0]?.default ?? '',
    character_encoding: 'utf8',
    ...getGeographyTabData(searchItem),
  };
};

export { formatSearchResponse };
