import { FormattedTabOptions } from '../../src/interfaces/detailsTab.interface';
import { ISearchItem } from '../../src/interfaces/searchResponse.interface';
import { formattedDetailsFullResponse } from '../data/documentDetailsResponse';

describe('Process details tab data function', () => {
  let originalWindow: Window | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    originalWindow = global.window;

    global.window = {
      location: {
        hostname: 'seabed.admiralty.co.uk',
      },
    } as unknown as Window & typeof globalThis;
  });

  afterEach(() => {
    global.window = originalWindow as unknown as Window & typeof globalThis;
  });

  it('should process details tab data correctly', async () => {
    const docDetails: ISearchItem = {
      ...(formattedDetailsFullResponse.items[0] as ISearchItem),
    };
    const {
      processDetailsTabData,
    } = require('../../src/utils/processDetailsTabData');
    const processedData: FormattedTabOptions =
      await processDetailsTabData(docDetails);
    expect(processedData).toBeDefined();
  });

  it('should process when column has parentheses and the value is not an URL', async () => {
    jest.mock('../../src/utils/constants', () => ({
      detailsTabOptions: {
        mock: { 'Title': '(title)' },
      },
    }));
    const {
      processDetailsTabData,
    } = require('../../src/utils/processDetailsTabData');
    const docDetails: ISearchItem = {
      ...(formattedDetailsFullResponse.items[0] as ISearchItem),
    };
    const processedData: FormattedTabOptions =
      await processDetailsTabData(docDetails);
    expect(processedData).toBeDefined();
    expect(processedData['mock']).toBeDefined();
    expect(processedData?.['mock']?.[0]?.displayValue).toBe(
      `(${docDetails.title})`,
    );
  });

  it('should process when column has parentheses and the value is an URL', async () => {
    jest.mock('../../src/utils/constants', () => ({
      detailsTabOptions: {
        mock: { 'Title': '(resourceLocator)' },
      },
    }));
    const {
      processDetailsTabData,
    } = require('../../src/utils/processDetailsTabData');
    const docDetails: ISearchItem = {
      ...(formattedDetailsFullResponse.items[0] as ISearchItem),
    };
    const processedData: FormattedTabOptions =
      await processDetailsTabData(docDetails);
    expect(processedData).toBeDefined();
    expect(processedData['mock']).toBeDefined();
    expect(processedData?.['mock']?.[0]?.displayValue).toBe(
      `(<a class="govuk-link" href="${docDetails.resourceLocator}" target="_blank">${docDetails.resourceLocator}</a>)`,
    );
  });

  it('should process when column having the value as an URL without parentheses', async () => {
    jest.mock('../../src/utils/constants', () => ({
      detailsTabOptions: {
        mock: { 'Title': 'resourceLocator' },
      },
    }));
    const {
      processDetailsTabData,
    } = require('../../src/utils/processDetailsTabData');
    const docDetails: ISearchItem = {
      ...(formattedDetailsFullResponse.items[0] as ISearchItem),
    };
    const processedData: FormattedTabOptions =
      await processDetailsTabData(docDetails);
    expect(processedData).toBeDefined();
    expect(processedData['mock']).toBeDefined();
    expect(processedData?.['mock']?.[0]?.displayValue).toBe(
      `<a class="govuk-link" href="${docDetails.resourceLocator}" target="_blank">${docDetails.resourceLocator}</a>`,
    );
  });

  it('should process when column and display plain value', async () => {
    jest.mock('../../src/utils/constants', () => ({
      detailsTabOptions: {
        mock: { 'Title': 'title' },
      },
    }));
    const {
      processDetailsTabData,
    } = require('../../src/utils/processDetailsTabData');
    const docDetails: ISearchItem = {
      ...(formattedDetailsFullResponse.items[0] as ISearchItem),
    };
    const processedData: FormattedTabOptions =
      await processDetailsTabData(docDetails);
    expect(processedData).toBeDefined();
    expect(processedData['mock']).toBeDefined();
    expect(processedData?.['mock']?.[0]?.displayValue).toBe(docDetails.title);
  });

  it('should process the empty displayValue', async () => {
    jest.mock('../../src/utils/constants', () => ({
      detailsTabOptions: {
        mock: { 'Title': 'title12' },
      },
    }));
    const {
      processDetailsTabData,
    } = require('../../src/utils/processDetailsTabData');
    const docDetails: ISearchItem = {
      ...(formattedDetailsFullResponse.items[0] as ISearchItem),
    };
    const processedData: FormattedTabOptions =
      await processDetailsTabData(docDetails);
    expect(processedData).toBeDefined();
    expect(processedData['mock']).toBeDefined();
    expect(processedData?.['mock']?.[0]?.displayValue).toBe('');
  });

  it('should process the value with the given format when having two columns', async () => {
    jest.mock('../../src/utils/constants', () => ({
      detailsTabOptions: {
        mock: { 'Title': 'title (resourceLocator)' },
      },
    }));
    const {
      processDetailsTabData,
    } = require('../../src/utils/processDetailsTabData');
    const docDetails: ISearchItem = {
      ...(formattedDetailsFullResponse.items[0] as ISearchItem),
    };
    const processedData: FormattedTabOptions =
      await processDetailsTabData(docDetails);
    expect(processedData).toBeDefined();
    expect(processedData['mock']).toBeDefined();
    expect(processedData?.['mock']?.[0]?.displayValue).toBe(
      `${docDetails.title} (<a class="govuk-link" href="${docDetails.resourceLocator}" target="_blank">${docDetails.resourceLocator}</a>)`,
    );
  });

  it('should process the value with the given format when having two columns and link having target', async () => {
    jest.mock('../../src/utils/constants', () => ({
      detailsTabOptions: {
        mock: { 'Title': 'title (resourceLocator)' },
      },
    }));
    global.window!.location.hostname = 'localhost:4000';
    const {
      processDetailsTabData,
    } = require('../../src/utils/processDetailsTabData');
    const docDetails: ISearchItem = {
      ...(formattedDetailsFullResponse.items[0] as ISearchItem),
    };
    const processedData: FormattedTabOptions =
      await processDetailsTabData(docDetails);
    expect(processedData).toBeDefined();
    expect(processedData['mock']).toBeDefined();
    expect(processedData?.['mock']?.[0]?.displayValue).toBe(
      `${docDetails.title} (<a class="govuk-link" href="${docDetails.resourceLocator}" target="_blank">${docDetails.resourceLocator}</a>)`,
    );
  });
});
