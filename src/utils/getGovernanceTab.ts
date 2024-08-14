/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { IGovernance } from '../interfaces/searchResponse.interface';
import { combineAndSortContacts } from './getAccessTabData';

const getGovernanceTabData = (searchItem: Record<string, any>): IGovernance[] => {
  const contacts = searchItem?._source?.contact;
  const contactForResource = searchItem?._source?.contactForResource;
  const sortedArray = combineAndSortContacts(contacts, contactForResource);

  const governanceData: IGovernance[] = sortedArray?.map((contact) => ({
    tab: 'governance',
    role: contact.role || '',
    organization_name: contact.organisationName?.trim() || '',
    individual_name: contact.individual || '',
    position_name: contact.position || '',
    telephone_number: contact.phone || '',
    delivery_point: contact.address || '',
    postal_code: contact.postalCode || '',
    city: contact.city || '',
    administrative_area: contact.administrativeArea || '',
    country: contact.country || '',
    web_address: contact.website || '',
    email: contact.email || '',
  }));
  return governanceData;
};

export { getGovernanceTabData };
