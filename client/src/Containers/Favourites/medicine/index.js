import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import FavouriteMedicines from "../../../Components/Favourites/medicine";
import {
  markFavourite,
  getFavourites,
  removeFavourite,
} from "../../../modules/favouritesData/index";

const mapStateToProps = (state) => {
  const {
    medicine = {},
    favourites_data = {},
    pages: { favourite_medicine_ids = [] } = {},
  } = state;
  return {
    medicine,
    favourites_data,
    favourite_medicine_ids,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    markFavourite: (payload) => dispatch(markFavourite(payload)),
    getFavourites: ({ type }) => dispatch(getFavourites({ type })),
    removeFavourite: ({ typeId, type }) =>
      dispatch(removeFavourite({ typeId, type })),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FavouriteMedicines)
);
