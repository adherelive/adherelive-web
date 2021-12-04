//services
import BaseFoodItemDetails from "../../../services/foodItemDetails/index";
import FoodItemDetailsService from "../../../services/foodItemDetails/foodItemDetails.service";
// wrappers
import FoodItemWrapper from "../foodItem";
import PortionWrapper from "../portions";

class FoodItemDetailsWrapper extends BaseFoodItemDetails {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {_data} = this;
    const {
      id,
      food_item_id,
      calorific_value,
      carbs,
      proteins,
      fats,
      fibers,
      details,
      portion_id,
      portion_size,
      creator_id,
      creator_type,
    } = _data || {};
    
    return {
      basic_info: {
        id,
        food_item_id,
        calorific_value,
        carbs,
        proteins,
        fats,
        fibers,
        portion_id,
        portion_size,
        creator_id,
        creator_type,
      },
      details,
    };
  };
  
  getReferenceInfo = async () => {
    const foodItemId = this.getFoodItemId();
    const foodItemWrapper = await FoodItemWrapper({id: foodItemId});
    let foodItemApiData = {};
    foodItemApiData[foodItemWrapper.getId()] =
      await foodItemWrapper.getBasicInfo();
    const portionId = this.getPortionId();
    const portionWrapper = await PortionWrapper({id: portionId});
    let portionData = {};
    portionData[portionId] = portionWrapper.getBasicInfo();
    
    return {
      food_item_details: {
        [this.getId()]: {...(await this.getBasicInfo())},
      },
      food_items: {
        ...foodItemApiData,
      },
      portions: {
        ...portionData,
      },
    };
  };
  
  getPortionDetails = async () => {
    const portionId = this.getPortionId();
    const portionWrapper = await PortionWrapper({id: portionId});
    const portionData = await portionWrapper.getBasicInfo();
    return {
      ...portionData,
    };
  };
}

export default async ({data = null, id = null}) => {
  if (data !== null) {
    return new FoodItemDetailsWrapper(data);
  }
  const foodItemDetailsService = new FoodItemDetailsService();
  const foodItemDetail = await foodItemDetailsService.findOne({id});
  
  return new FoodItemDetailsWrapper(foodItemDetail);
};
