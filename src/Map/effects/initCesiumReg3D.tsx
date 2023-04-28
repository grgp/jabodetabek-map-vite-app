import {
  Ion,
  ImageryLayer,
  Viewer,
  createWorldTerrain,
  createOsmBuildings,
  Cartesian3,
  Math,
  OpenStreetMapImageryProvider
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

import { Map } from 'ol';
import { useEffect } from 'react';
import OLCesium from 'olcs/src/olcs/OLCesium';
import { OLCS_ION_TOKEN } from '../../constants/tokens';

console.log('what is OLCSeuuius', OLCesium);

Ion.defaultAccessToken = OLCS_ION_TOKEN;

export function useInitCesiumReg3D({ mapInstance }: { mapInstance?: Map }) {
  useEffect(() => {
    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    const osmImageryProvider = new OpenStreetMapImageryProvider({
      url: 'https://a.tile.openstreetmap.org/'
    });

    const viewer = new Viewer('cesiumContainer', {
      terrainProvider: createWorldTerrain()
      // baseLayerPicker: new ImageryLayer(osmImageryProvider)
    });

    // Add Cesium OSM Buildings, a global 3D buildings layer.
    viewer.scene.primitives.add(createOsmBuildings());

    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(-122.4175, 37.655, 400),
      orientation: {
        heading: Math.toRadians(0.0),
        pitch: Math.toRadians(-15.0)
      }
    });

    return () => {
      // Clear viewer from cesiumContainer
      viewer.destroy();
    };
  }, [mapInstance]);
}
