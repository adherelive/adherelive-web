const dotenv = require("dotenv");

module.exports =  () => {
    dotenv.config();
    process.config = {
        app: {
            invite_link: process.env.INVITE_LINK,
            env: process.env.APP_ENV
        },
        db: {
            connection: process.env.DB_CONNECTION,
            name: process.env.DB_DATABASE_NAME,
            database: process.env.DB_DATABASE,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            dialect: process.env.DB_DIALECT
        },
        aws: {
            access_key: process.env.AWS_ACCESS_KEY,
            access_key_id: process.env.AWS_ACCESS_KEY_ID,
            region: process.env.AWS_REGION,
            platform_arn: process.env.AWS_PLATFORM_ARN,
            topic_arn: process.env.AWS_TOPIC_ARN,
            aws_provider_bucket: process.env.AWS_PROVIDER_BUCKET,
            aws_booking_request_bucket: process.env.AWS_BOOKING_REQUEST_BUCKET,
            aws_prescription_bucket: process.env.AWS_PRESCRIPTION_BUCKET,
            device_token: process.env.device_token
        },
        twilio: {
            TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
            TWILIO_API_KEY: process.env.TWILIO_API_KEY,
            TWILIO_API_SECRET: process.env.TWILIO_API_SECRET,
            TWILIO_CHAT_SERVICE_SID: process.env.TWILIO_CHAT_SERVICE_SID,
            TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN
        },
        saltRounds: process.env.SALT_ROUNDS,
        minio: {
            MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
            MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
            MINIO_VOLUME_NAME: process.env.MINIO_VOLUME_NAME,
            MINIO_REGION: process.env.MINIO_REGION,
            MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
            MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME
        },
        GOOGLE_KEYS: {
            CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI
        },
        FACEBOOK_KEYS: {
          APP_TOKEN: process.env.FACEBOOK_APP_TOKEN,
        },
        smtp: {
            source_address: process.env.SOURCE_ADDRESS,
            reply_to_address: process.env.REPLY_TO_ADDRESS,
            user: process.env.SMTP_USER,
            secret_key: process.env.SMTP_KEY
          },
        cookieKey: process.env.COOKIE_KEY,
        PORT:process.env.WEB_SERVER_PORT,
        APP_URL: process.env.APP_URL,
        WEB_URL: process.env.WEB_URL,
        FORGOT_PASSWORD_EXPIRE_TIME: process.env.FORGOT_PASSWORD_EXPIRE_TIME,
        APP_ENV: process.env.APP_ENV,
        IMAGE_HOST: process.env.IMAGE_HOST,
        DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
        S3_BUCKET_URL: process.env.S3_BUCKET_URL,
        UTC_OFFSET_STR: process.env.UTC_OFFSET_STR,
        DB_ENCRYPTION_KEY: process.env.DB_ENCRYPTION_KEY,
        TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME,
        TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
        INVITE_EXPIRE_TIME: process.env.INVITE_EXPIRE_TIME,
    };
};

// config();
