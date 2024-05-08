export interface classify {
  text?: string;
  value?: string;
  title: string;
  description: string;
  id: string;
}

export interface classifiers {
  sectionTitle: string;
  sectionIntro: string;
  classifiers: classify[];
  selectAll?: string;
}
