import Database from "../../../libs/mysql";
import { getFilePath } from "../../helper/filePath";

import { TABLE_NAME } from "../../models/dietResponses";
import { TABLE_NAME as uploadDocumentTableName } from "../../models/uploadDocuments";
import { TABLE_NAME as scheduleEventsTableName } from "../../models/scheduleEvents";

import { DOCUMENT_PARENT_TYPE, EVENT_STATUS } from "../../../constant";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class DietResponsesService {
  create = async ({ documents = [], ...dietResponseData }) => {
    const transaction = await Database.initTransaction();
    try {
      let document_uploaded = false;
      if (documents.length > 0) {
        document_uploaded = true;
      }

      const dietResponse =
        (await Database.getModel(TABLE_NAME).create(
          { ...dietResponseData, document_uploaded },
          {
            raw: true,
            transaction,
          }
        )) || null;

      const { id, schedule_event_id } = dietResponse || {};

      if (documents.length > 0) {
        for (let index = 0; index < documents.length; index++) {
          const { name, file } = documents[index] || {};
          // todo: change this to bulk create
          await Database.getModel(uploadDocumentTableName).create(
            {
              name,
              document: getFilePath(file),
              parent_type: DOCUMENT_PARENT_TYPE.DIET_RESPONSE,
              parent_id: id,
            },
            {
              transaction,
            }
          );
        }
      }

      // update schedule event status
      await Database.getModel(scheduleEventsTableName).update(
        {
          status: EVENT_STATUS.COMPLETED,
        },
        {
          where: {
            id: schedule_event_id,
          },
          transaction,
        }
      );

      await transaction.commit();
      return id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        raw: true,
        transaction,
      });
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findAndCountAll = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        attributes,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  findOne = async (data) => {
    try {
      const diet = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true,
      });
      return diet;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id) => {
    try {
      const record = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id,
        },
      });
      return record;
    } catch (err) {
      throw err;
    }
  };
}

export default DietResponsesService;
