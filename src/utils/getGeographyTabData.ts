/* eslint-disable  @typescript-eslint/no-explicit-any */
import { IGeographyItem } from '../interfaces/searchResponse.interface';

const getVerticalExtentHtml = (verticalRangeObject: { gte?: number; lte?: number }): string => {
  if (Object.keys(verticalRangeObject).length === 0) {
    return '';
  }
  let verticalExtentHtml: string = '';
  if (verticalRangeObject?.gte) {
    verticalExtentHtml = `<p>Lowest point: ${verticalRangeObject?.gte}m</p>`;
  }
  if (verticalRangeObject?.lte) {
    verticalExtentHtml += `<p>Highest point: ${verticalRangeObject?.lte}m</p>`;
  }
  return verticalExtentHtml;
};

const getSamplingResolution = (distanceObject: { distance?: string }, scale: number | null): string => {
  let samplingResolution: string = '';
  if (Object.keys(distanceObject).length && distanceObject?.distance) {
    samplingResolution = `${distanceObject?.distance} m`;
  } else if (scale) {
    samplingResolution = `Scale ${scale}`;
  }
  return samplingResolution;
};

const getGeographicBoundaryHtml = (coordinates: any): string => {
  const hasCoordinate = getCoordinates(coordinates);
  if (hasCoordinate) {
    return `<p>West bounding longitude: <span id="west" /></p><p>East bounding longitude: <span id="east" /></p><p>North bounding latitude: <span id="north" /></p><p>South bounding latitude: <span id="south" /></p>`;
  }
  return '';
};

const getGeographicLocation = (location: string | string[]): string => {
  if (Array.isArray(location)) {
    const filteredArray = location.filter((item) => item !== '');
    return filteredArray?.[0] ?? '';
  } else {
    return location;
  }
};

const getCoordinates = (coordinatesData: any): string => {
  if (Array.isArray(coordinatesData)) {
    return JSON.stringify(coordinatesData?.[0]?.coordinates?.[0] ?? '');
  }
  if (Object.keys(coordinatesData).length) {
    return JSON.stringify(coordinatesData?.coordinates?.[0] ?? '');
  }
  return '';
};

const getGeographyTabData = (searchItem: Record<string, any>): IGeographyItem => {
  return {
    spatialDataService: searchItem?._source?.OrgServiceType ?? '',
    spatialRepresentationService:
      searchItem?._source?.cl_spatialRepresentationType?.map((item) => item.default).join(', ') ?? '',
    spatialReferencingSystem: searchItem?._source?.crsDetails?.map((item) => item.code).join(', ') ?? '',
    geographicLocations:
      searchItem?._source?.OrgGeographicIdentifierTitle?.map((item) => item?.ciTitle).join(', ') ?? '',
    geographicBoundary: getCoordinates(searchItem?._source?.geom ?? {}),
    geographicBoundaryHtml: getGeographicBoundaryHtml(searchItem?._source?.geom ?? {}),
    geographicCenter: getGeographicLocation(searchItem?._source?.location ?? ''),
    verticalExtent: getVerticalExtentHtml(searchItem?._source?.OrgResourceVerticalRange ?? {}),
    samplingResolution: getSamplingResolution(
      searchItem?._source?.OrgResolutionDistance ?? {},
      searchItem?._source?.OrgResolutionScaleDenominator ?? null,
    ),
  };
};

export {
  getVerticalExtentHtml,
  getGeographicLocation,
  getSamplingResolution,
  getGeographicBoundaryHtml,
  getCoordinates,
  getGeographyTabData,
};
