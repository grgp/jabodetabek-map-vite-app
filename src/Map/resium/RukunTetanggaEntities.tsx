import React from 'react';
import { Entity, EntityDescription, PolygonGraphics } from 'resium';
import { Cartesian3, Color } from 'cesium';

import { rukunTetanggaData } from '../../data';
import { randomSaturationLightnessColor } from './utils';
import { capitalizeWords } from '../utils';

export const RukunTetanggaEntities: React.FC<{ polygonEntity: any }> = ({
  polygonEntity
}) => {
  console.log('what are villageData', rukunTetanggaData);

  return (
    <>
      {Object.values(rukunTetanggaData).flatMap((data, index) => {
        return data.features.map(
          (feature) => {
            const coordinates = feature.geometry.coordinates.flatMap((coord) =>
              coord
                .filter(
                  (c) => typeof c[0] === 'number' && typeof c[1] === 'number'
                )
                .map((c) => [c[1], c[0]])
            );

            // console.log('what are coordinates in RT', coordinates);

            // const popData =
            //   data.

            // if (!popData) {
            //   return;
            // }

            // const population = popData.total_population;
            // const density = population / data.polygonArea;
            // const height = density / 100000;

            const height = Math.random() * 1000 + 500;

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
                      {/* <strong>{capitalizeWords(data.village.tags?.name)}</strong> */}
                      {/* <div>Population: {population}</div> */}
                      {/* <div>Density: {(density / 10000000).toFixed(2)} * 10^7</div> */}
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
          }

          // .map((c) => c)
        );
      })}
    </>
  );
};
