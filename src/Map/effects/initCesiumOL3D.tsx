// import * as Cesium from 'cesium';
// window.CESIUM_BASE_URL = JSON.stringify('');
// window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
// import 'cesium/Build/Cesium/Widgets/widgets.css';

import { Map } from 'ol';
import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import OLCesium from 'olcs/src/olcs/OLCesium';

(window as any).Cesium = Cesium; // expose Cesium to the OL-Cesium library

export function useInitCesiumOL3D({
  mapInstance
}: {
  mapInstance?: Map;
  count: number;
}) {
  const ol3dRef = useRef<any | undefined>(undefined);

  useEffect(() => {
    if (mapInstance) {
      console.log('am i called for olcesium');
      // Only these are really required
      setTimeout(() => {
        // @ts-ignore
        const ol3d = new OLCesium({
          map: mapInstance,
          time: () => Cesium.JulianDate.now(),
          target: 'cesiumContainer'
        });
        ol3d.setEnabled(true);
        ol3dRef.current = ol3d;

        console.log('what is ol3d');

        ol3d.enableAutoRenderLoop();
      }, 5000);
    }

    return () => {
      if (ol3dRef?.current) {
        // ol3dRef?.current.setEnabled(false);
      }
    };
  }, [mapInstance]);
}
