export interface ISearchItem {
  id: string;
  title: string;
  publishedBy: string;
  content: string;
}

export interface ISearchResults {
  total: number;
  items: ISearchItem[];
}
