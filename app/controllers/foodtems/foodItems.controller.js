import Controller from "../";

//servces
import FoodItemService from "../../services/foodItems/foodItems.service";
// import FoodItemDetailService from "../../services/foodItemDetails/foodItemDetails.service";
//wrappers
import FoodItemWrapper from "../../ApiWrapper/web/foodItem";
import FoodItemDetailsWrapper from "../../ApiWrapper/web/foodItemDetails";
// import PortionWrapper from "../../ApiWrapper/web/portions";
// import DoctorWrapper from "../../ApiWrapper/web/doctor";
import Log from "../../../libs/log";
import { USER_CATEGORY } from "../../../constant";

const Logger = new Log("WEB FOOD ITEM CONTROLLER");

class FoodItemController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        body,
        userDetails: {
          userCategoryId = null,
          userData: { category = null } = {},
        } = {},
      } = req;

      const {
        name = "",
        calorific_value = null,
        carbs = null,
        proteins = null,
        fats = null,
        fibers = null,
        details = {},
        portion_id = null,
        portion_size = 1,
      } = body || {};

      const foodItemService = new FoodItemService();

      const foodItemData = {
        name,
        calorific_value,
        carbs,
        proteins,
        fats,
        fibers,
        details,
        portion_id,
        portion_size,
      };

      const userData = { userCategoryId, category };

      // check if doc's food item or public food item exist w same name

      const foodItem = await foodItemService.getFoodItem({
        name,
        creator_id: userCategoryId,
        creator_type: category,
      });

      if (foodItem) {
        // if exist , check if that food item has detail with the portion id

        const foodItemData = await FoodItemWrapper({ data: foodItem });
        const foodItemId = foodItemData.getId();
        const foodItemDetailsRecord = await foodItemService.getItemDetailData({
          food_item_id: foodItemId,
          portion_id,
          creator_id: userCategoryId,
          creator_type: category,
        });

        if (foodItemDetailsRecord) {
          // if already , cant create new for same

          return raiseClientError(
            res,
            422,
            {},
            `Food Item Already exists with this portion id.`
          );
        }
      }

      // create

      const { food_item_id = null, food_item_detail_id = null } =
        await foodItemService.create({
          foodItemData,
          userData,
        });

      let foodItemsApiData = {},
        foodItemDetailsApiData = {},
        portionsApiData = {};

      if (food_item_id) {
        const createdFoodItemWrapper = await FoodItemWrapper({
          id: food_item_id,
        });
        foodItemsApiData[createdFoodItemWrapper.getId()] =
          await createdFoodItemWrapper.getBasicInfo();
        // const creatorType = await createdFoodItemWrapper.getCreatorType();
        // const creatorId = await createdFoodItemWrapper.getCreatorId();
        // if(creatorType === USER_CATEGORY.DOCTOR){
        //     const doctorData = await DoctorWrapper(null,creatorId);
        //     doctorApiData[creatorId] = await doctorData.getBasicInfo();
        // }
      }

      if (food_item_detail_id) {
        const createdFoodItemDetailWrapper = await FoodItemDetailsWrapper({
          id: food_item_detail_id,
        });
        foodItemDetailsApiData[createdFoodItemDetailWrapper.getId()] =
          await createdFoodItemDetailWrapper.getBasicInfo();
        // const creatorType = await createdFoodItemDetailWrapper.getCreatorType();
        // const creatorId = await createdFoodItemDetailWrapper.getCreatorId();
        const portionId = await createdFoodItemDetailWrapper.getPortionId();
        portionsApiData[portionId] =
          await createdFoodItemDetailWrapper.getPortionDetails();
        // if(creatorType === USER_CATEGORY.DOCTOR){
        //     const doctorData = await DoctorWrapper(null,creatorId);
        //     doctorApiData[creatorId] = await doctorData.getBasicInfo();
        // }
      }

      return raiseSuccess(
        res,
        200,
        {
          food_items: {
            ...foodItemsApiData,
          },
          food_item_details: {
            ...foodItemDetailsApiData,
          },
          portions: {
            ...portionsApiData,
          },
        },
        "Food Item created successfully"
      );
    } catch (error) {
      Logger.debug("create food item 500 error", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const {
        params: { id: foodItemId } = {},
        body,
        userDetails: {
          userCategoryId = null,
          userData: { category = null } = {},
        } = {},
      } = req;

      const {
        name,
        calorific_value = null,
        carbs = null,
        proteins = null,
        fats = null,
        details = {},
        portion_id = null,
        portion_size = 1,
        fibers = null,
      } = body || {};

      const foodItemService = new FoodItemService();

      const FoodItemRecordExists = await foodItemService.getByData({
        id: foodItemId,
      });

      // no matching food item

      if (!FoodItemRecordExists) {
        return raiseClientError(
          res,
          422,
          {},
          `Food Item with this id does not exist.`
        );
      }

      // food item exists

      const foodItemWrapper = await FoodItemWrapper({ id: foodItemId });
      const creator_id = await foodItemWrapper.getCreatorId();
      const creator_type = await foodItemWrapper.getCreatorType();

      const hasPermission =
        (creator_id &&
          userCategoryId &&
          creator_id.toString() === userCategoryId.toString() &&
          creator_type === category) ||
        creator_type === USER_CATEGORY.ADMIN;

      // different dietician's food item

      if (!hasPermission) {
        return raiseClientError(
          res,
          422,
          {},
          `User unauthorized to update Food record.`
        );
      }

      // ---- has permission

      const matchingDetailsForPortionAndUser =
        await foodItemService.getItemDetailData({
          portion_id,
          food_item_id: foodItemId,
          creator_id: userCategoryId,
          creator_type: category,
        });

      let foodItemDetailsId = null,
        canUpdateFoodItem = false,
        canUpdateFoodItemDetails = false;

      // if its doctor' item, only then editable by doc
      canUpdateFoodItem =
        foodItemWrapper.getCreatorType() === USER_CATEGORY.ADMIN ? false : true;

      //if its doctor' item Detail , only then editable
      if (matchingDetailsForPortionAndUser) {
        const DetailsWrapper = await FoodItemDetailsWrapper({
          data: matchingDetailsForPortionAndUser,
        });
        foodItemDetailsId = (await DetailsWrapper.getId()) || null;
        const ItemDetailsWrapper = await FoodItemDetailsWrapper({
          data: matchingDetailsForPortionAndUser,
        });
        if (
          (ItemDetailsWrapper.getCreatorType() === USER_CATEGORY.DOCTOR &&
            category == USER_CATEGORY.DOCTOR &&
            ItemDetailsWrapper.getCreatorId() === userCategoryId) ||
          (ItemDetailsWrapper.getCreatorType() === USER_CATEGORY.HSP &&
            category == USER_CATEGORY.HSP &&
            ItemDetailsWrapper.getCreatorId() === userCategoryId)
        ) {
          canUpdateFoodItemDetails = true;
        } else {
          canUpdateFoodItemDetails = false;
        }
        // canUpdateFoodItemDetails = ItemDetailsWrapper.getCreatorType() === USER_CATEGORY.ADMIN ? false : true;

        // if(category === USER_CATEGORY.ADMIN && ItemDetailsWrapper.getCreatorType() === USER_CATEGORY.ADMIN){
        //     canUpdateFoodItem=true;
        //     canUpdateFoodItemDetails=true;
        //     // if current user is also admin and creator is also admin  -> then can update
        // }
      }

      const toUpdate = matchingDetailsForPortionAndUser ? true : false; // if matching portion id is found for detail ,  so update instead of create

      if (toUpdate && !canUpdateFoodItemDetails) {
        // portion id exists for food item but is global so cant be edited by a dietician, only by admin
        return raiseClientError(
          res,
          422,
          {},
          `User unauthorized to update Food Details record.`
        );
      }

      // update food item & create detail record

      const foodItemData = {
        name,
      };

      const foodItemDetailData = {
        calorific_value,
        carbs,
        proteins,
        fats,
        details,
        portion_id,
        portion_size,
        creator_id: userCategoryId,
        creator_type: category,
        food_item_id: foodItemId,
        fibers,
      };

      const { food_item_id, food_item_detail_id } =
        await foodItemService.update({
          food_item_id: foodItemId,
          item_detail_id: foodItemDetailsId,
          foodItemData,
          foodItemDetailData,
          toUpdate,
          canUpdateFoodItem,
          canUpdateFoodItemDetails,
        });

      let foodItemsApiData = {},
        foodItemDetailsApiData = {},
        portionsApiData = {};

      if (food_item_id) {
        const createdFoodItemWrapper = await FoodItemWrapper({
          id: food_item_id,
        });
        foodItemsApiData[createdFoodItemWrapper.getId()] =
          await createdFoodItemWrapper.getBasicInfo();
        // const creatorType = await createdFoodItemWrapper.getCreatorType();
        // const creatorId = await createdFoodItemWrapper.getCreatorId();
        // if(creatorType === USER_CATEGORY.DOCTOR){
        //     const doctorData = await DoctorWrapper(null,creatorId);
        //     doctorApiData[creatorId] = await doctorData.getBasicInfo();
        // }
      }

      if (food_item_detail_id) {
        const createdFoodItemDetailWrapper = await FoodItemDetailsWrapper({
          id: food_item_detail_id,
        });
        foodItemDetailsApiData[createdFoodItemDetailWrapper.getId()] =
          await createdFoodItemDetailWrapper.getBasicInfo();
        // const creatorType = await createdFoodItemDetailWrapper.getCreatorType();
        // const creatorId = await createdFoodItemDetailWrapper.getCreatorId();
        const portionId = await createdFoodItemDetailWrapper.getPortionId();
        portionsApiData[portionId] =
          await createdFoodItemDetailWrapper.getPortionDetails();
        // if(creatorType === USER_CATEGORY.DOCTOR){
        //     const doctorData = await DoctorWrapper(null,creatorId);
        //     doctorApiData[creatorId] = await doctorData.getBasicInfo();
        // }
      }

      return raiseSuccess(
        res,
        200,
        {
          food_items: {
            ...foodItemsApiData,
          },
          food_item_details: {
            ...foodItemDetailsApiData,
          },
          // doctors :{
          //     ...doctorApiData
          // },
          portions: {
            ...portionsApiData,
          },
        },
        "Food Item updated successfully"
      );
    } catch (error) {
      Logger.debug("update food item 500 error", error);
      return raiseServerError(res);
    }
  };

  search = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {
        query: { value = "" } = {},
        userDetails: {
          userCategoryId = null,
          userData: { category = null } = {},
        } = {},
      } = req;

      const foodItemService = new FoodItemService();
      // const foodItemDetailService = new FoodItemDetailService();

      let foodItemsApiData = {},
        foodItemDetailsApiData = {},
        portionsApiData = {};

      const foodItems =
        (await foodItemService.search({
          name: value,
          creator_id: userCategoryId,
          creator_type: category,
        })) || {};

      if (Object.keys(foodItems).length) {
        for (let each in foodItems) {
          const foodItem = foodItems[each];
          const foodItemWrapper = await FoodItemWrapper({ data: foodItem });

          const { food_item_details: foodItemDetails = [] } = foodItem || {};

          for (let eachDetail in foodItemDetails) {
            const record = foodItemDetails[eachDetail] || {};
            const foodItemDetailWrapper = await FoodItemDetailsWrapper({
              data: record,
            });
            foodItemDetailsApiData[foodItemDetailWrapper.getId()] =
              await foodItemDetailWrapper.getBasicInfo();
            const portionId = await foodItemDetailWrapper.getPortionId();
            portionsApiData[portionId] =
              await foodItemDetailWrapper.getPortionDetails();
            // const detailCreatorType = await foodItemDetailWrapper.getCreatorType();
            // const detailCreatorId = await foodItemDetailWrapper.getCreatorId();
            // if(detailCreatorType === USER_CATEGORY.DOCTOR){
            //     const doctorData = await DoctorWrapper(null,detailCreatorId);
            //     doctorApiData[detailCreatorId] = await doctorData.getBasicInfo();
            // }
          }

          foodItemsApiData[foodItemWrapper.getId()] =
            await foodItemWrapper.getBasicInfo();
          // const creatorType = await foodItemWrapper.getCreatorType();
          // const creatorId = await foodItemWrapper.getCreatorId();
          // if(creatorType === USER_CATEGORY.DOCTOR){
          //     const doctorData = await DoctorWrapper(null,creatorId);
          //     doctorApiData[creatorId] = await doctorData.getBasicInfo();
          // }
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          food_items: {
            ...foodItemsApiData,
          },
          food_item_details: {
            ...foodItemDetailsApiData,
          },
          portions: {
            ...portionsApiData,
          },
          // doctors:{
          //     ...doctorApiData
          // }
        },
        "Food Item data fetched successfully"
      );
    } catch (error) {
      Logger.debug("Search food item 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new FoodItemController();
