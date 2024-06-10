import {
  fireEventAfterStorage,
  getStorageData,
  updateSubmitButtonState,
} from './customScripts.js';
import { invokeAjaxCall } from './fetchResults.js';
import {
  addFilterHeadingClickListeners,
  attachStudyPeriodChangeListener,
} from './filters.js';

const index3 = 3;
const precision = 6;
const timeout = 200;
const mapTarget = 'coordinate-map';
const isDetailsScreen = typeof isDetails !== 'undefined' && isDetails;
const hasCenter = typeof center !== 'undefined' && center;
const isMapResultsScreen =
  typeof isViewMapResults !== 'undefined' && isViewMapResults;
let initialCenter;
const initialZoom = 2;
let viewChanged = false;
const mapInitialLon = 3.436;
const mapInitialLat = 55.3781;
const mapResultsButtonId = 'map-result-button';
const mapResultsCountId = 'map-result-count';
const actionDataAttribute = 'data-action';
const filterBlockId = 'map-filter-block';
const boundingBoxCheckbox = document.getElementById('bounding-box');
const extentSearchZoomLevel = 5;
const responseSuccessStatusCode = 200;
const highlightedMarkerIcon = '/assets/images/highlight-marker-icon.svg';
const hoverMarkerIcon = '/assets/images/hover-marker-icon.svg';
const markerIcon = '/assets/images/marker-icon.svg';
const mapInfoBlock = document.getElementById('map-info');
const contentMaxChar = 500;
let selectedRecord = '';
let mapResults;
const defaultFilterOptions = {
  startYear: '',
  toYear: '',
  resourceType: [],
};
let appliedFilterOptions = { ...defaultFilterOptions };
const markerOverlays = [];
const defaultMapProjection = 'EPSG:3857';
const extentTransformProjection = 'EPSG:4326';
let firstMove = true;
const resetControl = document.getElementById('defra-map-reset');
const markerOverlayOffsetX = -15;
const markerOverlayOffsetY = -50;
const maxMarkerAllowed = 9;
const leftArrowKey = 37;
const upArrowKey = 38;
const rightArrowKey = 39;
const downArrowKey = 40;
let resetData = false;
let selectedFeatureId = '';
let selectedBoundingBox = '';
let hasResourceListener = false;
const maxCountForBoundingBoxInfo = 50;
const polygonFeatureData = [];

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
    color: 'rgb(62, 238, 0, 0.15)',
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
    minZoom: 2,
    extent: ol.proj.get(defaultMapProjection).getExtent(),
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
    markerSource.getFeatures().forEach(function (feature) {
      if (
        isMarkerFeature(feature) &&
        map.getFeaturesAtPixel(pixel).includes(feature) &&
        selectedFeatureId !== feature.get('id')
      ) {
        feature.setStyle(getMarkerStyle(hoverMarkerIcon));
      } else if (selectedFeatureId === feature.get('id')) {
        feature.setStyle(getMarkerStyle(highlightedMarkerIcon));
      } else {
        feature.setStyle(getMarkerStyle(markerIcon));
      }
    });
  });
  map.on('click', (event) => {
    const pixel = event.pixel;
    const feature = map.forEachFeatureAtPixel(
      pixel,
      (featureItem) => featureItem,
    );
    resetFeatureStyle();
    closeInfoPopup();
    if (feature && isMarkerFeature(feature)) {
      const recordId = feature.get('id');
      const boundingBox = feature.get('boundingBox');
      feature.setStyle(getMarkerStyle(highlightedMarkerIcon));
      selectedFeatureId = recordId;
      selectedBoundingBox = boundingBox;
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
  infoListener();
  boundingBoxListener(boundingBoxCheckbox.checked);
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
    window.location.href = `${window.location.origin}${window.location.pathname}/${selectedRecord.id}${window.location.search}`;
  }
}
function closeInfoPopup() {
  if (mapInfoBlock) {
    const titleElement = document.getElementById('info-title');
    const publishedBlock = document.getElementById('info-published-block');
    const publishedByElement = document.getElementById('info-published-by');
    const contentElement = document.getElementById('info-content');
    mapInfoBlock.style.display = 'none';
    titleElement.textContent = 'test';
    publishedBlock.style.display = 'block';
    publishedByElement.textContent = '';
    contentElement.textContent = '';
  }
  selectedFeatureId = '';
  selectedBoundingBox = '';
  resetFeatureStyle();
  boundingBoxListener(boundingBoxCheckbox.checked);
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
      defaultMapProjection,
      extentTransformProjection,
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
      toggleClearSelectionBlock();
    }
  }
}

vectorSource.on('change', () => {
  if (!isDetailsScreen) {
    calculateCoordinates();
  }
});

const toggleClearSelectionBlock = () => {
  const clearSelection = document.getElementById('clear-map-selection');
  if (clearSelection) {
    const north = document.getElementById('north')?.value;
    const south = document.getElementById('south')?.value;
    const east = document.getElementById('east')?.value;
    const west = document.getElementById('west')?.value;
    if (north && south && east && west) {
      clearSelection.style.display = 'block';
    } else {
      clearSelection.style.display = 'none';
    }
  }
};

const attachClearSelectionListener = () => {
  const clearSelection = document.getElementById('clear-map-selection');
  if (clearSelection) {
    clearSelection.addEventListener('click', function () {
      vectorSource.clear();
      const form = document.querySelector('[data-do-browser-storage]');
      if (form) {
        const sessionData = getStorageData();
        if (sessionData.fields.hasOwnProperty(form.id)) {
          delete sessionData.fields[form.id];
        }
        fireEventAfterStorage(sessionData);
        document.getElementById('north').value = '';
        document.getElementById('south').value = '';
        document.getElementById('east').value = '';
        document.getElementById('west').value = '';
        toggleClearSelectionBlock();
        updateSubmitButtonState(form);
      }
    });
  }
};

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
  !isDetailsScreen && toggleClearSelectionBlock();
  addPolygon({ north, south, east, west }, completedStyle);
}

function addPolygon(coordinates, style, addToVector = true) {
  const { north, south, east, west } = coordinates;
  if (north && south && east && west) {
    const extent = ol.proj.transformExtent(
      [west, south, east, north],
      extentTransformProjection,
      defaultMapProjection,
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
    addToVector && vectorSource.addFeature(polygonFeature);
    if (!addToVector) {
      polygonFeatureData.push(polygonFeature);
    }
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

function resetFilterData() {
  const studyPeriodForm = document.getElementById(
    'study_period_filter-map_results',
  );
  const resourceTypeForm = document.getElementById(
    'resource_type_filter-map_results',
  );
  if (studyPeriodForm && resourceTypeForm) {
    studyPeriodForm.reset();
    resourceTypeForm.reset();
  }
}

function resetMap() {
  map.getView().setZoom(initialZoom);
  map.getView().animate({ center: initialCenter, duration: 1000 });
  viewChanged = false;
  firstMove = true;
  if (resetControl) {
    resetControl.style.display = 'none';
  }
  resetFeatureStyle();
  closeInfoPopup();
  fitMapToExtent();
}

function exitMap() {
  resetMap();
  resetFilterData();
  if (resetData) {
    appliedFilterOptions = { ...defaultFilterOptions };
    invokeMapResults(true, true);
    invokeMapFilters(true);
    resetData = false;
  }
}

function exitMapEventListener() {
  const exitControl = document.getElementById('defra-map-exit');
  if (exitControl) {
    exitControl.addEventListener('click', exitMap);
  }
}

function drawBoundingBoxWithMarker(fitToMapExtentFlag, doRecenter = true) {
  vectorSource.clear();
  markerSource.clear();
  map.updateSize();
  const centerArray = [];
  mapResults.forEach((record) => {
    const boundingBox = addPolygon(
      record.geographicBoundary,
      mapResultsStyle,
      false,
    );
    placeMarkers(record.geographicCenter, markerIcon, record.id, boundingBox);

    const markersArray = record.geographicCenter.split('_');
    markersArray.forEach((markerString) => {
      if (markerString) {
        const [lon, lat] = markerString.split(',').map(parseFloat);
        centerArray.push([lon, lat]);
      }
    });
  });
  if (doRecenter) {
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
      map.getView().setCenter(ol.proj.fromLonLat(averageCenter));
      map.getView().setZoom(initialZoom);
    }
  }
  fitToMapExtentFlag && fitMapToExtent();
}

const boundingBoxListener = (boundingBoxCheckboxState) => {
  polygonFeatureData.forEach((feature) => {
    const isFeatureExists = vectorSource
      .getFeatures()
      .some(
        (f) =>
          f.getGeometry().getCoordinates().toString() ===
          feature.getGeometry().getCoordinates().toString(),
      );
    if (feature !== selectedBoundingBox) {
      if (boundingBoxCheckboxState) {
        !isFeatureExists && vectorSource.addFeature(feature);
        feature.setStyle(mapResultsStyle);
      } else {
        isFeatureExists && vectorSource.removeFeature(feature);
      }
    } else {
      !isFeatureExists && vectorSource.addFeature(feature);
      feature.setStyle(mapResultsHighlightStyle);
    }
  });
};

const attachBoundingBoxToggleListener = () => {
  if (boundingBoxCheckbox) {
    boundingBoxCheckboxChange(false);
    boundingBoxCheckbox.addEventListener('change', () => {
      boundingBoxListener(boundingBoxCheckbox.checked);
    });
  }
};

const attachMapResultsFilterCheckboxChangeListener = () => {
  const mapResultsFilterCheckboxes = document.querySelectorAll(
    '[data-instance="map_results"]',
  );
  if (mapResultsFilterCheckboxes.length) {
    mapResultsFilterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', function (event) {
        const { value, checked } = event.target;
        const index = appliedFilterOptions.resourceType.indexOf(value);
        if (checked && index === -1) {
          appliedFilterOptions.resourceType.push(value);
        } else {
          appliedFilterOptions.resourceType.splice(index, 1);
        }
        resetData = true;
        invokeMapResults(true);
        invokeMapFilters();
      });
    });
  }
};

const updateStudyPeriodFilter = () => {
  setTimeout(() => {
    appliedFilterOptions.startYear = document.getElementById(
      'map_results-start_year',
    ).value;
    appliedFilterOptions.toYear = document.getElementById(
      'map_results-to_year',
    ).value;
    resetData = true;
    invokeMapResults(true);
    invokeMapFilters();
  }, 100);
};

const getMapResults = async (path, fitToMapExtentFlag) => {
  const mapResultsButton = document.getElementById(mapResultsButtonId);
  const mapResultsCount = document.getElementById(mapResultsCountId);
  const response = await invokeAjaxCall(path, {}, false, 'GET');
  if (response) {
    if (response.status === responseSuccessStatusCode) {
      const mapResultsJson = await response.json();
      mapResultsButton.removeAttribute('disabled');
      mapResultsCount.textContent = mapResultsJson.total;
      if (mapResultsJson.total > 0) {
        const boundingBoxInfo = document.getElementById(
          'defra-bounding-box-info',
        );
        if (
          boundingBoxInfo &&
          mapResultsJson.total > maxCountForBoundingBoxInfo
        ) {
          boundingBoxInfo.style.display = 'block';
        } else {
          boundingBoxInfo.style.display = 'none';
        }
        mapResults = mapResultsJson.items;
        setTimeout(() => {
          drawBoundingBoxWithMarker(fitToMapExtentFlag, true);
        }, 100);
        attachBoundingBoxToggleListener();
      } else {
        mapResultsButton.setAttribute('disabled', true);
      }
    } else {
      mapResultsButton.setAttribute('disabled', true);
    }
  }
};

const getMapFilters = async (path) => {
  const response = await invokeAjaxCall(path, {}, false, 'GET');
  if (response && response?.status === responseSuccessStatusCode) {
    const mapFiltersHtml = await response.text();
    document.getElementById(filterBlockId).innerHTML = mapFiltersHtml;
    addFilterHeadingClickListeners('map_results');
    attachStudyPeriodChangeListener('map_results');
    attachMapResultsFilterCheckboxChangeListener();
    const mapFilterStartYear = document.getElementById(
      'map_results-start_year',
    );
    const mapFilterToYear = document.getElementById('map_results-to_year');
    if (mapFilterStartYear && mapFilterToYear) {
      mapFilterStartYear.addEventListener('change', updateStudyPeriodFilter);
      mapFilterToYear.addEventListener('change', updateStudyPeriodFilter);
    }
  }
};

const getPathWithQueryParams = (basePath, needOriginalQueryParams) => {
  const queryParams = new URLSearchParams(window.location.search);
  const { startYear, toYear, resourceType } = appliedFilterOptions;
  if (startYear && toYear && !needOriginalQueryParams) {
    queryParams.set('sy', startYear);
    queryParams.set('ty', toYear);
  }
  if (resourceType.length > 0 && !needOriginalQueryParams) {
    queryParams.set('rty', resourceType.join(','));
  }
  const queryString = queryParams.size > 0 ? `?${queryParams.toString()}` : '';
  return `${basePath}${queryString}`;
};

const checkLatestBrowser = () => {
  try {
    eval('const x = (y) => y + 1');
    return true;
  } catch (e) {
    const mapResultsBlock = document.getElementById('map-results-block');
    if (mapResultsBlock) {
      mapResultsBlock.classList.add('map-results-block');
    }
    const mapResultsButton = document.getElementById(mapResultsButtonId);
    if (mapResultsButton) {
      mapResultsButton.style.marginBottom = '10px';
      mapResultsButton.setAttribute('disabled', true);
    }
    const mapUnavailableInfo = document.getElementById(
      'map-results-unavailable',
    );
    if (mapUnavailableInfo) {
      mapUnavailableInfo.style.display = 'block';
    }
    return false;
  }
};

const invokeMapResults = (
  fitToMapExtentFlag = false,
  needOriginalQueryParams = false,
) => {
  if (checkLatestBrowser()) {
    const fetchResults = document.querySelector('[data-fetch-map-results]');
    if (fetchResults) {
      const action = fetchResults.getAttribute(actionDataAttribute);
      getMapResults(
        getPathWithQueryParams(action, needOriginalQueryParams),
        fitToMapExtentFlag,
      );
    }
  }
};

const toggleResetStudyPeriodLink = () => {
  const { startYear, toYear } = appliedFilterOptions;
  const mapResetFilter = document.getElementById(
    'reset-map-study-period-filter',
  );
  if (mapResetFilter) {
    mapResetFilter.addEventListener('click', () => {
      appliedFilterOptions = {
        ...appliedFilterOptions,
        startYear: '',
        toYear: '',
      };
      invokeMapFilters(true);
      invokeMapResults(true, true);
    });
    if (startYear && toYear) {
      mapResetFilter.style.display = 'block';
    } else {
      mapResetFilter.style.display = 'none';
    }
  }
};

const invokeMapFilters = async (needOriginalQueryParams = false) => {
  if (checkLatestBrowser()) {
    const fetchFilters = document.querySelector('[data-fetch-map-filters]');
    if (fetchFilters) {
      const action = fetchFilters.getAttribute(actionDataAttribute);
      await getMapFilters(
        getPathWithQueryParams(action, needOriginalQueryParams),
      );
      toggleResetStudyPeriodLink();
    }
  }
};

function animateZoom(delta) {
  map.getView().animate({
    zoom: map.getView().getZoom() + delta,
    duration: 250,
    easing: ol.easing.easeOut,
  });
}

function createTooltipOverlay(index) {
  const tooltip = document.createElement('div');
  tooltip.className = 'marker-tooltip';
  tooltip.innerHTML = (index + 1).toString();
  tooltip.style.position = 'absolute';
  tooltip.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
  tooltip.style.padding = '4px 4px';
  tooltip.style.borderRadius = '7px';
  tooltip.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.border = '3px solid #000';
  tooltip.style.fontWeight = 'bold';
  tooltip.style.fontSize = '20px';
  tooltip.style.display = 'flex';
  tooltip.style.alignItems = 'center';
  tooltip.style.justifyContent = 'center';
  tooltip.style.width = '16px';
  tooltip.style.height = '16px';
  tooltip.style.fontFamily = "'GDS Transport', arial, sans-serif";

  const markerOverlay = new ol.Overlay({
    element: tooltip,
    positioning: 'top-center',
    offset: [markerOverlayOffsetX, markerOverlayOffsetY],
    stopEvent: false,
  });

  map.addOverlay(markerOverlay);
  markerOverlays.push(markerOverlay);
}

function keydownHandler(event) {
  const key = event.key;
  if (key >= 1 && key <= maxMarkerAllowed) {
    const markerIndex = parseInt(key) - 1;
    const visibleMarkers = markerLayer
      .getSource()
      .getFeaturesInExtent(map.getView().calculateExtent(map.getSize()));
    if (markerIndex < visibleMarkers.length) {
      const markerOverlay = markerOverlays[markerIndex];
      if (markerOverlay) {
        const marker = visibleMarkers[markerIndex];
        const coord = marker.getGeometry().getCoordinates();
        const pixel = map.getPixelFromCoordinate(coord);
        resetFeatureStyle();
        closeInfoPopup();
        map.forEachFeatureAtPixel(pixel, function (feature) {
          if (feature === marker && isMarkerFeature(feature)) {
            const recordId = feature.get('id');
            const boundingBox = feature.get('boundingBox');
            selectedFeatureId = recordId;
            selectedBoundingBox = boundingBox;
            feature.setStyle(getMarkerStyle(highlightedMarkerIcon));
            showInformationPopup(recordId, boundingBox);
          }
        });
      }
    }
  }
}

function checkNUpdateMarkerTooltip() {
  const visibleMarkers = markerLayer
    .getSource()
    .getFeaturesInExtent(map.getView().calculateExtent(map.getSize()));
  markerOverlays.forEach((overlay) => map.removeOverlay(overlay));
  markerOverlays.length = 0;
  document.removeEventListener('keydown', keydownHandler);
  resetFeatureStyle();
  closeInfoPopup();

  if (visibleMarkers.length <= maxMarkerAllowed) {
    visibleMarkers.forEach((marker, index) => {
      createTooltipOverlay(index);
      const coord = marker.getGeometry().getCoordinates();
      markerOverlays[index].setPosition(coord);
    });
    document.addEventListener('keydown', keydownHandler);
  }
}

function fitMapToExtent() {
  const padding = 50;
  const visibleMarkers = markerLayer.getSource().getFeatures();
  const extent = ol.extent.createEmpty();
  if (visibleMarkers.length > 0) {
    visibleMarkers.forEach((marker) => {
      ol.extent.extend(extent, marker.getGeometry().getExtent());
    });
  }
  if (!ol.extent.isEmpty(extent)) {
    map.getView().fit(extent, {
      padding: [padding, padding, padding, padding],
      duration: 1000,
    });
  }
  initialCenter = map.getView().getCenter();
  if (resetControl) {
    viewChanged = false;
    resetControl.style.display = 'none';
  }
}

function customControls() {
  const zoomInElement = document.getElementById('defra-map-zoom-in');
  const zoomOutElement = document.getElementById('defra-map-zoom-out');
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
      if (firstMove) {
        fitMapToExtent();
        firstMove = false;
      } else {
        if (!viewChanged) {
          viewChanged = true;
        } else {
          resetControl.style.display = 'block';
        }
      }
      checkNUpdateMarkerTooltip();
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
    if (!hasResourceListener) {
      goToResourceElement.addEventListener('click', () => {
        window.openDataModal(
          selectedRecord.organisationName,
          selectedRecord.resourceLocator,
          true,
        );
      });
      hasResourceListener = true;
    }
  }
}

function handleKeyboardArrowEvent(event) {
  const view = map.getView();
  const delta = view.getResolution() * 100;

  switch (event.keyCode) {
    case leftArrowKey: // Left arrow key
      view.animate({
        center: [view.getCenter()[0] - delta, view.getCenter()[1]],
        duration: 100,
      });
      break;
    case upArrowKey: // Up arrow key
      view.animate({
        center: [view.getCenter()[0], view.getCenter()[1] + delta],
        duration: 100,
      });
      break;
    case rightArrowKey: // Right arrow key
      view.animate({
        center: [view.getCenter()[0] + delta, view.getCenter()[1]],
        duration: 100,
      });
      break;
    case downArrowKey: // Down arrow key
      view.animate({
        center: [view.getCenter()[0], view.getCenter()[1] - delta],
        duration: 100,
      });
      break;
    default:
      break;
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
      invokeMapFilters();
      exitMapEventListener();
      disableInteractions();
      customControls();
      checkNUpdateMarkerTooltip();
      document.addEventListener('keydown', handleKeyboardArrowEvent);
    } else {
      setTimeout(() => {
        calculatePolygonFromCoordinates();
        attachClearSelectionListener();
      }, timeout);
    }
  }
});
