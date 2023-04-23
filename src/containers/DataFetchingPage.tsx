import * as React from 'react';
import { uniqBy } from 'lodash';
import { fetchJakarta } from '../fetches/villagesData';
import { Village } from '../types/structure';
import CSVUploader from './CSVUploader';
import { Train, TrainSchedule } from '../types/unparsedStructures';

import trainsInJakarta from '../data/trains/trains-passing-jakarta.json';
import trainsInJakartaUnique from '../data/trains/trains-passing-jakarta-unique.json';
import { Link } from 'react-router-dom';

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
          fetchTrainSchedules(trainsInJakartaUnique as any);
        }}
      >
        Fetch Train Schedules in Jakarta
      </button>

      <CSVUploader />

      <Link to="/">Go back to the homepage</Link>
    </div>
  );
}
