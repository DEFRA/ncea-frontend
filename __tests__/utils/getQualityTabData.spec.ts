'use strict';

import { IQualityItem } from '../../src/interfaces/searchResponse.interface';
import { showLessText, showMoreText } from '../../src/utils/constants';
import { getQualityTabData } from '../../src/utils/getQualityTabData';

describe('Quality tab fields', () => {
  it('should have values for the fields', async () => {
    const searchItem: Record<string, any> = {
      _source: {
        resourceDate: [
          {
            type: 'publication',
            date: '2022-03-23T17:25:56.000Z',
          },
        ],
        lineageObject: {
          default:
            'This data set has been derived from an Echosounder - multibeam survey which was collected for the purpose of Scientific Research. The survey has been validated and processed by the UK Hydrographic Office (UKHO).',
        },
        supplementalInformationObject: {
          default: 'This is for additional information',
        },
      },
    };

    const result: IQualityItem = await getQualityTabData(searchItem);
    expect(result).toEqual({
      publicationInformation: '23 March 2022 - Last Revision',
      lineage:
        'This data set has been derived from an Echosounder - multibeam survey which was collected for the purpose of Scientific Research. The survey has been validated and processed by the UK Hydrographic Office (UKHO).',
      additionalInformation: 'This is for additional information',
      conformity: '',
    });
  });

  it('should have show more link if the lineage has more than configured words', async () => {
    const searchItem: Record<string, any> = {
      _source: {
        resourceDate: [
          {
            type: 'publication',
            date: '2022-03-23T17:25:56.000Z',
          },
        ],
        lineageObject: {
          default:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse auctor enim sit amet diam pharetra, sit amet ultrices elit convallis. Phasellus varius mattis mi, at consequat dolor congue quis. Fusce a odio id nunc viverra sagittis sit amet eget dui. Integer sed aliquet metus. Maecenas a eros vel orci iaculis gravida eget in mi. In non libero eleifend, aliquet ligula a, maximus nisi. Quisque a mauris quis ante faucibus semper vitae in diam. Cras nec ipsum sit amet diam tincidunt malesuada at nec metus.<br>Ut mattis felis sapien, suscipit feugiat quam cursus sit amet. Nam suscipit dapibus pellentesque. Nam sed quam non ipsum ultrices sollicitudin. Aliquam eu porta arcu, id.',
        },
      },
    };

    const result: IQualityItem = await getQualityTabData(searchItem);
    expect(result).toEqual({
      publicationInformation: '23 March 2022 - Last Revision',
      lineage: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse auctor enim sit amet diam pharetra, sit amet ultrices elit convallis. Phasellus varius mattis mi, at consequat dolor congue quis. Fusce a odio id nunc viverra sagittis sit amet eget dui. Integer sed aliquet metus. Maecenas a eros vel orci iaculis gravida eget in mi. In non libero eleifend, aliquet ligula a, maximus nisi. Quisque a mauris quis ante faucibus semper vitae in diam. Cras nec ipsum sit amet diam tincidunt malesuada at nec metus.<br>Ut mattis felis sapien, suscipit feugiat quam cursus sit amet. Nam suscipit dapibus pellentesque. Nam sed quam<span id='lineage-content' style='display: none;'> non ipsum ultrices sollicitudin. Aliquam eu porta arcu, id.</span> <a href='javascript:void(0);' class='govuk-link toggle-content__link' onclick=\"toggleContent(this, 'lineage', '${showMoreText}', '${showLessText}')\">${showMoreText}</a>`,
      additionalInformation: '',
      conformity: '',
    });
  });

  it('should have single conformity row', async () => {
    const searchItem: Record<string, any> = {
      _source: {
        specificationConformance: [
          {
            title: 'invocable',
            explanation: 'Conformant to the INSPIRE SDS specifications.',
            pass: 'true',
          },
        ],
        supplementalInformationObject: {
          default: 'This is for additional information',
        },
      },
    };
    const conformityHTML = `<table class="details-table">
                      <thead>
                        <tr>
                          <th width="60%">Specification</th>
                          <th width="10%">Degree</th>
                          <th>Explanation</th>
                        </tr>
                      </thead><tbody><tr>
                      <td>invocable</td>
                      <td>true</td>
                      <td>Conformant to the INSPIRE SDS specifications.</td>
                    </tr></tbody></table>`;
    const result: IQualityItem = await getQualityTabData(searchItem);
    expect(result).toEqual({
      publicationInformation: '',
      lineage: '',
      additionalInformation: 'This is for additional information',
      conformity: conformityHTML,
    });
  });

  it('should have two conformity rows', async () => {
    const searchItem: Record<string, any> = {
      _source: {
        specificationConformance: [
          {
            title: 'invocable',
            explanation: 'Conformant to the INSPIRE SDS specifications.',
            pass: 'true',
          },
          {
            title: 'Description of technical specification',
            explanation: 'Conformant to the cited specifications.',
            pass: 'true',
          },
        ],
      },
    };
    const conformityHTML = `<table class="details-table">
                      <thead>
                        <tr>
                          <th width="60%">Specification</th>
                          <th width="10%">Degree</th>
                          <th>Explanation</th>
                        </tr>
                      </thead><tbody><tr>
                      <td>invocable</td>
                      <td>true</td>
                      <td>Conformant to the INSPIRE SDS specifications.</td>
                    </tr><tr>
                      <td>Description of technical specification</td>
                      <td>true</td>
                      <td>Conformant to the cited specifications.</td>
                    </tr></tbody></table>`;
    const result: IQualityItem = await getQualityTabData(searchItem);
    expect(result).toEqual({
      publicationInformation: '',
      lineage: '',
      additionalInformation: '',
      conformity: conformityHTML,
    });
  });

  it('should have return empty values if there is no data', async () => {
    const searchItem: Record<string, any> = {};

    const result: IQualityItem = await getQualityTabData(searchItem);
    expect(result).toEqual({
      publicationInformation: '',
      lineage: '',
      additionalInformation: '',
      conformity: '',
    });
  });
});
