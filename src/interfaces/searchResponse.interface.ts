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
  hierarchy_level?: string;
  resource_locators?: string;
}

export interface IGovernance {
  ncea_group_reference?: string;
  metadata_standard?: string;
  project_number?: string;
  Metadata_language?: string;
  ncea_catalogue_date?: string;
  host_service_catalogue_number?: string;
}

export interface ILicense {
  limitation_on_public_access?: string;
  license_constraints?: string;
  data_owner?: string;
  available_formats?: string | string[];
  frequency_of_update?: string;
  character_encoding?: string;
}

export interface IQualityItem {
  publicationInformation?: string;
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

export type IOtherSearchItem = IGeneralItem & IAccessItem & IQualityItem & IGovernance & ILicense & IGeographyItem;
export type ISearchItem = IBaseItem & IOtherSearchItem;

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
