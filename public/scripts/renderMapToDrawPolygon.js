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
    center: ol.proj.fromLonLat([3.436, 55.3781]),
    zoom: 5,
  }),
  ...(typeof isDetails !== 'undefined' &&
    isDetails && { interactions: [], controls: [] }),
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
    color: '#F47738',
    width: 2,
  }),
  fill: new ol.style.Fill({
    color: 'rgb(255, 251, 0, 0.2)',
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

if (typeof isDetails === 'undefined') {
  const modify = new ol.interaction.Modify({
    source: vectorSource,
  });
  map.addInteraction(modify);

  const snap = new ol.interaction.Snap({
    source: vectorSource,
  });
  map.addInteraction(snap);
}

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
  if (typeof isDetails === 'undefined') {
    calculateCoordinates();
  }
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

function calculatePolygonFromCoordinates(isDetailsScreen = false) {
  const targetKey = isDetailsScreen ? 'textContent' : 'value';
  const north = parseFloat(document.getElementById('north')[targetKey]);
  const south = parseFloat(document.getElementById('south')[targetKey]);
  const east = parseFloat(document.getElementById('east')[targetKey]);
  const west = parseFloat(document.getElementById('west')[targetKey]);
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

function disableInteractions() {
  map.getInteractions().forEach((interaction) => {
    if (
      interaction instanceof ol.interaction.DoubleClickZoom ||
      interaction instanceof ol.interaction.MouseWheelZoom ||
      interaction instanceof ol.interaction.DragPan ||
      interaction instanceof ol.interaction.Draw ||
      interaction instanceof ol.interaction.Modify ||
      interaction instanceof ol.interaction.Snap
    ) {
      map.removeInteraction(interaction);
    }
  });
  map.getViewport().addEventListener('mousemove', (event) => {
    event.preventDefault();
    return false;
  });
  map.getViewport().addEventListener('contextmenu', (event) => {
    event.preventDefault();
    return false;
  });
}

function placeMarkers() {
  const markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: '/assets/images/marker.png',
      scale: 1.0,
    }),
  });
  if (typeof markers !== 'undefined' && markers) {
    const markersArray = markers.split('_');
    markersArray.forEach((markerString) => {
      if (markerString) {
        const markerParts = markerString.split(',');

        const markerFeature = new ol.Feature({
          geometry: new ol.geom.Point(
            ol.proj.fromLonLat([markerParts[1], markerParts[0]]),
          ),
        });
        markerFeature.setStyle(markerStyle);
        vectorSource.addFeature(markerFeature);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById(mapTarget)) {
    if (
      typeof isDetails !== 'undefined' &&
      isDetails &&
      typeof center !== 'undefined' &&
      center
    ) {
      setTimeout(() => {
        calculatePolygonFromCoordinates(true);
        placeMarkers();
        const locationParts = center.split(',');
        map.getView().setCenter(ol.proj.fromLonLat(locationParts));
        map.getView().setZoom(6);
        disableInteractions();
      }, timeout);
    } else {
      setTimeout(() => {
        calculatePolygonFromCoordinates();
      }, timeout);
    }
  }
});
