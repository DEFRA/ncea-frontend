import {
  getLicenseTabData,
  getLimitationData,
  getAvailableFormats,
  getFrequencyUpdate,
} from '../../src/utils/getLicenseTabData';

describe('getLimitationData', () => {
  test('should return correct limitation public access', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [
          { OrgAccessConstraints: ['Access 1', 'Access 2'] },
        ],
      },
    };
    expect(getLimitationData(searchItem, 'access')).toBe('Access 1<br>Access 2<br>');
  });

  test('should return empty string when no access constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationData(searchItem, 'access')).toBe('');
  });

  test('should return correct limitation public access other constraint', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [
          { OrgOtherConstraints: ['Other Constraint 1', 'Other Constraint 2'] },
        ],
      },
    };
    expect(getLimitationData(searchItem, 'other')).toBe('');
  });

  test('should return empty string when no other constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationData(searchItem, 'other')).toBe('');
  });

  test('should return correct limitation public access use constraint', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [
          {
            OrgUseConstraints: ['Use Constraint 1', 'Use Constraint 2'],
          },
        ],
      },
    };
    expect(getLimitationData(searchItem, 'use')).toBe('Use Constraint 1<br>Use Constraint 2<br>');
  });

  test('should return empty string when no use constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationData(searchItem, 'use')).toBe('');
  });

  test('should return correct limitation public access use other constraint', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [
          {
            OrgOtherConstraints: ['Other Constraint 1', 'Other Constraint 2'],
            OrgUseConstraints: ['Use Constraint 1', 'Use Constraint 2'],
          },
        ],
      },
    };
    expect(getLimitationData(searchItem, 'useOther')).toBe('Other Constraint 1<br>Other Constraint 2<br>');
  });

  test('should return empty string when no use other constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationData(searchItem, 'useOther')).toBe('');
  });

  test('should return correct limitation public other constraint', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [
          { OrgOtherConstraints: ['Other Constraint 1'] },
        ],
      },
    };
    expect(getLimitationData(searchItem, 'publicOther')).toBe('Other Constraint 1');
  });

  test('should return empty string when no other constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationData(searchItem, 'publicOther')).toBe('');
  });
});

describe('getFrequencyUpdate', () => {
  test('should return correct frequency update', () => {
    const searchItem = {
      _source: {
        cl_maintenanceAndUpdateFrequency: [{ default: 'Daily' }],
      },
    };
    expect(getFrequencyUpdate(searchItem)).toBe('Daily');
  });

  test('should return empty string when no update frequency provided', () => {
    const searchItem = {
      _source: {
        cl_maintenanceAndUpdateFrequency: [],
      },
    };
    expect(getFrequencyUpdate(searchItem)).toBe('');
  });
});

describe('getAvailableFormats', () => {
  test('should return correct available formats', () => {
    const searchItem = {
      _source: {
        OrgDistributionFormats: [
          { name: 'Format1' },
          { name: 'Format2' },
        ],
      },
    };
    expect(getAvailableFormats(searchItem)).toBe('Format1, Format2');
  });

  test('should return empty string when no formats provided', () => {
    const searchItem = {
      _source: {
        OrgDistributionFormats: [],
      },
    };
    expect(getAvailableFormats(searchItem)).toBe('');
  });
});

describe('getLicenseTabData', () => {
  test('should return correct license tab data', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [
          {
            OrgAccessConstraints: ['Access Constraint'],
            OrgOtherConstraints: ['Other Constraint'],
            OrgUseConstraints: ['Use Constraint'],
          },
        ],
        cl_maintenanceAndUpdateFrequency: [{ default: 'Daily' }],
        OrgDistributionFormats: [{ name: 'Format1' }, { name: 'Format2' }],
      },
    };
    const expectedData = {
      limitation_on_public_access: 'Access Constraint<br>',
      limitation_on_public_access_otherconstraint: '',
      conditions_for_access_and_use_useConstraints: 'Use Constraint<br>',
      conditions_for_access_and_useOtherConstraints: '',
      other_constraint: 'Other Constraint',
      available_formats: 'Format1, Format2',
      frequency_of_update: 'Daily',
      character_encoding: 'utf8',
    };
    expect(getLicenseTabData(searchItem)).toEqual(expectedData);
  });

  test('should return empty data when no constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
        cl_maintenanceAndUpdateFrequency: [],
        OrgDistributionFormats: [],
      },
    };
    const expectedData = {
      limitation_on_public_access: '',
      limitation_on_public_access_otherconstraint: '',
      conditions_for_access_and_useOtherConstraints: "",
      conditions_for_access_and_use_useConstraints: "",
      other_constraint: '',
      available_formats: '',
      frequency_of_update: '',
      character_encoding: 'utf8',
    };
    expect(getLicenseTabData(searchItem)).toEqual(expectedData);
  });
});
