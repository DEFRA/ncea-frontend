import { getOrganisationDetails } from '../../src/utils/getOrganisationDetails';

describe('Check Organization Details', () => {
  test('should return empty values when data is not an array or empty', () => {
    const testData = [];
    const result = getOrganisationDetails(testData);
    expect(result).toEqual({ organisationValue: '', role: '', email: '' });
  });

  test('should return organisation details for owner role when isDetails is false', () => {
    const testData = {
      contactForResource: [
        {
          organisationObject: { default: 'Org1' },
          role: 'owner',
        },
      ],
      ownerOrgForResourceObject: {
        default: 'Org1',
      },
    };
    const result = getOrganisationDetails(testData);
    expect(result).toEqual({
      organisationValue: 'Org1',
      role: 'owner',
      email: '',
    });
  });

  test('should return organisation details based on roles when isDetails is true', () => {
    const testData = {
      contactForResource: [
        {
          organisationObject: { default: 'Org1' },
          role: 'custodian',
        },
        {
          organisationObject: { default: 'Org2' },
          role: 'owner',
        },
      ],
      custodianOrgForResourceObject: {
        default: 'Org1',
      },
    };
    const result = getOrganisationDetails(testData, true);
    expect(result).toEqual({
      organisationValue: 'Org1',
      role: 'custodian',
      email: '',
    });
  });

  test('should return organisation details for specified role when isDetails is true', () => {
    const testData = {
      contactForResource: [
        {
          organisationObject: { default: 'Org1' },
          role: 'distributor',
        },
      ],
      distributorOrgForResourceObject: {
        default: 'Org1',
      },
    };
    const result = getOrganisationDetails(testData, true);
    expect(result).toEqual({
      organisationValue: 'Org1',
      role: 'distributor',
      email: '',
    });
  });

  test('should ignore other roles that have data if a specified role that has data in the order when isDetails is true.', () => {
    const testData = {
      contactForResource: [
        {
          organisationObject: { default: 'OrgOriginator' },
          role: 'originator',
          email: 'originator@example.com',
        },
        {
          organisationObject: { default: 'OrgDistributor' },
          role: 'distributor',
          email: 'distributor@example.com',
        },
      ],
      distributorOrgForResourceObject: {
        default: 'OrgDistributor',
      },
    };
    const result = getOrganisationDetails(testData, true);
    expect(result).toEqual({
      organisationValue: 'OrgDistributor',
      role: 'distributor',
      email: 'distributor@example.com',
    });
  });

  test('should return empty organisation value when organisationObject.default is not present', () => {
    const testData = {
      contactForResource: [
        {
          role: 'distributor',
        },
      ],
    };
    const result = getOrganisationDetails(testData, true);
    expect(result).toEqual({
      organisationValue: '',
      role: '',
      email: '',
    });
  });
});
