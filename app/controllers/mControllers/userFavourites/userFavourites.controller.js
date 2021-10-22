import Controller from "../../index";
import Logger from "../../../../libs/log";

// HELPERS

// SERVICES...
import UserFavouritesService from "../../../services/userFavourites/userFavourites.service";

// WRAPPERS...
import UserFavouritesWrapper from "../../../ApiWrapper/mobile/userFavourites";
import UserWrapper from "../../../ApiWrapper/mobile/user";

import { FAVOURITE_TYPE } from "../../../../constant";

const Log = new Logger("MOBILE > CONTROLLER > USER_FAVOURITES");

class UserFavouritesController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body,
        userDetails: {
          userId,
          userCategoryId,
          userData: { category = "" } = {}
        } = {}
      } = req;

      const { type = "", id = "", details = {} } = body;

      const data = {
        user_category_id: userCategoryId,
        user_category_type: category,
        marked_favourite_id: id,
        marked_favourite_type: type,
        details
      };

      // const existing = await UserFavouritesService.findExistingFavourite(data);

      // if(existing){
      //   return this.raiseClientError(
      //     res,
      //     422,
      //     {},
      //     `Already Marked Favourite for user`
      //   );
      // }

      const record = await UserFavouritesService.markFavourite(data);

      let favourites_data = {};

      const favourite = await UserFavouritesWrapper(record);
      const ref_info = await favourite.getReferenceInfo();
      const favourite_id = favourite.getId();
      favourites_data[favourite_id] = { ...ref_info };

      const userData = {};
      const currentUser = await UserWrapper(null, userId);

      userData[currentUser.getId()] = currentUser.getBasicInfo();

      return raiseSuccess(
        res,
        200,
        {
          favourites_data
        },
        "User Favourite marked successfully"
      );
    } catch (error) {
      Log.debug("create 500 error - userFavourite marked", error);
      return raiseServerError(res);
    }
  };

  getUserTypeFavourites = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        userDetails: {
          userId,
          userCategoryId,
          userData: { category = "" } = {}
        } = {}
      } = req;

      const { query: { type = "" } = {} } = req;

      const data = {
        user_category_id: userCategoryId,
        user_category_type: category,
        marked_favourite_type: type
      };

      const favourites = await UserFavouritesService.getAllFavourites(data);

      let favourites_data = {};

      const userData = {};
      const currentUser = await UserWrapper(null, userId);
      const favourite_medicine_ids = [];
      const favourite_medical_test_ids = [];

      userData[currentUser.getId()] = currentUser.getBasicInfo();

      if (favourites && favourites.length) {
        for (let index = 0; index < favourites.length; index++) {
          let each = favourites[index];
          const eachFavourite = await UserFavouritesWrapper(each);
          const ref_info = await eachFavourite.getReferenceInfo();
          const id = eachFavourite.getId();
          if (type === FAVOURITE_TYPE.MEDICINE) {
            const medicineId = await eachFavourite.getMarkedFavouriteId();
            Log.debug("983246238747523746790283", { medicineId });
            await favourite_medicine_ids.push(medicineId.toString());
          } else if (type === FAVOURITE_TYPE.MEDICAL_TESTS) {
            const medicalTestId = await eachFavourite.getMarkedFavouriteId();
            await favourite_medical_test_ids.push(medicalTestId.toString());
          }
          favourites_data[id] = { ...ref_info };
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          favourites_data,
          user_data: userData,
          ...(type === FAVOURITE_TYPE.MEDICINE && {
            favourite_medicine_ids: favourite_medicine_ids
          }),
          ...(type === FAVOURITE_TYPE.MEDICAL_TESTS && {
            favourite_medical_test_ids: favourite_medical_test_ids
          })
        },
        "Get User Favourites successful"
      );
    } catch (error) {
      Log.debug("user Get Favourite 500 error", error);
      return raiseServerError(res);
    }
  };

  removeFavourite = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body,
        userDetails: {
          userId,
          userCategoryId,
          userData: { category = "" } = {}
        } = {}
      } = req;

      const { params: { id = null } = {} } = req;

      const favourite = await UserFavouritesWrapper(null, id);
      const type = await favourite.getMarkedFavouriteType();
      const existing = await UserFavouritesService.findExistingFavourite({
        id
      });
      if (existing) {
        const deleted = await UserFavouritesService.delete(id);
      } else {
        return this.raiseClientError(
          res,
          422,
          {},
          `Not marked Favourite for user`
        );
      }

      return raiseSuccess(
        res,
        200,
        {},
        `Favourite ${type} unmarked successfully`
      );
    } catch (error) {
      Log.debug("removeFavourite 500 error", error);
      return raiseServerError(res);
    }
  };

  removeFavouriteMedicine = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body,
        userDetails: {
          userId,
          userCategoryId,
          userData: { category = "" } = {}
        } = {}
      } = req;

      const { query: { typeId = null, type = "" } = {} } = req;

      const record = await UserFavouritesService.getByData({
        marked_favourite_id: typeId,
        marked_favourite_type: type
      });

      let removed_favourites_data = {};

      if (record) {
        const favourite = await UserFavouritesWrapper(record);
        const ref_info = await favourite.getReferenceInfo();
        const favourite_id = favourite.getId();
        removed_favourites_data[favourite_id] = { ...ref_info };

        const favouriteId = await favourite.getId();

        Log.debug("32784284576237463256948723", { favouriteId });
        const deleted = await UserFavouritesService.delete(favouriteId);
      } else {
        return this.raiseClientError(
          res,
          422,
          {},
          `Not marked Favourite for user`
        );
      }

      return raiseSuccess(
        res,
        200,
        { removed_favourites_data },
        `Favourite ${type} unmarked successfully`
      );
    } catch (error) {
      Log.debug("userFavourite 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new UserFavouritesController();
