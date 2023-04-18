import React, { useEffect } from 'react';

import { Feature, Map, View } from 'ol';
import { RealtimeLayer, MaplibreLayer } from 'mobility-toolbox-js/ol';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
// import { fetchBoundaries, fetchJakarta } from './fetches';
// import { villages } from '../data/villages-with-boundaries-600';
import { villages } from '../data/actual-villages-1115.json';

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke, Fill } from 'ol/style';
import { Polygon } from 'ol/geom';
import GeoJSON from 'ol/format/GeoJSON.js';

import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { kebonJerok } from '../data/kebonJeruk';
import { fetchJakarta } from './fetches';

export function BasicMap() {
  // const [villages, setVillages] = React.useState([]);

  useEffect(() => {
    // fetchBoundaries().then((data) => {
    //   console.log('what is data?', data);
    // });
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

      layers: [
        // new TileLayer({
        //   source: new OSM()
        // })
      ],
      controls: []
    });

    const basemapEnum = 'ArcGIS:Streets';
    const apiKey = import.meta.env.VITE_ARC_GIS_API_KEY;

    const layer = new MaplibreLayer({
      url: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`
    });
    layer.attachToMap(map);

    const geoJsonFeatures = villages
      .filter((village) => village.tags['is_in:province'] === 'DKI Jakarta')
      .map((village) => {
        const geometry = {
          type: 'Polygon',
          coordinates: [
            village.members
              .filter((member) => member.role === 'outer')
              .flatMap((member) =>
                member.geometry.map((point) => [point.lon, point.lat])
              )
          ]
        };

        return {
          type: 'Feature',
          geometry,
          properties: village.tags
        };
      });

    const geoJson = {
      type: 'FeatureCollection',
      features: geoJsonFeatures
    };

    // Create a vector source from the GeoJSON data
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geoJson, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
    });

    // Create a vector layer with a simple stroke style
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: '#00a5b1',
          width: 1
        })
        // fill: new Fill({
        //   color: '#ff9090'
        // })
      })
    });

    // Add the vector layer to the map
    map.addLayer(vectorLayer);

    // function createKebonJerukPolygons() {
    //   const polygon = new Polygon(kebonJerok.members.);
    // }

    function createJakartaBoundingBoxLayer() {
      // Bounding box coordinates
      const jakartaBbox = [-6.3744575, -6.071689, 106.677916, 106.997127];

      // Convert the bounding box coordinates to map projection (EPSG:3857)
      const bottomLeft = fromLonLat([jakartaBbox[2], jakartaBbox[0]]);
      const topLeft = fromLonLat([jakartaBbox[2], jakartaBbox[1]]);
      const topRight = fromLonLat([jakartaBbox[3], jakartaBbox[1]]);
      const bottomRight = fromLonLat([jakartaBbox[3], jakartaBbox[0]]);

      // Create a polygon geometry for the bounding box
      const polygon = new Polygon([
        [bottomLeft, topLeft, topRight, bottomRight, bottomLeft]
      ]);

      // Create a feature with the polygon geometry
      const feature = new Feature({ geometry: polygon });

      // Create a vector source with the feature
      const vectorSource = new VectorSource({
        features: [feature]
      });

      // Create a vector layer with a simple stroke style
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: '#736bed',
            width: 3
          })
        })
      });

      return vectorLayer;
    }

    // map.addLayer(createJakartaBoundingBoxLayer());

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
