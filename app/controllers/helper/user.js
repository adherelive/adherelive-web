import md5 from "js-md5";
import path from "path";

export const saveFileIntoUserBucket = async ({
                                                 service,
                                                 file,
                                                 user_id,
                                                 file_path
                                             }) => {
    try {
        await service.createBucket();
        const extension = path.extname(file_path);

        const bucket = md5(user_id).substring(0, 4);

        const fileBuffer = file;
        const filename = md5(user_id + new Date().getTime()).substring(4);

        let fileUrl = bucket + "/" + filename + extension;
        console.log("rrrrrrrrrrr fileBuffer ----------------->\n\n", fileBuffer);
        await service.saveBufferObject(fileUrl, fileBuffer);
        // console.log("fileUrl 0000000000000000000000000000", fileUrl);
        let files = [fileUrl];
        return files;
    } catch (err) {
        console.log(err);
        throw err;
    }
};
