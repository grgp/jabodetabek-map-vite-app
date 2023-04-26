import { useRef, useState } from 'react';

import 'ol/ol.css';
import { Map } from 'ol';

import { capitalizeWords } from './utils';
import { MapModeButton, POPUP_STYLES } from './styles';
import { useInitMap } from './effects/init';
import { usePopupMap } from './effects/popup';
import { useVectorLayers } from './effects/vectorLayers';
import { useAddVillages } from './effects/villages';
import { MapLayerName, useMapStore } from '../store/map';

const BUTTONS: Array<{ id: MapLayerName; label: string; icon: string }> = [
  {
    id: 'villages',
    label: 'Kelurahan',
    icon: 'mingcute:version-fill'
  },
  {
    id: 'railway',
    label: 'Railway',
    icon: 'mingcute:train-2-fill'
  },
  {
    id: 'streets',
    label: 'Jalan',
    icon: 'mingcute:road-fill'
  },
  {
    id: 'satellite',
    label: 'Satellite',
    icon: 'mingcute:camera-2-fill'
  }
];

export function MainMap() {
  const [mapInstance, setMapInstance] = useState<Map | undefined>(undefined);

  // Pull refs:
  const mapElement = useRef<HTMLDivElement | null | undefined>();

  // Create state ref that can be accessed in OpenLayers onclick callback
  // https://stackoverflow.com/a/60643670
  const mapRef = useRef<Map | undefined>();
  mapRef.current = mapInstance;

  // Init map:
  useInitMap({ mapElement, setMapInstance });

  // Popups:
  const { popupData } = usePopupMap({ mapInstance });

  // Add villages layer:
  useAddVillages({ mapInstance });

  // Display vector layers:
  useVectorLayers({ mapInstance });

  const { activeLayers, setActiveLayers } = useMapStore();

  return (
    <>
      <div
        ref={mapElement as React.MutableRefObject<HTMLDivElement>}
        style={{ width: '100%', height: '100%' }}
      ></div>

      <div
        style={{ zIndex: 10000000 }}
        className="absolute bottom-0 inset-x-0 md:flex md:items-center md:justify-center m-4 rounded-md px-4 py-3"
      >
        <div className="flex">
          {BUTTONS.map((item) => (
            <MapModeButton
              key={item.id}
              icon={item.icon}
              isSelected={activeLayers[item.id]}
              onClick={() => {
                setActiveLayers({
                  ...activeLayers,
                  [item.id]: !activeLayers[item.id]
                });
              }}
            />
          ))}
        </div>
      </div>

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
