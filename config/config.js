const dotenv = require("dotenv");

module.exports = () => {
  dotenv.config();
  process.config = {
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
    calendar: {
      CRONOFY_API_URL: process.env.CRONOFY_API_URL,
      CRONOFY_OAUTH_APP_URL: process.env.CRONOFY_OAUTH_APP_URL,
      CRONOFY_OAUTH_API_URL: process.env.CRONOFY_OAUTH_API_URL,
      CRONOFY_CLIENT_ID: process.env.CRONOFY_CLIENT_ID,
      CRONOFY_CLIENT_SECRET: process.env.CRONOFY_CLIENT_SECRET
    },
    saltRounds: process.env.SALT_ROUNDS,
    TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
    INVITE_EXPIRE_TIME: process.env.INVITE_EXPIRE_TIME,
    TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME,
    cookieKey: process.env.COOKIE_KEY,
    twilio: {
      TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY: process.env.TWILIO_API_KEY,
      TWILIO_API_SECRET: process.env.TWILIO_API_SECRET,
      TWILIO_CHAT_SERVICE_SID: process.env.TWILIO_CHAT_SERVICE_SID,
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN
    },
    minio: {
      MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
      MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
      MINIO_VOLUME_NAME: process.env.MINIO_VOLUME_NAME,
      MINIO_REGION: process.env.MINIO_REGION,
      MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
      MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME
    },
    getstream: {
      API_KEY: process.env.GETSTREAM_API_KEY,
      API_SECRET: process.env.GETSTREAM_API_SECRET,
      REGION: process.env.GETSTREAM_REGION,
      APP_ID: process.env.GETSTREAM_APP_ID
    },
    APP_URL: process.env.APP_URL,
    WEB_URL: process.env.WEB_URL,
    SOURCE_ADDRESS: process.env.SOURCE_ADDRESS,
    REPLY_TO_ADDRESS: process.env.REPLY_TO_ADDRESS,
    FORGOT_PASSWORD_EXPIRE_TIME: process.env.FORGOT_PASSWORD_EXPIRE_TIME,
    APP_ENV: process.env.APP_ENV,
    IMAGE_HOST: process.env.IMAGE_HOST,
    DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_KEY: process.env.SMTP_KEY,
    UTC_OFFSET_STR: process.env.UTC_OFFSET_STR,
    MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
    MSG91_SMS_URL: process.env.MSG91_SMS_URL,
    MSG91_SENDER: process.env.MSG91_SENDER,
    DB_ENCRYPTION_KEY: process.env.DB_ENCRYPTION_KEY,
    branch_io: {
      key: process.env.BRANCH_IO_KEY,
      base_url: process.env.BRANCH_IO_BASE_URL
    }
  };
};
