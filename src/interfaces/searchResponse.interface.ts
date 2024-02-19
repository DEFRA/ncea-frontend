export interface ISearchItem {
  id: string;
  title: string;
  publishedBy: string;
  content: string;
  temporalExtentDetails: {
    startDate: string;
    endDate: string;
  };
}

export interface ISearchResults {
  total: number;
  items: ISearchItem[];
}
