export const fetchGetAllFeaturesUrl = () => {
  return `/features`;
};

export const fetchToggleChatPermissionUrl = (patientId) => {
  return `/features/toggleChatMessagePermission/${patientId}`;
};

export const fetchToggleVideoCallPermissionUrl = (patientId) => {
  return `/features/toggleVideoCallPermission/${patientId}`;
};
