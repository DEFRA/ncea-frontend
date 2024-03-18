import { getOrganisationDetails } from '../../src/utils/getOrganisationDetails';

describe('Check Organization Details', () => {
  test('should return empty values when data is not an array or empty', () => {
    const testData = [];
    const result = getOrganisationDetails(testData);
    expect(result).toEqual({ organisationValue: '', emailValue: '' });
  });

  test('should return organisation details for owner role when isDetails is false', () => {
    const testData = [
      {
        organisationObject: { default: 'Org1' },
        role: 'owner',
        email: 'owner@example.com',
      },
    ];
    const result = getOrganisationDetails(testData);
    expect(result).toEqual({ organisationValue: 'Org1', emailValue: '' });
  });

  test('should return organisation and email details based on roles when isDetails is true', () => {
    const testData = [
      {
        organisationObject: { default: 'Org1' },
        role: 'custodian',
        email: 'custodian@example.com',
      },
      {
        organisationObject: { default: 'Org2' },
        role: 'owner',
        email: 'owner@example.com',
      },
    ];
    const result = getOrganisationDetails(testData, true);
    expect(result).toEqual({
      organisationValue: 'Org1',
      emailValue: 'custodian@example.com',
    });
  });

  test('should return organisation details for specified role when isDetails is true', () => {
    const testData = [
      {
        organisationObject: { default: 'Org1' },
        role: 'distributor',
        email: 'distributor@example.com',
      },
    ];
    const result = getOrganisationDetails(testData, true);
    expect(result).toEqual({
      organisationValue: 'Org1',
      emailValue: 'distributor@example.com',
    });
  });

  test('should ignore other roles that have data if a specified role that has data in the order when isDetails is true.', () => {
    const testData = [
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
    ];
    const result = getOrganisationDetails(testData, true);
    expect(result).toEqual({
      organisationValue: 'OrgOriginator',
      emailValue: 'originator@example.com',
    });
  });

  test('should return empty organisation value when organisationObject.default is not present', () => {
    const testData = [
      {
        role: 'distributor',
        email: 'distributor@example.com',
      },
    ];
    const result = getOrganisationDetails(testData, true);
    expect(result).toEqual({
      organisationValue: '',
      emailValue: '',
    });
  });

  test('should return empty email value when it is not present', () => {
    const testData = [
      {
        organisationObject: { default: 'OrgDistributor' },
        role: 'distributor',
      },
    ];
    const result = getOrganisationDetails(testData, true);
    expect(result).toEqual({
      organisationValue: 'OrgDistributor',
      emailValue: '',
    });
  });
});
