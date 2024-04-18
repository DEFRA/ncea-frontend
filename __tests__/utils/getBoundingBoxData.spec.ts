import { ICoordinates } from '../../src/interfaces/searchResponse.interface';
import {
  getAccumulatedCoordinatesNCenter,
  getBoundingBox,
} from '../../src/utils/getBoundingBoxData';

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

  it('should return null when coordinates are not provided', () => {
    const result = getAccumulatedCoordinatesNCenter({} as ICoordinates);
    expect(result).toBeNull();
  });
});

describe('getBoundingBox function', () => {
  it('should return null when coordinates are not provided', () => {
    const result = getBoundingBox([]);
    expect(result).toBeNull();
  });
});
