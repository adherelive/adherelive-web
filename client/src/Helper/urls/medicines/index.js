export const searchMedicines = (data) => {
  return `/medicines?value=${data}`;
};

export const addMedicineUrl = () => {
  return `/medicines`;
};

export const addAdminMedicineUrl = () => {
  return `/admin/medicines`;
};

export const getPublicMedicinesUrl = ({ value, offset }) => {
  if (value && value !== "") {
    return `/admin/medicines?value=${value}&offset=${offset}&public_medicine=1`;
  } else {
    return `/admin/medicines?value=&offset=${offset}&public_medicine=1`;
  }
};

export const getPrivateMedicinesUrl = ({ value, offset }) => {
  if (value && value !== "") {
    return `/admin/medicines?value=${value}&offset=${offset}&public_medicine=0`;
  } else {
    return `/admin/medicines?value=&offset=${offset}&public_medicine=0`;
  }
};

export const makeMedicinePublicUrl = (medicine_id) => {
  return `/admin/medicines/${medicine_id}/public`;
};

export const deleteMedicineUrl = (medicine_id) => {
  return `/admin/medicines/${medicine_id}`;
};
