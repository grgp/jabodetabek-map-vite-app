import { fromLonLat } from 'ol/proj';

export const JAKARTA_CENTER_LONGITUDE = 106.8256;
export const JAKARTA_CENTER_LATITUDE = -6.2488;

export const JAKARTA_CENTER_COORDINATES = fromLonLat([
  JAKARTA_CENTER_LONGITUDE,
  JAKARTA_CENTER_LATITUDE
]);

export const BASEMAP_ENUM = 'ArcGIS:LightGray';
export const ARC_GIS_API_KEY = import.meta.env.VITE_ARC_GIS_API_KEY;
export const MAPLIBRE_LAYER_URL = `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${BASEMAP_ENUM}?type=style&token=${ARC_GIS_API_KEY}`;
