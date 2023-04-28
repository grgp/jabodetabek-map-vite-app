// import * as Cesium from 'cesium';
// window.CESIUM_BASE_URL = JSON.stringify('');
// window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
// import 'cesium/Build/Cesium/Widgets/widgets.css';

import { Map } from 'ol';
import { useEffect } from 'react';
import OLCesium from 'olcs/src/olcs/OLCesium';

console.log('what is OLCSeuuius', OLCesium);

export function useInitCesiumOL3D({ mapInstance }: { mapInstance?: Map }) {
  useEffect(() => {
    if (mapInstance) {
      const ol3d = new OLCesium({ map: mapInstance });
      ol3d.setEnabled(true);
    }

    // return () => {
    //   ol3d.setEnabled(false);
    // };
  }, [mapInstance]);
}
