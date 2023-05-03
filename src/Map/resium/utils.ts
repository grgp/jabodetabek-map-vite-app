import Color from 'color';

type Rectangle = number[];

export function splitBigRectangle(
  bigRectangle: Rectangle,
  x: number,
  y: number
): Rectangle[] {
  const [lon1, lat1, lon2, lat2, lon3, lat3, lon4, lat4] = bigRectangle;
  const latStep = (lat2 - lat1) / y;
  const lonStep = (lon3 - lon1) / x;

  const grid: Rectangle[] = [];

  const DISTANCE = 0.0025;

  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      const cell: Rectangle = [
        lon1 + lonStep * j + DISTANCE,
        lat1 + latStep * i,
        lon1 + lonStep * (j + 1),
        lat1 + latStep * i,
        lon1 + lonStep * (j + 1),
        lat1 + latStep * (i + 1) + DISTANCE,
        lon1 + lonStep * j + DISTANCE,
        lat1 + latStep * (i + 1) + DISTANCE
      ];
      grid.push(cell);
    }
  }

  return grid;
}

export function randomRectangleColor() {
  const red = Color('rgb(255, 50, 50)');
  const orange = Color('rgb(255, 185, 25)');

  // Generate a random value between 0 and 1
  const randomValue = Math.random();

  // Interpolate between red and orange using the random value
  const randomColor = red.mix(orange, randomValue);

  return randomColor.toString();
}
