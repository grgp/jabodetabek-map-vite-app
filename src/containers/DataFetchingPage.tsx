import * as React from 'react';
import { fetchJakarta } from '../map/fetches';

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
          });
        }}
      >
        {isFetchJakartaLoading ? 'Loading...' : 'Fetch Jakarta'}
      </button>
      <button className={buttonStyle} onClick={() => {}}>
        Fetch Data 2
      </button>
    </div>
  );
}
