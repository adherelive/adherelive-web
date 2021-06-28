import Logger from "../../../libs/log";

const Log = new Logger("DIET > HELPER");

export const getTimeWiseDietFoodGroupMappings = async ({
        diet_food_group_mappings
}) => {
  try {
    
    let timeWiseData = {};
    let allIds = [];
    
    for(let each in diet_food_group_mappings){
        
        const { 
            basic_info : {
             day = null , time = null 
            } = {} ,
            related_diet_food_group_mapping_ids =[]

        } = diet_food_group_mappings[each] || {} ;

        const forTime = timeWiseData[time] || {} ;

        let { mappingIds  = [] } = forTime || {};
        const eachInt = parseInt(each);

          if(related_diet_food_group_mapping_ids.length){
            let tempArr = mappingIds.slice();            
            for(let id of mappingIds){
              if( !Array.isArray(id) && related_diet_food_group_mapping_ids.includes(id)){
                const index = tempArr.indexOf(id);
                if (index > -1) {
                  tempArr.splice(index, 1);
                }

              }

            }
            // related_diet_food_group_mapping_ids.push(eachInt);
            related_diet_food_group_mapping_ids.splice(0, 0, eachInt);
            tempArr.push(related_diet_food_group_mapping_ids);
            mappingIds = tempArr;
            allIds.push(eachInt);
            related_diet_food_group_mapping_ids.forEach(element => {
              allIds.push(element);
            });

          }else if (!allIds.includes(eachInt)){
            mappingIds.push(eachInt);
            allIds.push(eachInt);

          }


          timeWiseData = {
                ...timeWiseData,
                    [`${time}`]:{
                        ...forTime,
                        ['mappingIds']:mappingIds
                }
            }

    }


    return timeWiseData ;

  } catch (error) {
    throw error;
  }
};


export const daysDietPlan = async () => {
  try {
    
  } catch(error) {
    Log.debug("createDiet catch error", error);
    return null;
  }
};
