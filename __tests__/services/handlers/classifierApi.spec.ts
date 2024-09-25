import axios from 'axios';
import {
  getClassifierThemes
} from '../../../src/services/handlers/classifierApi';
import {
  getToken
} from '../../../src/services/handlers/classifierApiTokenProvider';
import {
  level1ApiResponse,
  level2ApiResponse,
  level3ApiResponse,
  level3MissingClassifiersApiResponse,
  level1ClassifierItems,
  level2ClassifierItems,
  level3ClassifierItems,
  level3MissingClassifierItems
} from '../../data/classifierSearch';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../../src/utils/keyvault', () => ({
  getSecret: jest.fn(),
}));

jest.mock('../../../src/services/handlers/classifierApiTokenProvider', () => ({
  getToken: jest.fn(),
  tokenRequest: jest.fn()
}));

describe('Classifier API', () => {
  describe('getClassifierThemes', () => {
    it('should call classifier list api for level 1', async () => {
      mockedAxios.get.mockResolvedValue({data: level1ApiResponse});
      (getToken as jest.Mock).mockResolvedValue('alksdfjalksfjlaksdfjlsakfdj');
      const classifierItems1 = await getClassifierThemes("1");
      expect(classifierItems1).toEqual(level1ClassifierItems);
    });

    it('should call classifier list api for level 2', async () => {
      mockedAxios.get.mockResolvedValue({data: level2ApiResponse});
      (getToken as jest.Mock).mockResolvedValue('alksdfjalksfjlaksdfjlsakfdj');
      const classifierItems2 = await getClassifierThemes("2", "lvl1-003");
      expect(classifierItems2).toEqual(level2ClassifierItems);
    });

    it('should call classifier list api for level 3', async () => {
      mockedAxios.get.mockResolvedValue({data: level3ApiResponse});
      (getToken as jest.Mock).mockResolvedValue('alksdfjalksfjlaksdfjlsakfdj');
      const classifierItems3 = await getClassifierThemes("3", "lvl2-001,lvl2-003");
      expect(classifierItems3).toEqual(level3ClassifierItems);
    });

    it('classifier list error', async () => {
      mockedAxios.get.mockRejectedValue('Network error: Something went wrong');
      (getToken as jest.Mock).mockResolvedValue('alksdfjalksfjlaksdfjlsakfdj');
      const classifierItems4 = await getClassifierThemes("3", "lvl2-001,lvl2-003");
      expect(classifierItems4).toEqual([]);
    });
    it('no classifiers for some of the level 2 categories', async () => {
      mockedAxios.get.mockResolvedValue({data: level3MissingClassifiersApiResponse});
      (getToken as jest.Mock).mockResolvedValue('alksdfjalksfjlaksdfjlsakfdj');
      const classifierItems4 = await getClassifierThemes("3", "lvl2-001,lvl2-003");
      expect(classifierItems4).toEqual(level3MissingClassifierItems);
    });
  });
});
