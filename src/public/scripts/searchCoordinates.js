'use strict';

const drawSource = new ol.source.Vector();

const mapOptions = {
  target: 'coordinate-map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([-0.118092, 51.509865]),
    zoom: 2,
  }),
};

const map = new ol.Map(mapOptions);

const drawStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: 'blue',
    width: 2,
  }),
  fill: new ol.style.Fill({
    color: 'rgb(0, 0, 255, 0.1)',
  }),
});

const completedStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: 'red',
    width: 2,
  }),
  fill: new ol.style.Fill({
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

  const polygon = new ol.geom.Polygon([coordinates]);
  const feature = new ol.Feature({
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

const draw = new ol.interaction.Draw({
  source: drawSource,
  type: 'Circle',
  geometryFunction: ol.interaction.Draw.createBox(),
  style: drawStyle,
});

map.addInteraction(draw);

draw.on('drawend', handleDrawEnd);
