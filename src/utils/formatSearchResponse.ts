/* eslint-disable  @typescript-eslint/no-explicit-any */
import { formatDate } from './formatDate';
import { getOrganisationDetails } from './getOrganisationDetails';
import { ISearchItem, ISearchResults } from '../interfaces/searchResponse.interface';

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
): Promise<ISearchResults> => {
  const finalResponse: ISearchResults = {
    total: apiResponse?.hits?.total?.value,
    items: [],
  };
  const apiSearchItems = apiResponse?.hits?.hits;

  apiSearchItems.forEach(async (searchItem: Record<string, any>) => {
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
    if (isDetails) {
      const otherDetails: Record<string, string> = await getOtherDetails(searchItem, publishedBy);
      item = { ...item, ...otherDetails };
    }

    finalResponse.items.push(item);
  });
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
  if (searchItem?._source?.licenseObject?.[0]?.defasult) {
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

const getOtherDetails = async (
  searchItem: Record<string, any>,
  publishedBy: Record<string, any>,
): Promise<Record<string, string>> => {
  const catalogueDate = searchItem?._source?.dateStamp ? new Date(searchItem?._source?.dateStamp) : '';

  return {
    alternateTitle: searchItem?._source?.resourceAltTitleObject?.[0]?.default ?? '',
    language: searchItem?._source?.mainLanguage?.toUpperCase() ?? '',
    keywords: searchItem?._source?.tag?.map((item) => item.default).join(', ') ?? '',
    topic_categories: searchItem?._source?.cl_topic?.map((item) => item.default).join(', ') ?? '',
    ncea_catalogue_number: searchItem?._source?.uuid,
    host_catalogue_number: `${searchItem?._source?.resourceIdentifier?.[0]?.codeSpace ?? ''} ${searchItem?._source?.resourceIdentifier?.[0]?.code ?? ''}`,
    // Keeping this as a placeholder, as the Coupled Resource is not available now
    host_catalogue_entry: '',
    resource_type_and_hierarchy: searchItem?._source?.resourceType?.[0] ?? '',
    hierarchy_level: searchItem?._source?.cl_hierarchyLevel?.[0]?.default ?? '',
    resource_locators: `${searchItem?._source?.cl_function?.[0]?.default} from ${searchItem?._source?.link?.[0]?.nameObject?.default} (<a class="govuk-link" href="${searchItem?._source?.link?.[0]?.urlObject?.default}" target="_blank">${searchItem?._source?.link?.[0]?.urlObject?.default}</a>)`,
    host_service_catalogue_number: searchItem?._source?.sourceCatalogue ?? '',
    ncea_group_reference: searchItem?._source?.metadataIdentifier ?? '',
    metadata_standard: searchItem?._source?.standardNameObject?.default ?? '',
    project_number: '',
    Metadata_language: searchItem?._source?.mainLanguage ?? '',
    ncea_catalogue_date: catalogueDate
      ? catalogueDate.toLocaleDateString('en-US', { day: 'numeric' }) +
        '-' +
        catalogueDate.toLocaleDateString('en-US', { month: 'short' }) +
        '-' +
        catalogueDate.toLocaleDateString('en-US', { year: 'numeric' })
      : '',
    limitation_on_public_access: getLimitationPublicAccess(searchItem),
    license_constraints: getLicenseConstraints(searchItem),
    data_owner: getPublishedBy(publishedBy),
    available_formats: searchItem?._source?.format ?? '',
    frequency_of_update: searchItem?._source?.cl_maintenanceAndUpdateFrequency?.[0]?.default ?? '',
    character_encoding: 'utf8',
  };
};

export { formatSearchResponse };
