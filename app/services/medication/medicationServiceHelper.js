export const deleteMedicine = (data, productId) => {
  const { medicine } = data;
  const lastMedication = medicine[medicine.length - 1];

  delete lastMedication[productId];
  const afterDeletingMedicine = lastMedication;

  return afterDeletingMedicine;
};
