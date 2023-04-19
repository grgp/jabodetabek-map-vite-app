import { Feature } from 'ol';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';

import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke } from 'ol/style';
import { Polygon } from 'ol/geom';

export function createJakartaBoundingBoxLayer() {
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
