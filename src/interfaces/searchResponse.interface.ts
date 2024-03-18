import { GeneralTab, QualityTab } from './detailsTab.interface';

export interface ISearchItem {
  id: string;
  title: string;
  publishedBy: string;
  content: string;
  studyPeriod: string;
  resourceLocator: string;
  organisationName?: string;
  alternateTitle?: string;

  generalTab?: GeneralTab;

  ncea_catalogue_number?: string;
  host_catalogue_number?: string;
  host_catalogue_entry?: string;
  resource_type_and_hierarchy?: string;
  hierarchy_level?: string;
  resource_locators?: string;

  qualityTab?: QualityTab;
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
