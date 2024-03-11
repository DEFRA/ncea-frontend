import {
  FormattedTabOption,
  FormattedTabOptions,
  TabOption,
} from '../interfaces/detailsTab.interface';
import { ISearchItem } from '../interfaces/searchResponse.interface';
import { detailsTabOptions } from './constants';

const processDetailsTabData = async (
  docDetails: ISearchItem | Record<string, unknown>,
): Promise<FormattedTabOptions> => {
  const processedTabOption: FormattedTabOptions = {};

  const addLink = (value: string): string => {
    const internalDomainRegex = new RegExp(
      `^https?://${window.location.hostname}`,
    );
    const targetAttribute = internalDomainRegex.test(value)
      ? ''
      : ' target="_blank"';
    return `<a class="govuk-link" href="${value}"${targetAttribute}>${value}</a>`;
  };

  const processTabOption = (tabOptions: TabOption[]): FormattedTabOption[] => {
    return tabOptions.map((option) => {
      const displayValue: string[] = [];

      option.column.split(' ').forEach((part) => {
        const sanitizedPart = part.replace(/[()]/g, '');
        const value = docDetails[sanitizedPart];

        if (value) {
          const isLink = /^https?:\/\/.*$/.test(value);
          const formattedValue = isLink ? addLink(value) : value;

          if (part.includes('(') && part.includes(')')) {
            displayValue.push(`(${formattedValue})`);
          } else {
            displayValue.push(formattedValue);
          }
        }
      });

      return {
        label: option.label,
        displayValue: displayValue.length > 0 ? displayValue.join(' ') : '',
      };
    });
  };

  Object.keys(detailsTabOptions).forEach((tabKey) => {
    const tabOptions = detailsTabOptions[tabKey];
    if (tabOptions && Array.isArray(tabOptions)) {
      processedTabOption[tabKey] = processTabOption(tabOptions);
    }
  });

  return processedTabOption;
};

export { processDetailsTabData };
