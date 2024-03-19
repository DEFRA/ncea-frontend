/* eslint-disable  @typescript-eslint/no-explicit-any */
const getOrganisationDetails = (
  data: Record<string, any>[],
  isDetails: boolean = false,
): { organisationValue: string } => {
  if (Array.isArray(data) && data.length > 0) {
    const rolesOrder: string[] = ['custodian', 'pointOfContact', 'originator', 'distributor', 'owner'];

    const getOrganisation = (role: string): string => {
      const obj = data.find((item: Record<string, any>) => item.role === role);
      return obj?.organisationObject?.default ?? '';
    };

    if (isDetails) {
      for (const role of rolesOrder) {
        const orgValue: string = getOrganisation(role);
        if (orgValue) {
          return { organisationValue: orgValue };
        }
      }
    } else {
      const orgValue: string = getOrganisation('owner');
      return { organisationValue: orgValue };
    }
  }
  return { organisationValue: '' };
};

export { getOrganisationDetails };
