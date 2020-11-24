import { TABLE_COLUMN } from "../helper";

export default data => {
  const { basic_info:{id = null} = {}} = data;
  // console.log("data in datarow",data);

  return {
    key: id,
    [TABLE_COLUMN.NAME.dataIndex]: {
     data
    },
    [TABLE_COLUMN.TYPE.dataIndex]: {
      data
    },
    [TABLE_COLUMN.AMOUNT.dataIndex]: {
      data
    },
    [TABLE_COLUMN.DELETE.dataIndex]: {
      data
    }
  };
};
