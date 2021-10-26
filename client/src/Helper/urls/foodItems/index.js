export const addFoodItemUrl = () => {
  return `/food-items`;
};

export const updateFoodItemUrl = (food_item_id) => {
  return `/food-items/${food_item_id}`;
};

export const searchFoodUrl = (value) => {
  return `/food-items?value=${value}`;
};
