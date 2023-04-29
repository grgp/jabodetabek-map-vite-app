import { useEffect } from 'react';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';
import { Map, View } from 'ol';
import {
  JAKARTA_CENTER_COORDINATES,
  MAPLIBRE_LAYER_URL
} from '../../constants/coordinates';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import { fromLonLat } from 'ol/proj';

const OVERPASS_JAKARTA_BOUNDING_BOX = '-6.4339,106.6356,-6.0816,107.1540';

// Parse the bounding box string into an array
const bboxCoords = OVERPASS_JAKARTA_BOUNDING_BOX.split(',').map((coord) =>
  parseFloat(coord)
);

// Create an array of coordinates for the square
const squareCoords = [
  [bboxCoords[1], bboxCoords[0]],
  [bboxCoords[1], bboxCoords[2]],
  [bboxCoords[3], bboxCoords[2]],
  [bboxCoords[3], bboxCoords[0]],
  [bboxCoords[1], bboxCoords[0]]
];

// Transform the coordinates to the map's projection
const squareCoordsTransformed = squareCoords.map((coord) => fromLonLat(coord));

// Create a polygon feature using the square coordinates
const squarePolygon = new Polygon([squareCoordsTransformed]);
const squareFeature = new Feature(squarePolygon);

// Create a vector source and layer, and add the feature to the source
const vectorSource = new VectorSource({ features: [squareFeature] });
const vectorLayer = new VectorLayer({ source: vectorSource });

export function useInitMap({
  mapElement,
  setMapInstance
}: {
  mapElement: React.RefObject<HTMLDivElement | null | undefined>;
  setMapInstance: React.Dispatch<React.SetStateAction<Map | undefined>>;
}) {
  useEffect(() => {
    console.log('what are jktCoordinates?', JAKARTA_CENTER_COORDINATES);

    const initialMap = new Map({
      target: mapElement.current || undefined,
      view: new View({
        center: JAKARTA_CENTER_COORDINATES,
        zoom: 12,
        minZoom: 5
      }),

      layers: [
        // vectorLayer
        /* new TileLayer({ source: new OSM() }) */
      ],
      controls: []
    });

    const layer = new MaplibreLayer({ url: MAPLIBRE_LAYER_URL });
    layer.attachToMap(initialMap);

    setMapInstance(initialMap);

    return () => {
      initialMap?.setTarget(undefined);
    };
  }, []);
}
