import {
  getCoordinates,
  getGeographicBoundaryHtml,
  getGeographicLocation,
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
      const result = getGeographicBoundaryHtml([
        [1, 2],
        [3, 4],
      ]);
      expect(result).toEqual(
        '<p>West bounding longitude: <span id="west" /></p><p>East bounding longitude: <span id="east" /></p><p>North bounding latitude: <span id="north" /></p><p>South bounding longitude: <span id="south" /></p>',
      );
    });

    it('should return an empty string when coordinates are not provided', () => {
      const result = getGeographicBoundaryHtml({});
      expect(result).toEqual('');
    });
  });

  describe('getCoordinates function', () => {
    it('should return correct coordinates when coordinates array is provided', () => {
      const result = getCoordinates([
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
      expect(result).toEqual(
        JSON.stringify([
          [-15.320435, 47.912775],
          [-6.970825, 47.912775],
          [-6.970825, 50.180526],
          [-15.320435, 50.180526],
          [-15.320435, 47.912775],
        ]),
      );
    });

    it('should return correct coordinates when coordinates object is provided', () => {
      const result = getCoordinates({
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
      expect(result).toEqual(
        JSON.stringify([
          [-15.320435, 47.912775],
          [-6.970825, 47.912775],
          [-6.970825, 50.180526],
          [-15.320435, 50.180526],
          [-15.320435, 47.912775],
        ]),
      );
    });

    it('should return an empty string when coordinates are not provided', () => {
      const result = getCoordinates({});
      expect(result).toEqual('');
    });
  });

  describe('getGeographicLocation function', () => {
    it('should return correct location when location is a string', () => {
      const result = getGeographicLocation('49.0466505,-11.14563');
      expect(result).toEqual('49.0466505,-11.14563');
    });

    it('should return correct location when location is an array of strings', () => {
      const result = getGeographicLocation([
        '49.0466505,-11.14563',
        '59.0466505,-21.14563',
      ]);
      expect(result).toEqual('49.0466505,-11.14563');
    });

    it('should return correct location when location has empty string inside an array', () => {
      const result = getGeographicLocation(['', '59.0466505,-21.14563']);
      expect(result).toEqual('59.0466505,-21.14563');
    });

    it('should return an empty string when location is empty', () => {
      const result = getGeographicLocation('');
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
          geom: { coordinates: [[[1, 2, 3, 4]]] },
          OrgResourceVerticalRange: { gte: 1, lte: 10 },
          OrgResolutionDistance: { distance: '10' },
          OrgResolutionScaleDenominator: 100,
          location: 'Location',
        },
      };
      const result = getGeographyTabData(searchItem);
      expect(result).toEqual({
        spatialDataService: 'Type',
        spatialRepresentationService: 'Representation',
        spatialReferencingSystem: 'CRS',
        geographicLocations: 'Location',
        geographicBoundary: '[[1,2,3,4]]',
        geographicBoundaryHtml:
          '<p>West bounding longitude: <span id="west" /></p><p>East bounding longitude: <span id="east" /></p><p>North bounding latitude: <span id="north" /></p><p>South bounding longitude: <span id="south" /></p>',
        geographicCenter: 'Location',
        verticalExtent: '<p>Lowest point: 1m</p><p>Highest point: 10m</p>',
        samplingResolution: '10 m',
      });
    });
  });
});
