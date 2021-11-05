//services
import BaseDietFoodGroupMapping from "../../../services/dietFoodGroupMapping/index";
import DietFoodGroupMappingService from "../../../services/dietFoodGroupMapping/dietFoodGroupMapping.service";
import SimilarFoodMappingService from "../../../services/similarFoodMapping/similarFoodMapping.service";

//Wrapper
import FoodGroupWrapper from "../foodGroup";
import DietWrapper from "../diet";
import SimilarFoodMappingWrapper from "../similarFoodMapping";

class DietFoodGroupMappingWrapper extends BaseDietFoodGroupMapping {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, time, food_group_id, diet_id } = _data || {};

    return {
      basic_info: {
        id,
        time,
        food_group_id,
        diet_id,
      },
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo } = this;
    const similarFoodMappingService = new SimilarFoodMappingService();
    let related_diet_food_group_mapping_ids = [];
    const diet_food_grouping_mapping_id = this.getId();

    const { count = null, rows = [] } =
      await similarFoodMappingService.findAndCountAll({
        where: { related_to_id: diet_food_grouping_mapping_id },
        attributes: ["secondary_id"],
      });

    if (count && count > 0) {
      for (let i = 0; i < rows.length; i++) {
        const { secondary_id = null } = rows[i];
        related_diet_food_group_mapping_ids.push(secondary_id);
      }
    }

    return {
      ...getBasicInfo(),
      related_diet_food_group_mapping_ids,
    };
  };

  getReferenceInfo = async () => {
    const { getBasicInfo, getSimilarFoodMappings } = this;
    let dietApiData = {};
    let similar_food_mapping_ids = [];

    const similarFoodMappingService = new SimilarFoodMappingService();
    const food_group_id = this.getFoodGroupId();
    const diet_id = this.getDietId();
    const diet_food_grouping_mapping_id = this.getId();

    let portionsApiData = {},
      foodGroupsApiData = {},
      foodItemDetailsApiData = {},
      foodItemsApiData = {},
      similarFoodMappingApiData = {};

    const foodGroupData = await FoodGroupWrapper({ id: food_group_id });
    const dietData = await DietWrapper({ id: diet_id });

    const {
      food_groups = {},
      portions = {},
      food_item_details = {},
      food_items = {},
    } = await foodGroupData.getReferenceInfo();

    portionsApiData = { ...portions };
    foodGroupsApiData = { ...food_groups };
    foodItemDetailsApiData = { ...food_item_details };
    foodItemsApiData = { ...food_items };
    dietApiData[dietData.getId()] = dietData.getBasicInfo();

    const similar_food_mappings = getSimilarFoodMappings();
    if (similar_food_mappings.length > 0) {
      for (let index = 0; index < similar_food_mappings.length; index++) {
        const SimilarFoodMapingDetail = await SimilarFoodMappingWrapper({
          data: similar_food_mappings[index],
        });

        similarFoodMappingApiData[SimilarFoodMapingDetail.getId()] =
          await SimilarFoodMapingDetail.getBasicInfo();
      }
    }

    const { count = null, rows = [] } =
      await similarFoodMappingService.findAndCountAll({
        where: { related_to_id: diet_food_grouping_mapping_id },
        attributes: ["secondary_id"],
      });

    if (count && count > 0) {
      for (let i = 0; i < rows.length; i++) {
        const { secondary_id = null } = rows[i];
        similar_food_mapping_ids.push(secondary_id);
      }
    }

    return {
      diet_food_grouping_mappings: {
        [`${this.getId()}`]: {
          ...(await this.getAllInfo()),
        },
      },
      food_groups: { ...foodGroupsApiData },
      portions: { ...portionsApiData },
      food_items: { ...foodItemsApiData },
      food_item_details: { ...foodItemDetailsApiData },
      diets: { ...dietApiData },
      similar_food_mappings: { ...similarFoodMappingApiData },
    };
  };
}

export default async ({ data = null, id = null }) => {
  if (data !== null) {
    return new DietFoodGroupMappingWrapper(data);
  }
  const dietFoodGroupMappingService = new DietFoodGroupMappingService();
  const dietFoodGroupMapping = await dietFoodGroupMappingService.getByData({
    id,
  });
  return new DietFoodGroupMappingWrapper(dietFoodGroupMapping);
};
