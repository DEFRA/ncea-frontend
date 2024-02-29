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
    const item: ISearchItem = {
      id: searchItem?._id,
      title: searchItem?._source?.resourceTitleObject?.default ?? '',
      publishedBy: searchItem?._source?.OrgObject?.default ?? '',
      content: searchItem?._source?.resourceAbstractObject?.default,
      temporalExtentDetails: {
        startDate,
        endDate,
      },
      resourceLocator: searchItem?._source?.resourceIdentifier?.[0]?.codeSpace ?? '',
    };
    if (isDetails) {
      getOtherDetails(item, searchItem);
    }

    finalResponse.items.push(item);
  });
  return finalResponse;
};

const getOtherDetails = (item: ISearchItem, searchItem: Record<string, any>) => {
  item.abstract = searchItem?._source?.resourceAbstractObject?.default ?? '';
  item.language = searchItem?._source?.mainLanguage?.toUpperCase() ?? '';
  item.keywords = searchItem?._source?.tag.map((item) => item.default).join(', ') ?? '';
  item.topic_categories = searchItem?._source?.cl_topic?.map((item) => item.default).join(', ') ?? '';
};

export { formatSearchResponse };
