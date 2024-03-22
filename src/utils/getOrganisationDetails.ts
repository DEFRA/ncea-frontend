/* eslint-disable  @typescript-eslint/no-explicit-any */
const getOrganisationDetails = (
  data: Record<string, any>[],
  isDetails: boolean = false,
): { organisationValue: string; role: string; email: string } => {
  if (Array.isArray(data) && data.length > 0) {
    const rolesOrder: string[] = ['custodian', 'pointOfContact', 'originator', 'distributor', 'owner'];

    const getOrganisation = (role: string): any | string => {
      const orgValue = data.find((item: Record<string, any>) => item.role === role);
      if (orgValue) {
        return {
          organisationValue: orgValue?.organisationObject?.default ?? '',
          role: orgValue?.role ?? '',
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
        const orgValue: any | string = getOrganisation(role);
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
