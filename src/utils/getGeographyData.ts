/* eslint-disable  @typescript-eslint/no-explicit-any */
import { IGeographyItem } from '../interfaces/searchResponse.interface';

const getGeographyData = (searchItem: Record<string, any>): IGeographyItem => {
  return {
    spatialDataService: searchItem?._source?.serviceType ?? '',
    spatialRepresentationService:
      searchItem?._source?.cl_spatialRepresentationType?.map((item) => item.default).join(', ') ?? '',
    spatialReferencingSystem: searchItem?._source?.crsDetails?.map((item) => item.code).join(', ') ?? '',
    geographicLocations:
      searchItem?._source?.OrgGeographicIdentifierTitle?.map((item) => item.ciTitle).join(', ') ?? '',
    geographicBoundary: searchItem?._source?.geom?.coordinates?.[0] ?? '',
    verticalExtent: '',
    samplingResolution: '',
  };
};

export { getGeographyData };
