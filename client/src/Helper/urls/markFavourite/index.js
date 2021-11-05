export const markFavouriteUrl = () => {
  return `/favourites`;
};

export const getFavouritesUrl = ({ type }) => {
  return `/favourites?type=${type}`;
};

export const removeFavouritesUrl = ({ typeId, type }) => {
  return `/favourites?typeId=${typeId}&type=${type}`;
};

export const removeFavouriteRecordUrl = (id) => {
  return `/favourites/${id}`;
};
