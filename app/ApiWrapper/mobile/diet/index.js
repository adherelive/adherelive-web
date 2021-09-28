//services
import BaseDiet from "../../../services/diet/index";
import DietService from "../../../services/diet/diet.service";

//Wrapper
import DietFoodGroupMappingWrapper from "../dietFoodGroupMapping";

class DietWrapper extends BaseDiet {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      name,
      total_calories,
      start_date,
      end_date,
      care_plan_id,
      details,
      expired_on
    } = _data || {};

    return {
      basic_info: {
        id,
        name,
        total_calories,
        start_date,
        end_date,
        care_plan_id
      },
      details,
      expired_on
    };
  };

  getReferenceInfo = async () => {
    const { getDietFoodGroupMappings, getAllInfo, getId } = this;
    const dietFoodGroupMappings = getDietFoodGroupMappings() || [];

    let dietFoodGroupMappingData = {},
      foodGroupsApiData = {},
      portionsApiData = {},
      foodItemsApiData = {},
      foodItemDetailsApiData = {};

    if (dietFoodGroupMappings.length > 0) {
      for (let index = 0; index < dietFoodGroupMappings.length; index++) {
        const { id } = dietFoodGroupMappings[index] || {};
        const dietFoodGroupMappingWrapper = await DietFoodGroupMappingWrapper({
          id
        });

        const {
          diet_food_grouping_mappings = {},
          food_groups = {},
          portions = {},
          food_items = {},
          food_item_details = {}
        } = await dietFoodGroupMappingWrapper.getReferenceInfo();

        dietFoodGroupMappingData = {
          ...dietFoodGroupMappingData,
          ...diet_food_grouping_mappings
        };
        foodGroupsApiData = { ...foodGroupsApiData, ...food_groups };
        portionsApiData = { ...portionsApiData, ...portions };
        foodItemsApiData = { ...foodItemsApiData, ...food_items };
        foodItemDetailsApiData = {
          ...foodItemDetailsApiData,
          ...food_item_details
        };
      }
    }

    return {
      diets: {
        [getId()]: {
          ...getAllInfo()
        }
      },
      diet_food_group_mappings: dietFoodGroupMappingData,
      food_groups: foodGroupsApiData,
      portions: portionsApiData,
      food_items: foodItemsApiData,
      food_item_details: foodItemDetailsApiData
    };
  };

  getAllInfo = () => {
    const { getDietFoodGroupMappings, getBasicInfo } = this;
    let diet_food_group_mapping_ids = [];

    const allMappings = getDietFoodGroupMappings() || [];

    if (allMappings.length > 0) {
      for (let index = 0; index < allMappings.length; index++) {
        const { id } = allMappings[index];
        diet_food_group_mapping_ids.push(id);
      }
    }
    return {
      ...getBasicInfo(),
      diet_food_group_mapping_ids
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data !== null) {
    return new DietWrapper(data);
  }
  const dietService = new DietService();
  const diet = await dietService.findOne({ id });
  return new DietWrapper(diet);
};
