import { Map } from 'ol';
import { MapState, useMapStore } from '../../store/map';
import { useEffect } from 'react';
import { Village } from '../../types/structure';

export function useVectorLayers({
  mapInstance
}: {
  mapInstance: Map | undefined;
}) {
  const { vectorSourceAndLayers } = useMapStore();

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
}
