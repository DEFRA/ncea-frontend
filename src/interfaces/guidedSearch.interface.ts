export interface GovUKItems {
  classes: string;
  name: string;
  value: string;
}

export interface FormFieldError {
  [fieldKey: string]: string | GovUKItems[];
}

export interface IStepRouteMatrix {
  self?: string;
  next?: string;
}

export interface IGuidedSearchStepsMatrix {
  [key: string]: IStepRouteMatrix;
}
