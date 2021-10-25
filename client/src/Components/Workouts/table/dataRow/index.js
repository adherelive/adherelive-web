import { TABLE_COLUMN } from "../helper";

export default (data) => {
  const {
    id,
    openResponseDrawer,
    openEditDrawer,
    workoutData,
    formatMessage,
    canViewDetails = false,
  } = data;

  return {
    key: id,
    [TABLE_COLUMN.NAME.dataIndex]: {
      workoutData,
      formatMessage,
    },
    [TABLE_COLUMN.DURATION.dataIndex]: {
      workoutData,
    },
    [TABLE_COLUMN.REPEAT_DAYS.dataIndex]: {
      workoutData,
    },
    [TABLE_COLUMN.CALORIES.dataIndex]: {
      workoutData,
    },
    [TABLE_COLUMN.TIMELINE.dataIndex]: {
      id,
      openResponseDrawer,
      formatMessage,
    },
    [TABLE_COLUMN.EDIT.dataIndex]: {
      id,
      workoutData,
      openEditDrawer,
      formatMessage,
      canViewDetails,
    },
  };
};
