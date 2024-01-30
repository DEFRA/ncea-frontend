export interface GovUKItems {
  classes: string;
  name: string;
  value: string;
}

export interface DateQuestionnaireError {
  fromError: string;
  fromItems: GovUKItems[];
  toError: string;
  toItems: GovUKItems[];
}
