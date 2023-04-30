import { CameraFlyTo, Viewer, Entity, PolygonGraphics } from 'resium';
import { VillageEntities } from './resium/VillageEntities';
import { Cartesian3 } from 'cesium';

function CesiumMap() {
  return (
    <Viewer full>
      <CameraFlyTo
        destination={Cartesian3.fromDegrees(106.84513, -6.20876, 50000)}
        duration={0}
      />
      <Entity>
        <PolygonGraphics
          hierarchy={Cartesian3.fromDegreesArray([
            106.806024, -6.182291, 106.806024, -6.232975, 106.863187, -6.232975,
            106.863187, -6.182291
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
