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
