export interface TabOption {
  label: string;
  column: string;
  key?: string;
}
export interface TabOptions {
  [key: string]: TabOption[];
}

export interface FormattedTabOption {
  label: string;
  displayValue: string;
}

export interface FormattedTabOptions {
  [key: string]: FormattedTabOption[];
}

export interface GeneralTab {
  topicCategories: string;
  language: string;
  keywords: string;
}
export interface QualityTab {
  publicationInformation: string;
  lineage: string;
  conformity: string;
  additionalInformation: string;
}
