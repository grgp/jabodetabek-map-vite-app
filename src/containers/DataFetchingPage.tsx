import * as React from 'react';
import { uniqBy } from 'lodash';
import { fetchJakarta } from '../map/fetches';
import { Village } from '../types/structure';
import CSVUploader from './CSVUploader';
import { Train, TrainSchedule } from '../types/unparsedStructures';

import trainsInJakarta from '../data/trains/trains-passing-jakarta.json';
import trainsInJakartaUnique from '../data/trains/trains-passing-jakarta-unique.json';

const buttonStyle =
  'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';

export function DataFetchingPage() {
  const [isFetchJakartaLoading, setIsFetchJakartaLoading] =
    React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <button
        className={buttonStyle}
        onClick={() => {
          setIsFetchJakartaLoading(true);

          fetchJakarta().then((data) => {
            setIsFetchJakartaLoading(false);
            console.log('fetchJakarta done', data);

            const uniqueFetchJakarta = uniqBy(
              data.villages,
              'id'
            ) as any as Village[];
            console.log('uniqueFetchJakarta', uniqueFetchJakarta);

            const uniqueFetchOnlyJakarta = uniqueFetchJakarta.filter(
              (village) =>
                village.tags['is_in:province'] === 'DKI Jakarta' ||
                village.tags.wikipedia?.includes('Tangerang')
            );
            console.log(
              'uniqueFetchOnlyJakartaTangerang',
              uniqueFetchOnlyJakarta
            );
          });
        }}
      >
        {isFetchJakartaLoading ? 'Loading...' : 'Fetch Jakarta'}
      </button>

      <button
        className={buttonStyle}
        onClick={() => {
          // Get unique trains
          const uniqueTrains = uniqBy(trainsInJakarta, 'train_id');

          console.log('what are non-uniqueTrains', trainsInJakarta);
          console.log('what are uniqueTrains', uniqueTrains);
        }}
      >
        Get Unique Trains
      </button>

      <button
        className={buttonStyle}
        onClick={() => {
          async function fetchTrainSchedules(trains: Train[]): Promise<void> {
            const batchSize = 3;

            const schedules: TrainSchedule[] = [];

            console.log('Downloading schedules...');

            for (let i = 0; i < trains.length; i += batchSize) {
              const batch = trains.slice(i, i + batchSize);
              for (const train of batch) {
                const url = `https://api-partner.krl.co.id/krlweb/v1/schedule-train?trainid=${train.train_id}`;
                const response = await fetch(url);
                const data = await response.json();

                schedules.push(data);
              }

              console.log('Downloaded #', i + batchSize, ' of schedules...');

              await new Promise((resolve) => setTimeout(resolve, 4000));

              if (i % 100 === 0) {
                console.log('Current schedules in ' + i, schedules);
              }
            }

            console.log('Total schedules:', schedules);
          }

          fetchTrainSchedules(trainsInJakartaUnique as any);
        }}
      >
        Fetch Train Schedules in Jakarta
      </button>

      <CSVUploader />
    </div>
  );
}
