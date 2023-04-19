import { useEffect, useRef, useState } from 'react';

import Color from 'color';
import { Feature, Map, Overlay, View } from 'ol';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';
import 'ol/ol.css';

import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke, Fill, Text } from 'ol/style';
import { Polygon } from 'ol/geom';

// import data from '../data/final/villages-unique-jkt-tgt-349.json';
import data from '../data/final/villages-unique-jkt-262-minified.json';
import popsData from '../data/final/villages-pop-data-v1.json';

import { Village, VillagePopData } from '../types/structure';

const villages = data as Village[];
const villagesPopsData = popsData as Record<string, any>;

const getColor = (totalPopulation: number) => {
  const minPopulation = 0; // Define the minimum population here
  const maxPopulation = 180000; // Define the maximum population here
  const colorStart = Color('#ccffcc');
  const colorEnd = Color('#006400');

  const ratio = Math.min(
    Math.max(
      (totalPopulation - minPopulation) / (maxPopulation - minPopulation),
      0
    ),
    1
  );
  return colorStart.mix(colorEnd, ratio).toString();
};

export function MainMap() {
  const mapRef = useRef<Map | null>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);

  const [popupData, setPopupData] = useState<{
    data: Village;
    popData: VillagePopData;
    coordinate: number[];
  } | null>(null);

  useEffect(() => {
    const longitude = 106.8256;
    const latitude = -6.2088;

    const jktCoordinates = fromLonLat([longitude, latitude]);

    console.log('what are jktCoordinates?', jktCoordinates);

    const map = new Map({
      target: 'map',
      view: new View({
        center: jktCoordinates,
        zoom: 12,
        minZoom: 5
      }),

      layers: [
        /* new TileLayer({ source: new OSM() }) */
      ],
      controls: []
    });

    const basemapEnum = 'ArcGIS:Streets';
    const apiKey = import.meta.env.VITE_ARC_GIS_API_KEY;

    const layer = new MaplibreLayer({
      url: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`
    });
    layer.attachToMap(map);

    const features = villages.map((village) => {
      const coordinates = village.members
        .filter((member) => member.role === 'outer')
        .flatMap((member) =>
          member.geometry.map((point) => fromLonLat([point.lon, point.lat]))
        );

      const polygon = new Polygon([coordinates]).getSimplifiedGeometry(-5000);
      const feature = new Feature({ geometry: polygon, villageData: village });
      return feature;
    });

    // Create a vector source from the features
    const vectorSource = new VectorSource({
      features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const village = feature.get('villageData') as Village;
        const villagePopData =
          villagesPopsData[village.tags?.name?.toUpperCase()];

        return new Style({
          stroke: new Stroke({
            color: '#0080e3',
            width: 2
          }),
          fill: new Fill({
            color: getColor(
              villagePopData ? villagePopData.total_population : null
            )
          }),
          text: new Text({
            text: village.tags.name,
            scale: 1.5,
            fill: new Fill({
              color: '#000000'
            })
          })
        });
      }
    });

    map.addLayer(vectorLayer);

    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature
      );
      if (feature) {
        const village = feature.get('villageData') as Village;
        onClick(village);
      }
    });

    const onClick = (data: Village) => {
      console.log('Clicked on:', data);
      // Do something with the clicked village data
    };

    mapRef.current = map;
    setMapInstance(map);

    return () => {
      map.setTarget(undefined);
    };
  }, []);

  useEffect(() => {
    // Add a popup overlay to the map
    const popup = new Overlay({
      element: document.getElementById('popup')!,
      positioning: 'bottom-center',
      offset: [0, -10],
      stopEvent: true
    });

    if (mapInstance) {
      mapInstance.on('pointermove', (event) => {
        const feature = mapInstance.forEachFeatureAtPixel(
          event.pixel,
          (feature: any) => feature
        );
        if (feature) {
          console.log('on pointermove', event, feature);
          const village = feature.get('villageData') as Village;
          setPopupData({
            data: village,
            popData: villagesPopsData[village.tags?.name?.toUpperCase()],
            coordinate: event.coordinate
          });
        } else {
          setPopupData(null);
        }
      });

      mapInstance.addOverlay(popup);
    }
  }, [mapInstance]);

  return (
    <>
      <div id="map" style={{ width: '100%', height: '100%' }}></div>
      {popupData && (
        <div
          id="popup"
          className="ol-popup"
          style={{
            position: 'absolute',
            // transform: `translate(${popupData?.coordinate[0]}px, ${popupData?.coordinate[1]}px)`,
            bottom: 16,
            right: 16,
            backgroundColor: 'white',
            padding: 16,
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 999999,
            width: '260px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRadius: 8
          }}
        >
          <div>
            <strong>{popupData.popData?.nama_kelurahan}</strong>
          </div>
          <div>{popupData.popData?.nama_kecamatan}</div>
          <div>Population: {popupData.popData?.total_population}</div>
        </div>
      )}
    </>
  );
}
