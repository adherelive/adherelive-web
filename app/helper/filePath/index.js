/*
 *
 * ${HOST}://${BUCKET_NAME}.${S3_HOST}${path_from_database}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4DR6HU5G773H2Q4U%2F20210217%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20210217T075407Z&X-Amz-Expires=60&X-Amz-Signature=883031d7db9a8dc31fa00a85f019e62890b51594278d76d2b4fe17829c0d868b&X-Amz-SignedHeaders=host
 *
 *
 *
 * */

import minioService from "../../services/minio/minio.service";

export const completePath = path => {
  // return path
  //   ? `${process.config.minio.MINIO_S3_HOST}/${process.config.minio.MINIO_BUCKET_NAME}${path}`
  //   : null;

  if (path) {
    return minioService.getSignedUrl(path);
  }
  return null;
};

export const getFilePath = url => {
  // return url && url.split(process.config.minio.MINIO_BUCKET_NAME).length > 1
  //   ? url.split(process.config.minio.MINIO_BUCKET_NAME)[1]
  //   : null;

  if (url) {
    // for S3
    const decodedUrl = decodeURI(url);
    const s3Url = decodedUrl.split("?")[0] || null;

    if (s3Url) {
      return s3Url && s3Url.split(process.config.minio.MINIO_S3_HOST).length > 1
        ? s3Url.split(process.config.minio.MINIO_S3_HOST)[1]
        : null;
    }
  }

  return null;
};
