import { ISearchResults } from '../../src/interfaces/searchResponse.interface';

const searchResultsWithData: ISearchResults = {
  total: 2,
  items: [
    {
      id: '1',
      title: 'Title 1',
      publishedBy: 'Organization 1',
      content: 'Content 1',
      studyPeriod: '04 Jan 1960',
      resourceLocator: '',
      ncea_catalogue_number: 'af7cd14f-6c20-445f-abd0-7c41385ba999',
      host_catalogue_number: 'https://seabed.admiralty.co.uk af7cd14f-6c20-445f-abd0-7c41385ba999',
      host_catalogue_entry: 'https://seabed.admiralty.co.uk',
      resource_type_and_hierarchy: 'dataset',
      resource_locators : 'Download from Seabed Mapping Service (https://seabed.admiralty.co.uk)'
    },
    {
      id: '2',
      title: 'Title 2',
      publishedBy: 'Organization 2',
      content: 'Content 2',
      studyPeriod: '04 Jan 1950 to 12 Jan 2009',
      resourceLocator: '',
      ncea_catalogue_number: 'ac7db62c-1908-48a3-a4be-8ca8526b4948',
      host_catalogue_number: 'https://seabed.admiralty.co.uk ac7db62c-1908-48a3-a4be-8ca8526b4948',
      host_catalogue_entry: '',
      resource_type_and_hierarchy: 'dataset',
      resource_locators : 'Download from Seabed Mapping Service (https://seabed.admiralty.co.uk)'
    },
  ],
};

const searchResultsWithEmptyData = {
  total: 0,
  items: [],
};

export { searchResultsWithData, searchResultsWithEmptyData };
