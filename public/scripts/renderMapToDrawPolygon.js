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

function drawPolygonFromCoordinates(coordinates) {
  if (coordinates) {
    if (document.getElementById('west')) {
      document.getElementById('west').textContent = Math.min.apply(
        null,
        coordinates.map((point) => point[0].toFixed(precision)),
      );
    }
    if (document.getElementById('east')) {
      document.getElementById('east').textContent = Math.max.apply(
        null,
        coordinates.map((point) => point[0].toFixed(precision)),
      );
    }
    if (document.getElementById('south')) {
      document.getElementById('south').textContent = Math.min.apply(
        null,
        coordinates.map((point) => point[1].toFixed(precision)),
      );
    }
    if (document.getElementById('north')) {
      document.getElementById('north').textContent = Math.max.apply(
        null,
        coordinates.map((point) => point[1].toFixed(precision)),
      );
    }

    setTimeout(() => {
      calculatePolygonFromCoordinates(true);
      placeMarkers();
    }, timeout);
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
  const north = parseFloat(document.getElementById('north').textContent);
  const south = parseFloat(document.getElementById('south').textContent);
  const east = parseFloat(document.getElementById('east').textContent);
  const west = parseFloat(document.getElementById('west').textContent);
  if (north && south && east && west) {
    const markerStyle = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: '/assets/images/marker.png',
        scale: 1.0,
      }),
    });
    const point1 = {
      latitude: south + (north - south) / 2,
      longitude: west + (east - west) / 2,
    };
    console.log(`Calculated: ${point1.latitude}, ${point1.longitude}`);
    console.log(`Center: ${center}`);
    // const point2 = {
    //   latitude: south - 5.0 + (north + 5.0 - (south - 5.0)) / 2,
    //   longitude: west - 5.0 + (east + 5.0 - (west - 5.0)) / 2,
    // };
    // console.log(point2);
    // console.log(
    //   `south: ${JSON.stringify({ first: south, second: south - 5 })}`,
    // );
    // console.log(`west: ${JSON.stringify({ first: west, second: west - 5 })}`);
    // console.log(
    //   `north: ${JSON.stringify({ first: north, second: north + 5 })}`,
    // );
    // console.log(`east: ${JSON.stringify({ first: east, second: east + 5 })}`);
    // console.log(
    //   `latitude: ${JSON.stringify({ first: south + (north - south) / 2, second: south - 5.0 + (north + 5.0 - (south - 5.0)) / 2 })}`,
    // );
    // const points = [point1, point2];
    // const marketFeatures = [];
    // points.forEach((point) => {
    //   const markerFeature = new ol.Feature({
    //     geometry: new ol.geom.Point(
    //       ol.proj.fromLonLat([point.longitude, point.latitude]),
    //     ),
    //   });
    //   markerFeature.setStyle(markerStyle);
    //   marketFeatures.push(markerFeature);
    // });

    const markerFeature = new ol.Feature({
      geometry: new ol.geom.Point(
        ol.proj.fromLonLat([point1.longitude, point1.latitude]),
      ),
    });
    markerFeature.setStyle(markerStyle);
    vectorSource.addFeature(markerFeature);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById(mapTarget)) {
    setTimeout(() => {
      calculatePolygonFromCoordinates();
    }, timeout);
  }
  if (
    typeof isDetails !== 'undefined' &&
    isDetails &&
    typeof center !== 'undefined' &&
    center
  ) {
    drawPolygonFromCoordinates(coordinates);
    const locationParts = center.split(',');
    map
      .getView()
      .setCenter(
        ol.proj.fromLonLat([
          parseFloat(locationParts[1]),
          parseFloat(locationParts[0]),
        ]),
      );
    map.getView().setZoom(6);
    disableInteractions();
  }
});
