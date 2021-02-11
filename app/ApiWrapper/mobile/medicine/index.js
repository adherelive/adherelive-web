import BaseMedicine from "../../../services/medicine";
import medicineService from "../../../services/medicine/medicine.service";

class MobileMedicineWrapper extends BaseMedicine {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, name, type, description, creator_id } = _data || {};
    return {
      basic_info: {
        id,
        name,
        type,
        description,
        creator_id
      }
    };
  };

  getBasicInfoBulk = () => {
    const { _data, getExistingData, setCurrentData, _objectName } = this;

    let cumulativeData = {};
    _data.forEach(data => {
      // setCurrentData(data);
      // const medicineData = getExistingData();
      const { id, name, type, description, creator_id} = data || {};
      cumulativeData[id] = {
        basic_info: {
          id,
          name,
          type,
          description,
          creator_id
        }
      };
    });

    return {
      [_objectName]: {
        ...cumulativeData
      }
    };
  };

  getAllInfo = () => {
    const { _data } = this;
    const { id, name, type, description, creator_id, details } = _data || {};

    return {
      basic_info: {
        id,
        name,
        type,
        description,
        creator_id
      },
      details
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MobileMedicineWrapper(data);
  }
  const medicine = await medicineService.getMedicineById(id);
  return new MobileMedicineWrapper(medicine);
};
