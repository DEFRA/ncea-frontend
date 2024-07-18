export interface classify {
  text?: string;
  value?: string;
  name: string;
  definition: string;
  themeName?: string;
  code: string;
  classifiers?: classify[];
}

export interface classifiers {
  sectionTitle: string;
  sectionIntroduction: string;
  classifiers: classify[] | [];
  selectAll?: string;
  level?: number;
  code?: string;
  name?: string;
  text?: string;
  value?: string;
}
