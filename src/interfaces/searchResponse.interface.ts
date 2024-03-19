export interface IBaseItem {
  id: string;
  title: string;
  publishedBy: string;
  content: string;
  studyPeriod: string;
  resourceLocator: string;
  organisationName?: string;
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

export interface IQualityItem {
  publicationInformation?: string;
  lineage?: string;
  conformity?: string;
  additionalInformation?: string;
}

export type IOtherSearchItem = IGeneralItem & IAccessItem & IQualityItem;
export type ISearchItem = IBaseItem & IOtherSearchItem;

export interface ISearchResults {
  total: number;
  items: ISearchItem[];
}

export interface IAggregationOption {
  value: string;
  text: string;
}

export interface IAggregationOptions extends Array<IAggregationOption> {}
