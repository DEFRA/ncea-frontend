import { environmentConfig } from '../../config/environmentConfig';
import axios, { AxiosResponse } from 'axios';
import { classifiers, classify } from '../../interfaces/classifierSearch.interface';

const transformClassifierDetails = (classifiers: classify[]): classify[] => {
  return classifiers?.map((classifier) => ({
    ...classifier,
    text: classifier.definition,
    value: classifier.themeName || classifier.name,
  }));
};

const transformClassifierLevel3Details = (Level2Classifiers: classify[]): classifiers[] => {
  return Level2Classifiers.map((classifier2: classify) => {
    const classifiers3 = classifier2.classifiers ? transformClassifierDetails(classifier2.classifiers) : [];
    return {
      ...classifier2,
      sectionTitle: classifier2.name,
      sectionIntroduction: '',
      classifiers: classifiers3,
      selectAll: classifiers3?.map((classify) => classify.code).join(','),
      text: '',
      value: classifier2.name,
    };
  });
};

export const getClassifierThemes = async (level: string, parents: string = ''): Promise<classifiers[]> => {
  try {
    let url = `${environmentConfig.classifierApiUrl}?level=${level}`;
    if (parents) {
      url = url + `&Parents=${parents}`;
    }
    const headers = {
      headers: {
        'X-API-Key': environmentConfig.classifierApiKey,
      },
    };
    const response: AxiosResponse = await axios.get(url, headers);
    const classifierResponse: classifiers[] = [];
    response.data.forEach((classifier: classifiers) => {
      if (classifier.level === 3) {
        classifierResponse.push({
          sectionTitle: classifier.sectionTitle,
          sectionIntroduction: classifier.sectionIntroduction,
          classifiers: [],
          selectAll: '',
        });
        const lvl3: classifiers[] = transformClassifierLevel3Details(classifier.classifiers);
        classifierResponse.push(...lvl3);
      } else {
        const classifiers = transformClassifierDetails(classifier.classifiers);
        classifierResponse.push({
          sectionTitle: classifier.sectionTitle,
          sectionIntroduction: classifier.sectionIntroduction,
          classifiers,
          selectAll: classifiers.map((classify) => classify.code).join(','),
        });
      }
    });
    return classifierResponse;
  } catch (error: unknown) {
    return [];
  }
};
