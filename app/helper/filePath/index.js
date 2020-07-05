
export const completePath = (path) => {
  return path ? `${process.config.minio.MINIO_S3_HOST}/${process.config.minio.MINIO_BUCKET_NAME}${path}` : null;
};

export const getFilePath = (url) => {
    const splitUrl = url.split(process.config.minio.MINIO_BUCKET_NAME);
    return splitUrl.length > 1 ? splitUrl[1] : null;
};