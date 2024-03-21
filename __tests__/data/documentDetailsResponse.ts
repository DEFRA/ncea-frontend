import { ISearchResults } from '../../src/interfaces/searchResponse.interface';

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
          resourceIdentifier: [
            {
              code: '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2',
              codeSpace: '',
              link: '',
            },
          ],
          cl_function: [
            {
              key: 'download',
              default: 'Download',
              langeng: 'Download',
              link: 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_OnLineFunctionCode',
              text: 'download',
            },
          ],
          link: [
            {
              protocol: '',
              mimeType: '',
              urlObject: {
                default: 'https://seabed.admiralty.co.uk',
              },
              nameObject: {
                default: 'Seabed Mapping Service',
                langeng: 'Seabed Mapping Service',
              },
              function: 'download',
              applicationProfile: '',
              group: 0,
            },
          ],
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
          resourceAltTitleObject: [
            {
              default: '',
            },
          ],
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

const formattedDetailsResponse: ISearchResults = {
  total: 1,
  items: [
    {
      id: '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2',
      title: 'Geoserver WFS Fragments Country Boundaries Test Template',
      publishedBy: '',
      content: '',
      studyPeriod: '',
      resourceLocator: '',
      language: 'ENG',
      Metadata_language: "eng",
      keywords: '',
      topic_categories: '',
      alternateTitle: '',
      organisationName: '',
      ncea_catalogue_number: '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2',
      host_catalogue_number: ' 3c080cb6-2ed9-43e7-9323-9ce42b05b9a2',
      host_catalogue_entry: '',
      resource_type_and_hierarchy: 'dataset',
      host_service_catalogue_number: "2fc172f5-4c8e-493b-8277-3492b3ed504c",
      hierarchy_level: 'Dataset',
      metadata_standard: '',
      ncea_catalogue_date: "26-Jan-2010",
      ncea_group_reference: "3c080cb6-2ed9-43e7-9323-9ce42b05b9a2",
      project_number: "",
      resource_locators:
        'Download from Seabed Mapping Service (<a class="govuk-link" href="https://seabed.admiralty.co.uk" target="_blank">https://seabed.admiralty.co.uk</a>)',
    },
  ],
};

const detailsSuccessAPIFullData = {
  took: 1,
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
        _id: 'fb8dca0f-7425-4f50-86a1-c4673b1aef88',
        _score: 1.0,
        _source: {
          docType: 'metadata',
          document: '',
          metadataIdentifier: 'fb8dca0f-7425-4f50-86a1-c4673b1aef88',
          standardNameObject: {
            default: 'MEDIN',
            langeng: 'MEDIN',
            link: 'http://vocab.nerc.ac.uk/collection/M25/current/MEDIN/',
          },
          standardVersionObject: {
            default: '3.1.1',
            langeng: '3.1.1',
          },
          indexingDate: '2024-02-26T00:00:07Z',
          dateStamp: '2024-01-16T07:10:27.000Z',
          mainLanguage: 'eng',
          resourceType: ['dataset'],
          OrgObject: {
            default: 'United Kingdom Hydrographic Office',
            langeng: 'United Kingdom Hydrographic Office',
          },
          pointOfContactOrgObject: {
            default: 'United Kingdom Hydrographic Office',
            langeng: 'United Kingdom Hydrographic Office',
          },
          contact: [
            {
              organisationObject: {
                default: 'United Kingdom Hydrographic Office',
                langeng: 'United Kingdom Hydrographic Office',
              },
              role: 'pointOfContact',
              email: 'customerservices@ukho.gov.uk',
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
              link: 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_ScopeCode',
              text: 'dataset',
            },
          ],
          cl_maintenanceAndUpdateFrequency: [
            {
              key: 'notPlanned',
              default: 'Not planned',
              langeng: 'Not planned',
              link: 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_MaintenanceFrequencyCode',
              text: 'notPlanned',
            },
          ],
          cl_accessConstraints: [
            {
              key: 'otherRestrictions',
              default: 'Other restrictions',
              langeng: 'Other restrictions',
              link: 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_RestrictionCode',
              text: 'otherRestrictions',
            },
          ],
          cl_spatialRepresentationType: [
            {
              key: 'grid',
              default: 'Grid',
              langeng: 'Grid',
              link: 'http://standards.iso.org/itff/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#MD_SpatialRepresentationTypeCode',
            },
          ],
          cl_function: [
            {
              key: 'download',
              default: 'Download',
              langeng: 'Download',
              link: 'http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/codelist/gmxCodelists.xml#CI_OnLineFunctionCode',
              text: 'download',
            },
          ],
          resourceTitleObject: {
            default:
              '20190731 - HI1597 - Firth of Clyde - Troon to Turnberry Point - 2m - Bathymetric Survey',
            langeng:
              '20190731 - HI1597 - Firth of Clyde - Troon to Turnberry Point - 2m - Bathymetric Survey',
          },
          resourceAltTitleObject: [
            {
              default: 'This is an alternate title',
            },
          ],
          publicationDateForResource: ['2022-03-23T17:26:25.000Z'],
          publicationYearForResource: '2022',
          publicationMonthForResource: '2022-03',
          resourceDate: [
            {
              type: 'publication',
              date: '2022-03-23T17:26:25.000Z',
            },
          ],
          resourceTemporalDateRange: [
            {
              gte: '2022-03-23T17:26:25.000Z',
              lte: '2022-03-23T17:26:25.000Z',
            },
            {
              gte: '2019-05-24T00:00:00.000Z',
              lte: '2019-07-31T00:00:00.000Z',
            },
          ],
          resourceIdentifier: [
            {
              code: 'fb8dca0f-7425-4f50-86a1-c4673b1aef88',
              codeSpace: 'https://seabed.admiralty.co.uk',
              link: '',
            },
          ],
          resourceAbstractObject: {
            default:
              'This processed bathymetric data set has been derived from an Echosounder - multibeam survey. The source data was collected, validated and processed for the purpose of Safety Of Life At Sea (SOLAS). The data set must not be used for navigation or to create products that could be used for navigation.',
            langeng:
              'This processed bathymetric data set has been derived from an Echosounder - multibeam survey. The source data was collected, validated and processed for the purpose of Safety Of Life At Sea (SOLAS). The data set must not be used for navigation or to create products that could be used for navigation.',
          },
          OrgForResourceObject: [
            {
              default: 'Clinton Marine Survey AB',
              langeng: 'Clinton Marine Survey AB',
            },
            {
              default: 'United Kingdom Hydrographic Office',
              langeng: 'United Kingdom Hydrographic Office',
            },
            {
              default: 'United Kingdom Hydrographic Office',
              langeng: 'United Kingdom Hydrographic Office',
            },
            {
              default: 'Maritime and Coastguard Agency',
              langeng: 'Maritime and Coastguard Agency',
            },
          ],
          originatorOrgForResourceObject: {
            default: 'Clinton Marine Survey AB',
            langeng: 'Clinton Marine Survey AB',
          },
          contactForResource: [
            {
              organisationObject: {
                default: 'Clinton Marine Survey AB',
                langeng: 'Clinton Marine Survey AB',
              },
              role: 'originator',
              email: 'customerservices@ukho.gov.uk',
              website: '',
              logo: '',
              individual: '',
              position: '',
              phone: '',
              address: '',
            },
            {
              organisationObject: {
                default: 'United Kingdom Hydrographic Office',
                langeng: 'United Kingdom Hydrographic Office',
              },
              role: 'custodian',
              email: 'customerservices@ukho.gov.uk',
              website: '',
              logo: '',
              individual: '',
              position: '',
              phone: '',
              address: '',
            },
            {
              organisationObject: {
                default: 'United Kingdom Hydrographic Office',
                langeng: 'United Kingdom Hydrographic Office',
              },
              role: 'distributor',
              email: 'customerservices@ukho.gov.uk',
              website: '',
              logo: '',
              individual: '',
              position: '',
              phone: '',
              address: '',
            },
            {
              organisationObject: {
                default: 'Maritime and Coastguard Agency',
                langeng: 'Maritime and Coastguard Agency',
              },
              role: 'owner',
              email: 'customerservices@ukho.gov.uk',
              website: '',
              logo: '',
              individual: '',
              position: '',
              phone: '',
              address: '',
            },
          ],
          custodianOrgForResourceObject: {
            default: 'United Kingdom Hydrographic Office',
            langeng: 'United Kingdom Hydrographic Office',
          },
          distributorOrgForResourceObject: {
            default: 'United Kingdom Hydrographic Office',
            langeng: 'United Kingdom Hydrographic Office',
          },
          ownerOrgForResourceObject: {
            default: 'Maritime and Coastguard Agency',
            langeng: 'Maritime and Coastguard Agency',
          },
          hasOverview: 'false',
          resourceLanguage: ['eng'],
          tag: [
            {
              default: 'Elevation',
              langeng: 'Elevation',
              link: 'http://vocab.nerc.ac.uk/collection/P22/current/10/',
              key: 'http://vocab.nerc.ac.uk/collection/P22/current/10/',
            },
            {
              default: 'Marine Environmental Data and Information Network',
              langeng: 'Marine Environmental Data and Information Network',
              link: 'http://vocab.nerc.ac.uk/collection/N01/current/NDGO0001/',
              key: 'http://vocab.nerc.ac.uk/collection/N01/current/NDGO0001/',
            },
            {
              default: 'Bathymetry and Elevation',
              langeng: 'Bathymetry and Elevation',
              link: 'http://vocab.nerc.ac.uk/collection/P02/current/MBAN/',
              key: 'http://vocab.nerc.ac.uk/collection/P02/current/MBAN/',
            },
          ],
          tagNumber: '3',
          isOpenData: 'false',
          'th_GEMET-INSPIREthemesNumber': '1',
          'th_GEMET-INSPIREthemes': [
            {
              default: 'Elevation',
              langeng: 'Elevation',
              link: 'http://vocab.nerc.ac.uk/collection/P22/current/10/',
            },
          ],
          th_MedinMetadataRecordAvailabilityNumber: '1',
          th_MedinMetadataRecordAvailability: [
            {
              default: 'Marine Environmental Data and Information Network',
              langeng: 'Marine Environmental Data and Information Network',
              link: 'http://vocab.nerc.ac.uk/collection/N01/current/NDGO0001/',
            },
          ],
          th_SeaDataNetParameterDiscoveryVocabularyNumber: '1',
          th_SeaDataNetParameterDiscoveryVocabulary: [
            {
              default: 'Bathymetry and Elevation',
              langeng: 'Bathymetry and Elevation',
              link: 'http://vocab.nerc.ac.uk/collection/P02/current/MBAN/',
            },
          ],
          allKeywords: {
            'th_GEMET-INSPIREthemes': {
              title: 'GEMET - INSPIRE themes',
              theme: '',
              keywords: [
                {
                  default: 'Elevation',
                  langeng: 'Elevation',
                  link: 'http://vocab.nerc.ac.uk/collection/P22/current/10/',
                },
              ],
            },
            th_MedinMetadataRecordAvailability: {
              title: 'Medin Metadata Record Availability',
              theme: '',
              keywords: [
                {
                  default: 'Marine Environmental Data and Information Network',
                  langeng: 'Marine Environmental Data and Information Network',
                  link: 'http://vocab.nerc.ac.uk/collection/N01/current/NDGO0001/',
                },
              ],
            },
            th_SeaDataNetParameterDiscoveryVocabulary: {
              title: 'SeaDataNet Parameter Discovery Vocabulary',
              theme: '',
              keywords: [
                {
                  default: 'Bathymetry and Elevation',
                  langeng: 'Bathymetry and Elevation',
                  link: 'http://vocab.nerc.ac.uk/collection/P02/current/MBAN/',
                },
              ],
            },
          },
          cl_topic: [
            {
              key: 'elevation',
              default: 'Elevation',
              langeng: 'Elevation',
            },
          ],
          resolutionDistance: [
            '2.0 http://standards.iso.org/ittf/PubliclyAvailableStandards/ISO_19139_Schemas/resources/uom/gmxUom.xml#m',
          ],
          MD_LegalConstraintsOtherConstraintsObject: [
            {
              default:
                'There are no limitations on public access to spatial data sets and services.',
              langeng:
                'There are no limitations on public access to spatial data sets and services.',
              link: 'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/noLimitations',
            },
            {
              default: 'Open Government License',
              langeng: 'Open Government License',
            },
            {
              default:
                'The Supplied Material is not to be used for Navigation or to create products that could be used for Navigation.',
              langeng:
                'The Supplied Material is not to be used for Navigation or to create products that could be used for Navigation.',
            },
          ],
          licenseObject: [
            {
              default:
                'There are no limitations on public access to spatial data sets and services.',
              langeng:
                'There are no limitations on public access to spatial data sets and services.',
              link: 'http://inspire.ec.europa.eu/metadata-codelist/LimitationsOnPublicAccess/noLimitations',
            },
            {
              default: 'Open Government License',
              langeng: 'Open Government License',
            },
            {
              default:
                'The Supplied Material is not to be used for Navigation or to create products that could be used for Navigation.',
              langeng:
                'The Supplied Material is not to be used for Navigation or to create products that could be used for Navigation.',
            },
          ],
          geom: {
            type: 'Polygon',
            coordinates: [
              [
                [-4.8749, 55.3271],
                [-4.6264, 55.3271],
                [-4.6264, 55.5736],
                [-4.8749, 55.5736],
                [-4.8749, 55.3271],
              ],
            ],
          },
          location: '55.45035,-4.75065',
          resourceTemporalExtentDateRange: [
            {
              gte: '2019-05-24T00:00:00.000Z',
              lte: '2019-07-31T00:00:00.000Z',
            },
          ],
          resourceTemporalExtentDetails: [
            {
              start: {
                date: '2019-05-24T00:00:00',
              },
              end: {
                date: '2019-07-31T00:00:00',
              },
            },
          ],
          resourceVerticalRange: [
            {
              gte: -40.0,
              lte: 1.2,
            },
          ],
          coordinateSystem: ['WGS 84'],
          crsDetails: [
            {
              ciTitle: '',
              code: 'WGS 84',
              codeSpace: '',
              name: 'WGS 84',
              url: 'https://epsg.org/crs_4326/WGS_84.html',
            },
          ],
          inspireConformResource: 'false',
          specificationConformance: [
            {
              title:
                'Commission Regulation (EU) No 1089/2010 of 23 November 2010 implementing Directive 2007/2/EC of the European Parliament and of the Council as regards interoperability of spatial data sets and services',
              date: '2010-12-08',
              link: 'http://data.europa.eu/eli/reg/2010/1089',
              explanation: 'inapplicable',
              pass: 'false',
            },
          ],
          conformTo_CommissionRegulationEUNo10892010of23November2010implementingDirective20072ECoftheEuropeanParliamentandoftheCouncilasregardsinteroperabilityofspatialdatasetsandservices:
            'false',
          lineageObject: {
            default:
              'This data set has been derived from an Echosounder - multibeam survey which was collected for the purpose of Safety of navigation, which was collected against S-44 survey specification (of the time). The survey has been validated and processed by the UKHO.',
            langeng:
              'This data set has been derived from an Echosounder - multibeam survey which was collected for the purpose of Safety of navigation, which was collected against S-44 survey specification (of the time). The survey has been validated and processed by the UKHO.',
          },
          format: ['Geographic Information System', 'Delimited'],
          linkUrl: 'https://seabed.admiralty.co.uk',
          linkUrlProtocol: 'https://seabed.admiralty.co.uk',
          link: [
            {
              protocol: '',
              mimeType: '',
              urlObject: {
                default: 'https://seabed.admiralty.co.uk',
              },
              nameObject: {
                default: 'Seabed Mapping Service',
                langeng: 'Seabed Mapping Service',
              },
              function: 'download',
              applicationProfile: '',
              group: 0,
            },
          ],
          recordGroup: 'fb8dca0f-7425-4f50-86a1-c4673b1aef88',
          recordOwner: 'admin admin',
          uuid: 'fb8dca0f-7425-4f50-86a1-c4673b1aef88',
          harvesterUuid: '3ce46f92-509c-4529-a062-c8b48788340d',
          displayOrder: '0',
          groupPublishedId: '1',
          popularity: '0',
          userinfo: 'admin|admin|admin|Administrator',
          groupPublished: 'all',
          isPublishedToAll: 'true',
          record: 'record',
          cat: ['datasets'],
          draft: 'n',
          changeDate: '2024-02-16T10:35:56.583Z',
          id: '213',
          createDate: '2024-02-16T10:35:56.583Z',
          isPublishedToIntranet: 'false',
          owner: '1',
          groupOwner: '2',
          hasxlinks: 'false',
          op0: '1',
          featureOfRecord: 'record',
          op1: '1',
          isPublishedToGuest: 'false',
          extra: 'null',
          documentStandard: 'iso19139',
          op5: '1',
          valid: '-1',
          isTemplate: 'n',
          feedbackCount: '0',
          rating: '0',
          isHarvested: 'true',
          userSavedCount: '0',
          sourceCatalogue: '3ce46f92-509c-4529-a062-c8b48788340d',
        },
      },
    ],
  },
};

const formattedDetailsFullResponse: ISearchResults = {
  total: 1,
  items: [
    {
      id: 'fb8dca0f-7425-4f50-86a1-c4673b1aef88',
      title:
        '20190731 - HI1597 - Firth of Clyde - Troon to Turnberry Point - 2m - Bathymetric Survey',
      publishedBy: 'Maritime and Coastguard Agency',
      Metadata_language: 'eng',
      content:
        'This processed bathymetric data set has been derived from an Echosounder - multibeam survey. The source data was collected, validated and processed for the purpose of Safety Of Life At Sea (SOLAS). The data set must not be used for navigation or to create products that could be used for navigation.',
      studyPeriod: '24 May 2019 to 31 Jul 2019',
      resourceLocator: 'https://seabed.admiralty.co.uk',
      language: 'ENG',
      keywords:
        'Elevation, Marine Environmental Data and Information Network, Bathymetry and Elevation',
      topic_categories: 'Elevation',
      alternateTitle: 'This is an alternate title',
      organisationName: 'United Kingdom Hydrographic Office',
      ncea_catalogue_number: 'fb8dca0f-7425-4f50-86a1-c4673b1aef88',
      host_catalogue_number:
        'https://seabed.admiralty.co.uk fb8dca0f-7425-4f50-86a1-c4673b1aef88',
      host_catalogue_entry: '',
      resource_type_and_hierarchy: 'dataset',
      hierarchy_level: 'Dataset',
      host_service_catalogue_number: "3ce46f92-509c-4529-a062-c8b48788340d",
      metadata_standard: "MEDIN",
      ncea_catalogue_date: "16-Jan-2024",
      ncea_group_reference: "fb8dca0f-7425-4f50-86a1-c4673b1aef88",
      project_number: "",
      resource_locators:
        'Download from Seabed Mapping Service (<a class="govuk-link" href="https://seabed.admiralty.co.uk" target="_blank">https://seabed.admiralty.co.uk</a>)',
    },
  ],
};

export {
  detailsEmptyAPIResponse,
  detailsSuccessAPIFullData,
  detailsSuccessAPIResponse,
  formattedDetailsFullResponse,
  formattedDetailsResponse,
};
