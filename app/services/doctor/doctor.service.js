import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/doctors";
import {TABLE_NAME as watchlistTableName} from "../../models/doctor_patient_watchlist";
import {TABLE_NAME as specialityTableName} from "../../models/specialities";
import {TABLE_NAME as userTableName} from "../../models/users";
import {Op} from "sequelize";
import {separateNameForSearch} from "../../helper/common/index";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class DoctorService {
    getDoctorByData = async (data, paranoid = true) => {
        try {
            return await Database.getModel(TABLE_NAME).findOne({
                where: data,
                include: [
                    {
                        model: Database.getModel(userTableName),
                        paranoid
                    },
                    Database.getModel(specialityTableName)
                ]
            });
        } catch (error) {
            throw error;
        }
    };

    getAllDoctorByData = async data => {
        try {
            const doctor = await Database.getModel(TABLE_NAME).findAll({
                where: data,
                include: [Database.getModel(userTableName), Database.getModel(specialityTableName)]
            });
            return doctor;
        } catch (error) {
            throw error;
        }
    };

    addDoctor = async data => {
        const transaction = await Database.initTransaction();
        try {
            const doctor = await Database.getModel(TABLE_NAME).create(data, {
                transaction
            });

            await transaction.commit();
            return doctor;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };

    updateDoctor = async (data, id) => {
        const transaction = await Database.initTransaction();
        try {
            const doctor = await Database.getModel(TABLE_NAME).update(data, {
                where: {
                    id
                },
                transaction
            });
            await transaction.commit();
            return doctor;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };

    getAllDoctors = async () => {
        try {
            const doctors = await Database.getModel(TABLE_NAME).findAll({
                include: Database.getModel(specialityTableName)
            });
            return doctors;
        } catch (err) {
            throw err;
        }
    };

    createNewWatchlistRecord = async watchlist_data => {
        const transaction = await Database.initTransaction();
        try {
            const newWatchlistRecord = await Database.getModel(
                watchlistTableName
            ).create(watchlist_data, {transaction});

            await transaction.commit();
            return newWatchlistRecord;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };

    getAllWatchlist = async data => {
        try {
            const watchlistRecord = await Database.getModel(
                watchlistTableName
            ).findAll({
                where: data,
                raw: true
            });
            return watchlistRecord;
        } catch (error) {
            throw error;
        }
    };

    deleteWatchlistRecord = async watchlist_data => {
        const transaction = await Database.initTransaction();
        try {
            const {patient_id, doctor_id, user_role_id} = watchlist_data;
            const deletedWatchlistDetails = await Database.getModel(
                watchlistTableName
            ).destroy({
                where: {
                    patient_id,
                    doctor_id,
                    user_role_id
                }
            });
            await transaction.commit();
            return deletedWatchlistDetails;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    };

    getDoctorByUserId = async user_id => {
        try {
            const doctor = await Database.getModel(TABLE_NAME).findOne({
                where: {
                    user_id
                },
                include: Database.getModel(specialityTableName)
            });
            return doctor;
        } catch (error) {
            throw error;
        }
    };

    getAllDoctorsOnly = async () => {
        try {
            const doctors = await Database.getModel(TABLE_NAME).findAll();
            return doctors;
        } catch (err) {
            throw err;
        }
    };

    // search = async data => {
    //   try {
    //     const doctor = await Database.getModel(TABLE_NAME).findAll({
    //       where: {
    //         [Op.or]: [
    //           {
    //             first_name: {
    //               [Op.like]: `%${data}%`
    //             }
    //           },
    //           {
    //             last_name: {
    //               [Op.like]: `%${data}%`
    //             }
    //           },
    //           {
    //             middle_name: {
    //               [Op.like]: `%${data}%`
    //             }
    //           }
    //         ]

    //       }
    //     });
    //     return doctor;
    //   } catch (error) {
    //     throw error;
    //   }
    // };

    search = async value => {
        try {
            let firstName = value;
            let middleName = value;
            let lastName = value;
            const name = value.split(" ");

            if (name.length > 1) {
                if (name.length === 2) {
                    firstName = name[0];
                    middleName = name[1];
                } else {
                    firstName = name[0];
                    middleName = name[1];
                    lastName = name[2];
                }
            }

            const doctor = await Database.getModel(TABLE_NAME).findAll({
                where: {
                    [Op.or]: [
                        {
                            first_name: {
                                [Op.like]: `%${firstName}%`
                            }
                        },
                        {
                            middle_name: {
                                [Op.or]: [
                                    {[Op.like]: `%${middleName}%`},
                                    {[Op.like]: `%${firstName}%`}
                                ]
                            }
                        },
                        {
                            last_name: {
                                [Op.like]: `%${lastName}%`
                            }
                        }
                    ]
                }
            });
            console.log("329847562389462364872384122 ===============>", {doctor, value});

            return doctor;
        } catch (error) {
            throw error;
        }
    };

    findOne = async ({where, order = DEFAULT_ORDER, attributes}) => {
        try {
            return await Database.getModel(TABLE_NAME).findOne({
                where,
                order,
                attributes,
                raw: true
            });
        } catch (error) {
            throw error;
        }
    };

    searchByName = async ({value, limit}) => {
        try {
            const {
                firstName, middleName, lastName
            } = separateNameForSearch(value);

            const doctor = await Database.getModel(TABLE_NAME).findAll({
                where: {
                    [Op.or]: [
                        {
                            first_name: {
                                [Op.like]: `%${firstName}%`
                            }
                        },
                        {
                            middle_name: {
                                [Op.like]: `%${middleName}%`
                            }
                        },
                        {
                            last_name: {
                                [Op.like]: `%${lastName}%`
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: Database.getModel(userTableName)
                    }
                ],
                limit
            });

            return doctor;
        } catch (err) {
            throw err;
        }
    };
}

export default new DoctorService();
