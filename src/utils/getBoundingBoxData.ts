import {
  IAccumulatedCoordinates,
  IAccumulatedCoordinatesWithCenter,
  ICoordinates,
  IVertex,
} from '../interfaces/searchResponse.interface';

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
    coordinates = getBoundingBox([coordinatesData]);
  }
  if (coordinates && Object.keys(coordinates).length) {
    const { north, south, east, west } = coordinates;
    const latitude = south - 5.0 + (north + 5.0 - (south - 5.0)) / 2;
    const longitude = west - 5.0 + (east + 5.0 - (west - 5.0)) / 2;
    return { coordinates, center: `${longitude},${latitude}` };
  }
  return null;
};

export { getAccumulatedCoordinatesNCenter, getBoundingBox };
