function foodGroupMappingsReducer(state, data) {
  const { diet_food_group_mappings } = data || {};
  if (diet_food_group_mappings) {
    return {
      ...state,
      ...diet_food_group_mappings,
    };
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return foodGroupMappingsReducer(state, data);
  }
};
