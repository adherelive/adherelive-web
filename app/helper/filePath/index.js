
export const completePath = (path) => {
  return path ? `${process.config.minio.MINIO_S3_HOST}/${process.config.minio.MINIO_BUCKET_NAME}${path}` : null;
};

export const getFilePath = (url) => {
    return url && url.split(process.config.minio.MINIO_BUCKET_NAME).length > 1 ? url.split(process.config.minio.MINIO_BUCKET_NAME)[1] : null;
};