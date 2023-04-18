import React, { useEffect } from 'react';

import { Map, View } from 'ol';
import { RealtimeLayer, MaplibreLayer } from 'mobility-toolbox-js/ol';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
// import { fetchBoundaries, fetchJakarta } from './fetches';
// import { villages } from '../data/villages-with-boundaries-600';
import { villages } from '../data/villages-with-boundaries-265-20chunks.json';

import GeoJSON from 'ol/format/GeoJSON.js';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke, Fill } from 'ol/style';

export function BasicMap() {
  // const [villages, setVillages] = React.useState([]);

  useEffect(() => {
    // fetchBoundaries().then((data) => {
    //   console.log('what is data?', data);
    // });
    // fetchJakarta().then((data) => {
    //   console.log('what is jakarta data?', data);
    // });
  });

  useEffect(() => {
    const longitude = 106.8256;
    const latitude = -6.2088;

    const jktCoordinates = fromLonLat([longitude, latitude]);

    console.log('what are jktCoordinates?', jktCoordinates);

    const map = new Map({
      target: 'map',
      view: new View({
        center: jktCoordinates,
        zoom: 11,
        minZoom: 5
      }),
      controls: []
    });

    const basemapEnum = 'ArcGIS:Streets';
    const apiKey = import.meta.env.VITE_ARC_GIS_API_KEY;

    const layer = new MaplibreLayer({
      url: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`
    });
    layer.attachToMap(map);

    const geoJsonFeatures = villages.map((village) => {
      const geometry = {
        type: 'Polygon',
        coordinates: [
          village.members
            .filter((member) => member.role === 'outer')
            .map((member) =>
              member.geometry.map((point) => [point.lon, point.lat])
            )
        ]
      };

      console.log('geometry', { geometry });

      return {
        type: 'Feature',
        geometry,
        properties: village.tags
      };
    });

    console.log('what are geojson features', { geoJsonFeatures });

    const geoJson = {
      type: 'FeatureCollection',
      features: geoJsonFeatures
    };

    // Create a vector source from the GeoJSON data
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geoJson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326'
      })
    });

    // Create a vector layer with a simple stroke style
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: 'blue',
          width: 2
        }),
        fill: new Fill({
          color: '#ff9090'
        })
      })
    });

    // Add the vector layer to the map
    map.addLayer(vectorLayer);

    // const tracker = new RealtimeLayer({
    //   url: 'wss://api.geops.io/tracker-ws/v1/',
    //   apiKey: window.apiKey,
    //   debug: true
    // });
    // tracker.attachToMap(map);

    // tracker.onClick(([feature]: any[]) => {
    //   if (feature) {
    //     // eslint-disable-next-line no-console
    //     console.log(feature.getProperties());
    //   }
    // });

    return () => {
      map.setTarget(undefined);
    };
  });

  return (
    <div>
      <h1>Basic Map</h1>
      <textarea>
        {JSON.stringify(villages.map((village) => village.tags.name))}
      </textarea>
      <div id="map" style={{ width: 500, height: 500 }}></div>
    </div>
  );
}
