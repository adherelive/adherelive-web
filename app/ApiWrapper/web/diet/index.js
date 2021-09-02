//services
import BaseDiet from "../../../services/diet/index";
import DietService from "../../../services/diet/diet.service";

//Wrapper
import CareplanWrapper from "../carePlan";
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
    const { getDietFoodGroupMappings } = this;
    const dietFoodGroupMappings = getDietFoodGroupMappings() || [];

    const careplanId = await this.getCareplanId();
    const careplanData = await CareplanWrapper(null, careplanId);

    let dietFoodGroupMappingData = {},
      dietsApiData = {},
      foodGroupsApiData = {},
      portionsApiData = {},
      foodItemsApiData = {},
      foodItemDetailsApiData = {};
    let careplanApiData = {},
      similiarFoodMappingApiData;

    if (dietFoodGroupMappings.length > 0) {
      for (let i = 0; i < dietFoodGroupMappings.length; i++) {
        const mapping = dietFoodGroupMappings[i];
        const { id = null } = mapping || {};
        const dietFoodGroupMappingWrapper = await DietFoodGroupMappingWrapper({
          id
        });

        const {
          diet_food_grouping_mappings = {},
          food_groups = {},
          diets = {},
          portions = {},
          food_items = {},
          food_item_details = {},
          similar_food_mappings = {}
        } = await dietFoodGroupMappingWrapper.getReferenceInfo();

        dietFoodGroupMappingData = {
          ...dietFoodGroupMappingData,
          ...diet_food_grouping_mappings
        };
        foodGroupsApiData = { ...foodGroupsApiData, ...food_groups };
        dietsApiData = { ...dietsApiData, ...diets };
        portionsApiData = { ...portionsApiData, ...portions };
        foodItemsApiData = { ...foodItemsApiData, ...food_items };
        foodItemDetailsApiData = {
          ...foodItemDetailsApiData,
          ...food_item_details
        };
        similiarFoodMappingApiData = {
          ...similiarFoodMappingApiData,
          ...similar_food_mappings
        };
      }
    }

    careplanApiData[
      careplanData.getCarePlanId()
    ] = await careplanData.getAllInfo();

    return {
      diets: {
        ...dietsApiData
      },
      care_plans: { ...careplanApiData },
      diet_food_group_mappings: {
        ...dietFoodGroupMappingData
      },
      food_groups: {
        ...foodGroupsApiData
      },
      portions: {
        ...portionsApiData
      },
      food_items: {
        ...foodItemsApiData
      },
      food_item_details: {
        ...foodItemDetailsApiData
      },
      similar_food_mappings: {
        ...similiarFoodMappingApiData
      }
    };
  };

  getAllInfo = async () => {
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
