import Color from 'color';

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
