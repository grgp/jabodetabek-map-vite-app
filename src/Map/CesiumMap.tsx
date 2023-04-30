import { CameraFlyTo, Viewer, Entity, PolygonGraphics } from 'resium';
import { VillageEntities } from './resium/VillageEntities';
import { Cartesian3 } from 'cesium';
import { useEffect, useState } from 'react';

function CesiumMap() {
  return (
    <Viewer full>
      <CameraFlyTo
        destination={Cartesian3.fromDegrees(106.84513, -6.20876, 50000)}
        duration={0}
      />
      <Entity>
        <PolygonGraphics
          key="hehe"
          hierarchy={Cartesian3.fromDegreesArray([
            106.826024, -6.192291, 106.826024, -6.222975, 106.863187, -6.222975,
            106.863187, -6.192291
          ])}
          // material={ResiumColor.RED.withAlpha(0.6)}
          extrudedHeight={2000}
        />
      </Entity>
      {/* <VillageEntities /> */}
    </Viewer>
  );
}

export default CesiumMap;
