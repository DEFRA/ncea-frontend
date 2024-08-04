/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { ILicense } from '../interfaces/searchResponse.interface';

const getLimitationPublicAccess = (searchItem: Record<string, any>): string => {
  let limitationPublicAccess = '';
  if (
    Array.isArray(searchItem?._source?.OrgResourceConstraints) &&
    searchItem._source.OrgResourceConstraints.length > 0
  ) {
    searchItem?._source?.OrgResourceConstraints?.forEach((constraint: any) => {
      if (constraint?.OrgAccessConstraints) {
        constraint?.OrgAccessConstraints?.forEach((accessConstraint: string) => {
          limitationPublicAccess += accessConstraint + '\n';
        });
      }
    });
  }
  return limitationPublicAccess;
};

const getLimitationPublicAccessOtherConstraint = (searchItem: Record<string, any>): string => {
  let limitationPublicAccessOtherConstraint = '';
  if (
    Array.isArray(searchItem?._source?.OrgResourceConstraints) &&
    searchItem._source.OrgResourceConstraints.length > 0
  ) {
    searchItem?._source?.OrgResourceConstraints?.forEach((constraint: any) => {
      if (constraint?.OrgOtherConstraints) {
        constraint?.OrgOtherConstraints.forEach((otherConstraint: string) => {
          limitationPublicAccessOtherConstraint += otherConstraint + '\n';
        });
      }
    });
  }
  return limitationPublicAccessOtherConstraint;
};

const getLimitationPublicAccessUseConstraint = (searchItem: Record<string, any>): string => {
  let limitationPublicAccessUseConstraint = '';
  if (
    Array.isArray(searchItem?._source?.OrgResourceConstraints) &&
    searchItem._source.OrgResourceConstraints.length > 0
  ) {
    searchItem?._source?.OrgResourceConstraints?.forEach((constraint: any) => {
      if (constraint?.OrgOtherConstraints && constraint?.OrgUseConstraints) {
        constraint?.OrgUseConstraints?.forEach((useConstraint: string) => {
          limitationPublicAccessUseConstraint += useConstraint + '\n';
        });
      }
    });
  }
  return limitationPublicAccessUseConstraint;
};

const getLimitationPublicAccessUseOtherConstraint = (searchItem: Record<string, any>): string => {
  let limitationPublicAccessUseOtherConstraint = '';

  if (
    Array.isArray(searchItem?._source?.OrgResourceConstraints) &&
    searchItem._source.OrgResourceConstraints.length > 0
  ) {
    searchItem._source.OrgResourceConstraints.forEach((constraint: any) => {
      if (Array.isArray(constraint?.OrgOtherConstraints) && Array.isArray(constraint?.OrgUseConstraints)) {
        constraint.OrgOtherConstraints.forEach((otherConstraint: string) => {
          limitationPublicAccessUseOtherConstraint += otherConstraint + '\n';
        });
      }
    });
  }

  return limitationPublicAccessUseOtherConstraint;
};

const getLimitationPublicOtherConstraint = (searchItem: Record<string, any>): string => {
  let limitationPublicAccessOtherConstraint = '';

  if (
    Array.isArray(searchItem?._source?.OrgResourceConstraints) &&
    searchItem._source.OrgResourceConstraints.length > 0
  ) {
    searchItem?._source?.OrgResourceConstraints?.forEach((constraint: Record<string, any>) => {
      if (constraint?.OrgOtherConstraints && !constraint?.OrgAccessConstraints && !constraint?.OrgUseConstraints) {
        limitationPublicAccessOtherConstraint = constraint?.OrgOtherConstraints.join(', ');
      }
    });
  }

  return limitationPublicAccessOtherConstraint;
};

const getFrequencyUpdate = (searchItem: Record<string, any>): string => {
  let limitationPublicAccessOtherConstraint = '';

  if (
    Array.isArray(searchItem?._source?.cl_maintenanceAndUpdateFrequency) &&
    searchItem._source.cl_maintenanceAndUpdateFrequency.length > 0
  ) {
    limitationPublicAccessOtherConstraint = searchItem._source.cl_maintenanceAndUpdateFrequency
      .map((constraint: Record<string, any>) => constraint.default)
      .join(', ');
  }

  return limitationPublicAccessOtherConstraint;
};

const getAvailableFormats = (searchItem: Record<string, any>): string => {
  let limitationPublicAccessAvailableFormats = '';
  if (searchItem.OrgDistributionFormats && searchItem.OrgDistributionFormats.length > 0) {
    const formatNames = searchItem.OrgDistributionFormats.map((format: Record<string, any>) => format.name);
    limitationPublicAccessAvailableFormats = formatNames.join(', ');
  }
  return limitationPublicAccessAvailableFormats;
};

const getLicenseTabData = (searchItem: Record<string, any>): ILicense => ({
  limitation_on_public_access: getLimitationPublicAccess(searchItem),
  limitation_on_public_access_other_constraint: getLimitationPublicAccessOtherConstraint(searchItem),
  conditions_for_access_and_use_use_constraints: getLimitationPublicAccessUseConstraint(searchItem),
  conditions_for_access_and_use_other_constraints: getLimitationPublicAccessUseOtherConstraint(searchItem),
  other_constraint: getLimitationPublicOtherConstraint(searchItem),
  available_formats: getAvailableFormats(searchItem),
  frequency_of_update: getFrequencyUpdate(searchItem),
  character_encoding: 'utf8',
});

export {
  getLicenseTabData,
  getLimitationPublicAccess,
  getLimitationPublicAccessOtherConstraint,
  getLimitationPublicAccessUseConstraint,
  getLimitationPublicAccessUseOtherConstraint,
  getLimitationPublicOtherConstraint,
  getAvailableFormats,
  getFrequencyUpdate,
};
