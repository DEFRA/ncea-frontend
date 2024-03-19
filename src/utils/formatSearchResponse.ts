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
      const otherDetails: Record<string, string> = await getOtherDetails(searchItem);
      item = { ...item, ...otherDetails };
    }

    finalResponse.items.push(item);
  });
  return finalResponse;
};

const getOtherDetails = async (searchItem: Record<string, any>): Promise<Record<string, string>> => ({
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
});

export { formatSearchResponse };
