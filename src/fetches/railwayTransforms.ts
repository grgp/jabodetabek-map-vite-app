import {
  Station,
  Track,
  ExtendedTrainRoute,
  Train,
  TrainSchedule
} from '../types/railway';
import { fetchRailwayData } from './railwayData';

// import trainSchedulesJson from '../data/trains/train-schedules-full.json';
// const trainSchedulesData = trainSchedulesJson as TrainSchedule[];

export function transformRailwayData(data: any): {
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

export async function combineRailwayData(): Promise<ExtendedTrainRoute[]> {
  const trains = [] as Train[];
  const trainSchedules = [] as TrainSchedule[];
  const railwayData = await fetchRailwayData();

  console.log('railwayData', railwayData);

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
