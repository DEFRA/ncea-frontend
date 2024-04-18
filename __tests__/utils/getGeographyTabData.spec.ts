import {
  IAccumulatedCoordinates,
  ICoordinates,
} from '../../src/interfaces/searchResponse.interface';
import {
  getAccumulatedCoordinatesNCenter,
  getGeographicBoundaryHtml,
  getGeographicMarkers,
  getGeographyTabData,
  getSamplingResolution,
  getVerticalExtentHtml,
} from '../../src/utils/getGeographyTabData';

describe('Geography tab data', () => {
  describe('getVerticalExtentHtml function', () => {
    it('should return correct HTML when both gte and lte are provided', () => {
      const result = getVerticalExtentHtml({ gte: 10, lte: 100 });
      expect(result).toEqual(
        '<p>Lowest point: 10m</p><p>Highest point: 100m</p>',
      );
    });

    it('should return correct HTML when only gte is provided', () => {
      const result = getVerticalExtentHtml({ gte: 10 });
      expect(result).toEqual('<p>Lowest point: 10m</p>');
    });

    it('should return correct HTML when only lte is provided', () => {
      const result = getVerticalExtentHtml({ lte: 100 });
      expect(result).toEqual('<p>Highest point: 100m</p>');
    });

    it('should return an empty string when verticalRangeObject is an empty object', () => {
      const result = getVerticalExtentHtml({});
      expect(result).toEqual('');
    });
  });

  describe('getSamplingResolution function', () => {
    it('should return correct resolution when distance is provided', () => {
      const result = getSamplingResolution({ distance: '10' }, null);
      expect(result).toEqual('10 m');
    });

    it('should return correct resolution when distance and scale are provided', () => {
      const result = getSamplingResolution({ distance: '10' }, 100);
      expect(result).toEqual('10 m');
    });

    it('should return correct resolution when only scale is provided', () => {
      const result = getSamplingResolution({}, 100);
      expect(result).toEqual('Scale 100');
    });

    it('should return an empty string when neither distance nor scale is provided', () => {
      const result = getSamplingResolution({}, null);
      expect(result).toEqual('');
    });

    it('should return an empty string when distanceObject is empty', () => {
      const result = getSamplingResolution({ distance: '' }, null);
      expect(result).toEqual('');
    });

    it('should return correct resolution when scale is negative', () => {
      const result = getSamplingResolution({}, -100);
      expect(result).toEqual('Scale -100');
    });
  });

  describe('getGeographicBoundaryHtml function', () => {
    it('should return correct HTML when coordinates are provided', () => {
      const coordinates: IAccumulatedCoordinates = {
        north: 51.245488,
        south: 47.912775,
        east: -6.127928,
        west: -15.320435,
      };
      const result = getGeographicBoundaryHtml(coordinates);
      const { north = '', south = '', east = '', west = '' } = coordinates;
      expect(result).toEqual(
        `<p>West bounding longitude: <span id="west">${west}</span></p><p>East bounding longitude: <span id="east">${east}</span></p><p>North bounding latitude: <span id="north">${north}</span></p><p>South bounding latitude: <span id="south">${south}</span></p>`,
      );
    });

    it('should return an empty string when coordinates are not provided', () => {
      const result = getGeographicBoundaryHtml({} as IAccumulatedCoordinates);
      expect(result).toEqual(
        '<p>West bounding longitude: <span id="west"></span></p><p>East bounding longitude: <span id="east"></span></p><p>North bounding latitude: <span id="north"></span></p><p>South bounding latitude: <span id="south"></span></p>',
      );
    });
  });

  describe('getAccumulatedCoordinatesNCenter function', () => {
    it('should return correct coordinates when coordinates array is provided', () => {
      const result = getAccumulatedCoordinatesNCenter([
        {
          coordinates: [
            [
              [-15.320435, 47.912775],
              [-6.970825, 47.912775],
              [-6.970825, 50.180526],
              [-15.320435, 50.180526],
              [-15.320435, 47.912775],
            ],
          ],
        },
      ]);
      expect(result).toEqual({
        coordinates: {
          north: 50.180526,
          south: 47.912775,
          east: -6.970825,
          west: -15.320435,
        },
        center: '-11.14563,49.0466505',
      });
    });

    it('should return correct coordinates when coordinates object is provided', () => {
      const result = getAccumulatedCoordinatesNCenter({
        coordinates: [
          [
            [-15.320435, 47.912775],
            [-6.970825, 47.912775],
            [-6.970825, 50.180526],
            [-15.320435, 50.180526],
            [-15.320435, 47.912775],
          ],
        ],
      });
      expect(result).toEqual({
        coordinates: {
          north: 50.180526,
          south: 47.912775,
          east: -6.970825,
          west: -15.320435,
        },
        center: '-11.14563,49.0466505',
      });
    });

    it('should return correct coordinates with multiple polygons are provided', () => {
      const result = getAccumulatedCoordinatesNCenter([
        {
          coordinates: [
            [
              [-15.320435, 47.912775],
              [-6.970825, 47.912775],
              [-6.970825, 50.180526],
              [-15.320435, 50.180526],
              [-15.320435, 47.912775],
            ],
          ],
        },
        {
          coordinates: [
            [
              [-7.963867, 50.555712],
              [-6.127928, 50.555712],
              [-6.127928, 51.245488],
              [-7.963867, 51.245488],
              [-7.963867, 50.555712],
            ],
          ],
        },
      ]);
      expect(result).toEqual({
        coordinates: {
          north: 51.245488,
          south: 47.912775,
          east: -6.127928,
          west: -15.320435,
        },
        center: '-10.7241815,49.5791315',
      });
    });

    it('should return an empty string when coordinates are not provided', () => {
      const result = getAccumulatedCoordinatesNCenter({} as ICoordinates);
      expect(result).toBeNull();
    });
  });

  describe('getGeographicMarkers function', () => {
    it('should return correct marker when location is a string', () => {
      const result = getGeographicMarkers('49.0466505,-11.14563');
      expect(result).toEqual('-11.14563,49.0466505');
    });

    it('should return correct marker when location is an array of strings', () => {
      const result = getGeographicMarkers([
        '49.0466505,-11.14563',
        '59.0466505,-21.14563',
      ]);
      expect(result).toEqual('-11.14563,49.0466505_-21.14563,59.0466505');
    });

    it('should return correct marker when location has empty string inside an array', () => {
      const result = getGeographicMarkers(['', '59.0466505,-21.14563']);
      expect(result).toEqual('-21.14563,59.0466505');
    });

    it('should return an empty string when location is empty', () => {
      const result = getGeographicMarkers('');
      expect(result).toEqual('');
    });
  });

  describe('getGeographyTabData function', () => {
    it('should return correct data when all properties are present', () => {
      const searchItem = {
        _source: {
          OrgServiceType: 'Type',
          cl_spatialRepresentationType: [{ default: 'Representation' }],
          crsDetails: [{ code: 'CRS' }],
          OrgGeographicIdentifierTitle: [{ ciTitle: 'Location' }],
          geom: {
            coordinates: [
              [
                [-15.320435, 47.912775],
                [-6.970825, 47.912775],
                [-6.970825, 50.180526],
                [-15.320435, 50.180526],
                [-15.320435, 47.912775],
              ],
            ],
          },
          OrgResourceVerticalRange: { gte: 1, lte: 10 },
          OrgResolutionDistance: { distance: '10' },
          OrgResolutionScaleDenominator: 100,
          location: '49.0466505,-11.14563',
        },
      };
      const result = getGeographyTabData(searchItem);
      expect(result).toEqual({
        spatialDataService: 'Type',
        spatialRepresentationService: 'Representation',
        spatialReferencingSystem: 'CRS',
        geographicLocations: 'Location',
        geographicBoundary: {
          north: 50.180526,
          south: 47.912775,
          east: -6.970825,
          west: -15.320435,
        },
        geographicBoundaryHtml: `<p>West bounding longitude: <span id="west">-15.320435</span></p><p>East bounding longitude: <span id="east">-6.970825</span></p><p>North bounding latitude: <span id="north">50.180526</span></p><p>South bounding latitude: <span id="south">47.912775</span></p>`,
        geographicCenter: '-11.14563,49.0466505',
        geographicMarkers: '-11.14563,49.0466505',
        verticalExtent: '<p>Lowest point: 1m</p><p>Highest point: 10m</p>',
        samplingResolution: '10 m',
      });
    });
  });
});
