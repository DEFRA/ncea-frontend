export interface IQuickSearchPayload {
  search_term: string;
}

export interface IDateSearchPayload {
  'from-date-day': number;
  'from-date-month': number;
  'from-date-year': number;
  'to-date-day': number;
  'to-date-month': number;
  'to-date-year': number;
}

export interface IDateObject {
  year: number;
  month?: number;
  day?: number;
}

export interface IFilterOption {
  key: string;
  field: string | string[];
  order?: string;
  needCount: boolean;
  propertyToRead: string;
  isTerm?: boolean;
  isDate?: boolean;
  hasBucket?: boolean;
}

export interface IFilterOptions extends Array<IFilterOption> {}
