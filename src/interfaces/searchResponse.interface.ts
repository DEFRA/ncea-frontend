export interface IBaseItem {
  id: string;
  title: string;
  publishedBy: string;
  content: string;
  studyPeriod: string;
  startYear?: string;
  toYear?: string;
  resourceLocator: string;
  organisationName?: string;
  resourceType?: string[];
}

export interface IGeneralItem {
  alternateTitle?: string;
  topicCategories?: string;
  language?: string;
  keywords?: string;
}

export interface IAccessItem {
  ncea_catalogue_number?: string;
  host_catalogue_number?: string;
  host_catalogue_entry?: string;
  resource_type_and_hierarchy?: string;
  contact_information?: string;
  catalogue_number?: string;
  resource_locators?: string;
  host_service_catalogue_number?: string;
  ncea_group_reference?: string;
  metadata_standard?: string;
  project_number?: string;
  metadata_language?: string;
  ncea_catalogue_entry?: string;
}

export interface Contact {
  organisationName: string;
  role: string;
  email: string;
  website: string;
  logo: string;
  individual: string;
  postalCode: string;
  administrativeArea: string;
  country: string;
  city: string;
  position: string;
  phone: string;
  address: string;
}
export interface ILicense {
  limitation_on_public_access?: string;
  limitation_on_public_access_otherconstraint?: string;
  conditions_for_access_and_use_useConstraints?: string;
  conditions_for_access_and_useOtherConstraints?: string;
  other_constraint?: string;
  data_owner?: string;
  available_formats?: string | string[];
  frequency_of_update?: string;
  character_encoding?: string;
}

export interface IGovernance {
  tab?: string;
  role?: string;
  organization_name?: string;
  individual_name?: string;
  position_name?: string;
  telephone_number?: string;
  delivery_point?: string;
  postal_code?: string;
  city?: string;
  administrative_area?: string;
  country?: string;
  web_address?: string;
  email?: string;
}

export interface IQualityItem {
  publicationInformation?: string;
  creationInformation?: string;
  revisionInformation?: string;
  metadataDate?: string;
  lineage?: string;
  conformity?: string;
  additionalInformation?: string;
}

export type IVertex = [number, number];

export interface ICoordinates {
  coordinates: IVertex[][];
}

export interface IAccumulatedCoordinates {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface IAccumulatedCoordinatesWithCenter {
  coordinates: IAccumulatedCoordinates;
  center: string;
}

export interface IGeographyItem {
  spatialDataService?: string;
  spatialRepresentationService?: string;
  spatialReferencingSystem?: string;
  geographicLocations?: string;
  geographicBoundary?: IAccumulatedCoordinates | string;
  geographicBoundaryHtml?: string;
  geographicCenter?: string;
  geographicMarkers?: string;
  verticalExtent?: string;
  samplingResolution?: string;
}

export interface INatural {
  Natural_capital_title?: string;
  Natural_capital_description?: string;
  Natural_capital_displayData?: string;
  Natural_capital_no_data?: string;
  Natural_capital_glossary_link?: string;
}

export type IOtherSearchItem = IGeneralItem &
  IAccessItem &
  INatural &
  IQualityItem &
  ILicense &
  IGeographyItem &
  IGovernance;

export interface ISearchItem extends IBaseItem, IOtherSearchItem {
  [key: string]: IGovernance | string | number | undefined | string[] | IAccumulatedCoordinates;
}

export interface TabbedItem {
  tab?: string;
}

export interface ISearchResults {
  total: number;
  items: ISearchItem[];
}

export interface IAggregationOption {
  value: string;
  text: string;
  selected?: boolean;
  checked?: boolean;
}

export interface IAggregationOptions {
  [key: string]: IAggregationOption[] | [];
}

export interface IOrganisationDetails {
  organisationValue: string;
  role: string;
  email: string;
}

export interface IDateRange {
  start?: { date?: string };
  end?: { date?: string };
}
