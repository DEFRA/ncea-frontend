import { IFilterFlags } from '@/src/interfaces/searchPayload.interface';
import { estypes } from '@elastic/elasticsearch';
import { formatAggregationResponse } from '../../utils/formatAggregationResponse';
import { formatSearchResponse } from '../../utils/formatSearchResponse';
import { performQuery } from '../../config/elasticSearchClient';

import { ISearchBuilderPayload, ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { defaultFilterOptions, quickSearchTargetFields } from '../../utils/constants';

import { IAggregationOptions, ISearchItem, ISearchResults } from '../../interfaces/searchResponse.interface';
import { generateFilterQuery, generateSearchQuery } from '../../utils/queryBuilder';

const getSearchResults = async (
  searchFieldsObject: ISearchPayload,
  isMapResults: boolean = false,
  isQuickSearchJourney: boolean = false,
): Promise<ISearchResults> => {
  try {
    if (Object.keys(searchFieldsObject.fields).length) {
      const searchBuilderPayload: ISearchBuilderPayload = {
        searchFieldsObject,
        ...(isQuickSearchJourney && {
          fieldsToSearch: quickSearchTargetFields,
        }),
      };
      const payload = generateSearchQuery(searchBuilderPayload);
      const response = await performQuery<estypes.SearchResponse>(payload);
      const finalResponse: ISearchResults = await formatSearchResponse(response, false, isMapResults);
      return finalResponse;
    } else {
      return Promise.resolve({ total: 0, items: [] });
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

const getSearchResultsCount = async (searchFieldsObject: ISearchPayload): Promise<{ totalResults: number }> => {
  try {
    const searchBuilderPayload: ISearchBuilderPayload = {
      searchFieldsObject,
      isCount: true,
    };
    const payload = generateSearchQuery(searchBuilderPayload);
    if (Object.keys(searchFieldsObject.fields).length) {
      const response = await performQuery<estypes.CountResponse>(payload, true);
      return { totalResults: response?.count ?? 0 };
    } else {
      return Promise.resolve({ totalResults: 0 });
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

const getFilterOptions = async (
  searchFieldsObject: ISearchPayload,
  filterFlags?: IFilterFlags,
  isQuickSearchJourney: boolean = false,
): Promise<IAggregationOptions> => {
  try {
    const { isStudyPeriod = false } = filterFlags as IFilterFlags;
    if (Object.keys(searchFieldsObject.fields).length) {
      const searchBuilderPayload: ISearchBuilderPayload = {
        searchFieldsObject,
        isAggregation: true,
        ...(isQuickSearchJourney && {
          fieldsToSearch: quickSearchTargetFields,
        }),
      };
      const payload = generateFilterQuery(searchBuilderPayload, {
        isStudyPeriod,
      });
      payload.terminate_after = 10000;
      const response = await performQuery<estypes.SearchResponse>(payload);
      const finalResponse: IAggregationOptions = await formatAggregationResponse(response, defaultFilterOptions);
      return finalResponse;
    } else {
      const fallbackResolve: IAggregationOptions = defaultFilterOptions.reduce((acc, curr) => {
        acc[curr.key] = [];
        return acc;
      }, {});
      return Promise.resolve(fallbackResolve);
    }
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

const getDocumentDetails = async (docId: string): Promise<ISearchItem> => {
  try {
    const payload = generateSearchQuery({ docId });
    const response = await performQuery<estypes.SearchResponse>(payload);
    const responseData = response;
    if (responseData?.hits?.total?.valueOf) {
      const finalResponse: ISearchResults = await formatSearchResponse(responseData, true);
      return finalResponse?.items?.[0] as ISearchItem;
    } else {
      return Promise.resolve({} as ISearchItem);
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

export { getDocumentDetails, getFilterOptions, getSearchResultsCount, getSearchResults };
