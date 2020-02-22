const eventModel = require("../../models/event");
import moment from "moment";
import { ObjectId } from "mongodb";
import { EVENT_TYPE } from "../../../constant";

//SCHEDULER STATUSES
const COMPLETED = "completed";
const PENDING = "pending";
const ACTIVE = "active";
const STARTED = "started";
const CANCEL = "cancelled";
const PASSED = "expired";

class EventService {
  async addEvent(data) {
    try {
      const response = await eventModel.create(data);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async searchByField(searchField) {
    try {
      const response = await eventModel.find(searchField);
      return response;
    } catch (err) {
      throw err;
    }
  }
  async updateEvent(searchField, updateField) {
    try {
      const response = await eventModel.update(searchField, {
        $set: updateField
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getEventById(id) {
    try {
      const data = await eventModel.findById(id).lean(true);
      return data;
    } catch (err) {
      throw err;
    }
  }

  // db.events.find({$or:[{"participantTwo":ObjectId("5c715195b4d35b01702012d4")},{"participantOne":ObjectId("5c715195b4d35b01702012d4")}],eventCategory:"reminder",startTime:{$gt:ISODate("2019-02-25T06:11:14.925Z")},startTime:{$lt:ISODate("2019-02-27T06:11:14.925Z")}}).pretty()
  async getEventsByuserId(data) {
    const { userId, startDate, endDate, eventCategories, status = [] } = data;
    try {
      if (userId) {
        const effectiveEndDate = moment(endDate).add(1, "days");
        const query = {
          eventCategory: { $in: eventCategories },
          status: { $in: status },
          $and: [
            {
              $or: [
                { participantOne: ObjectId(userId) },
                { participantTwo: ObjectId(userId) }
              ]
            },
            { status: { $not: { $eq: CANCEL } } }
          ],
          $or: [
            {
              startDate: {
                $lt: moment(effectiveEndDate)
                //$gt: moment(startDate)
              }
            },
            { endDate: { $gt: moment(startDate) } }
          ]
        };
        const events = await eventModel.find(query);
        return events;
      }
    } catch (err) {
      throw err;
    }
  }

  async getEventByDate(data) {
    const { userId, eventCategories, startDate, endDate } = data;
    try {
      const query = {
        eventCategory: { $in: eventCategories },
        status: { $ne: "cancel" },
        startDate: {
          $lt: endDate,
          $gte: startDate
        },
        $or: [
          { participantOne: ObjectId(userId) },
          { participantTwo: ObjectId(userId) }
        ]
      };
      const events = await eventModel.find(query);
      return events;
    } catch (err) {
      throw err;
    }
  }

  async getAdverseEvent(data) {
    const { userId } = data;
    try {
      if (userId) {
        const query = {
          eventCategory: EVENT_TYPE.ADVERSE_EVENT,
          $or: [
            { participantOne: ObjectId(userId) },
            { participantTwo: ObjectId(userId) }
          ]
        };
        const adverseEventData = await eventModel
          .find(query)
          .sort({ updatedAt: -1 });
        return adverseEventData && adverseEventData !== null
          ? adverseEventData
          : [];
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new EventService();
