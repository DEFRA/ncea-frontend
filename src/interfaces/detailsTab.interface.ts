export interface TabOption {
  [key: string]: string;
}
export interface TabOptions {
  [key: string]: TabOption;
}

export interface FormattedTabOption {
  label: string;
  displayValue: string;
}

export interface FormattedTabOptions {
  [key: string]: FormattedTabOption[];
}
