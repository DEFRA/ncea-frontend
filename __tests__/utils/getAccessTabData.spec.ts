import {
  getHostCatalogueNumber,
  getCoupledResource,
  getResourceLocators,
  getAccessTabData,
  getResourceTypeHierarchy,
} from '../../src/utils/getAccessTabData';

describe('getAccessTabData functions', () => {
  describe('getHostCatalogueNumber', () => {
    test('should return an empty string when searchItem is an empty object', () => {
      expect(getHostCatalogueNumber({})).toBe('');
    });

    test('should return an empty string when searchItem._source is missing', () => {
      expect(getHostCatalogueNumber({ _source: undefined })).toBe('');
    });

    test('should return an empty string when searchItem._source.resourceIdentifier is null', () => {
      expect(
        getHostCatalogueNumber({ _source: { resourceIdentifier: null } }),
      ).toBe('');
    });

    test('should return an empty string when searchItem._source.resourceIdentifier is an empty array', () => {
      expect(
        getHostCatalogueNumber({ _source: { resourceIdentifier: [] } }),
      ).toBe('');
    });

    test('should return concatenated codeSpace and code when both are provided', () => {
      const searchItem = {
        _source: {
          resourceIdentifier: [{ codeSpace: 'abc', code: '123' }],
        },
      };
      expect(getHostCatalogueNumber(searchItem)).toBe('abc123');
    });

    test('should return empty string when codeSpace and code are null', () => {
      const searchItem = {
        _source: {
          resourceIdentifier: [{ codeSpace: null, code: null }],
        },
      };
      expect(getHostCatalogueNumber(searchItem)).toBe('');
    });

    test('should return empty string when codeSpace and code are empty strings', () => {
      const searchItem = {
        _source: {
          resourceIdentifier: [{ codeSpace: '', code: '' }],
        },
      };
      expect(getHostCatalogueNumber(searchItem)).toBe('');
    });

    test('should return concatenated codeSpace and code when both are non-empty strings', () => {
      const searchItem = {
        _source: {
          resourceIdentifier: [{ codeSpace: 'abc', code: '123' }],
        },
      };
      expect(getHostCatalogueNumber(searchItem)).toBe('abc123');
    });
  });

  describe('getCoupledResource', () => {
    test('should return an empty string when data is an empty string', () => {
      expect(getCoupledResource('')).toBe('');
    });

    test('should create a link with decoded data as href', () => {
      const data = 'https:\\/\\/example.com';
      expect(getCoupledResource(data)).toBe(
        '<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>',
      );
    });
  });

  describe('getResourceLocators', () => {
    test('should return an empty string when _source is missing in searchItem', () => {
      expect(getResourceLocators({})).toBe('');
    });

    test('should return an empty string when _source.cl_function is null', () => {
      const searchItem = {
        _source: { cl_function: null },
      };
      expect(getResourceLocators(searchItem)).toBe('');
    });

    test('should return an empty string when _source.cl_function is an empty array', () => {
      const searchItem = {
        _source: { cl_function: [] },
      };
      expect(getResourceLocators(searchItem)).toBe('');
    });

    test('should generate resource locator strings for valid data', () => {
      const searchItem = {
        _source: {
          cl_function: [
            { key: 'function1', default: 'Function1' },
            { key: 'function2', default: 'Function2' },
          ],
          link: [
            {
              function: 'function1',
              urlObject: { default: 'https://example.com/1' },
              nameObject: { default: 'Name1' },
            },
            {
              function: 'function2',
              urlObject: { default: 'https://example.com/2' },
              nameObject: { default: 'Name2' },
            },
          ],
        },
      };
      const expected =
        'Function1 from Name1 (<a class="govuk-link" href="https://example.com/1" target="_blank">https://example.com/1</a>)\nFunction2 from Name2 (<a class="govuk-link" href="https://example.com/2" target="_blank">https://example.com/2</a>)';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should generate resource locator strings when link data is missing for some functions', () => {
      const searchItem = {
        _source: {
          cl_function: [
            { key: 'function1', default: 'Function1' },
            { key: 'function2', default: 'Function2' },
          ],
          link: [
            {
              function: 'function1',
              urlObject: { default: 'https://example.com/1' },
              nameObject: { default: 'Name1' },
            },
          ],
        },
      };
      const expected =
        'Function1 from Name1 (<a class="govuk-link" href="https://example.com/1" target="_blank">https://example.com/1</a>)';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should generate resource locator strings when organisationValue and email are present', () => {
      const searchItem = {
        _source: {
          contactForResource: [
            {
              role: 'originator',
              email: 'test@example.com',
            },
          ],
          originatorOrgForResourceObject: {
            default: 'Org',
          },
        },
      };
      const expected = 'For access contact Org :- test@example.com';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should return an empty string when organisationValue is present but email is missing', () => {
      const searchItem = {
        _source: {
          organisationValue: 'Org',
          email: undefined,
        },
      };
      expect(getResourceLocators(searchItem)).toBe('');
    });

    test('should return an empty string when email is present but organisationValue is missing', () => {
      const searchItem = {
        _source: {
          organisationValue: undefined,
          email: 'test@example.com',
        },
      };
      expect(getResourceLocators(searchItem)).toBe('');
    });

    test('should return an empty string when both organisationValue and email are missing', () => {
      const searchItem = {
        _source: {
          organisationValue: undefined,
          email: undefined,
        },
      };
      expect(getResourceLocators(searchItem)).toBe('');
    });
  });

  describe('getAccessTabData result', () => {
    test('should return an object with all properties when searchItem is valid', () => {
      const searchItem = {
        _source: {
          uuid: '123',
          OrgCoupledResource: 'example.com',
          resourceType: ['type1'],
          cl_hierarchyLevel: [{ default: 'level1' }],
        },
      };
      const result = getAccessTabData(searchItem);
      expect(result.ncea_catalogue_number).toBe('123');
      expect(result.host_catalogue_number).toBe('');
      expect(result.host_catalogue_entry).toBe(
        '<a class="govuk-link" href="example.com" target="_blank">example.com</a>',
      );
      expect(result.resource_type_and_hierarchy).toBe('level1');
      expect(result.hierarchy_level).toBe('level1');
      expect(result.resource_locators).toBe('');
    });

    test('should return "For access contact" message when organisationValue and email are present', () => {
      const searchItem = {
        _source: {
          contactForResource: [
            {
              role: 'originator',
              email: 'test@example.com',
            },
          ],
          originatorOrgForResourceObject: {
            default: 'Org',
          },
        },
      };
      const result = getAccessTabData(searchItem);
      expect(result.resource_locators).toBe(
        'For access contact Org :- test@example.com',
      );
    });

    test('should return an empty string for resource_locators when organisationValue is present but email is missing', () => {
      const searchItem = {
        _source: {
          organisationValue: 'Org',
          email: undefined,
        },
      };
      const result = getAccessTabData(searchItem);
      expect(result.resource_locators).toBe('');
    });

    test('should return an empty string for resource_locators when email is present but organisationValue is missing', () => {
      const searchItem = {
        _source: {
          organisationValue: undefined,
          email: 'test@example.com',
        },
      };
      const result = getAccessTabData(searchItem);
      expect(result.resource_locators).toBe('');
    });

    test('should return an empty string for resource_locators when both organisationValue and email are missing', () => {
      const searchItem = {
        _source: {
          organisationValue: undefined,
          email: undefined,
        },
      };
      const result = getAccessTabData(searchItem);
      expect(result.resource_locators).toBe('');
    });
  });

  describe('getResourceTypeHierarchy', () => {
    it('returns correct resource type hierarchy for series', () => {
      const searchItem = {
        _source: {
          resourceType: ['series'],
          cl_hierarchyLevel: [{ default: 'Some level' }],
        },
      };
      expect(getResourceTypeHierarchy(searchItem)).toBe(
        'Some level level of Series',
      );
    });

    it('returns correct resource type hierarchy for data series', () => {
      const searchItem = {
        _source: {
          resourceType: ['data series'],
          cl_hierarchyLevel: [{ default: 'Another level' }],
        },
      };
      expect(getResourceTypeHierarchy(searchItem)).toBe(
        'Another level level of Data Series',
      );
    });

    it('returns hierarchy level directly for other resource types', () => {
      const searchItem = {
        _source: {
          resourceType: ['some other type'],
          cl_hierarchyLevel: [{ default: 'Direct level' }],
        },
      };
      expect(getResourceTypeHierarchy(searchItem)).toBe('Direct level');
    });

    it('returns empty string if resource type or hierarchy level is not provided', () => {
      const searchItem = {
        _source: {},
      };
      expect(getResourceTypeHierarchy(searchItem)).toBe('');
    });
  });
});
