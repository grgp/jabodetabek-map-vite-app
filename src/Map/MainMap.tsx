import { useRef, useState } from 'react';

import 'ol/ol.css';
import { Map } from 'ol';

import { capitalizeWords } from './utils';
import { POPUP_STYLES } from './styles';
import { useInitMap } from './effects/init';
import { usePopupMap } from './effects/popup';
import { useVectorLayers } from './effects/vectorLayers';
import { useAddVillages } from './effects/villages';

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

      <div
        style={{ zIndex: 10000000 }}
        className="absolute bottom-0 inset-x-0 bg-white shadow-lg md:flex md:items-center md:justify-center m-4 rounded-md px-4 py-3 shadow-2xl"
      >
        <div className="w-full px-4 py-6 md:p-0">
          <h2 className="text-lg font-medium mb-4">My Panel Header</h2>
          <div className="flex space-x-2 mb-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
              Button 1
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-md">
              Button 2
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md">
              Button 3
            </button>
          </div>
          <p>This is some panel content.</p>
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
