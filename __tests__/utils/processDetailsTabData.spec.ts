import { FormattedTabOptions } from '../../src/interfaces/detailsTab.interface';
import { ISearchItem } from '../../src/interfaces/searchResponse.interface';
import { formattedDetailsFullResponse } from '../data/documentDetailsResponse';

describe('Process details tab data function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
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
        mock: [{ label: 'Title', column: '(title)' }],
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
        mock: [{ label: 'Title', column: '(resourceLocator)' }],
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
      `(<a href="${docDetails.resourceLocator}">${docDetails.resourceLocator}</a>)`,
    );
  });

  it('should process when column having the value as an URL without parentheses', async () => {
    jest.mock('../../src/utils/constants', () => ({
      detailsTabOptions: {
        mock: [{ label: 'Title', column: 'resourceLocator' }],
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
      `<a href="${docDetails.resourceLocator}">${docDetails.resourceLocator}</a>`,
    );
  });

  it('should process when column and display plain value', async () => {
    jest.mock('../../src/utils/constants', () => ({
      detailsTabOptions: {
        mock: [{ label: 'Title', column: 'title' }],
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
        mock: [{ label: 'Title', column: 'title12' }],
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
        mock: [{ label: 'Title', column: 'title (resourceLocator)' }],
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
      `${docDetails.title} (<a href="${docDetails.resourceLocator}">${docDetails.resourceLocator}</a>)`,
    );
  });
});
