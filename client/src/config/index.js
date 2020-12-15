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
};
