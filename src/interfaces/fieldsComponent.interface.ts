interface IAttributeOptions {
  [key: string]: string | boolean;
}

interface IHintOptions {
  text?: string;
  html?: string;
  id?: string;
  classes?: string;
  attributes?: IAttributeOptions;
}

interface IErrorMessageOptions {
  text?: string;
  html?: string;
  id?: string;
  classes?: string;
  attributes?: IAttributeOptions;
  visuallyHiddenText?: string;
}

interface IFormGroupOptions {
  classes: string;
}

interface ILabelOptions {
  text?: string;
  html?: string;
  for?: string;
  isPageHeading?: boolean;
  classes?: string;
  attributes?: IAttributeOptions;
}

interface ISuffixRPrefixOptions {
  text?: string;
  html?: string;
  classes?: string;
  attributes?: IAttributeOptions;
}

interface IDateItemOptions {
  id: string;
  name: string;
  label?: string;
  value?: string;
  pattern?: string;
  autocomplete?: string;
  classes?: string;
  attributes?: IAttributeOptions;
}

interface ILegendOptions {
  text?: string;
  html?: string;
  classes?: string;
  isPageHeading?: boolean;
}

interface IFieldsetOptions {
  describedBy?: string;
  legend?: ILegendOptions;
  classes?: string;
  role?: string;
  attributes?: IAttributeOptions;
  html?: string;
}

interface IBasicFieldOptions {
  id: string;
  name: string;
  hint?: IHintOptions;
  errorMessage?: IErrorMessageOptions;
  formGroup?: IFormGroupOptions;
  classes?: string;
  attributes?: IAttributeOptions;
}

interface ITextInputComponent extends IBasicFieldOptions {
  label?: ILabelOptions;
  suffix?: ISuffixRPrefixOptions;
  spellcheck?: boolean;
  pattern?: string;
  autocomplete?: string;
  value?: string;
}

interface IDateInputComponent extends IBasicFieldOptions {
  namePrefix?: string;
  items?: IDateItemOptions[];
  fieldset?: IFieldsetOptions;
}

export { ITextInputComponent, IDateInputComponent };
