import { useEffect } from 'react';

import { Feature, Map, View } from 'ol';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';
import 'ol/ol.css';

import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke } from 'ol/style';
import { Polygon } from 'ol/geom';

import data from '../data/final/villages-unique-368.json';
import { Village } from '../types/structure';

const villages = data as Village[];

export function MainMap() {
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
        zoom: 12,
        minZoom: 5
      }),

      layers: [
        /* new TileLayer({ source: new OSM() }) */
      ],
      controls: []
    });

    const basemapEnum = 'ArcGIS:Streets';
    const apiKey = import.meta.env.VITE_ARC_GIS_API_KEY;

    const layer = new MaplibreLayer({
      url: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`
    });
    layer.attachToMap(map);

    const features = villages
      .filter((village) => village.tags['is_in:province'] === 'DKI Jakarta')
      .map((village) => {
        const coordinates = village.members
          .filter((member) => member.role === 'outer')
          .flatMap((member) =>
            member.geometry.map((point) => fromLonLat([point.lon, point.lat]))
          );

        const polygon = new Polygon([coordinates]).getSimplifiedGeometry(-5000);
        const feature = new Feature({ geometry: polygon });
        return feature;
      });

    // Create a vector source from the features
    const vectorSource = new VectorSource({
      features
    });

    // Create a vector layer with a simple stroke style
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: '#0080e3',
          width: 2
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
  }, []);

  // <h1>Basic Map</h1>
  // <textarea>
  //   {JSON.stringify(villages.map((village) => village.tags.name))}
  // </textarea>

  return <div id="map" style={{ width: '100%', height: '100%' }}></div>;
}
