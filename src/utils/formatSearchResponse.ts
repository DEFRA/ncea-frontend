import {
  ISearchItem,
  ISearchResults,
} from '../interfaces/searchResponse.interface';

/* eslint-disable  @typescript-eslint/no-explicit-any */
const formatSearchResponse = async (
  apiResponse: Record<string, any>,
): Promise<ISearchResults> => {
  const finalResponse: ISearchResults = {
    total: apiResponse?.hits?.total?.value,
    items: [],
  };
  const apiSearchItems = apiResponse?.hits?.hits;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  apiSearchItems.map((searchItem: Record<string, any>) => {
    const startDate: string =
      searchItem?._source?.resourceTemporalExtentDetails.length &&
      searchItem?._source?.resourceTemporalExtentDetails[0].start
        ? searchItem?._source?.resourceTemporalExtentDetails[0].start.date || ''
        : '';
    const endDate: string =
      searchItem?._source?.resourceTemporalExtentDetails.length &&
      searchItem?._source?.resourceTemporalExtentDetails[0].end
        ? searchItem?._source?.resourceTemporalExtentDetails[0].end.date || ''
        : '';
    const item: ISearchItem = {
      id: searchItem?._id,
      title: searchItem?._source.resourceTitleObject.default,
      publishedBy: searchItem?._source.OrgObject.default,
      content: searchItem?._source.resourceAbstractObject.default,
      temporalExtentDetails: {
        startDate,
        endDate,
      },
    };

    finalResponse.items.push(item);
  });

  return finalResponse;
};

export { formatSearchResponse };
