import { useEffect, useState } from 'react';

import Color from 'color';
import { Feature, Overlay } from 'ol';
import { Style, Stroke, Fill } from 'ol/style';
import 'ol/ol.css';
import { Village, VillagePopData } from '../../types/structure';
import { villagesPopsData } from '../../data';
import { defaultStyleFunction } from '../styles';
import { useMapStore } from '../../store/map';

let hoveredFeature: Feature | null = null;

export function usePopupMap() {
  const { mapInstance } = useMapStore();

  const [popupData, setPopupData] = useState<{
    data: Village;
    popData?: VillagePopData;
    coordinate: number[];
    polygonArea: number;
  } | null>(null);

  // Add a popup overlay to the map
  useEffect(() => {
    const popup = new Overlay({
      element: document.getElementById('popup')!,
      positioning: 'bottom-center',
      offset: [0, -10],
      stopEvent: true
    });

    if (mapInstance) {
      mapInstance.on('pointermove', (event) => {
        const feature = mapInstance.forEachFeatureAtPixel(
          event.pixel,
          (feature: any) => feature
        );

        if (feature) {
          // console.log('on pointermove', event, feature);
          const village = feature.get('villageData') as Village;
          const polygonArea = feature.get('polygonArea') as number;

          if (
            hoveredFeature?.get('villageData').tags.name !== village.tags.name
          ) {
            // Places the popup just to the right and down of cursor
            const popupElement = document.getElementById('popup');
            if (popupElement) {
              popupElement.style.left = `${event.originalEvent.clientX + 16}px`;
              popupElement.style.top = `${event.originalEvent.clientY + 16}px`;
            }
          }

          if (hoveredFeature) {
            // Reset the style of the previously hovered feature
            hoveredFeature?.setStyle(defaultStyleFunction);
            hoveredFeature = null;
          }

          setPopupData({
            data: village,
            popData: villagesPopsData[village.tags?.name?.toUpperCase()],
            coordinate: event.coordinate,
            polygonArea
          });

          feature.setStyle(
            new Style({
              stroke: new Stroke({
                color: Color('#ffffff').alpha(0.95).toString(),
                width: 4
              }),
              fill: new Fill({
                color: Color('#ff880a').alpha(0.85).toString()
              })
            })
          );

          hoveredFeature = feature;
        } else {
          setPopupData(null);
        }
      });

      mapInstance.addOverlay(popup);
    }

    return () => {
      if (mapInstance) {
        mapInstance.removeOverlay(popup);
      }
    };
  }, [mapInstance]);

  return { popupData };
}
