export function capitalizeWords(word?: string) {
  if (!word) return '';

  const arr = word.split(' ');

  return arr
    .map((word) => {
      const firstLetter = word.charAt(0).toUpperCase();
      const rest = word.slice(1).toLowerCase();

      return firstLetter + rest;
    })
    .join(' ');
}
