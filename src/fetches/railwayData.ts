import {
  Station,
  Track,
  Train,
  TrainRoute,
  TrainSchedule
} from '../types/railway';

const JAKARTA_BOUNDING_BOX = '106.6356,-6.4339,107.1540,-6.0816';

export async function fetchRailwayData(): Promise<TrainRoute[]> {
  const response = await fetch(
    `https://api.openrailwaymap.org/0.6.6/map?bbox=${JAKARTA_BOUNDING_BOX}&tags=railway`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch railway data');
  }

  const data = await response.json();

  console.log('what is fetchRailwayData data', data);

  // Transform the fetched data into the specified types
  return transformData(data);
}

export async function fetchTrainSchedules(trains: Train[]): Promise<void> {
  const batchSize = 4;

  const schedules: TrainSchedule[] = [];

  for (let i = 0; i < trains.length; i += batchSize) {
    const batch = trains.slice(i, i + batchSize);
    for (const train of batch) {
      const url = `https://api-partner.krl.co.id/krlweb/v1/schedule-train?trainid=${train.train_id}`;
      const response = await fetch(url);
      const data = await response.json();

      schedules.push(data);
    }

    await new Promise((resolve) => setTimeout(resolve, 3300));
  }
}

function transformData(data: any): TrainRoute[] {
  const trainRoutes: TrainRoute[] = [];
  const stations: Station[] = [];
  const tracks: Track[] = [];
  const nodes: { [id: string]: [number, number] } = {};

  data.elements.forEach((element: any) => {
    if (element.type === 'node') {
      nodes[element.id] = [element.lon, element.lat];

      if (element.tags?.['railway'] === 'station') {
        stations.push({
          lat: element.lat,
          lon: element.lon,
          station_id: element.id.toString(),
          station_name: element.tags['name']
        });
      }
    } else if (element.type === 'way' && element.tags?.['railway'] === 'rail') {
      const coordinates = element.nodes.map((nodeId: string) => nodes[nodeId]);

      tracks.push({
        osm_way_id: element.id.toString(),
        coordinates
      });
    }
  });

  // Further processing can be done here to create TrainRoute objects based on the fetched stations and tracks,
  // or you can modify the types and return the stations and tracks separately.

  return trainRoutes;
}
