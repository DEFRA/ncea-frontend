'use strict';

import { ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { getClassifierThemes } from '../../services/handlers/classifierApi';
import { getSearchResultsCount } from '../../services/handlers/searchApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { formIds, webRoutePaths } from '../../utils/constants';
import { generateCountPayload, readQueryParams } from '../../utils/queryStringHelper';

const ClassifierSearchController = {
  renderClassifierSearchHandler: async (
    request: Request,
    response: ResponseToolkit
  ): Promise<ResponseObject> => {
    const {
      guidedClassifierSearch: guidedClassifierSearchPath,
      guidedDateSearch: skipPath,
      results,
    } = webRoutePaths;
    const formId: string = formIds.classifierSearch;
    const level: string = readQueryParams(request.query, "level");
    const parent: string = readQueryParams(request.query, "parent");
    const nextLevel: string = (+level + 1).toString();
    const payloadQuery = {
      ...request.query,
      level: (Number(level) - 1).toString(),
    };
    const resultPathQueryString: string = readQueryParams(
      payloadQuery,
      "",
      true
    );
    const resultsPath: string = `${results}?${resultPathQueryString}`;

    const renderView = async (showCount: boolean) => {
      let count: string | null = null;
      if (showCount) {
        const queryBuilderSearchObject: ISearchPayload =
          generateCountPayload(payloadQuery);
        const searchResultsCount: { totalResults: number } =
          await getSearchResultsCount(queryBuilderSearchObject);
        count = searchResultsCount.totalResults.toString() || null;
      }
      const classifierItems = await getClassifierThemes(level, parent);
      return response.view("screens/guided_search/classifier_selection.njk", {
        guidedClassifierSearchPath,
        nextLevel,
        skipPath,
        formId,
        classifierItems,
        count,
        resultsPath,
        backLinkPath: "javascript:history.back()",
      });
    };
    if (Number(level) - 1 == 3) {
      const queryBuilderSearchObject: ISearchPayload =
        generateCountPayload(payloadQuery);
      const searchResultsCount: { totalResults: number } =
        await getSearchResultsCount(queryBuilderSearchObject);
      return response.redirect(
        `${skipPath}?cnt=${searchResultsCount.totalResults.toString()}`
      );
    } else if (Number(payloadQuery.level) >= 1) {
      return renderView(true);
    } else {
      return renderView(false);
    }
  },
};

export { ClassifierSearchController };
