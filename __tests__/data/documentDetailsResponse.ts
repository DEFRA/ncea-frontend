const detailsSuccessAPIResponse = {
  took: 0,
  timed_out: false,
  _shards: {
    total: 3,
    successful: 3,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 1,
      relation: 'eq',
    },
    max_score: 1.0,
    hits: [
      {
        _index: 'gn-records',
        _type: '_doc',
        _id: '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2',
        _score: 1.0,
        _source: {
          docType: 'metadata',
          document: '',
          metadataIdentifier: '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2',
          indexingDate: '2024-02-16T16:39:44Z',
          dateStamp: '2010-01-26T19:56:18.000Z',
          mainLanguage: 'eng',
          cl_characterSet: [
            {
              key: 'utf8',
              default: 'UTF8',
              langeng: 'UTF8',
              link: 'http://www.isotc211.org/2005/resources/Codelist/gmxCodelists.xml#MD_CharacterSetCode',
            },
          ],
          resourceType: ['dataset'],
          contact: [
            {
              role: '',
              email: '',
              website: '',
              logo: '',
              individual: '',
              position: '',
              phone: '',
              address: '',
            },
          ],
          cl_hierarchyLevel: [
            {
              key: 'dataset',
              default: 'Dataset',
              langeng: 'Dataset',
              link: 'http://www.isotc211.org/2005/resources/Codelist/gmxCodelists.xml#MD_ScopeCode',
            },
          ],
          resourceTitleObject: {
            default: 'Geoserver WFS Fragments Country Boundaries Test Template',
            langeng: 'Geoserver WFS Fragments Country Boundaries Test Template',
          },
          resourceAbstractObject: {
            default: '',
            lang: '',
          },
          contactForResource: [
            {
              role: '',
              email: '',
              website: '',
              logo: '',
              individual: '',
              position: '',
              phone: '',
              address: '',
            },
          ],
          hasOverview: 'false',
          resourceLanguage: ['eng'],
          tag: [],
          tagNumber: '0',
          isOpenData: 'false',
          allKeywords: {},
          recordGroup: '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2',
          recordOwner: 'admin admin',
          uuid: '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2',
          displayOrder: '0',
          groupPublishedId: '1',
          popularity: '0',
          userinfo: 'admin|admin|admin|Administrator',
          groupPublished: 'all',
          isPublishedToAll: 'true',
          record: 'record',
          draft: 'n',
          changeDate: '2024-02-16T16:39:44Z',
          id: '106',
          createDate: '2024-02-16T16:39:44Z',
          isPublishedToIntranet: 'false',
          owner: '1',
          groupOwner: '1',
          logo: '/images/logos/2fc172f5-4c8e-493b-8277-3492b3ed504c.png',
          hasxlinks: 'false',
          op0: '1',
          featureOfRecord: 'record',
          isPublishedToGuest: 'false',
          extra: 'null',
          documentStandard: 'iso19139',
          op3: '1',
          valid: '-1',
          isTemplate: 'y',
          feedbackCount: '0',
          rating: '0',
          isHarvested: 'false',
          userSavedCount: '0',
          sourceCatalogue: '2fc172f5-4c8e-493b-8277-3492b3ed504c',
        },
      },
    ],
  },
};

const detailsEmptyAPIResponse = {
  took: 3,
  timed_out: false,
  _shards: {
    total: 3,
    successful: 3,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 0,
      relation: 'eq',
    },
    max_score: null,
    hits: [],
  },
};

const formattedDetailsResponse = {
  total: 1,
  items: [
    {
      id: 'fa34bd24-3aeb-429f-929c-34e3ca72f5a4',
      title:
        '20200305 - Atlantic Ocean - East of Hemptons Turbot Bank - 4m - Bathymetric Survey',
      publishedBy: 'United Kingdom Hydrographic Office',
      content:
        'This processed bathymetric data set has been derived from an Echosounder - multibeam survey. The source data was collected, validated and processed for the purpose of Safety Of Life At Sea (SOLAS). The data set must not be used for navigation or to create products that could be used for navigation.',
      temporalExtentDetails: {
        startDate: '2020-03-04T00:00:00',
        endDate: '2020-03-05T00:00:00',
      },
      resourceLocator: 'https://seabed.admiralty.co.uk',
    },
  ],
};

export {
  detailsEmptyAPIResponse,
  detailsSuccessAPIResponse,
  formattedDetailsResponse,
};
