const fs = require("fs");
import Logger from "../../libs/log";

import {
  DOCUMENT_PARENT_TYPE,
  PRESCRIPTION_PDF_FOLDER,
  S3_DOWNLOAD_FOLDER
} from "../../constant";
import * as UploadHelper from "./helper";

// SERVICES ---------------

import documentService from "../services/uploadDocuments/uploadDocuments.service";

const AWS_FOLDER_NAME = {
  PRESCRIPTION_PDF: "prescription_pdfs",
  DANGLING: "dangling",
  OTHERS: "others"
};

const Log = new Logger("CRON > REMOVE_DOCUMENTS");

class RemoveDocuments {
  checkIfAnyLocalDocumentExists = async path => {
    let isFolderEmpty = false;
    if (!fs.existsSync(path)) {
      isFolderEmpty = true;
    } else {
      isFolderEmpty = await this.isDirEmpty(path);
    }

    return !isFolderEmpty;
  };

  isDirEmpty = async dirname => {
    return (await fs.readdirSync(dirname).length) === 0;
  };

  getAWSFolderName = path => {
    switch (path) {
      case PRESCRIPTION_PDF_FOLDER:
        return AWS_FOLDER_NAME.PRESCRIPTION_PDF;
      default:
        return AWS_FOLDER_NAME.DANGLING;
    }
  };

  readDirectory = path => {
    try {
      const { readFiles, getAWSFolderName } = this;
      const upload = path === PRESCRIPTION_PDF_FOLDER ? true : false;
      const uploadFolderName = getAWSFolderName(path);
      fs.readdir(path, function(err, files) {
        if (err) {
          Log.debug(
            "REMOVE_DOCUMENTS: could not list the directory ---->",
            err
          );
          return;
        }
        const totalFiles = files.length;
        if (files && totalFiles) {
          for (let i = 0; i < totalFiles; i++) {
            if (files[i] === "provider") {
              continue;
            }
            readFiles(
              `${path}/${files[i]}`,
              files[i],
              upload,
              uploadFolderName
            );
          }
        }
      });
    } catch (error) {
      Log.debug("ERROR: in reading directory: ", error);
    }
  };

  readFiles = (file, fileName, upload, awsFolder) => {
    try {
      Log.info(`File got to read is: file = ${file}, fileName = ${fileName}`);
      const { deleteFile, uploadOnAWS } = this;
      fs.readFile(file, function(err, data) {
        if (err) {
          throw err;
        }
        if (upload) {
          const carePlanId =
            fileName && fileName.length ? fileName.split("-")[0] : null;
          let subfolderName = AWS_FOLDER_NAME.OTHERS;
          if (carePlanId && !isNaN(carePlanId)) {
            subfolderName = carePlanId;
          }
          uploadOnAWS(data, fileName, subfolderName, awsFolder);
        }

        deleteFile(file);
      });
    } catch (error) {
      Log.debug("ERROR: in reading file: ", error);
    }
  };

  uploadOnAWS = async (buffer, fileName, id, folder) => {
    try {
      const fileUrl = await UploadHelper.uploadDocument({
        buffer,
        fileName,
        id,
        folder,
        doHashing: id !== AWS_FOLDER_NAME.OTHERS ? true : false
      });

      if (id !== AWS_FOLDER_NAME.OTHERS) {
        const prescriptionDoc = await documentService.addDocument({
          parent_type: DOCUMENT_PARENT_TYPE.PRESCRIPTION_PDF,
          parent_id: id,
          document: fileUrl,
          name: fileName
        });
      }
    } catch (error) {
      Log.debug("ERROR: in uploading file on aws: ", error);
    }
  };

  deleteFile = path => {
    try {
      fs.unlink(path, function(err) {
        console.log("ERRor got in the unlink the file is: ", err);
      });
    } catch (error) {
      Log.debug("ERROR: in deleting file: ", error);
    }
  };

  runObserver = async () => {
    try {
      Log.info("running REMOVE_DOCUMENTS cron");
      const { checkIfAnyLocalDocumentExists } = this;

      const prescriptionPdfsPresent = await checkIfAnyLocalDocumentExists(
        PRESCRIPTION_PDF_FOLDER
      );
      const s3ImagesPresent = await checkIfAnyLocalDocumentExists(
        S3_DOWNLOAD_FOLDER
      );

      Log.info(
        `Check values are: prescriptionPdfsPresent = ${prescriptionPdfsPresent} s3ImagesPresent = ${s3ImagesPresent}`
      );

      if (prescriptionPdfsPresent) {
        this.readDirectory(PRESCRIPTION_PDF_FOLDER);
      }

      if (s3ImagesPresent) {
        this.readDirectory(S3_DOWNLOAD_FOLDER);
      }
    } catch (error) {
      Log.debug("REMOVE_DOCUMENTS runObserver 500 error ---->", error);
    }
  };
}

export default new RemoveDocuments();
