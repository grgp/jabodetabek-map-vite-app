import { Train, TrainSchedule } from '../types/unparsedStructures';

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
