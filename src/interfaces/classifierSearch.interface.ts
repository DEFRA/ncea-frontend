export interface Classify {
  text?: string;
  value?: string;
  name: string;
  definition: string;
  themeName?: string;
  code: string;
  classifiers?: Classify[];
}

export interface Classifiers {
  sectionTitle: string;
  sectionIntroduction: string;
  classifiers: Classify[] | [];
  selectAll?: string;
  level?: number;
  code?: string;
  name?: string;
  text?: string;
  value?: string;
}
