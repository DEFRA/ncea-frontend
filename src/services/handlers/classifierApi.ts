import { environmentConfig } from '../../config/environmentConfig';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { classifiers, classify } from '../../interfaces/classifierSearch.interface';

const transformClassifierDetails = (classifiers: classify[]): classify[] => {
  return classifiers.map((classifier) => ({
    ...classifier,
    text: classifier.definition,
    value: classifier.themeName || classifier.name,
  }));
};

export const getClassifierThemes = async (level: string, parents: string = ''): Promise<classifiers[]> => {
  try {
    let url = `${environmentConfig.classifierApiUrl}?level=${level}`;
    if (parents) {
      console.log(parents);
      url =
        url + `&Parents=${parents}`
    }
    const headers = {
      headers: {
        'X-API-Key': environmentConfig.classifierApiKey
      }
    }
    const response: AxiosResponse = await axios.get(url, headers);
    // console.log(response);
    const classifierResponse: classifiers[] = response.data.map((classifier: classifiers) => {
      const classifiers = transformClassifierDetails(classifier.classifiers);
      // console.log(classifiers);
      return {
        sectionTitle: classifier.sectionTitle,
        sectionIntro: classifier.sectionIntroduction,
        classifiers,
        selectAll: classifiers.map((classify) => classify.code).join(','),
      };
    });
    // console.log(JSON.stringify(classifierResponse));
    return classifierResponse;
  } catch (error: AxiosError) {
    console.error(error);
    return [];
  }
};
