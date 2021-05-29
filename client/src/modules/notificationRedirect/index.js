
const DO_NOTIFICATION_REDIRECT = "DO_NOTIFICATION_REDIRECT";

export const doNotificationRedirect = (payload) => {
    let response = {};
    return async dispatch => {
        try {
           
            // console.log("673823876123123719283",{payload});
            dispatch({
                type: DO_NOTIFICATION_REDIRECT,
                payload:{notification_redirect : {...payload}}
            });
          
        } catch(error) {
            console.log("DO_NOTIFICATION_REDIRECT error ---> ", error);
        }

        return response;
    };
};


function notificationRedirectReducer(state, data) {
    const {notification_redirect = {}} = data || {};
    if(Object.keys(notification_redirect).length > 0) {
        return {
            ...state,
            ...notification_redirect
        };
    } else {
        return state;
    }
}

export default (state = {}, data) => {
    const {type, payload} = data || {};
    switch(type) {
        case DO_NOTIFICATION_REDIRECT:
            return notificationRedirectReducer(state, payload);
        default:
            return state;
    }
}