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
        saltRounds: process.env.SALT_ROUNDS,
        minio: {
            MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
            MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
            MINIO_VOLUME_NAME: process.env.MINIO_VOLUME_NAME,
            MINIO_REGION: process.env.MINIO_REGION,
            MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
            MINIO_BUCKET_NAME: process.env.MINIO_BUCKET_NAME
        },
        APP_URL: process.env.APP_URL,
        WEB_URL: process.env.WEB_URL,
        FORGOT_PASSWORD_EXPIRE_TIME: process.env.FORGOT_PASSWORD_EXPIRE_TIME,
        APP_ENV: process.env.APP_ENV,
        IMAGE_HOST: process.env.IMAGE_HOST,
        DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
        S3_BUCKET_URL: process.env.S3_BUCKET_URL,
        UTC_OFFSET_STR: process.env.UTC_OFFSET_STR,
        DB_ENCRYPTION_KEY: process.env.DB_ENCRYPTION_KEY,
    };
};
