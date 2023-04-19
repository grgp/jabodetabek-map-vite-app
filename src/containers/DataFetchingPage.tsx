import * as React from 'react';
import { uniqBy } from 'lodash';
import { fetchJakarta } from '../map/fetches';
import { Village } from '../types/structure';
import CSVUploader from './CSVUploader';

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

      <button className={buttonStyle} onClick={() => {}}>
        Fetch Data 2
      </button>

      <CSVUploader />
    </div>
  );
}
