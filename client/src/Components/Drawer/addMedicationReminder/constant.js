import {
  USER_CATEGORY,
  ACTIVITY_TYPE,
  APPOINTMENT_TYPE,
} from "../../../constant";
import messages from "./message";

const DEFAULT = "DEFAULT";

const APPOINTMENT_FOR_CREATE_CONFIG = {
  [USER_CATEGORY.CARE_COACH]: {
    [USER_CATEGORY.PATIENT]: {
      activity: [
        {
          value: APPOINTMENT_TYPE.FOLLOWUP,
          label: messages.followup,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MEDICATION,
          label: messages.medication,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MATERIAL_DELIVERY,
          label: messages.materialDelivery,
          disable: false,
        },
      ],
      mode: {
        [APPOINTMENT_TYPE.FOLLOWUP]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MATERIAL_DELIVERY]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MEDICATION]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
      },
    },
    [USER_CATEGORY.DOCTOR]: {
      activity: [
        {
          value: APPOINTMENT_TYPE.FOLLOWUP,
          label: messages.followup,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MEDICATION,
          label: messages.medication,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MATERIAL_DELIVERY,
          label: messages.materialDelivery,
          disable: false,
        },
      ],
      mode: {
        [APPOINTMENT_TYPE.FOLLOWUP]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MATERIAL_DELIVERY]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MEDICATION]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
      },
    },
    [DEFAULT]: {
      activity: [
        {
          value: APPOINTMENT_TYPE.FOLLOWUP,
          label: messages.followup,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MEDICATION,
          label: messages.medication,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MATERIAL_DELIVERY,
          label: messages.materialDelivery,
          disable: false,
        },
      ],
      mode: {
        [APPOINTMENT_TYPE.FOLLOWUP]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MATERIAL_DELIVERY]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MEDICATION]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
      },
    },
    [USER_CATEGORY.DOCTOR]: {
      activity: [
        {
          value: APPOINTMENT_TYPE.FOLLOWUP,
          label: messages.followup,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MEDICATION,
          label: messages.medication,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MATERIAL_DELIVERY,
          label: messages.materialDelivery,
          disable: false,
        },
      ],
      mode: {
        [APPOINTMENT_TYPE.FOLLOWUP]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MATERIAL_DELIVERY]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MEDICATION]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
      },
    },
  },
  [USER_CATEGORY.PATIENT]: {
    [USER_CATEGORY.DOCTOR]: {
      activity: [
        {
          value: APPOINTMENT_TYPE.FOLLOWUP,
          label: messages.followup,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MEDICATION,
          label: messages.medication,
          disable: true,
        },
        {
          value: APPOINTMENT_TYPE.MATERIAL_DELIVERY,
          label: messages.materialDelivery,
          disable: true,
        },
      ],
      mode: {
        [APPOINTMENT_TYPE.FOLLOWUP]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: true,
          },
        ],
      },
    },
    [USER_CATEGORY.CARE_COACH]: {
      activity: [
        {
          value: APPOINTMENT_TYPE.FOLLOWUP,
          label: messages.followup,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MEDICATION,
          label: messages.medication,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MATERIAL_DELIVERY,
          label: messages.materialDelivery,
          disable: false,
        },
      ],
      mode: {
        [APPOINTMENT_TYPE.FOLLOWUP]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MATERIAL_DELIVERY]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MEDICATION]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
      },
    },
    [DEFAULT]: {
      activity: [
        {
          value: APPOINTMENT_TYPE.FOLLOWUP,
          label: messages.followup,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MEDICATION,
          label: messages.medication,
          disable: false,
        },
        {
          value: APPOINTMENT_TYPE.MATERIAL_DELIVERY,
          label: messages.materialDelivery,
          disable: false,
        },
      ],
      mode: {
        [APPOINTMENT_TYPE.FOLLOWUP]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MATERIAL_DELIVERY]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: true,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
        [APPOINTMENT_TYPE.MEDICATION]: [
          {
            value: ACTIVITY_TYPE.CALL,
            label: messages.call,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.CHAT,
            label: messages.textEmail,
            disable: false,
          },
          {
            value: ACTIVITY_TYPE.VISIT,
            label: messages.visit,
            disable: false,
          },
        ],
      },
    },
  },
};

const getAppointmentDataForEdit = (event = {}, viewer, other) => {
  const { activityType, activityMode } = event;

  return {
    activity: [
      {
        value: APPOINTMENT_TYPE.FOLLOWUP,
        label: messages.followup,
        disable: activityType !== APPOINTMENT_TYPE.FOLLOWUP,
      },
      {
        value: APPOINTMENT_TYPE.MEDICATION,
        label: messages.medication,
        disable: activityType !== APPOINTMENT_TYPE.MEDICATION,
      },
      {
        value: APPOINTMENT_TYPE.MATERIAL_DELIVERY,
        label: messages.materialDelivery,
        disable: activityType !== APPOINTMENT_TYPE.MATERIAL_DELIVERY,
      },
    ],
    mode: {
      [APPOINTMENT_TYPE.FOLLOWUP]: [
        {
          value: ACTIVITY_TYPE.CALL,
          label: messages.call,
          disable: activityMode !== ACTIVITY_TYPE.CALL,
        },
        {
          value: ACTIVITY_TYPE.CHAT,
          label: messages.textEmail,
          disable: activityMode !== ACTIVITY_TYPE.CHAT,
        },
        {
          value: ACTIVITY_TYPE.VISIT,
          label: messages.visit,
          disable: activityMode !== ACTIVITY_TYPE.VISIT,
        },
      ],
      [APPOINTMENT_TYPE.MATERIAL_DELIVERY]: [
        {
          value: ACTIVITY_TYPE.CALL,
          label: messages.call,
          disable: activityMode !== ACTIVITY_TYPE.CALL,
        },
        {
          value: ACTIVITY_TYPE.CHAT,
          label: messages.textEmail,
          disable: activityMode !== ACTIVITY_TYPE.CHAT,
        },
        {
          value: ACTIVITY_TYPE.VISIT,
          label: messages.visit,
          disable: activityMode !== ACTIVITY_TYPE.VISIT,
        },
      ],
      [APPOINTMENT_TYPE.MEDICATION]: [
        {
          value: ACTIVITY_TYPE.CALL,
          label: messages.call,
          disable: activityMode !== ACTIVITY_TYPE.CALL,
        },
        {
          value: ACTIVITY_TYPE.CHAT,
          label: messages.textEmail,
          disable: activityMode !== ACTIVITY_TYPE.CHAT,
        },
        {
          value: ACTIVITY_TYPE.VISIT,
          label: messages.visit,
          disable: activityMode !== ACTIVITY_TYPE.VISIT,
        },
      ],
    },
  };
};

const getAppointmentDataForCreate = (viewer, other) => {
  return APPOINTMENT_FOR_CREATE_CONFIG[viewer][other];
};

export const getActivityBetween = ({
  viewer = {},
  other = {},
  event = {},
  edit = false,
}) => {
  const { basicInfo: { category: viewerCategory } = {} } = viewer;
  const { basicInfo: { category: otherCategory = DEFAULT } = {} } = other;
  if (edit) {
    return getAppointmentDataForEdit(event, viewerCategory, otherCategory);
  } else {
    return getAppointmentDataForCreate(viewerCategory, otherCategory);
  }
};
