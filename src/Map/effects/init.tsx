import { useEffect } from 'react';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';
import { Map, View } from 'ol';
import {
  JAKARTA_CENTER_COORDINATES,
  MAPLIBRE_LAYER_URL
} from '../../constants/coordinates';
import { useMapStore } from '../../store/map';

export function useInitMap({
  mapElement
}: {
  mapElement: React.RefObject<HTMLDivElement | null | undefined>;
}) {
  const { setMapInstance } = useMapStore();

  useEffect(() => {
    console.log('what are jktCoordinates?', JAKARTA_CENTER_COORDINATES);

    const initialMap = new Map({
      target: mapElement.current || undefined,
      view: new View({
        center: JAKARTA_CENTER_COORDINATES,
        zoom: 12,
        minZoom: 5
      }),

      layers: [],
      controls: []
    });

    const layer = new MaplibreLayer({ url: MAPLIBRE_LAYER_URL });
    layer.attachToMap(initialMap);

    setMapInstance(initialMap);

    return () => {
      initialMap?.setTarget(undefined);
    };
  }, []);
}
