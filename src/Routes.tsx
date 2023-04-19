import * as React from 'react';
import { Routes as RouterRoutes, Route, Outlet } from 'react-router-dom';
import App from './containers/App';
import { DataFetchingPage } from './containers/DataFetchingPage';

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />
        <Route path="data" element={<DataFetchingPage />} />
      </Route>
    </RouterRoutes>
  );
}

function Layout() {
  return (
    <>
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </>
  );
}
