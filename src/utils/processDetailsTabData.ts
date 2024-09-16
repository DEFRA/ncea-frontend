import { detailsTabOptions } from './constants';
import { FormattedTabOption, FormattedTabOptions, TabOption } from '../interfaces/detailsTab.interface';
import { ISearchItem, TabbedItem } from '../interfaces/searchResponse.interface';

const addLink = (value: string): string => {
  return `<a class="govuk-link" href="${value}" target="_blank">${value}</a>`;
};

const formatValue = (value: string, part: string): string => {
  const isLink = /^(http|https):\/\/.*$/.test(value);
  return isLink && part !== 'host_catalogue_number' ? addLink(value) : value;
};

const appendFormattedValue = (value: unknown, part: string, displayValue: string[]) => {
  if (value) {
    const formattedValue = formatValue(value as string, part);
    if (part.includes('(') && part.includes(')')) {
      displayValue.push(`(${formattedValue})`);
    } else {
      displayValue.push(formattedValue);
    }
  }
};

const processTabOption = (
  tabOptions: TabOption,
  entry: Record<string, unknown>,
  docDetails: ISearchItem | Record<string, unknown>,
): FormattedTabOption[] => {
  return Object.keys(tabOptions)
    .map((label) => {
      const displayValue: string[] = [];
      processTabOptionParts(tabOptions[label], entry, docDetails, displayValue);
      return {
        label,
        displayValue: displayValue.length > 0 ? displayValue.join(' ') : '',
      };
    })
    .filter((option) => !(option.label === 'Other Constraint' && option.displayValue === ''));
};

const processTabOptionParts = (
  option: string | undefined,
  entry: Record<string, unknown>,
  docDetails: ISearchItem | Record<string, unknown>,
  displayValue: string[],
) => {
  option?.split(' ')?.forEach((part) => {
    const sanitizedPart = part.replace(/[()]/g, '');
    const value = entry[sanitizedPart] || docDetails[sanitizedPart];
    appendFormattedValue(value, part, displayValue);
  });
};

const processMultipleEntries = (
  tabOptions: TabOption,
  doc: Record<string, unknown>,
  tabKey: string,
  docDetails: ISearchItem | Record<string, unknown>,
): FormattedTabOption[] => {
  const results: FormattedTabOption[] = [];
  const noOfOBjectInTab: number = Object.values(docDetails).filter((obj) => (obj as TabbedItem).tab === tabKey).length;

  Object.keys(doc).forEach((key, index) => {
    const entry = doc[key] as Record<string, unknown>;
    if (typeof entry === 'object' && entry !== null && entry['tab'] == tabKey) {
      const entryResults = processTabOption(tabOptions, entry, docDetails).filter(
        (option) => option.displayValue !== '',
      );
      if (entryResults.length > 0) {
        results.push(...entryResults);
        if (index < noOfOBjectInTab - 1) {
          results.push({
            label: '<div class="govuk-section-break--visible"></div>',
            displayValue: '<div class="govuk-section-break--visible"></div>',
          });
        }
      }
    }
  });
  return results;
};

function isTabHaveMultiplePropertySet(docDetails: Record<string, unknown> | undefined, tabKey: string): boolean {
  if (!docDetails) return false;
  return Object.values(docDetails).some(
    (value) => typeof value === 'object' && value !== null && (value as { tab?: string }).tab === tabKey,
  );
}

const processDetailsTabData = (docDetails: ISearchItem | Record<string, unknown>): FormattedTabOptions => {
  const processedTabOption: FormattedTabOptions = {};

  Object.keys(detailsTabOptions).forEach((tabKey) => {
    const tabOptions = detailsTabOptions[tabKey];
    if (tabOptions) {
      processedTabOption[tabKey] = isTabHaveMultiplePropertySet(docDetails as Record<string, unknown>, tabKey)
        ? processMultipleEntries(tabOptions, docDetails as Record<string, unknown>, tabKey, docDetails)
        : processTabOption(tabOptions, docDetails as Record<string, unknown>, docDetails);
    }
  });

  return processedTabOption;
};

export { processDetailsTabData };
