import {
  REQUEST_TYPE,
  USER_CATEGORY,
  PATH,
  ONBOARDING_STATUS,
} from "../../constant";
import { doRequest } from "../../Helper/network";
import { Auth } from "../../Helper/urls";

export const SIGNING = "SIGNING";
export const SIGNING_COMPLETED = "SIGNING_COMPLETED";
export const SIGNING_COMPLETED_WITH_ERROR = "SIGNING_COMPLETED_WITH_ERROR";

export const VERIFY_USER = "VERIFY_USER";
export const VERIFY_USER_COMPLETED = "VERIFY_USER_COMPLETED";
export const VERIFY_USER_COMPLETED_WITH_ERROR = "VERIFY_USER_COMPLETED_WITH_ERROR";

export const GOOGLE_SIGNING = "GOOGLE_SIGNING";
export const GOOGLE_SIGNING_COMPLETED = "GOOGLE_SIGNING_COMPLETED";
export const GOOGLE_SIGNING_COMPLETED_WITH_ERROR =
  "GOOGLE_SIGNING_COMPLETED_WITH_ERROR";

export const FACEBOOK_SIGNING = "FACEBOOK_SIGNING";
export const FACEBOOK_SIGNING_COMPLETED = "FACEBOOK_SIGNING_COMPLETED";
export const FACEBOOK_SIGNING_COMPLETED_WITH_ERROR =
  "FACEBOOK_SIGNING_COMPLETED_WITH_ERROR";

export const SIGNING_UP = "SIGNING_UP";
export const SIGNING_UP_COMPLETED = "SIGNING_UP_COMPLETED";
export const SIGNING_UP_COMPLETED_WITH_ERROR =
  "SIGNING_UP_COMPLETED_WITH_ERROR";

export const VALIDATING_LINK = "VALIDATING_LINK";
export const VALIDATING_LINK_COMPLETED = "VALIDATING_LINK_COMPLETED";
export const VALIDATING_LINK_COMPLETED_WITH_ERROR =
  "VALIDATING_LINK_COMPLETED_WITH_ERROR";

export const SIGNING_OUT = "SIGNING_OUT";
export const SIGNING_OUT_COMPLETED = "SIGNING_OUT_COMPLETED";
const SIGNING_OUT_COMPLETED_WITH_ERROR = "SIGNING_OUT_COMPLETED_WITH_ERROR";

export const GETTING_INITIAL_DATA = "GETTING_INITIAL_DATA";
export const GETTING_INITIAL_DATA_COMPLETED = "GETTING_INITIAL_DATA_COMPLETED";
export const GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR =
  "GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR";

export const RESET_ERROR = "RESET_ERROR";

export const RESET_UNAUTHORIZED_ERROR = "RESET_UNAUTHORIZED_ERROR";

export const RESET_PASSWORD_LINK_COMPLETED = "RESET_PASSWORD_LINK_COMPLETED";

export const GOOGLE_SIGNOUT = "GOOGLE_SIGNOUT";

export const AUTH_INITIAL_STATE = {
  authenticated: false,
};

function setAuthRedirect(user) {
  let userData = Object.values(user).length ? Object.values(user)[0] : [];

  const {
    onboarded = true,
    onboarding_status = "",
    category = USER_CATEGORY.DOCTOR,
  } = userData;
  console.log(
    "USERRRRR IN SET AUUTTTHHHHH",
    !onboarded && category == USER_CATEGORY.DOCTOR,
    onboarded,
    category,
    userData
  );
  let authRedirect ='';
  if (!onboarded && category == USER_CATEGORY.DOCTOR) {
    if (onboarding_status == ONBOARDING_STATUS.PROFILE_REGISTERED) {
      authRedirect = PATH.REGISTER_QUALIFICATIONS;
    } else if (
      onboarding_status == ONBOARDING_STATUS.QUALIFICATION_REGISTERED
    ) {
      authRedirect = PATH.REGISTER_CLINICS;
    } else {
      authRedirect = PATH.REGISTER_PROFILE;
    }
  }
  return authRedirect;
}


function setAuthRedirectSignIn(user) {
  let userData = Object.values(user).length ? Object.values(user)[0] : [];

  const {
    onboarded = true,
    onboarding_status = "",
    category = USER_CATEGORY.DOCTOR,
  } = userData;
  console.log(
    "USERRRRR IN SET AUUTTTHHHHH",
    !onboarded && category == USER_CATEGORY.DOCTOR,
    onboarded,
    category,
    userData
  );
  let authRedirect ='/';
  if (!onboarded && category == USER_CATEGORY.DOCTOR) {
    if (onboarding_status == ONBOARDING_STATUS.PROFILE_REGISTERED) {
      authRedirect = PATH.REGISTER_QUALIFICATIONS;
    } else if (
      onboarding_status == ONBOARDING_STATUS.QUALIFICATION_REGISTERED
    ) {
      authRedirect = PATH.REGISTER_CLINICS;
    } else {
      authRedirect = PATH.REGISTER_PROFILE;
    }
  }
  return authRedirect;
}

export const signIn = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: SIGNING });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Auth.signInUrl(),
        data: payload,
      });

      console.log("SIGN IN response --> ", response);

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: SIGNING_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        const { users = {} } = data;
        let authUser = Object.values(users).length ? Object.values(users)[0] : {};
        let authRedirection = setAuthRedirectSignIn(users);
        console.log(
          " ID IN 898978 SIGNUPPPP",
          authRedirection,
          authUser,
          response.payload.data.user
        );
        dispatch({
          type: SIGNING_COMPLETED,
          payload: {
            authenticatedUser: authUser,
            authRedirection,
          },
        });
      }
    } catch (err) {
      console.log("err signin", err);
      throw err;
    }

    return response;
  };
};

export const verifyUser = (link) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: VALIDATING_LINK });

      response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Auth.getVerifyUserUrl(link)
      });

      console.log("SIGN IN response --> ", response);

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: VALIDATING_LINK_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        const { users = {} } = data;
        let authUser = Object.values(users).length ? Object.values(users)[0] : {};
        let authRedirection = setAuthRedirect(users);
        console.log(
          " ID IN 898978 SIGNUPPPP",
          authRedirection,
          authUser,
          response.payload.data.user
        );
        dispatch({
          type: VALIDATING_LINK_COMPLETED,
          payload: {
            authenticatedUser: authUser,
            authRedirection,
          },
        });
      }
    } catch (err) {
      console.log("err signin", err);
      throw err;
    }

    return response;
  };
};

export const signUp = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: SIGNING_UP });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Auth.signUpUrl(),
        data: payload,
      });

      console.log("SIGN UP response --> ", response);

      const { status, payload: { error = "", data = {} } = {} } =
        response || {};

      if (status === false) {
        dispatch({
          type: SIGNING_UP_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        const { _id, users } = data;
        dispatch({
          type: SIGNING_UP_COMPLETED,
          payload: {},
        });
      }
    } catch (err) {
      console.log("err signup", err);
      throw err;
    }

    return response;
  };
};

export const signOut = () => {
  let response = {};
  return async (dispatch) => {
    try {
      dispatch({ type: SIGNING_OUT });

      response = await doRequest({
        method: REQUEST_TYPE.POST,
        url: Auth.signOutUrl(),
      });

      const { status, payload: { error } = {} } = response || {};
      if (status === true) {
        dispatch({
          type: SIGNING_OUT_COMPLETED,
        });
      } else {
        dispatch({
          type: SIGNING_OUT_COMPLETED_WITH_ERROR,
          message: error.message,
        });
      }
    } catch (err) {
      console.log("", err);
      dispatch({
        type: SIGNING_COMPLETED_WITH_ERROR,
        message: err.message,
      });
    }
    return response;
  };
};

export const googleSignIn = (data) => {
  return async (dispatch, getState) => {
    try {
      const { auth = {} } = getState();
      dispatch({ type: GOOGLE_SIGNING });
      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: Auth.googleSignInUrl(),
      });

      if (response.status === false) {
        dispatch({
          type: GOOGLE_SIGNING_COMPLETED_WITH_ERROR,
          payload: { error: response.payload.error },
        });
      } else if (response.status === true) {
        const { lastUrl = false } = data;
        const { _id, users } = response.payload.data;
        let authRedirection = "/";
        dispatch({
          type: GOOGLE_SIGNING_COMPLETED,
          payload: {
            users: response.payload.data.users,
            authenticatedUser: _id,
            authRedirection,
          },
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};

export const facebookSignIn = (data) => {
  return async (dispatch) => {
    try {
      dispatch({ type: FACEBOOK_SIGNING });

      const response = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: Auth.facebookSignInUrl(),
      });

      if (response.status === false) {
        dispatch({
          type: FACEBOOK_SIGNING_COMPLETED_WITH_ERROR,
          payload: { error: response.payload.error },
        });
      } else if (response.status === true) {
        const { lastUrl = false } = data || {};
        const { _id, users = {} } = response.payload.data || {};
        let authRedirection = "/";
        console.log("10939032  ----->");
        dispatch({
          type: FACEBOOK_SIGNING_COMPLETED,
          payload: {
            users,
            authenticatedUser: _id,
            authRedirection,
          },
        });
      }
    } catch (err) {
      console.log("37861823 FACEBBOK ", err);
      throw err;
    }
  };
};

export const getInitialData = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: GETTING_INITIAL_DATA });

      const response = await doRequest({
        method: REQUEST_TYPE.GET,
        url: Auth.getInitialData(),
      });

      console.log("GET INITIAL DATA response --> ", response);

      const { status, payload: { error, data } = {} } = response || {};

      if (status === false) {
        dispatch({
          type: GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR,
          payload: { error },
        });
      } else if (status === true) {
        // const {lastUrl = false} = data;
        // const {  users } = response.payload.data;

        let { users = {} } = response.payload.data;
        let authUser = Object.values(users).length ? Object.values(users)[0] : {};

        let authRedirection = setAuthRedirect(users);

        console.log(
          " ID IN 898978 GET INITIAL DATAA",
          authRedirection,
          authUser,
          response.payload.data.users
        );
        dispatch({
          type: GETTING_INITIAL_DATA_COMPLETED,
          payload: {
            users,
            authenticatedUser: authUser,
            authRedirection,
          },
          data,
        });
      }
    } catch (err) {
      console.log("err getinitial", err);
      throw err;
    }
  };
};

// export const signOut = () => {
//   return async dispatch => {
//
//   }
// };

export default (state = AUTH_INITIAL_STATE, action = {}) => {
  const { type, payload } = action;
  console.log("10939032 type, payload ---> ", type, payload);
  switch (type) {
    case GETTING_INITIAL_DATA_COMPLETED:
      return {
        authenticated: true,
        authenticated_user: payload.authenticatedUser,
        authRedirection: payload.authRedirection
      };

    case VALIDATING_LINK_COMPLETED:
      return{
      authenticated: true,
      authenticated_user: payload.authenticatedUser,
      authRedirection: payload.authRedirection
      }
    
    case GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR:
      return {
        authenticated: false,
        // authRedirection: "",
      };
    case GOOGLE_SIGNING_COMPLETED:
      return {
        authenticated: true,
        authenticated_user: payload.authenticatedUser,
        authRedirection: payload.authRedirection,
      };
    case GOOGLE_SIGNING_COMPLETED_WITH_ERROR:
      return {
        authenticated: false,
        error: payload.error,
      };
    case FACEBOOK_SIGNING_COMPLETED:
      return {
        authenticated: true,
        authenticated_user: payload.authenticatedUser,
        authRedirection: payload.authRedirection,
      };
    case FACEBOOK_SIGNING_COMPLETED_WITH_ERROR:
      return {
        authenticated: false,
        error: payload.error,
      };

    case SIGNING_OUT_COMPLETED:
      return {
        authenticated: false,
        authRedirection: "/sign-in",
      };
    case SIGNING_COMPLETED:
      return {
        authenticated: true,
        authenticated_user: payload.authenticatedUser,
        authRedirection: payload.authRedirection,
      };
    default:
      return state;
  }
};
