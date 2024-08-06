import {
  getHostCatalogueNumber,
  getCoupledResource,
  getResourceLocators,
  getAccessTabData,
  getResourceTypeHierarchy,
  getContactInformation,
  getCatelogue,
  combineAndSortContacts,
} from '../../src/utils/getAccessTabData';

describe('getAccessTabData functions', () => {
  describe('getHostCatalogueNumber', () => {
    test('should return an empty string when searchItem is an empty object', () => {
      expect(getHostCatalogueNumber({})).toBe('');
    });

    test('should handle cases where resourceIdentifier is undefined or empty array', () => {
      expect(getHostCatalogueNumber({ _source: { resourceIdentifier: undefined } })).toBe('');
      expect(getHostCatalogueNumber({ _source: { resourceIdentifier: [] } })).toBe('');
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


    test('should return an empty string when empty array is provided', () => {
      expect(getCoupledResource([])).toBe('');
    });

    test('should create a link with decoded data as href when we provide array of links', () => {
      const data = ['https:\\/\\/example.com', 'https:\\/\\/example.com'];
      expect(getCoupledResource(data)).toBe(
        '<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>\n<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>',
      );
    });
  });

  describe('getResourceLocators', () => {
    test('should return an empty string when _source is missing in searchItem', () => {
      expect(getResourceLocators({})).toBe('');
    });

    test('should handle cases where funcData and descriptionData are missing', () => {
      const searchItem = {
        _source: {
          link: [
            {
              urlObject: { default: 'https://example.com' },
              nameObject: { default: 'Example Name' },
            },
          ],
        },
      };
      const expected =
        '<p>Example Name (<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>)</p>';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should handle cases where funcData is present and descriptionData is missing', () => {
      const searchItem = {
        _source: {
          link: [
            {
              function: 'example function',
              urlObject: { default: 'https://example.com' },
              nameObject: { default: 'Example Name' },
            },
          ],
        },
      };
      const expected =
        '<p>Example Function from Example Name (<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>)</p>';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should handle cases where funcData is missing and descriptionData is present', () => {
      const searchItem = {
        _source: {
          link: [
            {
              urlObject: { default: 'https://example.com' },
              nameObject: { default: 'Example Name' },
              descriptionObject: { default: 'Example Description' },
            },
          ],
        },
      };
      const expected =
        '<p>Example Name (<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>): Example Description</p>';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should handle cases where both funcData and descriptionData are present', () => {
      const searchItem = {
        _source: {
          link: [
            {
              function: 'example function',
              urlObject: { default: 'https://example.com' },
              nameObject: { default: 'Example Name' },
              descriptionObject: { default: 'Example Description' },
            },
          ],
        },
      };
      const expected =
        '<p>Example Function from Example Name (<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>): Example Description</p>';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should handle cases where funcData is empty and descriptionData is present', () => {
      const searchItem = {
        _source: {
          link: [
            {
              function: '',
              urlObject: { default: 'https://example.com' },
              nameObject: { default: 'Example Name' },
              descriptionObject: { default: 'Example Description' },
            },
          ],
        },
      };
      const expected =
        '<p>Example Name (<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>): Example Description</p>';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should handle cases where funcData is present and descriptionData is empty', () => {
      const searchItem = {
        _source: {
          link: [
            {
              function: 'example function',
              urlObject: { default: 'https://example.com' },
              nameObject: { default: 'Example Name' },
              descriptionObject: { default: '' },
            },
          ],
        },
      };
      const expected =
        '<p>Example Function from Example Name (<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>)</p>';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should handle cases where both funcData and descriptionData are empty', () => {
      const searchItem = {
        _source: {
          link: [
            {
              function: '',
              urlObject: { default: 'https://example.com' },
              nameObject: { default: 'Example Name' },
              descriptionObject: { default: '' },
            },
          ],
        },
      };
      const expected =
        '<p>Example Name (<a class="govuk-link" href="https://example.com" target="_blank">https://example.com</a>)</p>';
      expect(getResourceLocators(searchItem)).toBe(expected);
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
        '<p>Function1 from Name1 (<a class="govuk-link" href="https://example.com/1" target="_blank">https://example.com/1</a>)</p>\n<p>Function2 from Name2 (<a class="govuk-link" href="https://example.com/2" target="_blank">https://example.com/2</a>)</p>';
      expect(getResourceLocators(searchItem)).toBe(expected);
    });

    test('should generate resource locator strings when link data is missing for some functions', () => {
      const searchItem = {
        _source: {
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
        '<p>Function1 from Name1 (<a class="govuk-link" href="https://example.com/1" target="_blank">https://example.com/1</a>)</p>';
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
      const expected = 'Contact organisation for Resource locator information';
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

    test('should handle case where linkDataObject has missing urlObject or nameObject', () => {
      const searchItem = {
        _source: {
          link: [
            { function: 'function1', urlObject: { default: '' }, nameObject: { default: '' } },
            { function: 'function2', urlObject: undefined, nameObject: { default: 'Name2' } },
            { function: 'function3', urlObject: { default: 'https://example.com/3' }, nameObject: undefined },
          ],
        },
      };
      const expected = '<p>Function3 from <a class="govuk-link" href="https://example.com/3" target="_blank">https://example.com/3</a></p>';
      expect(getResourceLocators(searchItem)).toBe(expected);
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
        'Contact organisation for Resource locator information',
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

    test('should handle case where resourceType is an empty array', () => {
      const searchItem = { _source: { resourceType: [], cl_hierarchyLevel: [{ default: 'level' }] } };
      expect(getResourceTypeHierarchy(searchItem)).toBe('level');
    });

    it('returns empty string if resource type or hierarchy level is not provided', () => {
      const searchItem = {
        _source: {},
      };
      expect(getResourceTypeHierarchy(searchItem)).toBe('');
    });
  });


});
describe('contactFunctions', () => {
  describe('combineAndSortContacts', () => {
    const rolePrecedence = ['owner', 'pointofcontact', 'custodian', 'distributor', 'originator'];

    it('should combine and sort contacts based on role precedence', () => {
      const contactForResource = [
        {
          role: 'distributor',
          organisationName: 'OrgA',
          email: 'orgA@example.com',
          website: '',
          logo: '',
          individual: '',
          position: '',
          phone: '',
          address: ''
        }
      ];
      const contact = [
        {
          role: 'pointofcontact',
          organisationName: 'OrgC',
          email: 'orgC@example.com',
          website: '',
          logo: '',
          individual: '',
          position: '',
          phone: '',
          address: ''
        },
        {
          role: 'custodian',
          organisationName: 'OrgD',
          email: 'orgD@example.com',
          website: '',
          logo: '',
          individual: '',
          position: '',
          phone: '',
          address: ''
        },
      ];

      const result = combineAndSortContacts(contactForResource, contact);

      expect(result).toEqual([
        {
          role: 'pointofcontact',
          organisationName: 'OrgC',
          email: 'orgC@example.com',
          website: '',
          logo: '',
          individual: '',
          position: '',
          phone: '',
          address: ''
        },
        {
          role: 'custodian',
          organisationName: 'OrgD',
          email: 'orgD@example.com',
          website: '',
          logo: '',
          individual: '',
          position: '',
          phone: '',
          address: ''
        },
        {
          role: 'distributor',
          organisationName: 'OrgA',
          email: 'orgA@example.com',
          website: '',
          logo: '',
          individual: '',
          position: '',
          phone: '',
          address: ''
        },
      ]);
    });

    it('should handle cases where one or both contact arrays are undefined or null', () => {
      expect(combineAndSortContacts(undefined ?? [], undefined ?? [])).toEqual([]);
      expect(combineAndSortContacts(null ?? [], null ?? [])).toEqual([]);
      expect(combineAndSortContacts([{
        role: 'owner',
        organisationName: 'OrgA',
        email: 'orgA@example.com',
        website: '',
        logo: '',
        individual: '',
        position: '',
        phone: '',
        address: ''
      }], null ?? [])).toEqual([{
        role: 'owner',
        organisationName: 'OrgA',
        email: 'orgA@example.com',
        website: '',
        logo: '',
        individual: '',
        position: '',
        phone: '',
        address: ''
      }]);
    });

    it('should handle case where contacts have roles not in rolePrecedence', () => {
      const contactForResource = [{
        role: 'owner',
        organisationName: 'OrgA',
        email: 'orgA@example.com',
        website: '',
        logo: '',
        individual: '',
        position: '',
        phone: '',
        address: ''
      }];
      const contact = [{
        role: 'custodian',
        organisationName: 'OrgB',
        email: 'orgB@example.com',
        website: '',
        logo: '',
        individual: '',
        position: '',
        phone: '',
        address: ''
      }];

      const result = combineAndSortContacts(contactForResource, contact);

      expect(result).toEqual([
        {
          role: 'owner',
          organisationName: 'OrgA',
          email: 'orgA@example.com',
          website: '',
          logo: '',
          individual: '',
          position: '',
          phone: '',
          address: ''
        },
        {
          role: 'custodian',
          organisationName: 'OrgB',
          email: 'orgB@example.com',
          website: '',
          logo: '',
          individual: '',
          position: '',
          phone: '',
          address: ''
        },
      ]);
    });
  });


  describe('getContactInformation', () => {
    it('should return contact information formatted correctly when email is present', () => {
      const searchItem = {
        _source: {
          contact: [{
            role: 'owner',
            organisationName: 'OrgA',
            email: 'orgA@example.com',
            website: '',
            logo: '',
            individual: '',
            position: '',
            phone: '',
            address: ''
          }],
          contactForResource: [{
            role: 'custodian',
            organisationName: 'OrgB',
            email: 'orgB@example.com',
            website: '',
            logo: '',
            individual: '',
            position: '',
            phone: '',
            address: ''
          }],
        },
      };

      const result = getContactInformation(searchItem);

      expect(result).toBe('OrgA :- orgA@example.com, <br />OrgB :- orgB@example.com');
    });

    it('should return contact information formatted correctly when email is not present', () => {
      const searchItem = {
        _source: {
          contact: [{
            role: 'owner',
            organisationName: 'OrgA',
            email: '',
            website: '',
            logo: '',
            individual: '',
            position: '',
            phone: '',
            address: ''
          }],
          contactForResource: [{
            role: 'custodian',
            organisationName: 'OrgB',
            email: '',
            website: '',
            logo: '',
            individual: '',
            position: '',
            phone: '',
            address: ''
          }],
        },
      };

      const result = getContactInformation(searchItem);

      expect(result).toBe('OrgA, <br />OrgB');
    });

    it('should return a default message when there are no contacts', () => {
      const searchItem = {
        _source: {
          contact: [],
          contactForResource: [],
        },
      };

      const result = getContactInformation(searchItem);

      expect(result).toBe('Find contact information on the Governance tab');
    });

    it('should handle cases where searchItem._source is missing or undefined', () => {
      const searchItem = {};

      const result = getContactInformation(searchItem);

      expect(result).toBe('Find contact information on the Governance tab');
    });
  });

});

describe('getCatelogue', () => {
  test('should return the correct source system reference ID when it is present', () => {
    const searchItem = {
      _source: {
        OrgNceaIdentifiers: {
          masterReferenceID: {
            sourceSystemReferenceID: '12345'
          }
        }
      }
    };
    expect(getCatelogue(searchItem)).toBe('12345');
  });

  test('should return an empty string when sourceSystemReferenceID is undefined', () => {
    const searchItem = {
      _source: {
        OrgNceaIdentifiers: {
          masterReferenceID: {
            sourceSystemReferenceID: undefined
          }
        }
      }
    };
    expect(getCatelogue(searchItem)).toBe('');
  });

  test('should return an empty string when masterReferenceID is undefined', () => {
    const searchItem = {
      _source: {
        OrgNceaIdentifiers: {
          masterReferenceID: undefined
        }
      }
    };
    expect(getCatelogue(searchItem)).toBe('');
  });

  test('should return an empty string when OrgNceaIdentifiers is undefined', () => {
    const searchItem = {
      _source: {
        OrgNceaIdentifiers: undefined
      }
    };
    expect(getCatelogue(searchItem)).toBe('');
  });

  test('should return an empty string when _source is undefined', () => {
    const searchItem = {
      _source: undefined
    };
    expect(getCatelogue(searchItem)).toBe('');
  });
});
