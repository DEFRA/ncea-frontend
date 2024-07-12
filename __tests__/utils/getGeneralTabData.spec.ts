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
        resourceLanguage: 'eng',
        cl_topic: [
          {
            default: 'Elevation',
          },
        ],
      },
    };

    const result: IGeneralItem = await getGeneralTabData(searchItem);
    expect(result).toEqual({
      alternateTitle: '',
      language: 'ENG',
      keywords:
        'Elevation, Marine Environmental Data and Information Network, Bathymetry and Elevation',
      topicCategories: 'Elevation',
    });
  });

  it('should return the resource language properly when array of values provided', async () => {
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
        resourceLanguage: ['eng', 'cym'],
        cl_topic: [
          {
            default: 'Elevation',
          },
        ],
      },
    };

    const result: IGeneralItem = await getGeneralTabData(searchItem);
    expect(result).toEqual({
      alternateTitle: '',
      language: 'ENG, CYM',
      keywords:
        'Elevation, Marine Environmental Data and Information Network, Bathymetry and Elevation',
      topicCategories: 'Elevation',
    });
  });

  it('should have return empty values if there is no data', async () => {
    const searchItem: Record<string, any> = {};

    const result: IGeneralItem = await getGeneralTabData(searchItem);
    expect(result).toEqual({
      alternateTitle: '',
      language: '',
      keywords: '',
      topicCategories: '',
    });
  });
});
