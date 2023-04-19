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
