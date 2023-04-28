// useStore.ts

import { Geometry } from 'ol/geom';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

import { create } from 'zustand';

export type VectorSourceAndLayer = {
  source: VectorSource<Geometry>;
  layer: VectorLayer<VectorSource<Geometry>>;
  color?: string;
  vectorSourceAndLayerId: string;
  // interactions?: Array<Modify | Translate | Transform>;
};

export type MapLayerName = 'villages' | 'railway' | 'buildings' | 'satellite';

export type MapState = {
  mapTilesMode: 'satellite' | 'traffic' | 'alternate';
  setMapTilesMode: (mode: 'satellite' | 'traffic' | 'alternate') => void;

  vectorSourceAndLayers: Record<string, VectorSourceAndLayer>;
  setVectorSourceAndLayers: (
    vectorSourceAndLayers: MapState['vectorSourceAndLayers']
  ) => void;

  activeLayers: Record<MapLayerName, boolean>;
  setActiveLayers: (activeLayers: MapState['activeLayers']) => void;

  vectorSourceAndLayerGroups: Record<string, string[]>;
  setVectorSourceAndLayerGroups: (
    vectorSourceAndLayerGroups: MapState['vectorSourceAndLayerGroups']
  ) => void;
};

export const useMapStore = create<MapState>((set) => ({
  mapTilesMode: 'satellite',
  setMapTilesMode: (mode) => set({ mapTilesMode: mode }),

  vectorSourceAndLayers: {},
  setVectorSourceAndLayers: (vectorSourceAndLayers) =>
    set({ vectorSourceAndLayers }),

  activeLayers: {
    villages: true,
    railway: true,
    buildings: true,
    satellite: true
  },
  setActiveLayers: (activeLayers) => set({ activeLayers }),

  vectorSourceAndLayerGroups: {},
  setVectorSourceAndLayerGroups: (vectorSourceAndLayerGroups) =>
    set({ vectorSourceAndLayerGroups })
}));
