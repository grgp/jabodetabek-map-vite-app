import { Coordinate } from 'ol/coordinate';
import { Polygon } from 'ol/geom';

export type Village = {
  type: 'relation';
  id: 10989417;
  bounds: {
    minlat: number;
    minlon: number;
    maxlat: number;
    maxlon: number;
  };
  members: MemberItem[];
  tags: {
    admin_level: '4' | '5' | '6';
    boundary: 'administrative';
    name: string; // ex: 'Pondok Aren';
    type: 'boundary';
    wikidata: string; // ex: 'Q3663172';
    wikipedia: string; // ex: 'id:Pondok Aren, Tangerang Selatan';
    ['is_in:province']: string;
  };
};

export type MemberItem = {
  type: 'way';
  ref: number; // ex: 319515822;
  role: 'outer';
  geometry: Array<{
    lat: number;
    lon: number;
  }>;
};

export type VillageFullData = {
  village: Village;
  coordinates: Coordinate[];
  polygon: Polygon; // ol.Polygon
  polygonArea: number;
};

export type VillagePopData = {
  nama_kelurahan: string;
  nama_kecamatan: string;
  nama_kabupaten: string;
  nama_provinsi: string;
  occupations: Record<string, number>;
  occupation_groups: Record<string, number>;
  total_population: number;
};
