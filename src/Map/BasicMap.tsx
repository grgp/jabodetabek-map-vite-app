import React, { useEffect } from 'react';

import { Map, View } from 'ol';
import { RealtimeLayer, MaplibreLayer } from 'mobility-toolbox-js/ol';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import { fetchBoundaries, fetchJakarta } from './fetches';

export function BasicMap() {
  useEffect(() => {
    fetchBoundaries().then((data) => {
      console.log('what is data?', data);
    });
    fetchJakarta().then((data) => {
      console.log('what is jakarta data?', data);
    });
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
      <div id="map" style={{ width: 500, height: 500 }}></div>
    </div>
  );
}
