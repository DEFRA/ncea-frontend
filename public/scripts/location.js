import { fireEventAfterStorage, getStorageData } from './customScripts.js';
import { invokeAjaxCall } from './fetchResults.js';

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
const mapInitialLon = 3.436;
const mapInitialLat = 55.3781;
const mapResultsButtonId = 'map-result-button';
const mapResultsCountId = 'map-result-count';
const actionDataAttribute = 'data-action';
const boundingBoxCheckbox = document.getElementById('bounding-box');
const extentSearchZoomLevel = 5;
const responseSuccessStatusCode = 200;
const marketYPoint = 46;
const highlightedMarkerIcon = '/assets/images/highlight-blue-marker-icon.png';
const markerIcon = '/assets/images/blue-marker-icon.svg';
const mapInfoBlock = document.getElementById('map-info');
const contentMaxChar = 500;
let selectedRecord = '';
let mapResults;

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

const mapResultsHighlightStyle = new ol.style.Style({
  stroke: new ol.style.Stroke({
    color: '#FFDD00',
    width: 2,
  }),
  fill: new ol.style.Fill({
    color: 'rgb(244, 119, 56, 0.20)',
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

const isMarkerFeature = (feature) =>
  feature?.getGeometry()?.getType() === 'Point';

const isPolygonFeature = (feature) =>
  feature?.getGeometry()?.getType() === 'Polygon';

const map = new ol.Map({
  target: mapTarget,
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([mapInitialLon, mapInitialLat]),
    zoom: !isDetailsScreen && !isMapResultsScreen ? extentSearchZoomLevel : 2,
    maxZoom: 18,
    minZoom: 2,
  }),
  controls: [],
  ...(isDetailsScreen && { interactions: [] }),
});
map.addLayer(vectorLayer);
map.addLayer(markerLayer);
map.addInteraction(draw);

if (isMapResultsScreen) {
  mapEventListener();
}

function mapEventListener() {
  map.on('pointermove', (event) => {
    const pixel = event.pixel;
    const feature = map.forEachFeatureAtPixel(
      pixel,
      (featureItem) => featureItem,
    );
    map.getTargetElement().style.cursor = isMarkerFeature(feature)
      ? 'pointer'
      : '';
  });
  map.on('click', (event) => {
    const pixel = event.pixel;
    const feature = map.forEachFeatureAtPixel(
      pixel,
      (featureItem) => featureItem,
    );
    resetFeatureStyle();
    closeInfoPopup();
    if (feature && isPolygonFeature(feature)) {
      const polygonGeometry = feature.getGeometry();
      markerSource.getFeatures().forEach((marker) => {
        if (
          isMarkerFeature(marker) &&
          polygonGeometry.intersectsCoordinate(
            marker.getGeometry().getFirstCoordinate(),
          )
        ) {
          const recordId = marker.get('id');
          const boundingBox = marker.get('boundingBox');
          marker.setStyle(getMarkerStyle(highlightedMarkerIcon));
          showInformationPopup(recordId, boundingBox);
        }
      });
      return;
    }
    if (feature && isMarkerFeature(feature)) {
      const recordId = feature.get('id');
      const boundingBox = feature.get('boundingBox');
      feature.setStyle(getMarkerStyle(highlightedMarkerIcon));
      showInformationPopup(recordId, boundingBox);
    }
  });
}

const resetFeatureStyle = () => {
  vectorSource.getFeatures().forEach((feature) => {
    if (isPolygonFeature(feature)) {
      feature.setStyle(mapResultsStyle);
    }
  });
  markerSource.getFeatures().forEach((marker) => {
    if (isMarkerFeature(marker)) {
      marker.setStyle(getMarkerStyle(markerIcon));
    }
  });
};

function truncateString(inputString, maxLength) {
  if (inputString && inputString.length > maxLength) {
    return `${inputString.slice(0, maxLength)}...`;
  }
  return inputString;
}

function showInformationPopup(recordId, boundingBox) {
  selectedRecord = mapResults.find((item) => item?.id === recordId);
  const titleElement = document.getElementById('info-title');
  const publishedBlock = document.getElementById('info-published-block');
  const publishedByElement = document.getElementById('info-published-by');
  const contentElement = document.getElementById('info-content');
  if (selectedRecord && Object.keys(selectedRecord).length) {
    if (boundingBox) {
      boundingBox.setStyle(mapResultsHighlightStyle);
    }
    if (mapInfoBlock) {
      mapInfoBlock.style.display = 'block';
      titleElement.textContent = selectedRecord.title;
      if (selectedRecord.publishedBy) {
        publishedByElement.textContent = selectedRecord.publishedBy;
        publishedBlock.style.display = 'block';
      } else {
        publishedBlock.style.display = 'none';
      }
      contentElement.textContent = truncateString(
        selectedRecord.content,
        contentMaxChar,
      );
    }
  }
}

function moreInfoNavigation() {
  if (selectedRecord && Object.keys(selectedRecord).length) {
    window.location.href = `${window.location.origin}${window.location.pathname}/${selectedRecord.id}`;
  }
}
function closeInfoPopup() {
  if (mapInfoBlock) {
    const titleElement = document.getElementById('info-title');
    const publishedBlock = document.getElementById('info-published-block');
    const publishedByElement = document.getElementById('info-published-by');
    const contentElement = document.getElementById('info-content');
    mapInfoBlock.style.display = 'none';
    titleElement.textContent = '';
    publishedBlock.style.display = 'block';
    publishedByElement.textContent = '';
    contentElement.textContent = '';
  }
  resetFeatureStyle();
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

function calculatePolygonFromCoordinates() {
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
    return polygonFeature;
  }
  return null;
}

function disableInteractions() {
  map.getInteractions().forEach((interaction) => {
    const isZoomInteractions =
      interaction instanceof ol.interaction.DoubleClickZoom ||
      (!isMapResultsScreen &&
        interaction instanceof ol.interaction.MouseWheelZoom);
    const isDragDrawModifySnap =
      interaction instanceof ol.interaction.DragPan ||
      interaction instanceof ol.interaction.Draw;
    const isModifySnap =
      interaction instanceof ol.interaction.Modify ||
      interaction instanceof ol.interaction.Snap;
    if (isZoomInteractions || isDragDrawModifySnap || isModifySnap) {
      map.removeInteraction(interaction);
    }
  });
}

const getMarkerStyle = (iconPath) => {
  return new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, marketYPoint],
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
  calculatePolygonFromCoordinates();
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
  const resetControl = document.getElementById('defra-map-reset');
  if (resetControl) {
    resetControl.style.display = 'none';
  }
  resetFeatureStyle();
  closeInfoPopup();
}

function exitMapEventListener() {
  const exitControl = document.getElementById('defra-map-exit');
  if (exitControl) {
    exitControl.addEventListener('click', resetMap);
  }
}

function drawBoundingBoxWithMarker(records) {
  mapResults = records;
  map.updateSize();
  const centerArray = [];
  records.forEach((record) => {
    const boundingBox = addPolygon(record.geographicBoundary, mapResultsStyle);
    placeMarkers(record.geographicCenter, markerIcon, record.id, boundingBox);
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
    initialCenter = map.getView().getCenter();
    initialZoom = map.getView().getZoom();
  }
}

const attachBoundingBoxToggleListener = () => {
  if (boundingBoxCheckbox) {
    boundingBoxCheckboxChange(true);
    boundingBoxCheckbox.addEventListener('change', () => {
      vectorLayer.setVisible(boundingBoxCheckbox.checked);
    });
  }
};

const getMapResults = async (path) => {
  const mapResultsButton = document.getElementById(mapResultsButtonId);
  const mapResultsCount = document.getElementById(mapResultsCountId);
  const response = await invokeAjaxCall(path, {}, false, 'GET');
  if (response) {
    if (response.status === responseSuccessStatusCode) {
      const mapResultsJson = await response.json();
      mapResultsButton.removeAttribute('disabled');
      mapResultsCount.textContent = mapResultsJson.total;
      drawBoundingBoxWithMarker(mapResultsJson.items);
      attachBoundingBoxToggleListener();
    } else {
      mapResultsButton.setAttribute('disabled', true);
    }
  }
};

const invokeMapResults = () => {
  const fetchResults = document.querySelector('[data-fetch-map-results]');
  if (fetchResults) {
    const action = fetchResults.getAttribute(actionDataAttribute);
    getMapResults(`${action}${window.location.search}`);
  }
};

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

function infoListener() {
  const closeInfoElement = document.getElementById('map-info-close');
  if (closeInfoElement) {
    closeInfoElement.addEventListener('click', closeInfoPopup);
  }
  const moreInfoElement = document.getElementById('more-info');
  if (moreInfoElement) {
    moreInfoElement.addEventListener('click', moreInfoNavigation);
  }
  const goToResourceElement = document.getElementById('go-to-resource');
  if (goToResourceElement) {
    if (!selectedRecord.organisationName || !selectedRecord.resourceLocator) {
      goToResourceElement.setAttribute('disabled', true);
    } else {
      goToResourceElement.removeAttribute('disabled');
    }
    goToResourceElement.addEventListener('click', () => {
      window.openDataModal(
        selectedRecord.organisationName,
        selectedRecord.resourceLocator,
        true,
      );
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
      invokeMapResults();
      exitMapEventListener();
      disableInteractions();
      infoListener();
      customControls();
    } else {
      setTimeout(() => {
        calculatePolygonFromCoordinates();
      }, timeout);
    }
  }
});
