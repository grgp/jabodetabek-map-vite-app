import { useEffect, useRef, useState } from 'react';

import { Feature, Map, Overlay, View } from 'ol';
import { MaplibreLayer } from 'mobility-toolbox-js/ol';
import 'ol/ol.css';

import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { Style, Stroke, Fill, Text } from 'ol/style';
import { Polygon } from 'ol/geom';

import data from '../data/final/villages-unique-jkt-262-minified.json';
import popsData from '../data/final/villages-pop-data-v1.json';

import { Village, VillagePopData } from '../types/structure';
import { capitalizeWords } from './utils';
import { POPUP_STYLES, getColor } from './styles';
import Color from 'color';
import { StyleLike } from 'ol/style/Style';
import { FeatureLike } from 'ol/Feature';

const villages = data as Village[];
const villagesPopsData = popsData as unknown as Record<string, VillagePopData>;

let hoveredFeature: Feature | null = null;

export function MainMap() {
  const [mapInstance, setMapInstance] = useState<Map | undefined>(undefined);

  // pull refs
  const mapElement = useRef<HTMLDivElement | null | undefined>();

  // create state ref that can be accessed in OpenLayers onclick callback
  // https://stackoverflow.com/a/60643670
  const mapRef = useRef<Map | undefined>();
  mapRef.current = mapInstance;

  const [popupData, setPopupData] = useState<{
    data: Village;
    popData?: VillagePopData;
    coordinate: number[];
    polygonArea: number;
  } | null>(null);

  useEffect(() => {
    const longitude = 106.8256;
    const latitude = -6.2088;

    const jktCoordinates = fromLonLat([longitude, latitude]);

    console.log('what are jktCoordinates?', jktCoordinates);

    const initialMap = new Map({
      target: mapElement.current || undefined,
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

    const basemapEnum = 'ArcGIS:LightGray';
    const apiKey = import.meta.env.VITE_ARC_GIS_API_KEY;

    const layer = new MaplibreLayer({
      url: `https://basemaps-api.arcgis.com/arcgis/rest/services/styles/${basemapEnum}?type=style&token=${apiKey}`
    });
    layer.attachToMap(initialMap);

    const features = villages.map((village) => {
      const coordinates = village.members
        .filter((member) => member.role === 'outer')
        .flatMap((member) =>
          member.geometry.map((point) => fromLonLat([point.lon, point.lat]))
        );

      const polygon = new Polygon([coordinates]);
      const polygonArea = polygon.getArea();

      const feature = new Feature({
        geometry: polygon,
        villageData: village,
        polygonArea
      });
      return feature;
    });

    // Create a vector source from the features
    const vectorSource = new VectorSource({
      features
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: defaultStyleFunction
    });

    initialMap.addLayer(vectorLayer);

    initialMap.on('click', (event) => {
      const feature = initialMap.forEachFeatureAtPixel(
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

    setMapInstance(initialMap);

    return () => {
      initialMap.setTarget(undefined);
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
          const polygonArea = feature.get('polygonArea') as number;

          if (
            hoveredFeature?.get('villageData').tags.name !== village.tags.name
          ) {
            // what are cthose, console
            // Places the popup just to the right and down of cursor
            const popupElement = document.getElementById('popup');
            if (popupElement) {
              popupElement.style.left = `${event.originalEvent.clientX + 16}px`;
              popupElement.style.top = `${event.originalEvent.clientY + 16}px`;
            }
          }

          if (hoveredFeature) {
            // Reset the style of the previously hovered feature
            hoveredFeature?.setStyle(defaultStyleFunction);
            hoveredFeature = null;
          }

          setPopupData({
            data: village,
            popData: villagesPopsData[village.tags?.name?.toUpperCase()],
            coordinate: event.coordinate,
            polygonArea
          });

          feature.setStyle(
            new Style({
              stroke: new Stroke({
                color: Color('#ffffff').alpha(0.95).toString(),
                width: 4
              }),
              fill: new Fill({
                color: Color('#148be6').alpha(0.85).toString()
              })
            })
          );

          hoveredFeature = feature;
        } else {
          setPopupData(null);
        }
      });

      mapInstance.addOverlay(popup);
    }
  }, [mapInstance]);

  return (
    <>
      <div
        ref={mapElement as React.MutableRefObject<HTMLDivElement>}
        style={{ width: '100%', height: '100%' }}
      ></div>
      {popupData && (
        <div id="popup" className="ol-popup" style={POPUP_STYLES}>
          <div>
            <strong>{capitalizeWords(popupData.data.tags?.name)}</strong>
          </div>
          <div>{capitalizeWords(popupData.popData?.nama_kecamatan)}</div>
          <div>Population: {popupData.popData?.total_population}</div>
          <div style={{ fontSize: 8 }}>
            Polygon Area: {popupData.polygonArea}
          </div>
        </div>
      )}
    </>
  );
}

const defaultStyleFunction: StyleLike = (feature: FeatureLike) => {
  const village = feature.get('villageData') as Village;
  const polygonArea = feature.get('polygonArea') as number;
  const villagePopData = villagesPopsData[village.tags?.name?.toUpperCase()];

  return new Style({
    stroke: new Stroke({
      color: Color('#3f97da').alpha(0.8).toString(),
      width: 2
    }),
    fill: new Fill({
      color: getColor(
        villagePopData ? villagePopData.total_population : -1,
        polygonArea
      )
    }),
    text: new Text({
      text: village.tags.name,
      scale: 1.1,
      font: 'sans-serif',
      fill: new Fill({
        color: '#000000'
      })
    })
  });
};
