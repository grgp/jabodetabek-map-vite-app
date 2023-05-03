import {
  CameraFlyTo,
  Viewer,
  Entity,
  PolygonGraphics,
  InfoBox,
  EntityDescription
} from 'resium';
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

      console.log('what is', { pickedObject });
      if (pickedObject && pickedObject.id === polygonEntity) {
        // console.log('what are', { pickedObject, polygonEntity });
        const entity = pickedObject.id;
        const description = entity.description.getValue();
        // console.log('what is description', description);
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
      <InfoBox selectedEntity={selectedEntity} />
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
      <VillageEntities polygonEntity={polygonEntity} />
    </Viewer>
  );
}

export default CesiumMap;

const CustomInfoBox = ({ entity }: any) => {
  if (!entity || !entity.description) return null;

  const info = JSON.parse(entity.description.getValue());

  return (
    <div className="info-box">
      <h3>{info.title}</h3>
      <p>{info.content}</p>
    </div>
  );
};
