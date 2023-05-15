import React from 'react';
import ColorUtils from 'color';
import { Entity, EntityDescription, PolygonGraphics } from 'resium';
import { Cartesian3, Color } from 'cesium';
import { Polygon } from 'ol/geom';
import { VillageFullData } from '../../types/structure';
import { villages } from '../../data';
import { villagesPopsData } from '../../data';
import { randomMixColor, randomSaturationLightnessColor } from './utils';
import { POPUP_STYLES, getColorFromDensity } from '../styles';
import { capitalizeWords } from '../utils';

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

export const VillageEntities: React.FC<{ polygonEntity: any }> = ({
  polygonEntity
}) => {
  const villageData = displayedVillagesOLCoordinates;

  console.log('what are villageData', villageData);

  return (
    <>
      {villageData.map((data, index) => {
        const coordinates = data.coordinates.map((coord) => [
          coord[1],
          coord[0]
        ]);

        // console.log('what are coordinates in villages', coordinates);

        const popData =
          villagesPopsData[data.village.tags?.name?.toUpperCase()];

        if (!popData) {
          return;
        }

        const population = popData.total_population;
        const density = population / data.polygonArea;
        const height = density / 100000;

        const polygonHierarchy = Cartesian3.fromDegreesArray(
          coordinates.flat()
        ) as any;

        // console.log('what is polygonHierarchy', {
        //   coordFlat: coordinates.flat()
        //   // polygonHierarchy,
        //   // population,
        //   // height
        // });

        return (
          <Entity
            key={index}
            ref={(element) => {
              if (element) {
                polygonEntity.merge(element.cesiumElement);
              }
            }}
          >
            <EntityDescription>
              <div style={{ minHeight: 40 }}>
                <div>
                  <strong>{capitalizeWords(data.village.tags?.name)}</strong>
                  <div>Population: {population}</div>
                  <div>Density: {(density / 10000000).toFixed(2)} * 10^7</div>
                </div>
              </div>
            </EntityDescription>
            <PolygonGraphics
              hierarchy={polygonHierarchy}
              material={Color.fromCssColorString(
                randomSaturationLightnessColor([40, 60], [40, 50])
              )}
              extrudedHeight={height}
            />
          </Entity>
        );
      })}
    </>
  );
};
