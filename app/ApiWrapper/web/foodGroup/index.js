//services
import BaseFoodGroup from "../../../services/foodGroup/index";
import FoodGroupService from "../../../services/foodGroup/foodGroup.service";
//Wrapper
import FoodItemDetailsWrapper from "../foodItemDetails";
import PortionWrapper from "../portions";

class FoodGroupWrapper extends BaseFoodGroup {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const { _data } = this;
        const {
            id,
            portion_id,
            serving,
            food_item_detail_id,
            details
        } = _data || {};

        return {
            basic_info: {
                id,
                portion_id,
                serving,
                food_item_detail_id,
            },
            details
        };
    };


   
    getAllInfo = async () => {
        const { getBasicInfo } = this;

        return {
        ...getBasicInfo(),
        };
    };

    getReferenceInfo = async() => {
         
        const { getBasicInfo , getId }=this;
        let portionData = {};

        const foodItemDetailsId = await this.getFoodItemDetailsId();
        const foodItemDetailsData = await FoodItemDetailsWrapper({id:foodItemDetailsId});

        const portion_id = this.getPortionId();
        const portionWrapper = await PortionWrapper({id:portion_id});
    
        portionData[`${portion_id}`] =  await portionWrapper.getBasicInfo();
      
        return {
            food_groups:{
                [`${getId()}`]:{...(await getBasicInfo())}
            },
            portions:{
                ...portionData
            },
            ...(await foodItemDetailsData.getReferenceInfo())
        };

    }
}



export default async ({data = null, id = null}) => {
    if (data !== null) {
        return new FoodGroupWrapper(data);
    }
    const foodGroupService =new FoodGroupService();
    const foodGroup = await foodGroupService.getByData({ id });
    return new FoodGroupWrapper(foodGroup);
};
