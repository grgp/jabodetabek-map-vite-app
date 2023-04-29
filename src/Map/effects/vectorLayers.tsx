import { useMapStore } from '../../store/map';
import { useEffect } from 'react';
import { Village } from '../../types/structure';
import { usePrevious } from '../../utils/hooks';

export function useVectorLayers() {
  const { mapInstance, vectorSourceAndLayers } = useMapStore();

  const prevVectorSourceAndLayers = usePrevious(vectorSourceAndLayers);

  useEffect(() => {
    if (mapInstance) {
      // Remove previous layers
      Object.values(prevVectorSourceAndLayers).forEach(({ layer }) => {
        mapInstance.removeLayer(layer);
      });

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

    return () => {
      if (mapInstance) {
        Object.values(vectorSourceAndLayers).forEach(({ layer }) => {
          mapInstance.removeLayer(layer);
        });
      }
    };
  }, [mapInstance, vectorSourceAndLayers]);
}
