export const searchMedicines = (data) => {
    return `/medicines?value=${data}`;
};

export const addMedicineUrl = () => {
    return `/medicines`;
}