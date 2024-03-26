/* eslint-disable  @typescript-eslint/no-explicit-any */
import { formatDate } from './formatDate';
import { getGeneralTabData } from './getGeneralTabData';
import { getOrganisationDetails } from './getOrganisationDetails';
import { getQualityTabData } from './getQualityTabData';
import { IOtherSearchItem, ISearchItem, ISearchResults } from '../interfaces/searchResponse.interface';

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

    if (isDetails) {
      const otherDetails: IOtherSearchItem = await getOtherDetails(searchItem);
      item = { ...item, ...otherDetails };
    }

    return item;
  });

  finalResponse.items = await Promise.all(responseItems);
  return finalResponse;
};

const getOtherDetails = async (searchItem: Record<string, any>): Promise<IOtherSearchItem> => {
  const catalogueDate = searchItem?._source?.dateStamp ? new Date(searchItem?._source?.dateStamp) : '';

  return {
    alternateTitle: searchItem?._source?.resourceAltTitleObject?.[0]?.default ?? '',
    ...getGeneralTabData(searchItem),
    ncea_catalogue_number: searchItem?._source?.uuid,
    host_catalogue_number: `${searchItem?._source?.resourceIdentifier?.[0]?.codeSpace ?? ''} ${searchItem?._source?.resourceIdentifier?.[0]?.code ?? ''}`,
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
    ncea_catalogue_date: catalogueDate
      ? catalogueDate.toLocaleDateString('en-US', { day: 'numeric' }) +
        '-' +
        catalogueDate.toLocaleDateString('en-US', { month: 'short' }) +
        '-' +
        catalogueDate.toLocaleDateString('en-US', { year: 'numeric' })
      : '',
  };
};

export { formatSearchResponse };
