type GeoJSONType = 'FeatureCollection';

type CRSName = 'EPSG:3857';

type GeometryType = 'Polygon';

interface CRS {
  type: 'name';
  properties: {
    name: CRSName;
  };
}

interface Transform {
  originPosition: 'upperLeft';
  scale: [number, number];
  translate: [number, number];
}

interface Geometry {
  type: GeometryType;
  coordinates: Array<Array<[number, number]>>;
}

interface Properties {
  OBJECTID_1: number;
  WADMRT: string; // '012';
  WADMRW: string; // '002';
  WADMKD: string; // 'BAMBU APUS';
  WADMKC: string; // 'CIPAYUNG';
  WADMKK: string; // 'JAKARTA TIMUR';
  KDGPUM: string; // '3175101006002012';
  KDFPUM: string; // '3175101006002';
  KDEPUM: string; // '3175101006';
  KDCPUM: string; // '317510';
  KDPKAB: string; // '3175';
  LUASWH: null;
  ID: string; // 'BAMBU APUSRW2RT12';
  JUMLAH_LAKI: number; // 397;
  JUMLAH_PEREMPUAN: number; // 384;
  TOTAL_PENDUDUK: number; // 781;
  OBJECTID: number; // 399;
  LUAS_RT: number; // 0.05634993;
  KEPADATAN: number; // 13859.82147886;
  Shape__Area: number; // 56366.149573015;
  Shape__Length: number; // 1007.0716973424501;
}

export interface RukunTetanggaFeature {
  type: 'Feature';
  id: number;
  geometry: Geometry;
  properties: Properties;
}

export interface RukunTetanggaGeoJSON {
  type: GeoJSONType;
  crs: CRS;
  transform: Transform;
  features: RukunTetanggaFeature[]; // might be undefined from the API
}
