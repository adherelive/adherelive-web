import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/notes";

export default class ServiceOfferingService {
  constructor() {}

  addNotes = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const notes = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return notes;
    } catch (error) {
      log.debug(error);
      await transaction.rollback();
      throw error;
    }
  };

  getAllNotesByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };
}
