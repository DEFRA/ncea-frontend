import { getNaturalTab,generateClassifierTable } from '../../src/utils/getNaturalCapitalTab';
import { naturalTabStaticData } from '../../src/utils/constants';

describe('getNaturalTab', () => {
  it('should return the correct structure when searchItem contains OrgNceaClassifiers', () => {
    const searchItem = {
      _source: {
        OrgNceaClassifiers: [
          {
            name: 'Theme 1',
            classifiers: [
              {
                name: 'Category 1',
                classifiers: [
                  { name: 'Subcategory 1' },
                  { name: 'Subcategory 2' }
                ]
              },
              {
                name: 'Category 2',
                classifiers: []
              }
            ]
          }
        ]
      }
    };

    const result = getNaturalTab(searchItem);

    expect(result).toEqual({
      Natural_capital_title: naturalTabStaticData.title,
      Natural_capital_description: naturalTabStaticData.description,
      Natural_capital_displayData: expect.any(String),
      Natural_capital_no_data: naturalTabStaticData.noRecord,
      Natural_capital_glossary_link: naturalTabStaticData.link,
    });

    expect(result.Natural_capital_displayData).toContain('<table class="details-table-full">');
  });

  it('should return an empty string for Natural_capital_data if OrgNceaClassifiers is empty', () => {
    const searchItem = {
      _source: {
        OrgNceaClassifiers: []
      }
    };

    const result = getNaturalTab(searchItem);

    expect(result).toEqual({
      Natural_capital_title: naturalTabStaticData.title,
      Natural_capital_description: naturalTabStaticData.description,
      Natural_capital_displayData: '',
      Natural_capital_no_data: naturalTabStaticData.noRecord,
      Natural_capital_glossary_link: naturalTabStaticData.link,
    });
  });

  it('should handle missing _source or OrgNceaClassifiers gracefully', () => {
    const searchItem = {};

    const result = getNaturalTab(searchItem);

    expect(result).toEqual({
      Natural_capital_title: naturalTabStaticData.title,
      Natural_capital_description: naturalTabStaticData.description,
      Natural_capital_displayData: '',
      Natural_capital_no_data: naturalTabStaticData.noRecord,
      Natural_capital_glossary_link: naturalTabStaticData.link,
    });
  });
});

describe('generateClassifierTable', () => {
  it('should return a properly formatted HTML table when given data with themes, categories, and subcategories', () => {
    const data = [
      {
        name: 'Theme 1',
        classifiers: [
          {
            name: 'Category 1',
            classifiers: [
              { name: 'Subcategory 1' },
              { name: 'Subcategory 2' }
            ]
          },
          {
            name: 'Category 2',
            classifiers: []
          }
        ]
      }
    ];

    const result = generateClassifierTable(data);

    expect(result).toContain('<table class="details-table-full">');
    expect(result).toContain('<td>Theme 1</td>');
    expect(result).toContain('<td>Category 1</td>');
    expect(result).toContain('<td>Subcategory 1</td>');
    expect(result).toContain('<td>Subcategory 2</td>');
  });

  it('should return an empty string when data is empty', () => {
    const data: Record<string, any>[] = [];

    const result = generateClassifierTable(data);

    expect(result).toBe('');
  });

  it('should handle missing classifiers gracefully', () => {
    const data = [
      {
        name: 'Theme 1',
        classifiers: []
      }
    ];

    const result = generateClassifierTable(data);

    expect(result).toContain('<td>Theme 1</td>');
    expect(result).not.toContain('<td>Category 1</td>');
    expect(result).not.toContain('<td>Subcategory 1</td>');
  });
});
