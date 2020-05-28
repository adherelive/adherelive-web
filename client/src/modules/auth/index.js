import {REQUEST_TYPE} from "../../constant";
import {doRequest} from "../../Helper/network";
import {Auth} from "../../Helper/urls";

export const SIGNING = "SIGNING";
export const SIGNING_COMPLETED = "SIGNING_COMPLETED";
export const SIGNING_COMPLETED_WITH_ERROR = "SIGNING_COMPLETED_WITH_ERROR";

export const GOOGLE_SIGNING = "GOOGLE_SIGNING";
export const GOOGLE_SIGNING_COMPLETED = "GOOGLE_SIGNING_COMPLETED";
export const GOOGLE_SIGNING_COMPLETED_WITH_ERROR = "GOOGLE_SIGNING_COMPLETED_WITH_ERROR";

export const FACEBOOK_SIGNING = "FACEBOOK_SIGNING";
export const FACEBOOK_SIGNING_COMPLETED = "FACEBOOK_SIGNING_COMPLETED";
export const FACEBOOK_SIGNING_COMPLETED_WITH_ERROR = "FACEBOOK_SIGNING_COMPLETED_WITH_ERROR";

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
// const SIGNING_OUT_COMPLETED_WITH_ERROR = "SIGNING_OUT_COMPLETED_WITH_ERROR";

export const GETTING_INITIAL_DATA = "GETTING_INITIAL_DATA";
export const GETTING_INITIAL_DATA_COMPLETED = "GETTING_INITIAL_DATA_COMPLETED";
export const GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR =
    "GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR";

export const RESET_ERROR = "RESET_ERROR";

export const RESET_UNAUTHORIZED_ERROR = "RESET_UNAUTHORIZED_ERROR";

export const RESET_PASSWORD_LINK_COMPLETED = "RESET_PASSWORD_LINK_COMPLETED";

export const GOOGLE_SIGNOUT = "GOOGLE_SIGNOUT";

export const AUTH_INITIAL_STATE = {
    authenticated: false
};

export const signIn = payload => {
    let response = {};
    return async dispatch => {
        try {
            dispatch({type: GETTING_INITIAL_DATA});

            response = await doRequest({
                method: REQUEST_TYPE.POST,
                url: Auth.signInUrl(),
                data: payload
            });

            console.log("SIGN IN response --> ", response);

            const {status, payload: {error = "", data = {}} = {}} = response || {};

            if (status === false) {
                dispatch({
                    type: GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR,
                    payload: {error}
                });
            } else if (status === true) {
                const {_id, users} = data;
                let authRedirection = '/';
                dispatch({
                    type: GETTING_INITIAL_DATA_COMPLETED,
                    payload: {
                        authenticatedUser: _id,
                        authRedirection
                    }
                });
            }
        } catch (err) {
            console.log("err signin", err);
            throw err;
        }

        return response;
    };
};


export const signOut = () => {
    return async (dispatch) => {
        try {
            dispatch({type: GOOGLE_SIGNOUT});
        } catch (err) {
            console.log(err);
        }
    };
};

export const googleSignIn = (data) => {
    return async (dispatch, getState) => {
        try {
            const {auth = {}} = getState();
            dispatch({type: GOOGLE_SIGNING});
            const response = await doRequest({
                method: REQUEST_TYPE.POST,
                data: data,
                url: Auth.googleSignInUrl()
            });

            if (response.status === false) {
                dispatch({
                    type: GOOGLE_SIGNING_COMPLETED_WITH_ERROR,
                    payload: {error: response.payload.error}
                });
            } else if (response.status === true) {
                const {lastUrl = false} = data;
                const {_id, users} = response.payload.data;
                let authRedirection = '/';
                dispatch({
                    type: GOOGLE_SIGNING_COMPLETED,
                    payload: {
                        users: response.payload.data.users,
                        authenticatedUser: _id,
                        authRedirection
                    }
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
            dispatch({type: FACEBOOK_SIGNING});

            const response = await doRequest({
                method: REQUEST_TYPE.POST,
                data: data,
                url: Auth.facebookSignInUrl()
            });

            if (response.status === false) {
                dispatch({
                    type: FACEBOOK_SIGNING_COMPLETED_WITH_ERROR,
                    payload: {error: response.payload.error}
                });
            } else if (response.status === true) {
                const {lastUrl = false} = data;
                const {_id, users} = response.payload.data;
                let authRedirection = '/';
                dispatch({
                    type: FACEBOOK_SIGNING_COMPLETED,
                    payload: {
                        users: response.payload.data.users,
                        authenticatedUser: _id,
                        authRedirection
                    }
                });
            }
        } catch (err) {
            console.log(err);
            throw err;
        }


    };
};

export const getInitialData = () => {
    return async dispatch => {
        try {
            dispatch({type: GETTING_INITIAL_DATA});

            const response = await doRequest({
                method: REQUEST_TYPE.GET,
                url: Auth.getInitialData()
            });

            console.log("GET INITIAL DATA response --> ", response);

            if (response.status === false) {
                dispatch({
                    type: GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR,
                    payload: {error: response.payload.error}
                });
            } else if (response.status === true) {
                // const {lastUrl = false} = data;
                const {_id, users} = response.payload.data;
                let authRedirection = '/';
                dispatch({
                    type: GETTING_INITIAL_DATA_COMPLETED,
                    payload: {
                        user: response.payload.data.user,
                        authenticatedUser: _id,
                        authRedirection
                    }
                });
            }
        } catch (err) {
            console.log("err getinitial", err);
            throw err;
        }


    };
};

export default (state = AUTH_INITIAL_STATE, action = {}) => {
    const {type, payload} = action;
    switch (type) {
        case GETTING_INITIAL_DATA_COMPLETED:
            return {
                authenticated: true,
                authenticated_user: payload.authenticatedUser,
                authRedirection: payload.authRedirection
            };
        case GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR:
            return {
                authenticated: false,
                authRedirection: "/sign-in"
            };
        case GOOGLE_SIGNING_COMPLETED:
            return {
                authenticated: true,
                authenticated_user: payload.authenticatedUser,
                authRedirection: payload.authRedirection
            };
        case GOOGLE_SIGNING_COMPLETED_WITH_ERROR:
            return {
                authenticated: false,
                error: payload.error
            };
        case FACEBOOK_SIGNING_COMPLETED:
            return {
                authenticated: true,
                authenticated_user: payload.authenticatedUser,
                authRedirection: payload.authRedirection
            };
        case FACEBOOK_SIGNING_COMPLETED_WITH_ERROR:
            return {
                authenticated: false,
                error: payload.error
            };

        case GOOGLE_SIGNOUT:
            return {
                authenticated: false
            };
        default:
            return state;
    }
};
