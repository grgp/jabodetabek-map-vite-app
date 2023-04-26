import Color from 'color';
import { Style, Stroke, Fill, Text } from 'ol/style';
import { Village } from '../types/structure';
import { StyleLike } from 'ol/style/Style';
import { FeatureLike } from 'ol/Feature';
import { villagesPopsData } from '../data';
import { Icon } from '@iconify/react';

const RATIO_NUM = 9000000;

export const getColor = (totalPopulation: number, polygonArea: number) => {
  const minPopulation = 5000; // Define the minimum population here
  const maxPopulation = 180000; // Define the maximum population here
  const colorStart = Color('#ccffcc');
  const colorEnd = Color('#006400');

  const useDensity = true;
  const densityModifier = useDensity ? (1 / polygonArea) * RATIO_NUM : 3;

  const ratio = Math.min(
    Math.max(
      ((totalPopulation - minPopulation) / (maxPopulation - minPopulation)) *
        densityModifier,
      0
    ),
    1
  );
  return colorStart.mix(colorEnd, ratio).alpha(0.8).toString();
};

export const POPUP_STYLES = {
  top: -999,
  right: -999,
  position: 'absolute',
  background: 'linear-gradient(to bottom, #2d6daa, #155e92)',
  color: 'white',
  padding: 14,
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
  zIndex: 999999,
  width: '260px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: 8
  // bottom: 16,
  // right: 16,
  // background: 'linear-gradient(to bottom, #d1e9ffe4, #a2caedde)',
  // color: '#064e91',
  // border: '3px solid #216aad',
} as const;

export const defaultStyleFunction: StyleLike = (feature: FeatureLike) => {
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

export const MapModeButton = (item: {
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <div
    style={{ marginLeft: -16, fontSize: 44 }}
    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition duration-300 ease-in-out transform shadow-xl hover:scale-105 text-ac-black-orange hover:shadow-lg cursor-pointer ${
      item.isSelected
        ? 'bg-ac-orange text-white hover:text-ac-black-orange hover:bg-ac-white-off-deselect'
        : 'bg-ac-white-off hover:text-ac-orange'
    }`}
    onClick={item.onClick}
  >
    <Icon style={{ marginLeft: -2 }} icon={item.icon} />
  </div>
);
