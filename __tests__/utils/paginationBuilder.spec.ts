import { RequestQuery } from '@hapi/hapi';
import { getPaginationItems } from '../../src/utils/paginationBuilder';
import { queryParamKeys, webRoutePaths } from '../../src/utils/constants';
import { upsertQueryParams } from '../../src/utils/queryStringHelper';

const requestQuery: RequestQuery = {
  q: 'marine',
  jry: 'qs',
  pg: '1',
  rpp: '20',
  srt: 'best_match',
};
const getUrl = (page: number): string => {
  const queryParamsObject: Record<string, string> = {
    [queryParamKeys.page]: `${page}`,
  };
  const queryString: string = upsertQueryParams(
    requestQuery,
    queryParamsObject,
    false,
  );
  return `${webRoutePaths.results}?${queryString}`;
};
describe('Build the pagination items', () => {
  it('No pagination items when the total record is 0', () => {
    const result = getPaginationItems(1, 0, 20, requestQuery);
    expect(result).toEqual({});
  });
  it('Pagination items without previous page on page 1', () => {
    const result = getPaginationItems(1, 100, 20, requestQuery);
    const paginationItems = {
      items: [
        {
          attributes: {
            'data-page-id': 1,
          },
          current: true,
          href: `${getUrl(1)}`,
          number: 1,
        },
        {
          attributes: {
            'data-page-id': 2,
          },
          href: `${getUrl(2)}`,
          current: false,
          number: 2,
        },
        {
          attributes: {
            'data-page-id': 3,
          },
          href: `${getUrl(3)}`,
          current: false,
          number: 3,
        },
        {
          attributes: {
            'data-page-id': 4,
          },
          href: `${getUrl(4)}`,
          current: false,
          number: 4,
        },
        {
          attributes: {
            'data-page-id': 5,
          },
          current: false,
          href: `${getUrl(5)}`,
          number: 5,
        },
      ],
      next: {
        attributes: {
          'data-page-id': '2',
        },
        href: `${getUrl(2)}`,
      },
    };
    expect(result).toEqual(paginationItems);
  });
  it('Pagination items without next page on last page', () => {
    const result = getPaginationItems(5, 100, 20, requestQuery);
    const paginationItems = {
      items: [
        {
          attributes: {
            'data-page-id': 1,
          },
          current: false,
          href: `${getUrl(1)}`,
          number: 1,
        },
        {
          attributes: {
            'data-page-id': 2,
          },
          current: false,
          href: `${getUrl(2)}`,
          number: 2,
        },
        {
          attributes: {
            'data-page-id': 3,
          },
          current: false,
          href: `${getUrl(3)}`,
          number: 3,
        },
        {
          attributes: {
            'data-page-id': 4,
          },
          current: false,
          href: `${getUrl(4)}`,
          number: 4,
        },
        {
          attributes: {
            'data-page-id': 5,
          },
          current: true,
          href: `${getUrl(5)}`,
          number: 5,
        },
      ],
      previous: {
        attributes: {
          'data-page-id': '4',
        },
        href: `${getUrl(4)}`,
      },
    };
    expect(result).toEqual(paginationItems);
  });
  it('Pagination items with ellipses on page 7', () => {
    const result = getPaginationItems(7, 200, 20, requestQuery);
    const paginationItems = {
      items: [
        {
          attributes: {
            'data-page-id': 1,
          },
          current: false,
          href: `${getUrl(1)}`,
          number: 1,
        },
        {
          ellipsis: true,
        },
        {
          attributes: {
            'data-page-id': 6,
          },
          current: false,
          href: `${getUrl(6)}`,
          number: 6,
        },
        {
          attributes: {
            'data-page-id': 7,
          },
          current: true,
          href: `${getUrl(7)}`,
          number: 7,
        },
        {
          attributes: {
            'data-page-id': 8,
          },
          current: false,
          href: `${getUrl(8)}`,
          number: 8,
        },
        {
          ellipsis: true,
        },
        {
          attributes: {
            'data-page-id': 10,
          },
          current: false,
          href: `${getUrl(10)}`,
          number: 10,
        },
      ],
      next: {
        attributes: {
          'data-page-id': '8',
        },
        href: `${getUrl(8)}`,
      },
      previous: {
        attributes: {
          'data-page-id': '6',
        },
        href: `${getUrl(6)}`,
      },
    };
    expect(result).toEqual(paginationItems);
  });
});
