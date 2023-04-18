import React, { useEffect } from 'react';

import { Map, View } from 'ol';
import {
  RealtimeLayer,
  MaplibreLayer,
  CopyrightControl
} from 'mobility-toolbox-js/ol';
import 'ol/ol.css';

export function BasicMap() {
  useEffect(() => {
    const map = new Map({
      target: 'map',
      view: new View({
        center: [831634, 5933959],
        zoom: 13,
        minZoom: 5
      }),
      controls: []
    });

    const basemapEnum = 'ArcGIS:Streets';
    const apiKey = import.meta.env.ARC_GIS_API_KEY;

    const layer = new MaplibreLayer({
      url: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`
      // styleUrl: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`
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
  });

  return (
    <div>
      <h1>Basic Map</h1>
      <div id="map" style={{ width: 500, height: 500 }}></div>
    </div>
  );
}
