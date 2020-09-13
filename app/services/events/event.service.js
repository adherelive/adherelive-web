import schedulerModel from "../../models/scheduleEvents";
// const eventModel = require("../../models/event");
import moment from "moment";
// import { ObjectId } from "mongodb";
import { REPEAT_TYPE, EVENT_TYPE } from "../../../constant";

//SCHEDULER STATUSES
const COMPLETED = "completed";
const PENDING = "pending";
const ACTIVE = "active";
const STARTED = "started";
const CANCEL = "cancel";
const PASSED = "passed";

class SchedulerService {
    constructor() {}
    async addNewJob(data) {
        try {
            const scheduleJob = await schedulerModel.create(data);
            return scheduleJob;
        } catch (err) {
            throw err;
        }
    }

    async getScheduleEvent(data) {
        try {
            const { eventId, startDate, endDate } = data;
            const effectiveEndDate = moment(endDate).add(1, "days");
            const events = await schedulerModel.find({
                $and: [
                    { eventId: ObjectId(eventId) },
                    { startTime: { $gte: moment(startDate) } },
                    { startTime: { $lt: moment(effectiveEndDate) } },
                    { status: { $not: { $eq: CANCEL } } }
                ]
            });
            return events;
        } catch (err) {
            throw err;
        }
    }

    async cancelEventBetweenRange(data) {
        const { id, startDate, endDate } = data;
        const res = await schedulerModel.updateMany(
            {
                eventId: ObjectId(id),
                status: { $in: [PENDING, STARTED] },
                startTime: {
                    $gte: moment
                        .utc(startDate)
                        .utcOffset(process.config.UTC_OFFSET_STR)
                        .startOf("day")
                }
            },
            { $set: { status: CANCEL, reason: "DEFAULT" } },
            { new: true }
        );
        return res;
    }

    async getAppointmentHistoryGroupByDate(data) {
        try {
            const { startDate = new Date(), userId } = data;
            const result = await schedulerModel.aggregate([
                {
                    $match: {
                        $and: [
                            { eventType: "appointment" },
                            {
                                startTime: { $lt: new Date(startDate) }
                            },
                            { status: { $nin: [PENDING, STARTED] } },
                            {
                                $or: [
                                    { "data.participantOne": ObjectId(userId) },
                                    { "data.participantTwo": ObjectId(userId) }
                                ]
                            }
                        ]
                    }
                },
                { $sort: { startTime: -1 } },
                { $limit: 20 },
                {
                    $group: {
                        _id: { $dateToString: { date: "$startTime", format: "%Y-%m-%d" } },
                        scheduleEvents: { $push: "$_id" },
                        data: { $push: "$$ROOT" }
                    }
                },
                { $sort: { _id: -1 } }
            ]);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getScheduleEventByEventIdGroupByDate(data) {
        try {
            const { eventIds, startDate, endDate } = data;
            const effectiveEndDate = moment(endDate).add(1, "days");
            const eventList = eventIds.map(value => ObjectId(value));
            const result = await schedulerModel.aggregate([
                {
                    $match: {
                        $and: [
                            { eventId: { $in: eventList }, status: { $ne: CANCEL } },
                            {
                                startTime: {
                                    $gte: new Date(startDate),
                                    $lt: new Date(effectiveEndDate)
                                }
                            }
                        ]
                    }
                },
                { $sort: { startTime: 1 } },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                date: "$startTime",
                                format: "%Y-%m-%d",
                                timezone: process.config.UTC_OFFSET_STR
                            }
                        },
                        scheduleEvents: { $push: "$_id" }
                    }
                }
            ]);
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getScheduleEventsByEventId(eventId) {
        try {
            const result = await schedulerModel.find({
                eventId: eventId
            });
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getScheduleEventById(eventId) {
        try {
            const result = await schedulerModel
                .findOne({
                    _id: eventId
                })
                .lean();
            return result;
        } catch (err) {
            throw err;
        }
    }

    async setAppointmentStatus(data) {
        try {
            const { id, status, userId } = data;
            const statusSelected = status;
            const completedBy = status === COMPLETED ? userId : null;
            const res = await schedulerModel
                .findOneAndUpdate(
                    { _id: ObjectId(id) },
                    {
                        $set: { status: statusSelected, completedBy: completedBy }
                    },
                    { new: true }
                )
                .lean();
            return res;
        } catch (err) {
            throw err;
        }
    }

    //Query to update all status for events---------
    //db.schedulers.updateMany({"eventId": ObjectId("5c7ce5ce268d12006cb49c8a")},{$set : {"status":"cancel"}})

    //Query to update all status as pending
    //db.schedulers.updateMany({},{$set : {"status":"pending"}})

    async scheduleEventMarkAsCancel(data) {
        try {
            const { id, reason } = data;
            const res = await schedulerModel
                .findOneAndUpdate(
                    { _id: ObjectId(id), status: { $in: [PENDING, STARTED] } },
                    {
                        status: CANCEL,
                        $set: {
                            reason: reason
                        }
                    },
                    { new: true }
                )
                .lean();
            const scheduleEventData = await schedulerModel.find({
                _id: ObjectId(id)
            });
            const { data: { repeat = "" } = {}, eventId = "" } =
            scheduleEventData[0] || {};
            // if (repeat === REPEAT_TYPE.NONE) {
            //     const eventRes = await eventModel
            //         .findOneAndUpdate(
            //             { _id: ObjectId(eventId) },
            //             {
            //                 status: CANCEL,
            //                 $set: {
            //                     reason: reason
            //                 }
            //             }
            //         )
            //         .lean();
            // }
            return res;
        } catch (err) {
            console.log("err", err);
            throw err;
        }
    }

    // async markAllEventsAsCancel(data) {
    //     try {
    //         const { id, reason } = data;
    //         const scheduleEventData = await schedulerModel.findById(id);
    //         const eventId = scheduleEventData.eventId;
    //         const eventRes = await eventModel
    //             .findOneAndUpdate(
    //                 { _id: ObjectId(eventId) },
    //                 {
    //                     // status: CANCEL,
    //                     $set: {
    //                         reason: reason
    //                     }
    //                 }
    //             )
    //             .lean();
    //         const res = await schedulerModel
    //             .updateMany(
    //                 { eventId: ObjectId(eventId), status: { $in: [PENDING, STARTED] } },
    //                 { $set: { status: CANCEL, reason: reason } },
    //                 { new: true }
    //             )
    //             .lean();
    //         return eventRes;
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    async editNotes({ id, notes }) {
        try {
            const response = await schedulerModel
                .findOneAndUpdate(
                    { _id: id },
                    { $set: { "data.notes": notes } },
                    { new: true }
                )
                .lean();
            return response;
        } catch (err) {
            throw err;
        }
    }

    async reschedule({ id, startTime, endTime }) {
        try {
            const response = await schedulerModel
                .findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            startTime: moment(startTime),
                            endTime: moment(endTime),
                            status: PENDING
                        }
                    },
                    { new: true }
                )
                .lean();
            return response;
        } catch (err) {
            throw err;
        }
    }
    async getBookedSlot({ eventIds, days }) {
        try {
            const eventList = eventIds.map(id => ObjectId(id));
            let query = { eventId: { $in: eventList } };
            const dayQuery = days.map(event => {
                return {
                    startTime: {
                        $gte: new Date(event.startDate),
                        $lt: new Date(event.endDate)
                    }
                };
            });
            query = { ...query, $or: dayQuery };

            const response = await schedulerModel.find(query);
            return response;
        } catch (err) {}
    }

    async getLastEditedEvent() {
        try {
            const response = await schedulerModel
                .find()
                .limit(1)
                .sort({ updatedAt: -1 });
            return response;
        } catch (err) {
            throw err;
        }
    }

    async addVideoParticipantsToScheduleEvent(eventId, userOne, userTwo) {
        try {
            const result = await schedulerModel.findOneAndUpdate(
                { _id: ObjectId(eventId) },
                {
                    joinedParticipants: [userOne, userTwo]
                }
            );
            return result;
        } catch (err) {
            throw err;
        }
    }

    async getScheduleEventsByEventIds({ eventIds, startTime, endTime }) {
        try {
            const response = await schedulerModel.find({
                eventId: { $in: eventIds.map(id => ObjectId(id)) },
                startTime: { $gte: startTime, $lt: endTime },
                status: "pending"
            });
            return response;
        } catch (err) {
            throw err;
        }
    }

    async updateMedicationReminderStatus(eventId, status, reason) {
        try {
            let result = {};
            if (status === "taken") {
                const { actualTakenDate, comment } = reason;
                result = await schedulerModel
                    .findOneAndUpdate(
                        { _id: eventId },
                        {
                            status: status,
                            "data.actualTakenDate": actualTakenDate,
                            "data.comment": comment
                        },
                        { new: true }
                    )
                    .lean();
            } else if (status === "skip") {
                result = await schedulerModel
                    .findOneAndUpdate(
                        { _id: eventId },
                        {
                            status: status,
                            reason: reason
                        },
                        { new: true }
                    )
                    .lean();
            }
            return result;
        } catch (err) {
            throw err;
        }
    }

    async updateMedicationReminder(values) {
        try {
            const {
                id,
                startTime,
                endTime,
                notes,
                repeat,
                repeatDays,
                repeatInterval,
                medicine,
                quantity,
                strength,
                unit,
                whenToTake,
                participantOne,
                medication_stage,
                participantTwo
            } = values;

            const data = {
                repeat: repeat,
                repeatInterval: repeatInterval,
                repeatDays: repeatDays,
                notes: notes,
                medicine: medicine,
                quantity: quantity,
                strength: strength,
                unit: unit,
                medication_stage: medication_stage,
                whenToTake: whenToTake,
                participantOne: participantOne,
                participantTwo: participantTwo
            };
            let result = await schedulerModel
                .findOneAndUpdate(
                    { _id: id },
                    {
                        $set: {
                            startTime: moment(startTime),
                            endTime: moment(endTime),
                            status: PENDING,
                            data: data
                        }
                    },
                    { new: true }
                )
                .lean();

            return result;
        } catch (err) {
            throw err;
        }
    }

    async cancelMedicationReminderBetweenRange(data) {
        const { id, startDate, endDate } = data;
        const res = await schedulerModel.updateMany(
            {
                eventId: ObjectId(id),
                status: { $in: [PENDING, ACTIVE] },
                startTime: {
                    $gte: moment(startDate)
                        .clone()
                        .startOf("day")
                }
            },
            { $set: { status: CANCEL, reason: "DEFAULT" } },
            { new: true }
        );
        return res;
    }

    async getCountForStatusInEvent(data) {
        const { status, eventId } = data;
        try {
            const count = schedulerModel
                .find({
                    eventId: eventId,
                    status: status
                })
                .count();
            return count;
        } catch (error) {}
    }

    async getMedicationReminderByStartDateandMedicine(data) {
        try {
            console.log("data------------------->", data);
            const result = await schedulerModel.find(data).lean();
            console.log("result===================>", result);
            if (result.length > 0) {
                return true;
            }
            return false;
        } catch (error) {}
    }

    async cancelFutureAppointmentsAfterPhysicianChange(data) {
        try {
            const { patientId, doctorId, currentDateTime } = data;
            const res = await schedulerModel.updateMany(
                {
                    "data.participantOne": ObjectId(patientId),
                    "data.participantTwo": ObjectId(doctorId),
                    status: { $in: [PENDING, STARTED] },
                    startTime: {
                        $gte: moment(currentDateTime)
                    }
                },
                { $set: { status: CANCEL, reason: "Physician Changed" } },
                { new: true }
            );
            return res;
        } catch (error) {}
    }

    async getMedicationReminderByUserId(userId, options) {
        try {
            if (userId) {
                const query = {
                    eventType: EVENT_TYPE.MEDICATION_REMINDER,
                    $or: [
                        { "data.participantOne": ObjectId(userId) },
                        { "data.participantTwo": ObjectId(userId) }
                    ]
                };
                const { sort, limit, status } = options;

                const q = schedulerModel.find(query);
                if (typeof status === "string") {
                    q.where("status").eq(status);
                } else if (typeof status === "object") {
                    q.where("status").in(status);
                }
                if (sort) {
                    q.sort(sort);
                }
                if (limit) {
                    q.limit(limit);
                }
                const medicationReminderData = await q.exec();
                return medicationReminderData && medicationReminderData !== null
                    ? medicationReminderData
                    : [];
            }
        } catch (err) {
            throw err;
        }
    }

    async getAppointmentByUserId(userId, options = {}) {
        try {
            if (userId) {
                const query = {
                    eventType: EVENT_TYPE.APPOINTMENT,
                    $or: [
                        { "data.participantOne": ObjectId(userId) },
                        { "data.participantTwo": ObjectId(userId) }
                    ]
                };
                const { sort, limit, status } = options;
                const q = schedulerModel.find(query);

                if (typeof status === "string") {
                    q.where("status").eq(status);
                } else if (typeof status === "object") {
                    q.where("status").in(status);
                }
                if (sort) {
                    q.sort(sort);
                }
                if (limit) {
                    q.limit(limit);
                }

                const appointmentData = await q.exec();

                return appointmentData && appointmentData !== null
                    ? appointmentData
                    : [];
            }
        } catch (err) {
            throw err;
        }
    }

    async getReminderByUserId(userId, options = {}) {
        try {
            if (userId) {
                const query = {
                    eventType: EVENT_TYPE.REMINDER,
                    $or: [
                        { "data.participantOne": ObjectId(userId) },
                        { "data.participantTwo": ObjectId(userId) }
                    ]
                };
                const { sort, limit, status } = options;

                const q = schedulerModel.find(query);
                if (typeof status === "string") {
                    q.where("status").eq(status);
                } else if (typeof status === "object") {
                    q.where("status").in(status);
                }
                if (sort) {
                    q.sort(sort);
                }
                if (limit) {
                    q.limit(limit);
                }

                const reminderData = await q.exec();

                return reminderData && reminderData !== null ? reminderData : [];
            }
        } catch (err) {
            throw err;
        }
    }
}

export default new SchedulerService();
