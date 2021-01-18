import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/templateVitals";

export default class TemplateVitalService {
    getByData = async (data) => {
        try {
            return await Database.getModel(TABLE_NAME).findOne({
                where: data,
                raw: true
            });
        } catch(error) {
            throw error;
        }
    }
}