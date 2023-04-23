// import { OverpassElement, overpass } from 'overpass-ts';
import {
  ExtendedTrainRoute,
  OverpassResponse,
  Station,
  Track,
  Train,
  // TrainRoute,
  TrainSchedule
} from '../types/railway';

import railwayDataJson from '../data/railways/railway-map-overpass.json';

// import trainSchedulesJson from '../data/trains/train-schedules-full.json';
// const trainSchedulesData = trainSchedulesJson as TrainSchedule[];

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

function transformRailwayData(data: any): {
  stations: Station[];
  tracks: Track[];
} {
  const stations: Station[] = [];
  const tracks: Track[] = [];

  data.elements.forEach((element: any) => {
    if (element.type === 'node' && element.tags?.railway === 'station') {
      stations.push({
        lat: element.lat,
        lon: element.lon,
        station_id: element.id.toString(),
        station_name: element.tags.name
      });
    } else if (element.type === 'way' && element.tags?.railway === 'rail') {
      const coordinates: Array<[number, number]> = element.nodes.map(
        (nodeId: number) => {
          const node = data.elements.find((el: any) => el.id === nodeId);
          return [node.lon, node.lat];
        }
      );

      tracks.push({ coordinates, osm_way_id: 'idk' });
    }
  });

  return { stations, tracks };
}

export async function combineData(): Promise<ExtendedTrainRoute[]> {
  const trains = [] as Train[];
  const trainSchedules = [] as TrainSchedule[];
  const railwayData = await fetchRailwayData();
  const stationMap: { [station_id: string]: Station } = {};
  const trainRoutes: { [train_id: string]: ExtendedTrainRoute } = {};

  // Create a map of station IDs to Station objects
  railwayData.stations.forEach((station: Station) => {
    stationMap[station.station_id] = station;
  });

  // Process the train schedules to build the train routes
  trainSchedules.forEach((schedule: TrainSchedule) => {
    if (!trainRoutes[schedule.train_id]) {
      const train = trains.find((t) => t.train_id === schedule.train_id);
      trainRoutes[schedule.train_id] = {
        ...train,
        stations: [],
        tracks: railwayData.tracks // Assuming all trains use the same tracks
      };
    }

    trainRoutes[schedule.train_id].stations.push(
      stationMap[schedule.station_id]
    );
  });

  return Object.values(trainRoutes);
}
