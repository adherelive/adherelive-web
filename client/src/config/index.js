export default {
    WEB_URL: process.env.REACT_APP_WEB_URL,
    GETSTREAM_API_KEY: process.env.REACT_APP_GETSTREAM_API_KEY,
    GETSTREAM_APP_ID: process.env.REACT_APP_GETSTREAM_APP_ID,
    CHANNEL_SERVER: process.env.REACT_APP_TWILIO_CHANNEL_SERVER,
    algolia: {
        app_id: process.env.REACT_APP_ALOGLIA_APP_ID,
        app_key: process.env.REACT_APP_ALOGLIA_APP_KEY,
        medicine_index: process.env.REACT_APP_MEDICINE_INDEX,
    },
    ADHERE_LIVE_CONTACT_LINK: process.env.REACT_APP_ADHERE_LIVE_CONTACT_LINK,
    mail: {
        LOGIN_CONTACT_MESSAGE: process.env.REACT_APP_LOGIN_CONTACT_MESSAGE,
        VERIFICATION_PENDING_MESSAGE: process.env.REACT_APP_VERIFICATION_PENDING_MESSAGE,
    },
    BACKEND_URL:process.env.REACT_APP_BACKEND_URL

};
