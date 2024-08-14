import {getGovernanceTabData} from '../../src/utils/getGovernanceTab';
import { combineAndSortContacts } from '../../src/utils/getAccessTabData';
import { IGovernance } from '../../src/interfaces/searchResponse.interface';


jest.mock('../../src/utils/getAccessTabData', () => ({
  combineAndSortContacts: jest.fn(),
}));

describe('getGovernanceTabData', () => {

  it('should return an empty array when contact and contactForResource are both undefined', () => {
    const searchItem = { _source: {} };
    (combineAndSortContacts as jest.Mock).mockReturnValue([]);
    const result = getGovernanceTabData(searchItem);
    expect(result).toEqual([]);
  });

  it('should call combineAndSortContacts with contacts and contactForResource', () => {
    const contacts = [{ individual: 'John Doe' }];
    const contactForResource = [{ individual: 'Jane Doe' }];
    const searchItem = {
      _source: { contact: contacts, contactForResource: contactForResource },
    };

    (combineAndSortContacts as jest.Mock).mockReturnValue([...contacts, ...contactForResource]);

    getGovernanceTabData(searchItem);

    expect(combineAndSortContacts).toHaveBeenCalledWith(contacts, contactForResource);
  });

  it('should map sorted contacts to IGovernance format', () => {
    const sortedContacts = [
      {
        role: 'Manager',
        organisationName: 'Org Inc.',
        individual: 'John Doe',
        position: 'Head',
        phone: '123-456-7890',
        address: '123 Street Name',
        postalCode: '12345',
        city: 'CityName',
        administrativeArea: 'AdminArea',
        country: 'CountryName',
        website: 'https://example.com',
        email: 'john@example.com',
      },
    ];

    const searchItem = { _source: { contact: sortedContacts, contactForResource: [] } };

    (combineAndSortContacts as jest.Mock).mockReturnValue(sortedContacts);

    const result = getGovernanceTabData(searchItem);

    const expected: IGovernance[] = [
      {
        tab: 'governance',
        role: 'Manager',
        organization_name: 'Org Inc.',
        individual_name: 'John Doe',
        position_name: 'Head',
        telephone_number: '123-456-7890',
        delivery_point: '123 Street Name',
        postal_code: '12345',
        city: 'CityName',
        administrative_area: 'AdminArea',
        country: 'CountryName',
        web_address: 'https://example.com',
        email: 'john@example.com',
      },
    ];

    expect(result).toEqual(expected);
  });

  it('should handle missing or undefined fields in contacts', () => {
    const sortedContacts = [
      {
        role: undefined,
        organisationName: undefined,
        individual: undefined,
        position: undefined,
        phone: undefined,
        address: undefined,
        postalCode: undefined,
        city: undefined,
        administrativeArea: undefined,
        country: undefined,
        website: undefined,
        email: undefined,
      },
    ];

    const searchItem = { _source: { contact: sortedContacts, contactForResource: [] } };

    (combineAndSortContacts as jest.Mock).mockReturnValue(sortedContacts);

    const result = getGovernanceTabData(searchItem);

    const expected: IGovernance[] = [
      {
        tab: 'governance',
        role: '',
        organization_name: '',
        individual_name: '',
        position_name: '',
        telephone_number: '',
        delivery_point: '',
        postal_code: '',
        city: '',
        administrative_area: '',
        country: '',
        web_address: '',
        email: '',
      },
    ];

    expect(result).toEqual(expected);
  });
});
