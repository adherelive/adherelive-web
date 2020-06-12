
import BaseMedicine from "../../../services/medicine";
import { OBJECT_NAME } from "../../../../constant";
import medicineService from "../../../services/medicine/medicine.service";

class MobileMedicineWrapper extends BaseMedicine {
    constructor(data) {
        super(data);
        this._objectName = OBJECT_NAME.MEDICINE;
    }

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

export default async (data, id = null) => {
    if(!id) {
        return new MobileMedicineWrapper(data);
    }
    const medicine = await medicineService.getMedicineByData({id});
    return new MobileMedicineWrapper(medicine);
}