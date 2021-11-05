//services
import BaseMealTemplate from "../../../services/mealTemplate/index";
import MealTemplateService from "../../../services/mealTemplate/mealTemplate.service";

//Wrapper
import FoodItemDetailsWrapper from "../foodItemDetails";

class MealTemplateWrapper extends BaseMealTemplate {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, name, creator_id, creator_type, details } = _data || {};
    return {
      basic_info: {
        id,
        name,
        creator_id,
        creator_type,
      },
      details,
    };
  };

  getAllInfo = async () => {
    const { getFoodItemDetails, getBasicInfo } = this;
    let food_item_detail_ids = [];

    const allFoodItemDetails = getFoodItemDetails() || [];

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

  getReferenceInfo = async () => {
    const { getFoodItemDetails, getId, getAllInfo } = this;

    const allFoodItemDetails = getFoodItemDetails() || [];

    let foodItemsDetailsData = {};
    let food_item_detail_ids = [];
    if (allFoodItemDetails.length > 0) {
      for (let index = 0; index < allFoodItemDetails.length; index++) {
        const FoodItemDetails = await FoodItemDetailsWrapper({
          data: allFoodItemDetails[index],
        });
        foodItemsDetailsData[FoodItemDetails.getId()] =
          FoodItemDetails.getBasicInfo();
        food_item_detail_ids.push(FoodItemDetails.getId());
      }
    }

    return {
      meal_templates: {
        [getId()]: {
          ...(await getAllInfo()),
        },
      },
      food_item_details: {
        ...foodItemsDetailsData,
      },
      food_item_detail_ids,
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data !== null) {
    return new MealTemplateWrapper(data);
  }
  const mealTemplateService = new MealTemplateService();
  const mealTemplate = await mealTemplateService.findOne({ id });
  return new MealTemplateWrapper(mealTemplate);
};
