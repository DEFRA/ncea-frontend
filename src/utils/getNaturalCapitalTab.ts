/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { INatural } from '../interfaces/searchResponse.interface';
import { naturalTabStaticData } from '../utils/constants';

const generateClassifierTable = (data: Record<string, any>[]): string => {
  if (Array.isArray(data) && data?.length > 0) {
    let hasCategory = false;
    let hasSubcategory = false;

    data.forEach((item: Record<string, any>) => {
      if (Array.isArray(item.classifiers) && item.classifiers.length > 0) {
        hasCategory = true;
        item.classifiers.forEach((category: Record<string, any>) => {
          if (Array.isArray(category.classifiers) && category.classifiers.length > 0) {
            hasSubcategory = true;
          }
        });
      }
    });

    let tableHTML = `<table class="details-table-full">
                      <thead>
                        <tr>
                          <th width="${hasCategory || hasSubcategory ? '30%' : '100%'}">Theme</th>`;
    if (hasCategory) {
      tableHTML += `<th width="${hasSubcategory ? '35%' : '70%'}">Category</th>`;
    }
    if (hasSubcategory) {
      tableHTML += `<th width="35%">Subcategory</th>`;
    }
    const colspan = 1 + (hasCategory ? 1 : 0) + (hasSubcategory ? 1 : 0);
    tableHTML += `<tr><td colspan="${colspan}" class="details-table-hr"></td></tr>`;
    tableHTML += `</tr>
                      </thead><tbody>`;

    data.forEach((item: Record<string, any>) => {
      const themeName = item?.name ?? '';

      if (Array.isArray(item.classifiers) && item.classifiers.length > 0) {
        item.classifiers.forEach((category: Record<string, any>, index: number) => {
          const categoryName = category?.name ?? '';
          if (Array.isArray(category.classifiers) && category.classifiers.length > 0) {
            category.classifiers.forEach((subcategory: Record<string, any>, subIndex: number) => {
              const subcategoryName = subcategory?.name ?? '';
              tableHTML += `<tr>
                              ${index === 0 && subIndex === 0 ? `<td>${themeName}</td>` : '<td></td>'}
                              ${hasCategory && subIndex === 0 ? `<td>${categoryName}</td>` : hasCategory ? '<td></td>' : ''}
                              ${hasSubcategory ? `<td>${subcategoryName}</td>` : ''}
                            </tr>`;
            });
          } else {
            tableHTML += `<tr>
                            ${index === 0 ? `<td>${themeName}</td>` : '<td></td>'}
                            ${hasCategory ? `<td>${categoryName}</td>` : ''}
                            ${hasSubcategory ? '<td></td>' : ''}
                          </tr>
                          `;
          }
        });
      } else {
        tableHTML += `<tr>
                        <td>${themeName}</td>
                        ${hasCategory ? '<td></td>' : ''}
                        ${hasSubcategory ? '<td></td>' : ''}
                      </tr>`;
      }

      const colspan = 1 + (hasCategory ? 1 : 0) + (hasSubcategory ? 1 : 0);
      tableHTML += `<tr><td colspan="${colspan}" class="details-table-hr"></td></tr>`;
    });

    tableHTML += `</tbody></table>`;

    return tableHTML;

  }
  return '';
};

const getNaturalTab = (searchItem: Record<string, any>): INatural => ({
  Natural_capital_title: naturalTabStaticData.title,
  Natural_capital_description: naturalTabStaticData.description,
  Natural_capital_displayData: generateClassifierTable(searchItem?._source?.OrgNceaClassifiers || []),
  Natural_capital_no_data: naturalTabStaticData.noRecord,
  Natural_capital_glossary_link: naturalTabStaticData.link,
});

export { getNaturalTab, generateClassifierTable };
