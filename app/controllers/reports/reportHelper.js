import Logger from "../../../libs/log";
import minioService from "../../services/minio/minio.service";
import md5 from "js-md5";
import { completePath } from "../../helper/filePath";

const Log = new Logger("WEB > CONTROLLER > REPORTS > HELPER");

export const uploadReport = async ({ file, id }) => {
  try {
    const { mimetype } = file || {};
    const fileName = file.originalname.replace(/\s+/g, "");
    Log.info(`fileName : ${fileName}`);
    await minioService.createBucket();

    let hash = md5.create();
    hash.update(id);
    hash.hex();
    hash = String(hash);

    const folder = "reports";
    const encodedFileName = hash.substring(4) + "/" + fileName;

    Log.info(`encodedFileName :: ${encodedFileName}`);

    // check for images
    let metaData = null;
    const isImage = mimetype.split("/")[0] === "image";
    if (isImage) {
      metaData = {
        "Content-Type": `${mimetype}`
      };
    }

    const filePath = `${folder}/${encodedFileName}`;
    Log.info(`filePath :: ${filePath}`);

    await minioService.saveBufferObject(file.buffer, filePath, metaData);
    return completePath(`/${filePath}`);
  } catch (error) {
    Log.debug("uploadReport catch error", error);
    throw error;
  }
};
