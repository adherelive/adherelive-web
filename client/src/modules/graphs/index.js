import { GRAPH_INITIAL_STATE } from "../../data";

export default (state = GRAPH_INITIAL_STATE, action) => {
  const { data, type } = action;
  switch (type) {
    default:
      return state;
  }
};
