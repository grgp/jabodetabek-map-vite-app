export interface Station {
  lat: number;
  lon: number;
  station_id: string;
  station_name: string;
}

export interface TrainRoute {
  name: string;
  station_ids: Station[];
}

export interface Train {
  train_id: string;
  ka_name: string;
  route_name: string;
  dest: string;
  time_est: string;
  color: string;
  dest_time: string;
}

export interface TrainSchedule {
  train_id: string; // '5076B';
  ka_name: string; // 'BEKASI LINE';
  station_id: string; // 'KRI';
  station_name: string; // 'KRANJI';
  time_est: string; // '00:44:00';
  transit_station: boolean; // false;
  color: string; // '#0084D8';
  transit: string; // '';
}
