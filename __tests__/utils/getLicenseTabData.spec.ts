import {
  getLicenseTabData,
  getLicenseConstraints,
  getLimitationPublicAccess,
  getPublishedBy,
  getAvailableFormats,
} from '../../src/utils/getLicenseTabData';

describe('getLicenseTabData', () => {
  test('should return correct license tab data with all properties filled', () => {
    const searchItem = {
      _source: {
        MD_LegalConstraintsOtherConstraintsObject: [
          { default: 'Constraint 1' },
          {},
          { text: 'Constraint 2' },
        ],
        cl_accessConstraints: [{ default: 'Access Constraint', text: 'Text' }],
        licenseObject: [{ default: 'License Object' }],
        OrgDistributionFormats: [
          { name: 'Format1', version: '1.0' },
          { name: 'Format2', version: '2.0' },
        ],
        cl_maintenanceAndUpdateFrequency: [{ default: 'Daily' }],
      },
    };
    const publishedBy = {
      role: 'Role',
      organisationValue: 'Organization',
      email: 'email@example.com',
    };
    const expectedData = {
      limitation_on_public_access:
        'Access Constraint <br>Text <br>License Object',
      license_constraints: 'Constraint 1 <br>Constraint 2',
      data_owner: 'Role, Organization <br>email@example.com',
      available_formats: 'Format1(1.0), Format2(2.0)',
      frequency_of_update: 'Daily',
      character_encoding: 'utf8',
    };
    expect(getLicenseTabData(searchItem, publishedBy)).toEqual(expectedData);
  });

  test('should return correct license tab data with empty or missing properties', () => {
    const searchItem = {
      _source: {
        MD_LegalConstraintsOtherConstraintsObject: [],
        cl_accessConstraints: [],
        licenseObject: [],
        OrgDistributionFormats: [],
        cl_maintenanceAndUpdateFrequency: [],
      },
    };
    const publishedBy = {};
    const expectedData = {
      limitation_on_public_access: '',
      license_constraints: '',
      data_owner: '',
      available_formats: '',
      frequency_of_update: '',
      character_encoding: 'utf8',
    };
    expect(getLicenseTabData(searchItem, publishedBy)).toEqual(expectedData);
  });
});

describe('getLicenseConstraints', () => {
  test('should return correct license constraints with all properties filled', () => {
    const searchItem = {
      _source: {
        MD_LegalConstraintsOtherConstraintsObject: [
          { default: 'Constraint 1' },
          {},
          { text: 'Constraint 2' },
        ],
      },
    };
    const expectedConstraints = 'Constraint 1 <br>Constraint 2';
    expect(getLicenseConstraints(searchItem)).toEqual(expectedConstraints);
  });

  test('should return empty string when no constraints provided', () => {
    const searchItem = {
      _source: {
        MD_LegalConstraintsOtherConstraintsObject: [],
      },
    };
    expect(getLicenseConstraints(searchItem)).toEqual('');
  });
});

describe('getLimitationPublicAccess', () => {
  test('should return correct limitation public access with all properties filled', () => {
    const searchItem = {
      _source: {
        cl_accessConstraints: [{ default: 'Access Constraint', text: 'Text' }],
        licenseObject: [{ default: 'License Object' }],
      },
    };
    const expectedAccess = 'Access Constraint <br>Text <br>License Object';
    expect(getLimitationPublicAccess(searchItem)).toEqual(expectedAccess);
  });

  test('should return empty string when no access constraints provided', () => {
    const searchItem = {
      _source: {
        cl_accessConstraints: [],
        licenseObject: [],
      },
    };
    expect(getLimitationPublicAccess(searchItem)).toEqual('');
  });
});

describe('getPublishedBy', () => {
  test('should return correct data owner with all properties filled', () => {
    const publishedBy = {
      role: 'Role',
      organisationValue: 'Organization',
      email: 'email@example.com',
    };
    const expectedOwner = 'Role, Organization <br>email@example.com';
    expect(getPublishedBy(publishedBy)).toEqual(expectedOwner);
  });

  test('should return empty string when no properties provided', () => {
    const publishedBy = {};
    expect(getPublishedBy(publishedBy)).toEqual('');
  });
});

describe('getAvailableFormats', () => {
  test('should return correct available formats with all properties filled', () => {
    const formats = [
      { name: 'Format1', version: '1.0' },
      { name: 'Format2', version: '2.0' },
    ];
    const expectedFormats = 'Format1(1.0), Format2(2.0)';
    expect(getAvailableFormats(formats)).toEqual(expectedFormats);
  });

  test('should return empty string when no formats provided', () => {
    const formats = [];
    expect(getAvailableFormats(formats)).toEqual('');
  });

  test('should return correct available format when single format provided', () => {
    const formats = { name: 'Format1', version: '1.0' };
    const expectedFormats = 'Format1(1.0)';
    expect(getAvailableFormats(formats)).toEqual(expectedFormats);
  });

  test('should return empty string when invalid formats provided', () => {
    const formats = ['Invalid Format'];
    expect(getAvailableFormats(formats)).toEqual('');
  });
});
