'use strict';

import { Map, View, Feature } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat, transform } from 'ol/proj';
import { Style, Fill, Stroke } from 'ol/style';
import { Polygon, LineString } from 'ol/geom';
import Draw, { createBox } from 'ol/interaction/Draw';
import { toggleSubmitButton } from './toggleFormSubmitButton';
import { storeFieldsData } from './browserStorage';

const northInput = document.getElementById('north');
const southInput = document.getElementById('south');
const eastInput = document.getElementById('east');
const westInput = document.getElementById('west');

const drawSource = new VectorSource();

const mapOptions = {
  target: 'coordinate-map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new VectorLayer({
      source: drawSource,
    }),
  ],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2,
  }),
};

const map = new Map(mapOptions);

const handleDrawEnd = (event) => {
  const feature = event.feature;
  const geometry = feature.getGeometry();
  const coordinates = geometry.getCoordinates()[0];

  setCoordinates(coordinates);
};

const drawStyle = new Style({
  stroke: new Stroke({
    color: 'blue',
    width: 2,
  }),
  fill: new Fill({
    color: 'rgb(0, 0, 255, 0.1)',
  }),
});

const draw = new Draw({
  source: drawSource,
  type: 'Circle',
  geometryFunction: createBox(),
  style: drawStyle,
});

const completedStyle = new Style({
  stroke: new Stroke({
    color: 'red',
    width: 2,
  }),
  fill: new Fill({
    color: 'rgb(255, 0, 0, 0.5)',
  }),
});

const setCoordinates = (coordinates) => {
  if (coordinates.length !== 5) {
    console.error('Invalid rectangle coordinates');
    return;
  }

  const transformedCoordinates = coordinates.map((coord) => {
    return transform(coord, 'EPSG:3857', 'EPSG:4326');
  });

  const west = transformedCoordinates[0][0];
  const north = transformedCoordinates[0][1];
  const east = transformedCoordinates[2][0];
  const south = transformedCoordinates[2][1];
  northInput.value = north;
  southInput.value = south;
  eastInput.value = east;
  westInput.value = west;
  storeFieldsData(
    document.querySelector('[data-do-browser-storage]'),
    false,
    true,
  );
  setTimeout(() => {
    toggleSubmitButton(document.querySelector('[data-do-browser-storage]'));
  }, 200);

  const polygon = new Polygon([coordinates]);
  const feature = new Feature({
    geometry: polygon,
  });
  feature.setStyle(completedStyle);

  drawSource.clear();
  drawSource.addFeature(feature);
};

const generateRectanglePolygon = () => {
  const north = parseFloat(northInput.value);
  const south = parseFloat(southInput.value);
  const east = parseFloat(eastInput.value);
  const west = parseFloat(westInput.value);

  if ((isNaN(north) || isNaN(south) || isNaN(east), isNaN(west))) {
    console.error('Invalid coordinates. Please enter valid numbers');
    return;
  }

  setCoordinates([
    [west, north],
    [east, north],
    [east, south],
    [west, south],
    [west, north],
  ]);
};

const createGridLines = () => {
  const gridLines = [];
  const gridSize = 10;

  for (let lat = -90; lat <= 90; lat += gridSize) {
    const line = new LineString([
      fromLonLat([-180, lat]),
      fromLonLat([180, lat]),
    ]);
    gridLines.push(new Feature(line));
  }

  for (let lon = -180; lon <= 180; lon += gridSize) {
    const line = new LineString([
      fromLonLat([lon, -90]),
      fromLonLat([lon, 90]),
    ]);
    gridLines.push(new Feature(line));
  }

  gridSource.clear();
  gridSource.addFeatures(gridLines);
};

/**
 * Grid Lines
 */
const gridSource = new VectorSource();
const gridLayer = new VectorLayer({
  source: gridSource,
  style: new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 0, 0.5)',
      width: 1,
      lineDash: [5, 5],
    }),
  }),
});

const callNavigator = () => {
  /**
   * Navigator
   */
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Set the center of the map to the user's current position
        const centerCoordinates = fromLonLat([longitude, latitude]);
        map.getView().setCenter(centerCoordinates);
        map.getView().setZoom(4); // Set an appropriate zoom level
      },
      function (error) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error('User denied the request for geolocation.');
            break;
          case error.POSITION_UNAVAILABLE:
            console.error('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            console.error('The request to get user location timed out.');
            break;
          case error.UNKNOWN_ERROR:
            console.error('An unknown error occurred.');
            break;
        }
      },
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

const renderMapToDrawPolygon = () => {
  if (document.getElementById('coordinate-map')) {
    [northInput, southInput, eastInput, westInput].forEach((input) => {
      input.addEventListener('change', generateRectanglePolygon);
    });

    draw.on('drawend', handleDrawEnd);

    map.addInteraction(draw);

    map.addLayer(gridLayer);
    createGridLines();
    callNavigator();
  }
};

export { renderMapToDrawPolygon };
