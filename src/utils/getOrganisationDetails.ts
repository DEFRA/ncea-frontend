/* eslint-disable  @typescript-eslint/no-explicit-any */
const getOrganisationDetails = (
  data: Record<string, any>[],
  isDetails: boolean = false,
): { organisationValue: string; emailValue: string } => {
  if (Array.isArray(data) && data.length > 0) {
    const rolesOrder: string[] = ['custodian', 'pointOfContact', 'originator', 'distributor', 'owner'];

    const getOrganisation = (role: string): string => {
      const obj = data.find((item: Record<string, any>) => item.role === role);
      return obj ? obj?.organisationObject?.default ?? '' : '';
    };

    const getEmail = (role: string): string => {
      const obj = data.find((item: Record<string, any>) => item.role === role);
      return obj ? obj?.email ?? '' : '';
    };

    if (isDetails) {
      for (const role of rolesOrder) {
        const orgValue: string = getOrganisation(role);
        const emailValue: string = getEmail(role);
        if (orgValue) {
          return { organisationValue: orgValue, emailValue };
        }
      }
    } else {
      const orgValue: string = getOrganisation('owner');
      return { organisationValue: orgValue, emailValue: '' };
    }
  }
  return { organisationValue: '', emailValue: '' };
};

export { getOrganisationDetails };
