// import * as Cesium from 'cesium';
// window.CESIUM_BASE_URL = JSON.stringify('');
// window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
// import 'cesium/Build/Cesium/Widgets/widgets.css';

import { Map, View } from 'ol';
import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import OLCesium from 'olcs/src/olcs/OLCesium';
import { fromLonLat } from 'ol/proj';
import { XYZ } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import {
  JAKARTA_CENTER_LATITUDE,
  JAKARTA_CENTER_LONGITUDE
} from '../../constants/coordinates';

window.Cesium = Cesium; // expose Cesium to the OL-Cesium library

export function useInitCesiumOL3D({ mapInstance }: { mapInstance?: Map }) {
  const ol3dRef = useRef<any | undefined>(undefined);

  useEffect(() => {
    if (mapInstance) {
      const tileWorldImagery = new TileLayer({
        source: new XYZ({
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          crossOrigin: 'Anonymous'
        })
      });

      let map = new Map({
        target: 'map',
        projection: 'EPSG:3857',
        layers: [tileWorldImagery],
        view: new View({
          center: fromLonLat([
            JAKARTA_CENTER_LONGITUDE,
            JAKARTA_CENTER_LATITUDE
          ]),
          zoom: 4,
          minZoom: 2
        })
      });

      // Only these are really required
      setTimeout(() => {
        const ol3d = new OLCesium({
          map: mapInstance,
          time: () => Cesium.JulianDate.now(),
          target: 'cesiumContainer'
        });
        ol3d.setEnabled(true);
        ol3dRef.current = ol3d;
      }, 3000);
    }

    return () => {
      if (ol3dRef?.current) {
        ol3dRef?.current.setEnabled(false);
      }
    };
  }, [mapInstance]);
}
