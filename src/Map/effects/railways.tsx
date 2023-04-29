import { Feature } from 'ol';
import { Vector as LayerVector } from 'ol/layer';
import { Vector as SourceVector } from 'ol/source';
import { LineString, Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Style, Stroke, Icon, RegularShape, Fill } from 'ol/style';

import { Station, Track } from '../../types/railway';
import { fetchRailwayData } from '../../fetches/railwayData';
import { useMapStore } from '../../store/map';
import { useEffect } from 'react';

const data = await fetchRailwayData();

// Function to add stations and tracks to the map
export function useAddRailways() {
  const { mapInstance } = useMapStore();

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

      const { tracks, stations, ...rest } = vectorSourceAndLayers;
      setVectorSourceAndLayers({ ...rest });
    }

    if (isRailwaysLayerActive) {
      const stationSource = new SourceVector();
      const trackSource = new SourceVector();

      const iconStyle = createStationStyle();

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
          zIndex: 16
        });

        trackFeature.setStyle(trackStyle);
        trackSource.addFeature(trackFeature);
      });

      const stationLayer = new LayerVector({
        source: stationSource,
        zIndex: 25
      });

      const trackLayer = new LayerVector({
        source: trackSource,
        zIndex: 20
      });

      setVectorSourceAndLayers({
        ...vectorSourceAndLayers,
        tracks: {
          source: trackSource,
          layer: trackLayer,
          vectorSourceAndLayerId: 'tracks'
        },
        stations: {
          source: stationSource,
          layer: stationLayer,
          vectorSourceAndLayerId: 'stations'
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

const colors = ['#ffaa55', '#f8c53a', '#ffdd61', '#e07c20'];

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

function createStationStyle(): Style {
  return new Style({
    image: new RegularShape({
      points: 6,
      radius: 6,
      angle: Math.PI / 4,
      fill: new Fill({
        color: '#71513a'
      }),
      stroke: new Stroke({
        color: '#ffcc5f',
        width: 3
      })
    }),
    zIndex: 15
  });
}
