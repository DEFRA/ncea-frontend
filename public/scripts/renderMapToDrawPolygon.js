import { fireEventAfterStorage, getStorageData } from './customScripts.js';
import { invokeAjaxCall } from './fetchResults.js';

const index3 = 3;
const precision = 6;
const timeout = 200;
// const intervalTimeout = 50;
const mapTarget = 'coordinate-map';
let map;
let initialCenter;
let initialZoom;
let viewChanged = false;
const mapResultsButtonId = 'map-result-button';
const mapResultsCountId = 'map-result-count';
const actionDataAttribute = 'data-action';
const boundingBoxCheckbox = document.getElementById('bounding-box');

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

const mapResultsStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: '#004618',
    width: 2,
  }),
  fill: new ol.style.Fill({
    color: 'rgb(62, 238, 0, 0.2)',
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

const modify = new ol.interaction.Modify({
  source: vectorSource,
});

const snap = new ol.interaction.Snap({
  source: vectorSource,
});

function initMap() {
  map = new ol.Map({
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

  addMapFeatures();
}

function addMapFeatures() {
  map.addLayer(vectorLayer);
  map.addLayer(markerLayer);
  map.addInteraction(draw);

  if (typeof isDetails === 'undefined') {
    map.addInteraction(modify);
    map.addInteraction(snap);
  }
}

draw.on('drawstart', () => {
  vectorSource.clear();
});

draw.on('drawend', (event) => {
  const feature = event.feature;
  feature.setStyle(completedStyle);
});

vectorSource.on('change', () => {
  if (typeof isDetails === 'undefined') {
    calculateCoordinates();
  }
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

function placeMarkers(markers, iconPath) {
  const markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 46],
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: iconPath,
      scale: 1.0,
    }),
  });
  const markersArray = markers.split('_');
  markersArray.forEach((markerString) => {
    if (markerString) {
      const markerParts = markerString.split(',');
      const markerFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat(markerParts)),
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

function boundingBoxCheckboxChange(isChecked) {
  if (boundingBoxCheckbox) {
    boundingBoxCheckbox.checked = isChecked;
    boundingBoxCheckbox.dispatchEvent(new Event('change'));
  }
}

function resetMap() {
  map.getView().setZoom(initialZoom);
  map.getView().animate({ center: initialCenter, duration: 1000 });
  viewChanged = false;
  const refreshControl = document.querySelector('.defra-refresh-block');
  refreshControl.style.display = 'none';
  boundingBoxCheckboxChange(true);
}

function customControls() {
  const zoomInButton = document.querySelector('.ol-zoom-in');
  const zoomOutButton = document.querySelector('.ol-zoom-out');
  zoomInButton.classList.add('defra-zoom-in', 'defra-controls');
  zoomOutButton.classList.add('defra-zoom-out', 'defra-controls');

  const refreshControlBlock = document.createElement('div');
  refreshControlBlock.classList.add(
    'ol-unselectable',
    'ol-control',
    'defra-refresh-block',
  );
  const refreshControl = document.createElement('button');
  refreshControl.classList.add('defra-controls', 'defra-refresh-control');
  refreshControl.addEventListener('click', resetMap);
  refreshControlBlock.appendChild(refreshControl);
  map.getViewport().appendChild(refreshControlBlock);

  map.on('moveend', () => {
    if (!viewChanged) {
      viewChanged = true;
    } else {
      const refreshControl = document.querySelector('.defra-refresh-block');
      refreshControl.style.display = 'block';
    }
  });
}

function exitMapEventListener() {
  const exitControl = document.querySelector('.defra-exit-control');
  if (exitControl) {
    exitControl.addEventListener('click', resetMap);
  }
}

function drawBoundingBoxWithMarker(records) {
  map.updateSize();
  const centerArray = [];
  records.forEach((record) => {
    addPolygon(record.geographicBoundary, mapResultsStyle);
    placeMarkers(
      record.geographicCenter,
      '/assets/images/blue-marker-icon.svg',
    );
    const [lon, lat] = record.geographicCenter.split(',').map(parseFloat);
    centerArray.push([lon, lat]);
  });
  const totalCenters = centerArray.length;
  if (totalCenters) {
    const sumCenter = centerArray.reduce(
      (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]],
      [0, 0],
    );
    const averageCenter = [
      sumCenter[0] / totalCenters,
      sumCenter[1] / totalCenters,
    ];
    map.getView().setCenter(averageCenter);
    map.getView().setZoom(2);
    // map.getView().fit(vectorSource.getExtent(), { padding: [50, 50, 50, 50] });
    initialCenter = map.getView().getCenter();
    initialZoom = map.getView().getZoom();
  }
}

const attachBoundingBoxToggleListener = () => {
  if (boundingBoxCheckbox) {
    boundingBoxCheckboxChange(true);
    boundingBoxCheckbox.addEventListener('change', () => {
      vectorLayer.setVisible(boundingBoxCheckbox.checked ? true : false);
    });
  }
};

const getMapResults = async (path) => {
  const mapResultsButton = document.getElementById(mapResultsButtonId);
  const mapResultsCount = document.getElementById(mapResultsCountId);
  const { fields, sort, filters } = getStorageData();
  const payload = {
    fields,
    sort,
    rowsPerPage: null,
    filters,
    page: null,
  };
  const response = await invokeAjaxCall(path, payload);
  if (response) {
    if (response.status === 200) {
      const mapResults = await response.json();
      mapResultsButton.removeAttribute('disabled');
      mapResultsCount.textContent = mapResults.total;
      drawBoundingBoxWithMarker(mapResults.items);
      attachBoundingBoxToggleListener();
    } else {
      mapResultsButton.setAttribute('disabled', true);
    }
    return;
  }
};

const invokeMapResults = () => {
  const fetchResults = document.querySelector('[data-fetch-map-results]');
  if (fetchResults) {
    const action = fetchResults.getAttribute(actionDataAttribute);
    getMapResults(action);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById(mapTarget)) {
    initMap();
    if (
      typeof isDetails !== 'undefined' &&
      isDetails &&
      typeof center !== 'undefined' &&
      center
    ) {
      const geographyTabTag = document.querySelector('a[href="#geography"]');
      geographyTabTag.addEventListener('click', geographyTabListener);
      setTimeout(() => {
        geographyTabListener();
      }, timeout);
    } else if (typeof isViewMapResults !== 'undefined' && isViewMapResults) {
      invokeMapResults();
      exitMapEventListener();
      disableInteractions(true);
      customControls();
    } else {
      setTimeout(() => {
        calculatePolygonFromCoordinates();
      }, timeout);
    }
  }
});
