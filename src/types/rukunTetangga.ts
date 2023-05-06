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
  [key: string]: any;
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
  features: RukunTetanggaFeature[];
}
