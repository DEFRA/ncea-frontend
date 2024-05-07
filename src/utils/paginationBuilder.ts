import { RequestQuery } from '@hapi/hapi';
import { upsertQueryParams } from './queryStringHelper';
import { queryParamKeys, webRoutePaths } from './constants';

const generatePaginationNumbers = (currentPage, totalPages, maxPagesDisplayed) => {
  const pages: (number | string)[] = [];

  if (totalPages <= maxPagesDisplayed) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage - 1 > 2) {
      pages.push('...');
    }

    if (currentPage - 1 > 1) {
      pages.push(currentPage - 1);
    }

    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }

    if (currentPage + 1 < totalPages) {
      pages.push(currentPage + 1);
    }

    if (currentPage + 1 < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);
  }

  return pages;
};

export const getPaginationItems = (
  currentPage: number | null,
  totalItems: number,
  itemsPerPage: number,
  requestQuery: RequestQuery,
) => {
  const maxPagesDisplayed = 5;
  const paginationItems = {};
  if (totalItems === 0) {
    return paginationItems;
  }
  const totalPaginationPages = Math.ceil(totalItems / itemsPerPage);
  const paginationNumbers = generatePaginationNumbers(currentPage, totalPaginationPages, maxPagesDisplayed);
  // Previous page button
  if (currentPage && currentPage > 1) {
    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.page]: `${currentPage - 1}`,
    };
    const queryString: string = upsertQueryParams(requestQuery, queryParamsObject, false);
    paginationItems['previous'] = {
      href: `${webRoutePaths.results}?${queryString}`,
      attributes: {
        'data-page-id': `${currentPage - 1}`,
      },
    };
  }

  paginationItems['items'] = paginationNumbers.map((page) => {
    if (page === '...') {
      return { ellipsis: true };
    } else {
      const queryParamsObject: Record<string, string> = {
        [queryParamKeys.page]: `${page}`,
      };
      const queryString: string = upsertQueryParams(requestQuery, queryParamsObject, false);
      return {
        number: page,
        current: page === currentPage,
        href: `${webRoutePaths.results}?${queryString}`,
        attributes: { 'data-page-id': page },
      };
    }
  });

  // Next page button
  if (currentPage && currentPage < totalPaginationPages) {
    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.page]: `${currentPage + 1}`,
    };
    const queryString: string = upsertQueryParams(requestQuery, queryParamsObject, false);
    paginationItems['next'] = {
      href: `${webRoutePaths.results}?${queryString}`,
      attributes: {
        'data-page-id': `${currentPage + 1}`,
      },
    };
  }

  return paginationItems;
};
