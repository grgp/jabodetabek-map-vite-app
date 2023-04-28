import * as Cesium from 'cesium';
window.CESIUM_BASE_URL = 'https://assets.ion.cesium.com';
window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
import 'cesium/Build/Cesium/Widgets/widgets.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Routes } from './Routes';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
