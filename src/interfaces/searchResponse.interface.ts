export interface ISearchItem {
  id: string;
  title: string;
  publishedBy: string;
  content: string;
  temporalExtentDetails: {
    startDate: string;
    endDate: string;
  };
  resourceLocator: string;
  abstract?: string;
  language?: string;
  keywords?: string;
  topic_categories?: string;
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
