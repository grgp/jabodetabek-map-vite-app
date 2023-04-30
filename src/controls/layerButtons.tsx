import { MapLayerName } from '../store/map';

export const LAYER_BUTTONS: Array<{
  id: MapLayerName;
  label: string;
  icon: string;
}> = [
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
