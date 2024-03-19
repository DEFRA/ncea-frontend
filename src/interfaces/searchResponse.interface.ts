export interface ISearchItem {
  id: string;
  title: string;
  publishedBy: string;
  content: string;
  studyPeriod: string;
  resourceLocator: string;
  language?: string;
  keywords?: string;
  topic_categories?: string;
  organisationName?: string;
  ncea_catalogue_number?: string;
  host_catalogue_number?: string;
  host_catalogue_entry?: string;
  resource_type_and_hierarchy?: string;
  hierarchy_level?: string;
  resource_locators?: string;
  ncea_group_reference?: string;
  metadata_standard?: string;
  project_number?: string;
  Metadata_language?: string;
  ncea_catalogue_date?: string;
  host_service_catalogue_number?: string;
}

export interface ISearchResults {
  total: number;
  items: ISearchItem[];
}

export interface IAggregationOption {
  value: string;
  text: string;
}

export interface IAggregationOptions extends Array<IAggregationOption> {}
