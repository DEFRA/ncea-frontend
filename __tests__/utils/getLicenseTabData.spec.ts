import {
  getLicenseTabData,
  getLimitationPublicAccess,
  getLimitationPublicAccessOtherConstraint,
  getLimitationPublicAccessUseConstraint,
  getLimitationPublicAccessUseOtherConstraint,
  getLimitationPublicOtherConstraint,
  getAvailableFormats,
  getFrequencyUpdate,
} from '../../src/utils/getLicenseTabData';

describe('getLimitationPublicAccess', () => {
  test('should return correct limitation public access', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [
          { OrgAccessConstraints: ['Access 1', 'Access 2'] },
        ],
      },
    };
    expect(getLimitationPublicAccess(searchItem)).toBe('Access 1\nAccess 2\n');
  });

  test('should return empty string when no access constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationPublicAccess(searchItem)).toBe('');
  });
});

describe('getLimitationPublicAccessOtherConstraint', () => {
  test('should return correct limitation public access other constraint', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [
          { OrgOtherConstraints: ['Other Constraint 1', 'Other Constraint 2'] },
        ],
      },
    };
    expect(getLimitationPublicAccessOtherConstraint(searchItem)).toBe('Other Constraint 1\nOther Constraint 2\n');
  });

  test('should return empty string when no other constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationPublicAccessOtherConstraint(searchItem)).toBe('');
  });
});

describe('getLimitationPublicAccessUseConstraint', () => {
  test('should return correct limitation public access use constraint', () => {
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
    expect(getLimitationPublicAccessUseConstraint(searchItem)).toBe('Use Constraint 1\nUse Constraint 2\n');
  });

  test('should return empty string when no use constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationPublicAccessUseConstraint(searchItem)).toBe('');
  });
});

describe('getLimitationPublicAccessUseOtherConstraint', () => {
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
    expect(getLimitationPublicAccessUseOtherConstraint(searchItem)).toBe('Other Constraint 1\nOther Constraint 2\n');
  });

  test('should return empty string when no use other constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationPublicAccessUseOtherConstraint(searchItem)).toBe('');
  });
});

describe('getLimitationPublicOtherConstraint', () => {
  test('should return correct limitation public other constraint', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [
          { OrgOtherConstraints: ['Other Constraint 1'] },
        ],
      },
    };
    expect(getLimitationPublicOtherConstraint(searchItem)).toBe('Other Constraint 1');
  });

  test('should return empty string when no other constraints provided', () => {
    const searchItem = {
      _source: {
        OrgResourceConstraints: [],
      },
    };
    expect(getLimitationPublicOtherConstraint(searchItem)).toBe('');
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
      OrgDistributionFormats: [
        { name: 'Format1' },
        { name: 'Format2' },
      ],
    };
    expect(getAvailableFormats(searchItem)).toBe('Format1, Format2');
  });

  test('should return empty string when no formats provided', () => {
    const searchItem = {
      OrgDistributionFormats: [],
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
    const publishedBy = {};
    const expectedData = {
      limitation_on_public_access: 'Access Constraint\n',
      limitation_on_public_access_other_constraint: 'Other Constraint\n',
      conditions_for_access_and_use_use_constraints: 'Use Constraint\n',
      conditions_for_access_and_use_other_constraints: 'Other Constraint\n',
      other_constraint: '',
      available_formats: '',
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
    const publishedBy = {};
    const expectedData = {
      limitation_on_public_access: '',
      limitation_on_public_access_other_constraint: '',
      conditions_for_access_and_use_use_constraints: '',
      conditions_for_access_and_use_other_constraints: '',
      other_constraint: '',
      available_formats: '',
      frequency_of_update: '',
      character_encoding: 'utf8',
    };
    expect(getLicenseTabData(searchItem)).toEqual(expectedData);
  });
});
