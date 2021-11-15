import Logger from "../../libs/log";
import minioService from "../services/minio/minio.service";
import md5 from "js-md5";
import {completePath} from "../helper/filePath";

const Log = new Logger("CRON > HELPER");

export const uploadDocument = async ({buffer, fileName, id, folder, doHashing}) => {
  try {
      Log.info(`fileName : ${fileName}`);
      await minioService.createBucket();

      let hash = md5.create();
      hash.update(id);
      hash.hex();
      hash = String(hash);

      const subfolder = doHashing? hash.substring(4): id;

      const encodedFileName = subfolder + "/" + fileName;

      Log.info(`encodedFileName :: ${encodedFileName}`);

      const filePath = `${folder}/${encodedFileName}`;
      Log.info(`filePath :: ${filePath}`);

      await minioService.saveBufferObject(buffer, filePath, null);
      return completePath(`/${filePath}`);
  } catch(error) {
      Log.debug("uploadDocument catch error", error);
      throw error;
  }
};