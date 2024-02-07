'use strict';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorTileLayer from 'ol/layer/VectorTile';
import Draw, { createBox } from 'ol/interaction/Draw';
import { Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';

const drawSource = VectorSource();

const mapOptions = {
  target: 'coordinate-map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new VectorTileLayer({
      source: drawSource,
    }),
  ],
  view: new View({
    center: [-0.118092, 51.509865],
    zoom: 5,
  }),
};

const map = new Map(mapOptions);

const drawStyle = new Style({
  stroke: new Stroke({
    color: 'blue',
    width: 2,
  }),
  fill: new Fill({
    color: 'rgb(0, 0, 255, 0.1)',
  }),
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

const northInput = document.getElementById('north');
const southInput = document.getElementById('south');
const eastInput = document.getElementById('east');
const westInput = document.getElementById('west');

const setCoordinates = (coordinates) => {
  if (coordinates.length !== 5) {
    console.error('Invalid rectangle coordinates');
    return;
  }

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

[northInput, southInput, eastInput, westInput].forEach((input) => {
  input.addEventListener('change', generateRectanglePolygon);
});

const handleDrawEnd = (event) => {
  const feature = event.feature;
  const geometry = feature.getGeometry();
  const extent = geometry.getExtent();

  const west = extent[0];
  const south = extent[1];
  const east = extent[2];
  const north = extent[3];

  setCoordinates([
    [west, north],
    [east, north],
    [east, south],
    [west, south],
    [west, north],
  ]);
};

const draw = new Draw({
  source: drawSource,
  type: 'Circle',
  geometryFunction: createBox(),
  style: drawStyle,
});

map.addInteraction(draw);

draw.on('drawend', handleDrawEnd);
