import { Ion, Viewer, createOsmBuildings, Cartesian3, Math } from 'cesium';

import { Map } from 'ol';
import { useEffect } from 'react';
import { OLCS_ION_TOKEN } from '../../constants/tokens';
import {
  JAKARTA_CENTER_LATITUDE,
  JAKARTA_CENTER_LONGITUDE
} from '../../constants/coordinates';
import { useMapStore } from '../../store/map';

Ion.defaultAccessToken = OLCS_ION_TOKEN;

export function useInitCesiumReg3D() {
  const { mapInstance } = useMapStore();

  useEffect(() => {
    // const osmImageryProvider = new OpenStreetMapImageryProvider({
    //   url: 'https://a.tile.openstreetmap.org/'
    // });

    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.

    const viewer = new Viewer('cesiumContainer', {
      // terrainProvider: createWorldTerrain()
      // baseLayerPicker: new ImageryLayer(osmImageryProvider)
    });

    // Add Cesium OSM Buildings, a global 3D buildings layer.
    viewer.scene.primitives.add(createOsmBuildings());

    // Fly the camera to San Francisco at the given longitude, latitude, and height.
    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(
        JAKARTA_CENTER_LONGITUDE,
        JAKARTA_CENTER_LATITUDE,
        400
      ),
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
