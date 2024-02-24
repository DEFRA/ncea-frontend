import {getPaginationItems} from '../../src/utils/paginationBuilder';

describe('Build the pagination items', () => {
    it('No pagination items when the total record is 0', () => {
        const result = getPaginationItems(1, 0, 20);
        expect(result).toEqual({});
    });
    it('Pagination items without previous page on page 1', () => {
        const result = getPaginationItems(1, 100, 20);
        const paginationItems = {
            "items":[
              {
                "attributes": {
                  "data-page-id": 1,
                },
                "current": true,
                "href": "javascript:void()",
                "number": 1,
              },
              {
                "attributes": {
                  "data-page-id": 2,
                },
                "href": "javascript:void()",
                "number": 2,
              },
              {
                "attributes": {
                  "data-page-id": 3,
                },
                "href": "javascript:void()",
                "number": 3,
              },
              {
                "attributes": {
                  "data-page-id": 4,
                },
                "href": "javascript:void()",
                "number": 4,
              },
              {
                "attributes": {
                  "data-page-id": 5,
                },
                "href": "javascript:void()",
                "number": 5,
              },
            ],
            "next": {
              "attributes": {
                "data-page-id": "2",
              },
              "href": "javascript:void()",
            },
          }
        expect(result).toEqual(paginationItems);
    });
    it('Pagination items without next page on last page', () => {
        const result = getPaginationItems(5, 100, 20);
        const paginationItems =  {
            "items": [
              {
                "attributes": {
                  "data-page-id": 1,
                },
                "href": "javascript:void()",
                "number": 1,
              },
              {
                "attributes": {
                  "data-page-id": 2,
                },
                "href": "javascript:void()",
                "number": 2,
              },
              {
                "attributes": {
                  "data-page-id": 3,
                },
                "href": "javascript:void()",
                "number": 3,
              },
              {
                "attributes": {
                  "data-page-id": 4,
                },
                "href": "javascript:void()",
                "number": 4,
              },
              {
                "attributes": {
                  "data-page-id": 5,
                },
                "current": true,
                "href": "javascript:void()",
                "number": 5,
              },
            ],
            "previous": {
              "attributes": {
                "data-page-id": "4",
              },
              "href": "javascript:void()",
            },
          }
        expect(result).toEqual(paginationItems);
    });
    it('Pagination items with ellipses on page 7', () => {
        const result = getPaginationItems(7, 200, 20);
        const paginationItems =      {
            "items": [
              {
                "attributes": {
                  "data-page-id": 1,
                },
                "href": "javascript:void()",
                "number": 1,
              },
              {
                "ellipsis": true,
              },
              {
                "attributes": {
                  "data-page-id": 6,
                },
                "href": "javascript:void()",
                "number": 6,
              },
              {
                "attributes": {
                  "data-page-id": 7,
                },
                "current": true,
                "href": "javascript:void()",
                "number": 7,
              },
              {
                "attributes": {
                  "data-page-id": 8,
                },
                "href": "javascript:void()",
                "number": 8,
              },
              {
                "ellipsis": true,
              },
              {
                "attributes": {
                  "data-page-id": 10,
                },
                "href": "javascript:void()",
                "number": 10,
              },
            ],
            "next": {
              "attributes": {
                "data-page-id": "8",
              },
              "href": "javascript:void()",
            },
            "previous": {
              "attributes": {
                "data-page-id": "6",
              },
              "href": "javascript:void()",
            },
          }
        expect(result).toEqual(paginationItems);
    });
});