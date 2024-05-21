import { IOrganisationDetails } from '../interfaces/searchResponse.interface';

/* eslint-disable  @typescript-eslint/no-explicit-any */
const getOrganisationDetails = (source: Record<string, any>, isDetails: boolean = false): IOrganisationDetails => {
  const data: Record<string, any>[] = source?.contactForResource ?? [];
  if (Array.isArray(data) && data.length > 0) {
    const rolesOrder: string[] = [
      'pointOfContact',
      'custodian',
      'distributor',
      'originator',
      'metadataProvider',
      'owner',
    ];

    const getOrganisation = (role: string): IOrganisationDetails => {
      const orgValue = data.find((item: Record<string, any>) => item.role === role);
      if (orgValue) {
        const orgObject = `${orgValue.role}OrgForResourceObject`;
        return {
          organisationValue: source?.[orgObject]?.default ?? '',
          role: orgValue.role,
          email: orgValue?.email ?? '',
        };
      } else {
        return {
          organisationValue: '',
          role: '',
          email: '',
        };
      }
    };

    if (isDetails) {
      for (const role of rolesOrder) {
        const orgValue: IOrganisationDetails = getOrganisation(role);
        if (orgValue?.organisationValue !== '') {
          return orgValue;
        }
      }
    } else {
      return getOrganisation('owner');
    }
  }
  return { organisationValue: '', role: '', email: '' };
};

export { getOrganisationDetails };
