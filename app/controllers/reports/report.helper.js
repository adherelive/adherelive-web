import { createLogger } from "../../../libs/logger";
import awsS3Service from "../../services/awsS3/awsS3.service";
import md5 from "js-md5";
import { completePath } from "../../helper/s3FilePath";

const logger = createLogger("WEB > CONTROLLER > REPORTS > HELPER");

export const uploadReport = async ({ file, id }) => {
  try {
    const { mimetype } = file || {};
    const fileName = file.originalname.replace(/\s+/g, "");
    logger.debug(`fileName : ${fileName}`);
    await awsS3Service.createBucket();

    let hash = md5.create();
    hash.update(id);
    hash.hex();
    hash = String(hash);

    const folder = "reports";
    const encodedFileName = hash.substring(4) + "/" + fileName;

    logger.debug(`encodedFileName :: ${encodedFileName}`);

    // check for images
    let metaData = null;
    const isImage = mimetype.split("/")[0] === "image";
    if (isImage) {
      metaData = {
        "Content-Type": `${mimetype}`,
      };
    }

    const filePath = `${folder}/${encodedFileName}`;
    logger.debug(`filePath :: ${filePath}`);

    await awsS3Service.saveBufferObject(file.buffer, filePath, metaData);
    return completePath(`/${filePath}`);
  } catch (error) {
    logger.error("uploadReport has an error: ", error);
    throw error;
  }
};
