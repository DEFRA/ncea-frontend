/* eslint-disable  @typescript-eslint/no-explicit-any */
'use strict';

import { INatural } from '../interfaces/searchResponse.interface';
import { naturalTabStaticData } from '../utils/constants';

const generateClassifierTable = (data: Record<string, any>[]): string => {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const { hasCategory, hasSubcategory } = analyzeClassifiers(data);

  const tableHTML = `
    <table class="details-table-full">
      ${generateTableHeader(hasCategory, hasSubcategory)}
      <tbody>
        ${generateTableRows(data, hasCategory, hasSubcategory)}
      </tbody>
    </table>
  `;

  return tableHTML;
};

const analyzeClassifiers = (data: Record<string, any>[]) => {
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

  return { hasCategory, hasSubcategory };
};

const generateTableHeader = (hasCategory: boolean, hasSubcategory: boolean): string => {
  const categoryWidth = hasSubcategory ? '35%' : '70%';
  const subcategoryWidth = '35%';
  const themeWidth = hasCategory || hasSubcategory ? '30%' : '100%';

  return `
    <thead>
      <tr>
        <th width="${themeWidth}">Theme</th>
        ${hasCategory ? `<th width="${categoryWidth}">Category</th>` : ''}
        ${hasSubcategory ? `<th width="${subcategoryWidth}">Subcategory</th>` : ''}
      </tr>
      <tr><td colspan="${1 + (hasCategory ? 1 : 0) + (hasSubcategory ? 1 : 0)}" class="details-table-hr"></td></tr>
    </thead>
  `;
};

const generateTableRows = (data: Record<string, any>[], hasCategory: boolean, hasSubcategory: boolean): string => {
  return data
    .map(item => generateTableRow(item, hasCategory, hasSubcategory))
    .join('');
};

const generateTableRow = (item: Record<string, any>, hasCategory: boolean, hasSubcategory: boolean): string => {
  const themeName = item?.name ?? '';
  let rows = '';

  if (Array.isArray(item.classifiers) && item.classifiers.length > 0) {
    item.classifiers.forEach((category: Record<string, any>, index: number) => {
      const categoryName = category?.name ?? '';
      if (Array.isArray(category.classifiers) && category.classifiers.length > 0) {
        category.classifiers.forEach((subcategory: Record<string, any>, subIndex: number) => {
          const subcategoryName = subcategory?.name ?? '';
          rows += createRow(themeName, categoryName, subcategoryName, index, subIndex, hasCategory, hasSubcategory);
        });
      } else {
        rows += createRow(themeName, categoryName, '', index, 0, hasCategory, hasSubcategory);
      }
    });
  } else {
    rows += createRow(themeName, '', '', 0, 0, hasCategory, hasSubcategory);
  }

  const colspan = 1 + (hasCategory ? 1 : 0) + (hasSubcategory ? 1 : 0);
  rows += `<tr><td colspan="${colspan}" class="details-table-hr"></td></tr>`;

  return rows;
};

const createRow = (
  themeName: string,
  categoryName: string,
  subcategoryName: string,
  index: number,
  subIndex: number,
  hasCategory: boolean,
  hasSubcategory: boolean
): string => {
  const themeCell = index === 0 && subIndex === 0 ? `<td>${themeName}</td>` : '<td></td>';

  let categoryCell = '';
  if (hasCategory && subIndex === 0) {
    categoryCell = `<td>${categoryName}</td>`;
  } else if (hasCategory) {
    categoryCell = '<td></td>';
  }

  const subcategoryCell = hasSubcategory ? `<td>${subcategoryName}</td>` : '';

  return `
    <tr>
      ${themeCell}
      ${categoryCell}
      ${subcategoryCell}
    </tr>
  `;
};



const getNaturalTab = (searchItem: Record<string, any>): INatural => ({
  Natural_capital_title: naturalTabStaticData.title,
  Natural_capital_description: naturalTabStaticData.description,
  Natural_capital_displayData: generateClassifierTable(searchItem?._source?.OrgNceaClassifiers || []),
  Natural_capital_no_data: naturalTabStaticData.noRecord,
  Natural_capital_glossary_link: naturalTabStaticData.link,
});

export { getNaturalTab, generateClassifierTable };
