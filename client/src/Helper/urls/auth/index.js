export const googleSignInUrl = () => {
  return "/auth/googleSignIn";
};

export const facebookSignInUrl = () => {
  return "/auth/facebookSignIn";
};

export const getInitialData = () => {
  return `/auth/get-basic-info`;
};

export const signInUrl = () => {
  return `/auth/sign-in`;
};

export const forgotPasswordUrl = () => {
  return `/auth/forgot-password`;
};

export const verifyResetPasswordLinkUrl = (link) => {
  return `/auth/verify/${link}`;
};

export const resetPasswordUrl = () => {
  return `/auth/password-reset`;
};

export const signUpUrl = () => {
  return `/auth/sign-up`;
};

export const signOutUrl = () => {
  return `/auth/sign-out`;
};

export const getVerifyUserUrl = (link) => {
  return `/auth/register/${link}`;
};

export const giveUserConsentUrl = () => {
  return `/auth/consent`;
};

export const uploadDocument = () => {
  return `/auth/upload`;
};
