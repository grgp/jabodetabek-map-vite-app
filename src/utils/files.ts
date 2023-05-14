export const saveToFile = (objectToSave: any) => {
  const blob = new Blob([JSON.stringify(objectToSave, null, 2)], {
    type: 'application/json'
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'filename.json';
  link.click();

  // It's better to remove the object URL to free up memory
  URL.revokeObjectURL(link.href);
};
