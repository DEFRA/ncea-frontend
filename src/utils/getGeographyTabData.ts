/* eslint-disable  @typescript-eslint/no-explicit-any */
import {
  IAccumulatedCoordinates,
  IAccumulatedCoordinatesWithCenter,
  ICoordinates,
  IGeographyItem,
  IVertex,
} from '../interfaces/searchResponse.interface';

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

const getGeographicBoundaryHtml = (coordinates: IAccumulatedCoordinates): string => {
  const { north = '', south = '', east = '', west = '' } = coordinates;
  return `<p>West bounding longitude: <span id="west">${west}</span></p><p>East bounding longitude: <span id="east">${east}</span></p><p>North bounding latitude: <span id="north">${north}</span></p><p>South bounding latitude: <span id="south">${south}</span></p>`;
};

const getGeographicMarkers = (location: string | string[]): string => {
  let points: string[] = [];
  const markers: string[] = [];
  if (Array.isArray(location)) {
    points = location;
  } else {
    points = [location];
  }
  points.forEach((point: string) => {
    if (point) {
      markers.push(point);
    }
  });
  return markers.join('_');
};

const getBoundingBox = (polygons: ICoordinates[]): IAccumulatedCoordinates | null => {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  polygons.forEach((polygon: ICoordinates) => {
    polygon.coordinates.forEach((vertexArray: IVertex[]) => {
      vertexArray.forEach((vertex: IVertex) => {
        const [lon, lat] = vertex;
        if (!isNaN(lon) && !isNaN(lat)) {
          minLon = Math.min(minLon, lon);
          maxLon = Math.max(maxLon, lon);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        }
      });
    });
  });

  if (isFinite(minLon) && isFinite(maxLon) && isFinite(minLat) && isFinite(maxLat)) {
    return {
      north: maxLat,
      south: minLat,
      east: maxLon,
      west: minLon,
    };
  }
  return null;
};

const getAccumulatedCoordinatesNCenter = (
  coordinatesData: ICoordinates | ICoordinates[],
): IAccumulatedCoordinatesWithCenter | null => {
  let coordinates: IAccumulatedCoordinates | null = null;
  if (Array.isArray(coordinatesData)) {
    coordinates = getBoundingBox(coordinatesData);
  } else if (Object.keys(coordinatesData).length) {
    coordinates = getBoundingBox([coordinatesData as ICoordinates]);
  }
  if (coordinates && Object.keys(coordinates).length) {
    const { north, south, east, west } = coordinates;
    const latitude = south - 5.0 + (north + 5.0 - (south - 5.0)) / 2;
    const longitude = west - 5.0 + (east + 5.0 - (west - 5.0)) / 2;
    return { coordinates, center: `${longitude},${latitude}` };
  }
  return null;
};

const getGeographyTabData = (searchItem: Record<string, any>): IGeographyItem => {
  const coordinatesData: IAccumulatedCoordinatesWithCenter | null = getAccumulatedCoordinatesNCenter(
    searchItem?._source?.geom ?? {},
  );
  return {
    spatialDataService: searchItem?._source?.OrgServiceType ?? '',
    spatialRepresentationService:
      searchItem?._source?.cl_spatialRepresentationType?.map((item) => item.default).join(', ') ?? '',
    spatialReferencingSystem: searchItem?._source?.crsDetails?.map((item) => item.code).join(', ') ?? '',
    geographicLocations:
      searchItem?._source?.OrgGeographicIdentifierTitle?.map((item) => item?.ciTitle).join(', ') ?? '',
    geographicBoundary: coordinatesData?.coordinates ?? '',
    geographicBoundaryHtml: getGeographicBoundaryHtml(coordinatesData?.coordinates ?? ({} as IAccumulatedCoordinates)),
    geographicCenter: coordinatesData?.center ?? '0,0',
    geographicMarkers: getGeographicMarkers(searchItem?._source?.location ?? ''),
    verticalExtent: getVerticalExtentHtml(searchItem?._source?.OrgResourceVerticalRange ?? {}),
    samplingResolution: getSamplingResolution(
      searchItem?._source?.OrgResolutionDistance ?? {},
      searchItem?._source?.OrgResolutionScaleDenominator ?? null,
    ),
  };
};

export {
  getAccumulatedCoordinatesNCenter,
  getVerticalExtentHtml,
  getGeographicMarkers,
  getSamplingResolution,
  getGeographicBoundaryHtml,
  getGeographyTabData,
};
