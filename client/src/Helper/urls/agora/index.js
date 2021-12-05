export const getVideoAccessToken = (userId) => {
  return `/agora/video/token/${userId}`;
};

export const startCall = () => `/agora/start`;

export const missedCall = () => `/agora/missed`;
