export const addExerciseUrl = () => {
  return `/exercises`;
};

export const updateExerciseUrl = (food_item_id) => {
  return `/exercises/${food_item_id}`;
};

export const searchExerciseUrl = (name) => {
  return `/exercises?name=${name}`;
};

export const uploadExerciseContentUrl = () => {
  return `/exercises/upload`;
};
