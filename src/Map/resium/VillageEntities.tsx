import React from 'react';
import Color from 'color';
import { Entity, PolygonGraphics } from 'resium';
import { Cartesian3 } from 'cesium';
import { displayedVillages } from '../effects/villages';

export const VillageEntities = () => {
  const villageData = displayedVillages;

  return (
    <>
      {villageData.slice(0, 5).map((data, index) => {
        const coordinates = data.coordinates.map((coord) => [
          coord[1],
          coord[0]
        ]);
        const population = parseInt(data.village.tags.admin_level, 10);
        const height = population / data.polygonArea;

        const polygonHierarchy = Cartesian3.fromDegreesArray(
          coordinates.flat()
        ) as any;

        console.log('what is polygonHierarch', {
          polygonHierarchy,
          population,
          height
        });

        return (
          <Entity key={index}>
            <PolygonGraphics
              hierarchy={polygonHierarchy}
              // material={Color(`hsla(${Math.random() * 360}, 100%, 50%, 0.6)`)
              //   .rgb()
              //   .array()}
              extrudedHeight={height * 5000000000000}
            />
          </Entity>
        );
      })}
    </>
  );
};
