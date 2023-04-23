import { useEffect, useRef, useState } from 'react';

import 'ol/ol.css';
import { Feature, Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke, Fill, Text } from 'ol/style';
import { Polygon } from 'ol/geom';

import { Village } from '../types/structure';
import { capitalizeWords } from './utils';
import { POPUP_STYLES, getColor } from './styles';
import Color from 'color';
import { StyleLike } from 'ol/style/Style';
import { FeatureLike } from 'ol/Feature';
import { useMapStore } from '../store/map';
import { useInitMap } from './effects/init';
import { villages, villagesPopsData } from '../data';
import { usePopupMap } from './effects/popup';

export function MainMap() {
  const [mapInstance, setMapInstance] = useState<Map | undefined>(undefined);

  const { vectorSourceAndLayers, setVectorSourceAndLayers } = useMapStore();

  // pull refs
  const mapElement = useRef<HTMLDivElement | null | undefined>();

  // create state ref that can be accessed in OpenLayers onclick callback
  // https://stackoverflow.com/a/60643670
  const mapRef = useRef<Map | undefined>();
  mapRef.current = mapInstance;

  // Init map:
  useInitMap({ mapElement, setMapInstance });

  const { popupData } = usePopupMap({ mapInstance });

  // Add villages layer:
  useEffect(() => {
    if (mapInstance) {
      const features = villages.map((village) => {
        const coordinates = village.members
          .filter((member) => member.role === 'outer')
          .flatMap((member) =>
            member.geometry.map((point) => fromLonLat([point.lon, point.lat]))
          );

        const polygon = new Polygon([coordinates]);
        const polygonArea = polygon.getArea();

        const feature = new Feature({
          geometry: polygon,
          villageData: village,
          polygonArea
        });
        return feature;
      });

      // Create a vector source from the features
      const vectorSource = new VectorSource({
        features
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: defaultStyleFunction
      });

      setVectorSourceAndLayers({
        villages: {
          source: vectorSource,
          layer: vectorLayer,
          vectorSourceAndLayerId: 'villages'
        }
      });
    }
  }, [mapInstance]);

  useEffect(() => {
    if (mapInstance) {
      Object.values(vectorSourceAndLayers).forEach(({ layer }) => {
        mapInstance.addLayer(layer);

        mapInstance.on('click', (event) => {
          const feature = mapInstance.forEachFeatureAtPixel(
            event.pixel,
            (feature) => feature
          );
          if (feature) {
            const village = feature.get('villageData') as Village;
            onClick(village);
          }
        });

        const onClick = (data: Village) => {
          console.log('Clicked on:', data);
          // Do something with the clicked village data
        };
      });
    }
  }, [mapInstance, vectorSourceAndLayers]);

  return (
    <>
      <div
        ref={mapElement as React.MutableRefObject<HTMLDivElement>}
        style={{ width: '100%', height: '100%' }}
      ></div>
      {popupData && (
        <div id="popup" className="ol-popup" style={POPUP_STYLES}>
          <div>
            <strong>{capitalizeWords(popupData.data.tags?.name)}</strong>
          </div>
          <div>{capitalizeWords(popupData.popData?.nama_kecamatan)}</div>
          <div>Population: {popupData.popData?.total_population}</div>
          <div style={{ fontSize: 8 }}>
            Polygon Area: {popupData.polygonArea}
          </div>
        </div>
      )}
    </>
  );
}

export const defaultStyleFunction: StyleLike = (feature: FeatureLike) => {
  const village = feature.get('villageData') as Village;
  const polygonArea = feature.get('polygonArea') as number;
  const villagePopData = villagesPopsData[village.tags?.name?.toUpperCase()];

  return new Style({
    stroke: new Stroke({
      color: Color('#3f97da').alpha(0.8).toString(),
      width: 2
    }),
    fill: new Fill({
      color: getColor(
        villagePopData ? villagePopData.total_population : -1,
        polygonArea
      )
    }),
    text: new Text({
      text: village.tags.name,
      scale: 1.1,
      font: 'sans-serif',
      fill: new Fill({
        color: '#000000'
      })
    })
  });
};
