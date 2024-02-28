import { fireEventAfterStorage, getStorageData } from './customScripts.js';

const index3 = 3;
const precision = 6;
const timeout = 200;
const mapTarget = 'coordinate-map';

const map = new ol.Map({
  target: mapTarget,
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([0, 0]),
    zoom: 2,
  }),
});

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

const vectorSource = new ol.source.Vector();
const vectorLayer = new ol.layer.Vector({
  source: vectorSource,
});
map.addLayer(vectorLayer);

const draw = new ol.interaction.Draw({
  source: vectorSource,
  type: 'Circle',
  geometryFunction: ol.interaction.Draw.createBox(),
  style: drawStyle,
});
map.addInteraction(draw);

const modify = new ol.interaction.Modify({
  source: vectorSource,
});
map.addInteraction(modify);

const snap = new ol.interaction.Snap({
  source: vectorSource,
});
map.addInteraction(snap);

draw.on('drawstart', () => {
  vectorSource.clear();
});

draw.on('drawend', (event) => {
  const feature = event.feature;
  feature.setStyle(completedStyle);
});

function calculateCoordinates() {
  const extent = vectorSource.getExtent();
  if (
    extent[0] !== Infinity &&
    extent[1] !== Infinity &&
    extent[2] !== -Infinity &&
    extent[index3] !== -Infinity
  ) {
    const [west, south, east, north] = ol.proj.transformExtent(
      extent,
      'EPSG:3857',
      'EPSG:4326',
    );

    const form = document.querySelector('[data-do-browser-storage]');
    if (form) {
      const sessionData = getStorageData();
      if (!sessionData.fields.hasOwnProperty(form.id)) {
        sessionData.fields[form.id] = {};
      }
      sessionData.fields[form.id] = {
        ...sessionData.fields[form.id],
        north: north.toFixed(precision),
        south: south.toFixed(precision),
        east: east.toFixed(precision),
        west: west.toFixed(precision),
      };
      fireEventAfterStorage(sessionData);
    }
  }
}

vectorSource.on('change', () => {
  calculateCoordinates();
});

if (document.getElementById('north')) {
  document.getElementById('north').addEventListener('change', () => {
    calculatePolygonFromCoordinates();
  });
}
if (document.getElementById('south')) {
  document.getElementById('south').addEventListener('change', () => {
    calculatePolygonFromCoordinates();
  });
}
if (document.getElementById('east')) {
  document.getElementById('east').addEventListener('change', () => {
    calculatePolygonFromCoordinates();
  });
}
if (document.getElementById('west')) {
  document.getElementById('west').addEventListener('change', () => {
    calculatePolygonFromCoordinates();
  });
}

function calculatePolygonFromCoordinates() {
  const north = parseFloat(document.getElementById('north').value);
  const south = parseFloat(document.getElementById('south').value);
  const east = parseFloat(document.getElementById('east').value);
  const west = parseFloat(document.getElementById('west').value);
  if (north && south && east && west) {
    const extent = ol.proj.transformExtent(
      [west, south, east, north],
      'EPSG:4326',
      'EPSG:3857',
    );
    vectorSource.clear();
    const polygonFeature = new ol.Feature({
      geometry: new ol.geom.Polygon([
        [
          [extent[0], extent[1]],
          [extent[0], extent[index3]],
          [extent[2], extent[index3]],
          [extent[2], extent[1]],
          [extent[0], extent[1]],
        ],
      ]),
    });
    polygonFeature.setStyle(completedStyle);
    vectorSource.addFeature(polygonFeature);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById(mapTarget)) {
    setTimeout(() => {
      calculatePolygonFromCoordinates();
    }, timeout);
  }
});
