import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/consents";


class ConsentService {
    create = async (data) => {
      try {
          const consent = await Database.getModel(TABLE_NAME).create(data, {raw: true});
          return consent;
      } catch(error) {
          throw error;
      }
    };

    getByData = async (data) => {
        try {
            const consent = await Database.getModel(TABLE_NAME).findOne({
                where: data,
                raw: true
            });
            return consent;
        } catch(error) {
            throw error;
        }
    };

    getAllByData = async (data) => {
        try {
            const consent = await Database.getModel(TABLE_NAME).findAll({
                where: data,
                raw: true
            });
            return consent;
        } catch(error) {
            throw error;
        }
    };
}

export default ConsentService;