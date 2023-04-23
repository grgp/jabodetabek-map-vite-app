import { useRef, useState } from 'react';

import 'ol/ol.css';
import { Map } from 'ol';

import { capitalizeWords } from './utils';
import { POPUP_STYLES } from './styles';
import { useInitMap } from './effects/init';
import { usePopupMap } from './effects/popup';
import { useVectorLayers } from './effects/vectorLayers';
import { useAddVillages } from './effects/villages';
import { Icon } from '@iconify/react';

const BUTTONS = [
  {
    id: 'vector-layers',
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

  return (
    <>
      <div
        ref={mapElement as React.MutableRefObject<HTMLDivElement>}
        style={{ width: '100%', height: '100%' }}
      ></div>

      {/* <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'rgba(255, 219, 195, 0.05)',
          zIndex: 999999999,
          top: 0
        }}
      /> */}

      <div
        style={{ zIndex: 10000000 }}
        className="absolute bottom-0 inset-x-0 md:flex md:items-center md:justify-center m-4 rounded-md px-4 py-3"
      >
        <div className="flex">
          {BUTTONS.map((item) => (
            <div
              key={item.id}
              style={{ background: '#fdffee', marginLeft: -16, fontSize: 44 }}
              className={`relative w-20 h-20 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform shadow-xl hover:scale-105 text-ac-black-orange hover:text-ac-orange hover:shadow-lg cursor-pointer`}
            >
              <Icon style={{ marginLeft: -2 }} icon={item.icon} />
            </div>
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
