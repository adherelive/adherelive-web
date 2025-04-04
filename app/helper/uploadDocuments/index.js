import md5 from "js-md5";

import awsS3Service from "../../services/awsS3/awsS3.service";
import { createLogger } from "../../../libs/logger";
import { completePath } from "../s3FilePath";

const logger = createLogger("UPLOAD > HELPER");

export const upload = async ({ file, id, folder }) => {
  try {
    const { mimetype } = file || {};
    const fileName = file.originalname.replace(/\s+/g, "");
    logger.debug(`fileName : ${fileName}`);
    await awsS3Service.createBucket();

    let hash = md5.create();
    hash.update(`${id}`);
    hash.hex();
    hash = String(hash);

    const encodedFileName = hash.substring(4) + "/" + fileName;

    logger.debug(`encodedFileName :: ${encodedFileName}`);

    // check for images
    let metaData = null;
    // const isImage = mimetype.split("/")[0] === "image";
    // if(isImage) {
    metaData = {
      "Content-Type": `${mimetype}`,
    };
    // }

    const filePath = `${folder}/${encodedFileName}`;
    logger.debug(`filePath :: ${filePath}`);

    await awsS3Service.saveBufferObject(file.buffer, filePath, metaData);
    return completePath(`/${filePath}`);
  } catch (error) {
    throw error;
  }
};
