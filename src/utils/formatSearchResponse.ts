import { formatDate } from './formatDate';
import { ISearchItem, ISearchResults } from '../interfaces/searchResponse.interface';

/* eslint-disable  @typescript-eslint/no-explicit-any */
const formatSearchResponse = async (
  apiResponse: Record<string, any>,
  isDetails: boolean = false,
): Promise<ISearchResults> => {
  const finalResponse: ISearchResults = {
    total: apiResponse?.hits?.total?.value,
    items: [],
  };
  const apiSearchItems = apiResponse?.hits?.hits;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  apiSearchItems.forEach((searchItem: Record<string, any>) => {
    const startDate: string = searchItem?._source?.resourceTemporalExtentDetails?.[0]?.start?.date ?? '';
    const endDate: string = searchItem?._source?.resourceTemporalExtentDetails?.[0]?.end?.date ?? '';
    const studyPeriod = getStudyPeriod(startDate, endDate);
    const item: ISearchItem = {
      id: searchItem?._id,
      title: searchItem?._source?.resourceTitleObject?.default ?? '',
      publishedBy: searchItem?._source?.OrgObject?.default ?? '',
      content: searchItem?._source?.resourceAbstractObject?.default ?? '',
      studyPeriod,
      resourceLocator: searchItem?._source?.resourceIdentifier?.[0]?.codeSpace ?? '',
      ncea_catalogue_number: searchItem?._source?.uuid,
      host_catalogue_number: `${searchItem?._source?.resourceIdentifier?.[0]?.codeSpace} ${searchItem?._source?.resourceIdentifier?.[0]?.code}`,
      // Keeping this as a placeholder, as the Coupled Resource is not available now
      host_catalogue_entry: '',
      resource_type_and_hierarchy: searchItem?._source?.resourceType,
      hierarchy_level: searchItem?._source?.cl_hierarchyLevel?.[0]?.default,
      resource_locators: `${searchItem?._source?.cl_function?.[0]?.default} from ${searchItem?._source?.link?.[0]?.nameObject?.default} (<a class="govuk-link" href="${searchItem?._source?.link?.[0]?.urlObject?.default}" target="_blank">${searchItem?._source?.link?.[0]?.urlObject?.default}</a>)`,
    };
    if (isDetails) {
      getOtherDetails(item, searchItem);
    }

    finalResponse.items.push(item);
  });
  return finalResponse;
};

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

const getOtherDetails = (item: ISearchItem, searchItem: Record<string, any>) => {
  item.language = searchItem?._source?.mainLanguage?.toUpperCase() ?? '';
  item.keywords = searchItem?._source?.tag.map((item) => item.default).join(', ') ?? '';
  item.topic_categories = searchItem?._source?.cl_topic?.map((item) => item.default).join(', ') ?? '';
};

export { formatSearchResponse };
