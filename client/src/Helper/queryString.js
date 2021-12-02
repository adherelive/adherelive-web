import querystring from "querystring";

export const makeQueryString = (data) => {
  if (data) {
    return querystring.stringify(data);
  } else {
  }
};

export const getQuery = (data) => {
  if (data) {
    return querystring.parse(data.slice(1));
  } else {
    return {};
  }
};
