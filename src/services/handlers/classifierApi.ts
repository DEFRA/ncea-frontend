import axios, { AxiosError, AxiosResponse } from 'axios';
import { classifiers, classify } from '../../interfaces/classifierSearch.interface';

const transformClassifierDetails = (classifiers: classify[]): classify[] => {
  return classifiers.map((classifier) => ({
    ...classifier,
    text: classifier.description,
    value: classifier.title,
  }));
};

export const getClassifierThemes = async (level: string, parents: string = ''): Promise<classifiers[]> => {
  try {
    let url = `http://localhost:3301/naturalthemes?level=${level}`;
    if (parents) {
      url =
        url +
        '&' +
        parents
          .split(',')
          .map((parentId) => `classifiers[0].parent=${parentId}`)
          .join('&');
    }
    const response: AxiosResponse = await axios.get(url);
    const classifierResponse: classifiers[] = response.data.map((classifier: classifiers) => {
      const classifiers = transformClassifierDetails(classifier.classifiers);
      return {
        sectionTitle: classifier.sectionTitle,
        sectionIntro: classifier.sectionIntro,
        classifiers,
        selectAll: classifiers.map((classify) => classify.id).join(','),
      };
    });
    return classifierResponse;
  } catch (error: AxiosError) {
    console.error(error);
    return [];
  }
};
