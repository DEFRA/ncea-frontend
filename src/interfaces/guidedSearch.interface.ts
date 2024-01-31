export interface GovUKItems {
  classes: string;
  name: string;
  value: string;
}

export interface FormFieldError {
  [fieldKey: string]: string | GovUKItems[];
}

export interface IFormValidatorOptions {
  formId: string;
  submitButtonId: string;
}
