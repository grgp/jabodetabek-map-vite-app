export async function fetchBoundaries(): Promise<any> {
  const nominatimUrl =
    'https://nominatim.openstreetmap.org/search?city=Jakarta&country=Indonesia&polygon_geojson=1&format=json&limit=50';
  const response = await fetch(nominatimUrl);
  const data = await response.json();

  const boundaries = data.filter(
    (item: any) => true
    // item.osm_type === 'relation' &&
    // item.type === 'boundary' &&
    // item.class === 'boundary' &&
    // item.admin_level === '5'
  );

  return boundaries;
}

async function fetchJakartaBoundingBox(): Promise<
  [number, number, number, number]
> {
  const nominatimUrl =
    'https://nominatim.openstreetmap.org/search?city=Jakarta&country=Indonesia&format=json&limit=1';
  const response = await fetch(nominatimUrl);
  const data = await response.json();
  const bbox = data[0].boundingbox.map((coord: string) =>
    parseFloat(coord)
  ) as [number, number, number, number];
  return bbox;
}

async function fetchVillagesInJakarta(
  bbox: [number, number, number, number]
): Promise<any> {
  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  const query = `
      [out:json];
      (
        node["place"="village"](${bbox[0]},${bbox[2]},${bbox[1]},${bbox[3]});
        way["place"="village"](${bbox[0]},${bbox[2]},${bbox[1]},${bbox[3]});
        relation["place"="village"](${bbox[0]},${bbox[2]},${bbox[1]},${bbox[3]});
      );
      out center;
    `;
  const response = await fetch(overpassUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `data=${encodeURIComponent(query.trim())}`
  });
  const data = await response.json();
  return data.elements;
}

export async function fetchJakarta(): Promise<any> {
  const jakartaBbox = await fetchJakartaBoundingBox();
  const villages = await fetchVillagesInJakarta(jakartaBbox);

  return { villages };
}
