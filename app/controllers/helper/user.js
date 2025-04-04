import md5 from "js-md5";
import path from "path";
import { createLogger } from "../../../libs/logger";

const logger = createLogger("HELPER USER");

export const saveFileIntoUserBucket = async ({
  service,
  file,
  user_id,
  file_path,
}) => {
  try {
    await service.createBucket();
    const extension = path.extname(file_path);
    const bucket = md5(user_id).substring(0, 4);
    const fileBuffer = file;
    const filename = md5(user_id + new Date().getTime()).substring(4);
    let fileUrl = bucket + "/" + filename + extension;
    await service.saveBufferObject(fileUrl, fileBuffer);
    let files = [fileUrl];
    return files;
  } catch (err) {
    logger.error("Error in Save File into User Bucket: ", err);
    throw err;
  }
};
