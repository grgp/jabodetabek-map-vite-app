// import { OverpassElement, overpass } from 'overpass-ts';
import { Station, Track, Train, TrainSchedule } from '../types/railway';

import railwayDataJson from '../data/railways/railway-map-overpass.json';
import { transformRailwayData } from './railwayTransforms';

const OVERPASS_JAKARTA_BOUNDING_BOX = '-6.4339,106.6356,-6.0816,107.1540';

export async function fetchRailwayData(): Promise<{
  stations: Station[];
  tracks: Track[];
}> {
  const query = `
    [out:json];
    (
      node["railway"="station"](${OVERPASS_JAKARTA_BOUNDING_BOX});
      way["railway"="rail"](${OVERPASS_JAKARTA_BOUNDING_BOX});
    );
    out body; >; out skel qt;
  `;

  try {
    // const data = await overpass(query);
    const data = railwayDataJson;

    // Transform the fetched data into the specified types
    return transformRailwayData(data);
  } catch (error: any) {
    throw new Error('Failed to fetch railway data: ' + error?.message);
  }
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
