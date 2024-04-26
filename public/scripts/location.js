import { fireEventAfterStorage, getStorageData } from './customScripts.js';

const index3 = 3;
const precision = 6;
const timeout = 200;
const mapTarget = 'coordinate-map';
const isDetailsScreen = typeof isDetails !== 'undefined' && isDetails;
const hasCenter = typeof center !== 'undefined' && center;
const isMapResultsScreen =
  typeof isViewMapResults !== 'undefined' && isViewMapResults;
let initialCenter;
let initialZoom;
let viewChanged = false;

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
const markerSource = new ol.source.Vector();
const markerLayer = new ol.layer.Vector({
  source: markerSource,
});

const draw = new ol.interaction.Draw({
  source: vectorSource,
  type: 'Circle',
  geometryFunction: ol.interaction.Draw.createBox(),
  style: drawStyle,
});
draw.on('drawstart', () => {
  vectorSource.clear();
});
draw.on('drawend', (event) => {
  const feature = event.feature;
  feature.setStyle(completedStyle);
});

const map = new ol.Map({
  target: mapTarget,
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([3.436, 55.3781]),
    zoom: !isDetailsScreen && !isMapResultsScreen ? 5 : 2,
    maxZoom: 18,
    minZoom: 2,
  }),
  controls: [],
  ...(isDetailsScreen && { interactions: [] }),
});
map.addLayer(vectorLayer);
map.addLayer(markerLayer);
map.addInteraction(draw);
if (!isDetailsScreen) {
}

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
        nth: north.toFixed(precision),
        sth: south.toFixed(precision),
        est: east.toFixed(precision),
        wst: west.toFixed(precision),
      };
      fireEventAfterStorage(sessionData);
    }
  }
}

vectorSource.on('change', () => {
  if (!isDetailsScreen) {
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
  vectorSource.clear();
  addPolygon({ north, south, east, west }, completedStyle);
}

function addPolygon(coordinates, style) {
  const { north, south, east, west } = coordinates;
  if (north && south && east && west) {
    const extent = ol.proj.transformExtent(
      [west, south, east, north],
      'EPSG:4326',
      'EPSG:3857',
    );
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
    polygonFeature.setStyle(style);
    vectorSource.addFeature(polygonFeature);
  }
}

function disableInteractions(isMapResultsScreen = false) {
  map.getInteractions().forEach((interaction) => {
    if (
      interaction instanceof ol.interaction.DoubleClickZoom ||
      (!isMapResultsScreen &&
        interaction instanceof ol.interaction.MouseWheelZoom) ||
      interaction instanceof ol.interaction.DragPan ||
      interaction instanceof ol.interaction.Draw ||
      interaction instanceof ol.interaction.Modify ||
      interaction instanceof ol.interaction.Snap
    ) {
      map.removeInteraction(interaction);
    }
  });
}

const getMarkerStyle = (iconPath) => {
  return new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: iconPath,
      scale: 1.0,
    }),
  });
};

function placeMarkers(markers, iconPath, recordId = '1', boundingBoxData = '') {
  const markerStyle = getMarkerStyle(iconPath);
  const markersArray = markers.split('_');
  markersArray.forEach((markerString) => {
    if (markerString) {
      const markerParts = markerString.split(',');
      const markerFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(markerParts)),
        id: recordId,
        boundingBox: boundingBoxData,
      });
      markerFeature.setStyle(markerStyle);
      markerSource.addFeature(markerFeature);
    }
  });
}

function geographyTabListener() {
  map.updateSize();
  calculatePolygonFromCoordinates(true);
  if (typeof markers !== 'undefined' && markers) {
    placeMarkers(markers, '/assets/images/marker.png');
  }
  const locationParts = center.split(',');
  map.getView().setCenter(ol.proj.fromLonLat(locationParts));
  map.getView().fit(vectorSource.getExtent(), {
    padding: [100, 100, 100, 100],
    duration: 1000,
  });
  disableInteractions();
}

function resetMap() {
  map.getView().setZoom(initialZoom);
  map.getView().animate({ center: initialCenter, duration: 1000 });
  viewChanged = false;
  const resetControl = document.getElementById('defra-map-reset');
  if (resetControl) {
    resetControl.style.display = 'none';
  }
}

function exitMapEventListener() {
  const exitControl = document.getElementById('defra-map-exit');
  if (exitControl) {
    exitControl.addEventListener('click', resetMap);
  }
}

function animateZoom(delta) {
  map.getView().animate({
    zoom: map.getView().getZoom() + delta,
    duration: 250,
    easing: ol.easing.easeOut,
  });
}

function customControls() {
  const zoomInElement = document.getElementById('defra-map-zoom-in');
  const zoomOutElement = document.getElementById('defra-map-zoom-out');
  const resetControl = document.getElementById('defra-map-reset');
  if (zoomInElement) {
    zoomInElement.addEventListener('click', () => {
      animateZoom(1);
    });
  }
  if (zoomOutElement) {
    zoomOutElement.addEventListener('click', () => {
      animateZoom(-1);
    });
  }
  if (resetControl) {
    resetControl.addEventListener('click', resetMap);
    map.on('moveend', () => {
      if (!viewChanged) {
        viewChanged = true;
      } else {
        resetControl.style.display = 'block';
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById(mapTarget)) {
    if (isDetailsScreen && hasCenter) {
      const geographyTabTag = document.querySelector('a[href="#geography"]');
      geographyTabTag.addEventListener('click', geographyTabListener);
      setTimeout(() => {
        geographyTabListener();
      }, timeout);
    } else if (isMapResultsScreen) {
      exitMapEventListener();
      disableInteractions(true);
      initialCenter = map.getView().getCenter();
      initialZoom = map.getView().getZoom();
      customControls();
    } else {
      setTimeout(() => {
        calculatePolygonFromCoordinates();
      }, timeout);
    }
  }
});
