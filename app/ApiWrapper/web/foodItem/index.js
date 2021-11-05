//services
import BaseFoodItem from "../../../services/foodItems/index";
import FoodItemService from "../../../services/foodItems/foodItems.service";

import FoodItemDetailsWrapper from "../foodItemDetails";

class FoodItemWrapper extends BaseFoodItem {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, name, creator_id, creator_type } = _data || {};

    return {
      basic_info: {
        id,
        name,
        creator_id,
        creator_type,
      },
    };
  };

  getReferenceInfo = async () => {
    const { getfoodItemDetails, getAllInfo } = this;

    let foodItemsDetailsData = {};
    let food_item_detail_ids = [];

    const allFoodItemDetails = getfoodItemDetails() || [];

    if (allFoodItemDetails.length > 0) {
      for (let index = 0; index < allFoodItemDetails.length; index++) {
        const { id = null } = allFoodItemDetails[index] || {};
        const foodItemDetail = await FoodItemDetailsWrapper({ id });
        foodItemsDetailsData[foodItemDetail.getId()] =
          await foodItemDetail.getBasicInfo();
        food_item_detail_ids.push(foodItemDetail.getId());
      }
    }

    return {
      food_items: {
        [this.getId()]: {
          ...(await getAllInfo()),
        },
      },
      food_item_details: {
        ...foodItemsDetailsData,
      },
      food_item_detail_ids,
    };
  };

  getAllInfo = async () => {
    const { getfoodItemDetails, getBasicInfo } = this;
    let food_item_detail_ids = [];

    const allFoodItemDetails = getfoodItemDetails() || [];

    if (allFoodItemDetails.length > 0) {
      for (let index = 0; index < allFoodItemDetails.length; index++) {
        const { id } = allFoodItemDetails[index];
        food_item_detail_ids.push(id);
      }
    }

    return {
      ...getBasicInfo(),
      food_item_detail_ids,
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data !== null) {
    return new FoodItemWrapper(data);
  }
  const foodItemService = new FoodItemService();
  const foodItem = await foodItemService.findOne({ id });
  return new FoodItemWrapper(foodItem);
};
