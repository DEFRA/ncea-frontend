export interface IDateObject {
  year: number;
  month?: number;
  day?: number;
}

export interface IFilterFlags {
  isStudyPeriod: boolean;
}

export interface IFilterOption {
  key: string;
  order?: string;
  needCount: boolean;
  propertyToRead: string;
  isTerm?: boolean;
  isDate?: boolean;
  hasBucket?: boolean;
}

export interface IFilterOptions extends Array<IFilterOption> {}
