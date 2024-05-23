/* eslint-disable  @typescript-eslint/no-explicit-any */
import { getAccessTabData } from './getAccessTabData';
import { getAccumulatedCoordinatesNCenter } from './getBoundingBoxData';
import { getGeneralTabData } from './getGeneralTabData';
import { getGeographyTabData } from './getGeographyTabData';
import { getLicenseTabData } from './getLicenseTabData';
import { getOrganisationDetails } from './getOrganisationDetails';
import { getQualityTabData } from './getQualityTabData';
import { toggleContent } from './toggleContent';
import {
  IAccumulatedCoordinatesWithCenter,
  IOtherSearchItem,
  ISearchItem,
  ISearchResults,
} from '../interfaces/searchResponse.interface';
import { formatDate, getYear } from './formatDate';

const getStudyPeriod = (startDate: string, endDate: string): string => {
  const formattedStartDate: string = formatDate(startDate);
  const formattedEndDate: string = formatDate(endDate);
  let studyPeriod = '';
  if (formattedStartDate && formattedEndDate) {
    studyPeriod = `${formattedStartDate} to ${formattedEndDate}`;
  } else if (formattedStartDate && !formattedEndDate) {
    studyPeriod = `${formattedStartDate} to ${formattedStartDate}`;
  } else if (!formattedStartDate && formattedEndDate) {
    studyPeriod = `${formattedEndDate} to ${formattedEndDate}`;
  }

  return studyPeriod;
};

const getAbstractContent = (data: Record<string, any>, id: string): string => {
  if (Object.keys(data).length && data?.default) {
    return toggleContent(data?.default, `abstract_content-${id}`);
  }
  return '';
};

const getResourceLocatorURL = (data: string | string[]): string => {
  if (Array.isArray(data) && data.length) {
    return data[0] as string;
  }
  return data as string;
};

const formatSearchResponse = async (
  apiResponse: Record<string, any>,
  isDetails: boolean = false,
  isMapResults: boolean = false,
): Promise<ISearchResults> => {
  const finalResponse: ISearchResults = {
    total: apiResponse?.hits?.total?.value,
    items: [],
  };
  let minStartYear: string = '';
  let maxToYear: string = '';

  const apiSearchItems = apiResponse?.hits?.hits;
  const responseItems: Promise<ISearchItem>[] = apiSearchItems.map(async (searchItem: Record<string, any>) => {
    const startDate: string = searchItem?._source?.resourceTemporalExtentDetails?.[0]?.start?.date ?? '';
    const endDate: string = searchItem?._source?.resourceTemporalExtentDetails?.[0]?.end?.date ?? '';
    const studyPeriod = getStudyPeriod(startDate, endDate);
    const publishedBy = getOrganisationDetails(searchItem?._source, false);
    const organisationDetails = getOrganisationDetails(searchItem?._source, true);
    const startYear: string = getYear(startDate);
    const toYear: string = getYear(endDate);

    if (minStartYear === '' || (startYear !== '' && startYear < minStartYear)) {
      minStartYear = startYear;
    }

    if (maxToYear === '' || (toYear !== '' && toYear > maxToYear)) {
      maxToYear = toYear;
    }

    let item: ISearchItem = {
      id: searchItem?._id,
      title: searchItem?._source?.resourceTitleObject?.default ?? '',
      publishedBy: publishedBy.organisationValue,
      content: getAbstractContent(searchItem?._source?.resourceAbstractObject ?? '', searchItem?._id),
      studyPeriod,
      startYear,
      toYear,
      resourceLocator: getResourceLocatorURL(searchItem?._source?.linkUrl ?? ''),
      organisationName: organisationDetails.organisationValue,
    };

    if (isMapResults) {
      const coordinatesData: IAccumulatedCoordinatesWithCenter = getAccumulatedCoordinatesNCenter(
        searchItem._source.geom,
      ) as IAccumulatedCoordinatesWithCenter;
      item = {
        ...item,
        geographicBoundary: coordinatesData.coordinates,
        geographicCenter: coordinatesData.center,
        resourceType: searchItem?._source?.resourceType ?? [],
      };
    }

    if (isDetails) {
      const otherDetails: IOtherSearchItem = await getOtherDetails(searchItem, publishedBy);
      item = { ...item, ...otherDetails };
    }

    return item;
  });

  finalResponse.items = await Promise.all(responseItems);
  return finalResponse;
};

const getOtherDetails = async (
  searchItem: Record<string, any>,
  publishedBy: Record<string, any>,
): Promise<IOtherSearchItem> => {
  const projectId: string =
    searchItem?._source?.OrgNceaIdentifiers?.projectId ?? searchItem?._source?.OrgNceaIdentifiers?.projectNumber;
  return {
    ...getGeneralTabData(searchItem),
    ...getAccessTabData(searchItem),
    ...getQualityTabData(searchItem),
    host_service_catalogue_number: searchItem?._source?.sourceCatalogue ?? '',
    ncea_group_reference: searchItem?._source?.metadataIdentifier ?? '',
    metadata_standard: searchItem?._source?.standardNameObject?.default ?? '',
    project_number: projectId ?? '',
    Metadata_language: searchItem?._source?.mainLanguage ?? '',
    ncea_catalogue_date: formatDate(searchItem?._source?.dateStamp, false, false, '-'),
    ...getLicenseTabData(searchItem, publishedBy),
    ...getGeographyTabData(searchItem),
  };
};

export { formatSearchResponse };
