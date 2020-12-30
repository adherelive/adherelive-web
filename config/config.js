const dotenv = require("dotenv");

module.exports = () => {
  dotenv.config();
  process.config = {
    app: {
      invite_link: process.env.INVITE_LINK,
      env: process.env.APP_ENV,
      mobile_verify_link: process.env.MOBILE_INVITE_LINK,
      reset_password: process.env.RESET_PASSWORD_LINK,
      developer_email: process.env.DEVELOPER_EMAIL,
      verified_doctor: process.env.DASHBOARD_LINK,
      support_email: process.env.SUPPORT_EMAIL,
      appointment_wait_time_hours: process.env.APPOINTMENT_WAIT_TIME_HOURS,
      default_currency: process.env.DEFAULT_CURRENCY,
    },
    algolia: {
      app_id: process.env.ALGOLIA_APP_ID,
      app_key: process.env.ALGOLIA_APP_KEY,
      backend_key: process.env.ALGOLIA_BACKEND_KEY,
      medicine_index: process.env.ALGOLIA_MEDICINE_INDEX
    },
    razorpay: {
      key: process.env.RAZORPAY_KEY,
      secret: process.env.RAZORPAY_SECRET,
    },
    event: {
      count: process.env.EVENT_FETCH_COUNT
    },
    email: {
      USER: process.env.SENDGRID_USER,
      KEY: process.env.SENDGRID_PASSWORD,
      FROM: process.env.SENDGRID_FROM_ADDRESS,
      FROM_NAME: process.env.SENDGRID_FROM_NAME
    },
    sqs: {
      domain_url: process.env.SQS_DOMAIN_URL,
      account_id: process.env.AWS_ACCCOUNT_ID,
      queue_name: process.env.SQS_QUEUE_NAME,
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
    getstream: {
      key: process.env.GETSTREAM_API_KEY,
      secretKey: process.env.GETSTREAM_API_SECRET
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
      TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
      CHANNEL_SERVER: process.env.TWILIO_CHANNEL_SERVER,
    },
    saltRounds: process.env.SALT_ROUNDS,
    minio: {
      MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
      MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
      MINIO_VOLUME_NAME: process.env.MINIO_VOLUME_NAME,
      MINIO_REGION: process.env.MINIO_REGION,
      MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
      MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME,
      MINIO_S3_HOST: process.env.S3_HOST
    },
    GOOGLE_KEYS: {
      CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI
    },
    FACEBOOK_KEYS: {
      APP_TOKEN: process.env.FACEBOOK_APP_TOKEN,
      SECRET_TOKEN: process.env.FACEBOOK_SECRET_TOKEN
    },
    smtp: {
      source_address: process.env.SOURCE_ADDRESS,
      reply_to_address: process.env.REPLY_TO_ADDRESS,
      user: process.env.SMTP_USER,
      secret_key: process.env.SMTP_KEY
    },
    branch_io: {
      key: process.env.BRANCH_IO_KEY,
      base_url: process.env.BRANCH_IO_BASE_URL
    },
    one_signal: {
      app_id: process.env.ONE_SIGNAL_APP_ID,
      key: process.env.ONE_SIGNAL_KEY,
      urgent_channel_id: process.env.URGENT_CHANNEL_ID
    },
    cookieKey: process.env.COOKIE_KEY,
    PORT: process.env.WEB_SERVER_PORT,
    APP_URL: process.env.APP_URL,
    WEB_URL: process.env.WEB_URL,
    FORGOT_PASSWORD_EXPIRE_TIME: process.env.FORGOT_PASSWORD_EXPIRE_TIME,
    DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
    APP_ENV: process.env.APP_ENV,
    IMAGE_HOST: process.env.IMAGE_HOST,
    DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    UTC_OFFSET_STR: process.env.UTC_OFFSET_STR,
    DB_ENCRYPTION_KEY: process.env.DB_ENCRYPTION_KEY,
    TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME,
    TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY,
    INVITE_EXPIRE_TIME: process.env.INVITE_EXPIRE_TIME,
    MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
    MSG91_SMS_URL: process.env.MSG91_SMS_URL,
    MSG91_SENDER: process.env.MSG91_SENDER
  };
};

// config();
