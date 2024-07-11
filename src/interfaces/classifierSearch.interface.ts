export interface classify {
  text?: string;
  value?: string;
  name: string;
  definition: string;
  id: string;
  themeName?: string;
  code: string;
}

export interface classifiers {
  sectionTitle: string;
  sectionIntroduction: string;
  classifiers: classify[];
  selectAll?: string;
}
