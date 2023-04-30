import React, { ReactElement } from 'react';
import CesiumMap from '../map/CesiumMap';

function App(): ReactElement {
  return (
    <div style={{ width: '100%' }}>
      <div className="flex flex-col md:flex-row h-screen">
        <div className="flex-1 h-full bg-gray-300 relative overflow-hidden">
          <CesiumMap />
        </div>
      </div>
    </div>
  );
}

export default App;
