//Services
import BaseMealTemplateFoodItemMapping from "../../../services/mealTemplateFoodItemMapping/index";
import MealTemplateFoodItemMappingService from "../../../services/mealTemplateFoodItemMapping/mealTemplateFoodItemMapping.service";

//Wrappers
import MealTemplateWrapper from "../mealTemplate";
import foodItemDetailsWrapper from "../foodItemDetails";

class MealTemplateFoodItemMappingWrapper extends BaseMealTemplateFoodItemMapping {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const { _data } = this;
        const {
            id,
            meal_template_id,
            food_item_detail_id
        } = _data || {};

        return {
            basic_info: {
                id,
                meal_template_id,
                food_item_detail_id
            }
        };
    };

    getAllInfo = async () => {
        const { getBasicInfo } = this;

        return {
        ...getBasicInfo(),
        };
    };

    getReferenceInfo = async () => {
        const {getBasicInfo} = this;

        const meal_template_id = this.getMealTemplateId();

        const food_detail_item_id = this.getFoodItemDetailId();
        let mealTemplateApiData={} , foodItemDetailApiData = {};  

        const mealTemplateData = await MealTemplateWrapper({id:meal_template_id});
        mealTemplateApiData[ mealTemplateData.getId()] = mealTemplateData.getBasicInfo()

        const foodItemDetails = await foodItemDetailsWrapper({id:food_detail_item_id});
        foodItemDetailApiData[foodItemDetails.getId()] = foodItemDetails.getBasicInfo();

        return {
            meal_template_food_item_mapping : {
                [`${this.getId()}`]:{...getBasicInfo()}
            },
            meal_templates:{ ...mealTemplateApiData },
            food_item_details: { ...foodItemDetailApiData }
        }

    }
}



export default async ({data = null, id = null}) => {
    if (data !== null) {
        return new MealTemplateFoodItemMappingWrapper(data);
    }
    const mealTemplateFoodItemMappingService = new MealTemplateFoodItemMappingService();
    const mapping = await mealTemplateFoodItemMappingService.getByData({ id });
    return new MealTemplateFoodItemMappingWrapper(mapping);
};
