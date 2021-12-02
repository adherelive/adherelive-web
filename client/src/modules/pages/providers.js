// import { PAGE_INITIAL } from "../../data";

// export default (state = PAGE_INITIAL.PROVIDER_IDS, action) => {
//   const { type, data } = action;
//   switch (type) {
//     default:
//       return [
//         ...PAGE_INITIAL.PROVIDER_IDS
//       ];
//   }
// };

function allProvidersPageReducer(state, data) {
  const { provider_ids } = data || {};
  if (provider_ids) {
    return [...provider_ids];
  } else {
    return state;
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return allProvidersPageReducer(state, data);
  }
};
