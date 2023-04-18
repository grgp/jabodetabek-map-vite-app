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

  let bbox = data[0].boundingbox.map((coord: string) => parseFloat(coord)) as [
    number,
    number,
    number,
    number
  ];

  console.log('what are jakartas bbox', bbox);
  const bboxOverride = [-6.491239, -5.994594, 106.577164, 107.101736] as [
    number,
    number,
    number,
    number
  ];

  const bboxOverrideSmaller = [-6.3744575, -6.071689, 106.677916, 106.997127] as [
    number,
    number,
    number,
    number
  ];

  bbox = bboxOverrideSmaller;

  return bbox;
}

async function fetchVillagesInJakarta(
  bbox: [number, number, number, number]
): Promise<any> {
  const numChunks = 15;
  const latDelta = (bbox[1] - bbox[0]) / numChunks;
  const lonDelta = (bbox[3] - bbox[2]) / numChunks;

  const overpassUrl = 'https://overpass-api.de/api/interpreter';

  const fetchVillageChunk = async (
    chunkBbox: [number, number, number, number]
  ): Promise<any> => {
    const query = `
      [out:json];
      (
          relation["boundary"="administrative"]["admin_level"="6"](${chunkBbox[0]},${chunkBbox[2]},${chunkBbox[1]},${chunkBbox[3]});
      );
      out geom;
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
  };

  const villageChunks = [];

  for (let i = 0; i < numChunks; i++) {
    for (let j = 0; j < numChunks; j++) {
      const chunkBbox: [number, number, number, number] = [
        bbox[0] + i * latDelta,
        bbox[0] + (i + 1) * latDelta,
        bbox[2] + j * lonDelta,
        bbox[2] + (j + 1) * lonDelta
      ];
      villageChunks.push(fetchVillageChunk(chunkBbox));
    }
  }

  const results = await Promise.all(villageChunks);
  const villages = results.flat();

  return villages;
}

export async function fetchJakarta(): Promise<any> {
  const jakartaBbox = await fetchJakartaBoundingBox();
  const villages = await fetchVillagesInJakarta(jakartaBbox);

  return { villages };
}
