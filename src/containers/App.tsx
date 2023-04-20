import React, { ReactElement, useState } from 'react';
import { MainMap } from '../map/MainMap';

function App(): ReactElement {
  const [count, setCount] = useState(0);

  return (
    <div style={{ width: '100%' }}>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="flex-1 h-full bg-gray-300 relative overflow-hidden">
          <MainMap />
        </div>

        <div className={sidebarStyles}>
          <header>
            <p>
              <button
                className="pt-1 pb-1 pl-2 pr-2 text-sm text-purple-100 bg-purple-400 rounded"
                onClick={() => setCount((count) => count + 1)}
              >
                count is: {count}
              </button>
            </p>
            <p className="pt-3 pb-3">Content here</p>
          </header>
        </div>
      </div>
    </div>
  );
}

export default App;

const sidebarStyles =
  'fixed inset-y-0 right-0 z-50 md:relative md:min-w-[400px] p-4 border shadow-xl border-gray-50 rounded-xl md:overflow-y-scroll hidden md:block animate-slide-in';
