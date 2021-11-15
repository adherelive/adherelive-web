import minioService from "../../../services/minio/minio.service";
import md5 from "js-md5";

import Logger from "../../../../libs/log";
import {completePath} from "../../../helper/filePath";

const Log = new Logger("SYMPTOM > CONTROLLER > HELPER");

export const uploadImage = async({userId, file})=>{

    try{
        const fileExt= file.originalname.replace(/\s+/g, '');
        await minioService.createBucket();

        const imageName = md5(`${userId}-symptom-photo`);
        let hash = md5.create();
        hash.hex();
        hash = String(hash);

        const file_name = hash.substring(4) + "/" + imageName + "/" + fileExt;

        const fileUrl = "/" +file_name;
        Log.info(`FILE_NAME: ${file_name}`);
        await minioService.saveBufferObject(file.buffer, file_name);

        // const file_link = process.config.minio.MINIO_S3_HOST +"/" + process.config.minio.MINIO_BUCKET_NAME + fileUrl;

        Log.info(`FILE_LINK: ${fileUrl}`);

        return {file: completePath(fileUrl), name: file.originalname};
    }catch(error){
        Log.debug("uploadImage 500 error", error);
        return {};
    }
}

export const uploadAudio = async({userId, file})=>{

    try{
        const fileExt= file.originalname.replace(/\s+/g, '');
        await minioService.createBucket();

        const imageName = md5(`${userId}-symptom-audio`);
        let hash = md5.create();
        hash.hex();
        hash = String(hash);

        const file_name = hash.substring(4) + "/" + imageName + "/" + fileExt;

        const fileUrl = "/" +file_name;

        Log.info(`FILE_NAME: ${file_name}`);
        await minioService.saveAudioObject(file.buffer, file_name);

        // const file_link = process.config.minio.MINIO_S3_HOST +"/" + process.config.minio.MINIO_BUCKET_NAME + fileUrl;
        Log.info(`FILE_LINK: ${fileUrl}`);

        return {file: completePath(fileUrl), name: file.originalname};
    }catch(error){
        Log.debug("uploadAudio 500 error", error);
        return {};
    }
}

export const uploadVideo = async({userId, file})=>{

    try{
        const fileExt= file.originalname.replace(/\s+/g, '');
        await minioService.createBucket();

        const videoName = md5(`${userId}-symptom-video`);
        let hash = md5.create();
        hash.hex();
        hash = String(hash);

        const file_name = hash.substring(4) + "/" + videoName + "/" + fileExt;

        const fileUrl = "/" +file_name;

        Log.info(`FILE_NAME: ${file_name}`);
        await minioService.saveVideoObject(file.buffer, file_name);

        // const file_link = process.config.minio.MINIO_S3_HOST +"/" + process.config.minio.MINIO_BUCKET_NAME + fileUrl;
        Log.info(`FILE_LINK: ${fileUrl}`);

        return {file: completePath(fileUrl), name: file.originalname};
    }catch(error){
        Log.debug("uploadVideo 500 error", error);
        return {};
    }
}