import { useRef } from 'react';

import 'ol/ol.css';

import { Map } from 'ol';
import { capitalizeWords } from './utils';
import { MapModeButton, POPUP_STYLES } from './styles';
import { useInitMap } from './effects/init';
import { usePopupMap } from './effects/popup';
import { useVectorLayers } from './effects/vectorLayers';
import { useAddVillages } from './effects/villages';
import { MapLayerName, useMapStore } from '../store/map';
import { useAddRailways } from './effects/railways';
import { ENABLE_CESIUM } from '../constants/flags';

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
    id: 'buildings',
    label: 'Jalan',
    icon: 'mingcute:building-3-fill'
  },
  {
    id: 'satellite',
    label: 'Satellite',
    icon: 'mingcute:camera-2-fill'
  }
];

export function MainMap() {
  const { mapInstance, activeLayers, setActiveLayers } = useMapStore();

  const mapElement = useRef<HTMLDivElement | null | undefined>();

  // state ref for onclick callback https://stackoverflow.com/a/60643670
  const mapRef = useRef<Map | undefined>();
  mapRef.current = mapInstance;

  // Init map:
  useInitMap({ mapElement });

  // Popups:
  const { popupData } = usePopupMap();

  // Add vector layers:
  useAddVillages();
  useAddRailways();

  // Display vector layers:
  useVectorLayers();

  return (
    <>
      <div
        ref={mapElement as React.MutableRefObject<HTMLDivElement>}
        style={{ width: '100%', height: ENABLE_CESIUM ? '50%' : '100%' }}
      ></div>

      {ENABLE_CESIUM && <div id="cesiumContainer"></div>}

      <div
        style={{ zIndex: 10000000 }}
        className="absolute top-0 inset-x-0 md:flex md:items-center md:justify-center m-8 rounded-md px-4 py-3"
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
