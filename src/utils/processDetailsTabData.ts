import { FormattedTabOptions } from '../interfaces/detailsTab.interface';
import { ISearchItem } from '../interfaces/searchResponse.interface';
import { detailsTabOptions } from './constants';

const processDetailsTabData = async (
  docDetails: ISearchItem | Record<string, unknown>,
): Promise<FormattedTabOptions> => {
  const processedTabOption: FormattedTabOptions = {};
  Object.keys(detailsTabOptions).forEach((tabKey) => {
    const tabOptions = detailsTabOptions[tabKey];
    if (tabOptions && Array.isArray(tabOptions)) {
      processedTabOption[tabKey] = tabOptions.map((option) => {
        const displayValue: string[] = [];
        const parts = option.column.split(' ');

        parts.forEach((part) => {
          const sanitizedPart = part.replace(/[()]/g, '');
          const value = docDetails[sanitizedPart];
          if (value) {
            if (part.includes('(') && part.includes(')')) {
              if (/^https?:\/\/.*$/.test(value)) {
                displayValue.push(`(<a href="${value}">${value}</a>)`);
              } else {
                displayValue.push(`(${value})`);
              }
            } else if (/^https?:\/\/.*$/.test(value)) {
              displayValue.push(`<a href="${value}">${value}</a>`);
            } else {
              displayValue.push(value);
            }
          }
        });

        return {
          label: option.label,
          displayValue: displayValue.length > 0 ? displayValue.join(' ') : '',
        };
      });
    }
  });

  return processedTabOption;
};

export { processDetailsTabData };
