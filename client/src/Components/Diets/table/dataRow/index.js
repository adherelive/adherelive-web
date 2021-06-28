import { TABLE_COLUMN } from "../helper";

export default data => {
  const { id,
     openResponseDrawer,
     openEditDrawer,
    dietData,
     formatMessage } = data;

  return {
    key: id,
    [TABLE_COLUMN.NAME.dataIndex]: {
        dietData
    },
    [TABLE_COLUMN.DURATION.dataIndex]: {
        dietData
    },
    [TABLE_COLUMN.REPEAT_DAYS.dataIndex]: {
      dietData
    },
    [TABLE_COLUMN.CALORIES.dataIndex]: {
      dietData
    },
    [TABLE_COLUMN.TIMELINE.dataIndex]: {
      id,
      openResponseDrawer,
      formatMessage
    },
    [TABLE_COLUMN.EDIT.dataIndex]: {
      id,
      openEditDrawer,
      formatMessage
    },
  };
};
