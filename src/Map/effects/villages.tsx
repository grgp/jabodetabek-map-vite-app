import { useEffect } from 'react';
import { Feature, Map } from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Polygon } from 'ol/geom';
import { villages } from '../../data';
import { useMapStore } from '../../store/map';
import { defaultStyleFunction } from '../styles';

export function useAddVillages({
  mapInstance
}: {
  mapInstance: Map | undefined;
}) {
  const { activeLayers, setVectorSourceAndLayers } = useMapStore();

  const isVillagesLayerActive = activeLayers.villages;

  useEffect(() => {
    if (!mapInstance) return;

    if (isVillagesLayerActive) {
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
    } else {
      // Remove villages layer
      const villagesLayer = Object.values(
        useMapStore.getState().vectorSourceAndLayers
      ).find(
        ({ vectorSourceAndLayerId }) => vectorSourceAndLayerId === 'villages'
      );

      if (villagesLayer) {
        mapInstance.removeLayer(villagesLayer.layer);
      }
    }
  }, [mapInstance, isVillagesLayerActive]);
}
