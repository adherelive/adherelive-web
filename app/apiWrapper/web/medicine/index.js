import BaseMedicine from "../../../services/medicine";
import medicineService from "../../../services/medicine/medicine.service";

class MedicineWrapper extends BaseMedicine {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    // if (!_data) return { basic_info: {} }; // Handle null _data upfront
    const {
      id,
      name,
      type,
      description,
      creator_id,
      details,
      public_medicine,
    } = _data || {};
    return {
      basic_info: {
        id,
        name,
        type,
        details,
        description,
        creator_id,
        details,
        public_medicine,
      },
    };
  };

  getBasicInfoBulk = () => {
    const { _arrData, getExistingData, setCurrentData, _objectName } = this;
    // if (!_arrData || _arrData.length === 0) return { [_objectName]: {} };

    let cumulativeData = {};
    _arrData.forEach((data) => {
      setCurrentData(data);
      const medicineData = getExistingData();
      const { id, name, type, description, creator_id, public_medicine } =
        medicineData || {};
      cumulativeData[id] = {
        basic_info: {
          id,
          name,
          type,
          description,
          creator_id,
          public_medicine,
        },
      };
    });

    return {
      [_objectName]: {
        ...cumulativeData,
      },
    };
  };

  getAllInfo = () => {
    const { _data } = this;
    // if (!_data) return {}; // Handle null _data upfront
    const {
      id,
      name,
      type,
      description,
      creator_id,
      details,
      public_medicine,
      updated_at,
      created_at,
    } = _data || {};

    return {
      basic_info: {
        id,
        name,
        type,
        description,
        creator_id,
        public_medicine,
      },
      details,
      updated_at: updated_at,
      created_at: created_at,
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MedicineWrapper(data);
  }
  // if (!id) return new MedicineWrapper(null); // Handle null id case

  // try {
  const medicine = await medicineService.getMedicineById(id);
  return new MedicineWrapper(medicine);
  // } catch (error) {
  //   console.error("Error fetching medicine: ", error);
  //   return new MedicineWrapper(null); // Or throw the error if you want it to propagate
  // }
};
