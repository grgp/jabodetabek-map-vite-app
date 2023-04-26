import { Feature } from 'ol';
import { Vector as LayerVector } from 'ol/layer';
import { Vector as SourceVector } from 'ol/source';
import { LineString, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Stroke, Icon } from 'ol/style';
import { Map } from 'ol';

import { Station, Track } from '../../types/railway';
import { fetchRailwayData } from '../../fetches/railwayData';
import { useMapStore } from '../../store/map';
import { useEffect } from 'react';

const data = await fetchRailwayData();

// Function to add stations and tracks to the map
export function useAddRailways({
  mapInstance
}: {
  mapInstance: Map | undefined;
}) {
  const { activeLayers, vectorSourceAndLayers, setVectorSourceAndLayers } =
    useMapStore();

  const isRailwaysLayerActive = activeLayers.railway;

  useEffect(() => {
    if (!mapInstance) return;

    function clearLayers() {
      const stationsLayer = vectorSourceAndLayers.stations;
      const tracksLayer = vectorSourceAndLayers.tracks;

      if (stationsLayer) {
        mapInstance?.removeLayer(stationsLayer.layer);
      }

      if (tracksLayer) {
        mapInstance?.removeLayer(tracksLayer.layer);
      }
    }

    if (isRailwaysLayerActive) {
      const stationSource = new SourceVector();
      const trackSource = new SourceVector();

      const iconStyle = createIconStyle();

      data.stations.forEach((station: Station) => {
        const stationFeature = new Feature({
          geometry: new Point(fromLonLat([station.lon, station.lat])),
          station_id: station.station_id,
          station_name: station.station_name
        });

        stationFeature.setStyle(iconStyle);
        stationSource.addFeature(stationFeature);
      });

      data.tracks.forEach((track: Track) => {
        const trackCoordinates = track.coordinates.map((coord) =>
          fromLonLat(coord)
        );
        const trackFeature = new Feature({
          geometry: new LineString(trackCoordinates),
          osm_way_id: track.osm_way_id
        });

        // Set a random color for the track's line string
        const randomColor = getRandomColor(colors);
        const trackStyle = new Style({
          stroke: new Stroke({
            color: randomColor,
            width: 6
          }),
          zIndex: 10
        });

        trackFeature.setStyle(trackStyle);
        trackSource.addFeature(trackFeature);
      });

      const stationLayer = new LayerVector({
        source: stationSource
      });

      const trackLayer = new LayerVector({
        source: trackSource
      });

      setVectorSourceAndLayers({
        ...vectorSourceAndLayers,
        stations: {
          source: stationSource,
          layer: stationLayer,
          vectorSourceAndLayerId: 'stations'
        },
        tracks: {
          source: trackSource,
          layer: trackLayer,
          vectorSourceAndLayerId: 'tracks'
        }
      });
    } else {
      // Remove stations and tracks layers
      clearLayers();
    }

    return () => {
      clearLayers();
    };
  }, [mapInstance, isRailwaysLayerActive]);
}

const colors = [
  '#ff7755',
  '#f8443a',
  '#ff616e',
  '#ff9462',
  '#ba200c',
  '#ff6969',
  '#a32222'
];

function getRandomColor(colors: string[]): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

function createIconStyle(): Style {
  return new Style({
    image: new Icon({
      src: 'icon.png', // Path to your icon file
      scale: 0.5 // Adjust the scale to resize the icon
    })
  });
}
