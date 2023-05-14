import { CameraFlyTo, Viewer, Entity, PolygonGraphics } from 'resium';
import { VillageEntities } from './resium/VillageEntities';
import {
  Cartesian3,
  Color,
  ShadowMode,
  ScreenSpaceEventType,
  Entity as CesiumEntity
} from 'cesium';
import { useEffect, useRef, useState } from 'react';
import { randomMixColor, splitBigRectangle } from './resium/utils';
import { RukunTetanggaEntities } from './resium/RukunTetanggaEntities';

const rectangles = splitBigRectangle(
  [
    106.826024, -6.192291, 106.826024, -6.222975, 106.863187, -6.222975,
    106.863187, -6.192291
  ],
  8,
  6
);

function CesiumMap() {
  const viewerRef = useRef<any>(null);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const polygonEntity = new CesiumEntity();

  useEffect(() => {
    if (!viewerRef.current) return;

    const viewer = (viewerRef.current as any).cesiumElement;
    const screenSpaceEventHandler = viewer.screenSpaceEventHandler;

    function onMouseMove({ endPosition, ...rest }: any) {
      // console.log('what is onMouseMove', endPosition, rest);

      const pickedObject = viewer.scene.pick(endPosition);

      if (pickedObject && pickedObject.id === polygonEntity) {
        setSelectedEntity(polygonEntity);
      } else {
        setSelectedEntity(null);
      }
    }

    screenSpaceEventHandler.setInputAction(
      onMouseMove,
      ScreenSpaceEventType.MOUSE_MOVE
    );

    return () => {
      screenSpaceEventHandler.removeInputAction(
        ScreenSpaceEventType.MOUSE_MOVE
      );
    };
  }, [viewerRef, polygonEntity]);

  return (
    <Viewer full shadows ref={viewerRef}>
      <CustomInfoBox entity={selectedEntity} />
      <CameraFlyTo
        destination={Cartesian3.fromDegrees(106.84513, -6.20876, 50000)}
        duration={0}
      />
      {false &&
        rectangles.map((coordinates, idx) => (
          <Entity key={JSON.stringify(coordinates)}>
            <PolygonGraphics
              shadows={ShadowMode.ENABLED}
              hierarchy={Cartesian3.fromDegreesArray(coordinates)}
              // material={ResiumColor.RED.withAlpha(0.6)}
              material={Color.fromCssColorString(randomMixColor())}
              extrudedHeight={200 + Math.random() * 1000}
            />
          </Entity>
        ))}
      {/* <VillageEntities polygonEntity={polygonEntity} /> */}
      <RukunTetanggaEntities polygonEntity={polygonEntity} />
    </Viewer>
  );
}

export default CesiumMap;

const CustomInfoBox = ({ entity }: any) => {
  if (!entity || !entity.description) return null;

  const info = JSON.parse(entity.description.getValue());

  return (
    <div style={{ height: 'auto', maxWidth: 100 }}>
      <h5>{info.title}</h5>
      <div>{info.content}</div>
    </div>
  );
};
