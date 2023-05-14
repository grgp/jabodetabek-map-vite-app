import data from '../data/final/villages-unique-jkt-262-minified.json';
import popsData from '../data/final/villages-pop-data-v1.json';
import rtData from '../data/pops/kependudukan-rt-geojson-two-groups.json';

import { Village, VillagePopData } from '../types/structure';
import { RukunTetanggaGeoJSON } from '../types/rukunTetangga';

const villages = data as Village[];
const villagesPopsData = popsData as unknown as Record<string, VillagePopData>;

export { villages, villagesPopsData };

export const rukunTetanggaData = rtData as Record<string, RukunTetanggaGeoJSON>;
