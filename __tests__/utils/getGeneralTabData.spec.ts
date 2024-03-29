'use strict';

import { IGeneralItem } from '../../src/interfaces/searchResponse.interface';
import { getGeneralTabData } from '../../src/utils/getGeneralTabData';

describe('General tab fields', () => {
  it('should have values for the fields', async () => {
    const searchItem: Record<string, any> = {
      _source: {
        tag: [
          {
            default: 'Elevation',
          },
          {
            default: 'Marine Environmental Data and Information Network',
          },
          {
            default: 'Bathymetry and Elevation',
          },
        ],
        mainLanguage: 'eng',
        cl_topic: [
          {
            default: 'Elevation',
          },
        ],
      },
    };

    const result: IGeneralItem = await getGeneralTabData(searchItem);
    expect(result).toEqual({
      language: 'ENG',
      keywords:
        'Elevation, Marine Environmental Data and Information Network, Bathymetry and Elevation',
      topicCategories: 'Elevation',
    });
  });

  it('should have return empty values if there is no data', async () => {
    const searchItem: Record<string, any> = {};

    const result: IGeneralItem = await getGeneralTabData(searchItem);
    expect(result).toEqual({
      language: '',
      keywords: '',
      topicCategories: '',
    });
  });
});
