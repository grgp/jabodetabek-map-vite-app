import { CameraFlyTo, Viewer, Entity, PolygonGraphics } from 'resium';
import { VillageEntities } from './resium/VillageEntities';
import { Cartesian3, Color } from 'cesium';
import { useEffect, useState } from 'react';
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
  console.log('what are rectangles', rectangles);

  return (
    <Viewer full>
      <CameraFlyTo
        destination={Cartesian3.fromDegrees(106.84513, -6.20876, 50000)}
        duration={0}
      />
      {false &&
        rectangles.map((coordinates) => (
          <Entity key={JSON.stringify(coordinates)}>
            <PolygonGraphics
              hierarchy={Cartesian3.fromDegreesArray(coordinates)}
              // material={ResiumColor.RED.withAlpha(0.6)}
              material={Color.fromCssColorString(randomMixColor())}
              extrudedHeight={200 + Math.random() * 1000}
            />
          </Entity>
        ))}
      <VillageEntities />
    </Viewer>
  );
}

export default CesiumMap;
