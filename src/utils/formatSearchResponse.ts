import { ISearchItem, ISearchResults } from '../models/interfaces/searchResponse.interface';

/* eslint-disable  @typescript-eslint/no-explicit-any */
const formatSearchResponse = async (apiResponse: Record<string, any>): Promise<ISearchResults> => {
  const finalResponse: ISearchResults = {
    total: apiResponse?.hits?.total?.value,
    items: [],
  };
  const apiSearchItems = apiResponse?.hits?.hits;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  apiSearchItems.map((searchItem: Record<string, any>) => {
    const item: ISearchItem = {
      id: searchItem?._id,
      title: searchItem?._source.resourceTitleObject.default,
      publishedBy: searchItem?._source.OrgObject.default,
      content: searchItem?._source.resourceAbstractObject.default,
    };

    finalResponse.items.push(item);
  });

  return finalResponse;
};

export { formatSearchResponse };
