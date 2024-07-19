import axios from 'axios';
import {
  getClassifierThemes
} from '../../../src/services/handlers/classifierApi';
import {
  level1ApiResponse,
  level2ApiResponse,
  level3ApiResponse,
  level1ClassifierItems,
  level2ClassifierItems,
  level3ClassifierItems
} from '../../data/classifierSearch';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Classifier API', () => {
  describe('getClassifierThemes', () => {
    it('should call classifier list api for level 1', async () => {
      mockedAxios.get.mockResolvedValue({data: level1ApiResponse});
      const classifierItems1 = await getClassifierThemes("1");
      expect(classifierItems1).toEqual(level1ClassifierItems);
    });

    it('should call classifier list api for level 2', async () => {
      mockedAxios.get.mockResolvedValue({data: level2ApiResponse});
      const classifierItems2 = await getClassifierThemes("2", "lvl1-003");
      expect(classifierItems2).toEqual(level2ClassifierItems);
    });

    it('should call classifier list api for level 3', async () => {
      mockedAxios.get.mockResolvedValue({data: level3ApiResponse});
      const classifierItems3 = await getClassifierThemes("3", "lvl2-001,lvl2-003");
      expect(classifierItems3).toEqual(level3ClassifierItems);
    });
  });
});
