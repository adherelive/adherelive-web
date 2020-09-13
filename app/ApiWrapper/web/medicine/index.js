import BaseMedicine from "../../../services/medicine";
import medicineService from "../../../services/medicine/medicine.service";

class MedicineWrapper extends BaseMedicine {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {id, name, type, description} = _data || {};
        return {
            basic_info: {
                id,
                name,
                type,
                description
            }
        };
    };

    getBasicInfoBulk = () => {
        const {_arrData, getExistingData, setCurrentData, _objectName} = this;

        let cumulativeData = {};
        _arrData.forEach(data => {
            setCurrentData(data);
            const medicineData = getExistingData();
            const {id, name, type, description} = medicineData || {};
            cumulativeData[id] = {
                basic_info: {
                    id,
                    name,
                    type,
                    description
                }
            };
        });

        return {
            [_objectName]: {
                ...cumulativeData
            }
        }
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new MedicineWrapper(data);
    }
    const medicine = await medicineService.getMedicineByData({id});
    return new MedicineWrapper(medicine);
}