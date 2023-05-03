import React from 'react';
import ColorUtils from 'color';
import { Entity, PolygonGraphics } from 'resium';
import { Cartesian3, Color } from 'cesium';
import { Polygon } from 'ol/geom';
import { VillageFullData } from '../../types/structure';
import { villages } from '../../data';
import { randomMixColor, randomSaturationLightnessColor } from './utils';

const displayedVillagesOLCoordinates: VillageFullData[] = villages.map(
  (village) => {
    const coordinates = village.members
      .filter((member) => member.role === 'outer')
      .flatMap((member) =>
        member.geometry.map((point) => [point.lat, point.lon])
      );

    const polygon = new Polygon([coordinates]);
    const polygonArea = polygon.getArea();

    return { village, coordinates, polygon, polygonArea };
  }
);

export const VillageEntities = () => {
  const villageData = displayedVillagesOLCoordinates;

  console.log('what are villageData', villageData);

  return (
    <>
      {villageData.map((data, index) => {
        const coordinates = data.coordinates.map((coord) => [
          coord[1],
          coord[0]
        ]);
        const population = parseInt(data.village.tags.admin_level, 10);
        const density = population / data.polygonArea;
        const height = density / 30;

        const polygonHierarchy = Cartesian3.fromDegreesArray(
          coordinates.flat()
        ) as any;

        console.log('what is polygonHierarchy', {
          coordFlat: coordinates.flat()
          // polygonHierarchy,
          // population,
          // height
        });

        return (
          <Entity key={index}>
            <PolygonGraphics
              hierarchy={polygonHierarchy}
              material={Color.fromCssColorString(
                randomSaturationLightnessColor([30, 60], [40, 60])
              )}
              extrudedHeight={height}
            />
          </Entity>
        );
      })}
    </>
  );
};
