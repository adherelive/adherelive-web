import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/exerciseGroup";
import {TABLE_NAME as exerciseDetailTableName} from "../../models/exerciseDetails";
import {TABLE_NAME as exerciseTableName} from "../../models/exercise";

export default class ExerciseGroupService {
    findOne = async (data) => {
        try {
            return await Database.getModel(TABLE_NAME).findOne({
                where: data,
                include: [
                    {
                        model: Database.getModel(exerciseDetailTableName),
                        include: [Database.getModel(exerciseTableName)],
                    },
                ],
            });
        } catch (error) {
            throw error;
        }
    };
}
