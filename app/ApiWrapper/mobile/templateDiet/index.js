import BaseTemplateDiet from "../../../services/templateDiet";

import TemplateDietService from "../../../services/templateDiet/templateDiet.service";
import FoodItemDetailService from "../../../services/foodItemDetails/foodItemDetails.service";

import FoodItemDetailWrapper from "../foodItemDetails";

class TemplateDietWrapper extends BaseTemplateDiet {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            name,
            care_plan_template_id,
            total_calories,
            duration,
            details
        } = _data || {};
        return {
            basic_info: {
                id,
                name,
                care_plan_template_id,
            },
            total_calories,
            duration,
            details,
        };
    };

    getAllInfo = () => {
        const {getBasicInfo} = this;

        return {
            ...getBasicInfo(),
        };
    };

    getReferenceInfo = async () => {
        const {getId, getAllInfo, getDetails} = this;
        const {diet_food_groups = []} = getDetails() || {};
        let food_item_detail_ids = [];

        if (Object.keys(diet_food_groups).length) {
            for (let time in diet_food_groups) {
                const timeGroups = diet_food_groups[time] || [];
                for (let each in timeGroups) {

                    const eachGroup = timeGroups[each] || {};

                    const {similar = [], food_item_detail_id = null} = eachGroup || {};

                    if (food_item_detail_id) {
                        food_item_detail_ids.push(food_item_detail_id);
                    }

                    if (similar.length) {
                        for (let s in similar) {
                            const eachSimilar = similar[s] || {};
                            const {food_item_detail_id: similar_food_item_detail_id = null} = similar[s] || {};
                            if (similar_food_item_detail_id) {
                                food_item_detail_ids.push(similar_food_item_detail_id);
                            }
                        }
                    }

                }

            }
        }


        const foodItemDetailService = new FoodItemDetailService();

        let foodItemDetails = [];

        if (food_item_detail_ids) {
            const {rows = []} = await foodItemDetailService.findAndCountAll({
                where: {
                    id: food_item_detail_ids
                }
            }) || {};

            foodItemDetails = rows;
        }


        let allFoodItemDetails = {};
        let allFoodItems = {};
        let allPortions = {};
        if (foodItemDetails.length > 0) {
            for (let index = 0; index < foodItemDetails.length; index++) {
                const foodItemDetail = await FoodItemDetailWrapper({data: foodItemDetails[index]});
                const {food_item_details, food_items, portions} = await foodItemDetail.getReferenceInfo();
                allFoodItemDetails = {...allFoodItemDetails, ...food_item_details};
                allFoodItems = {...allFoodItems, ...food_items};
                allPortions = {...allPortions, ...portions};
            }
        }

        return {
            template_diets: {
                [getId()]: {
                    ...getAllInfo()
                }
            },
            food_item_details: allFoodItemDetails,
            food_items: allFoodItems,
            portions: allPortions
        }
    };


}

export default async ({data = null, id = null}) => {
    if (data !== null) {
        return new TemplateDietWrapper(data);
    }
    const templateDietService = new TemplateDietService();
    const templateDiet = await templateDietService.findOne({id});
    return new TemplateDietWrapper(templateDiet);
};
