import activityLogModel from "../../models/activityLog";

class ActivityLogService {
  async create(data) {
    try {
      const response = await activityLogModel.create(data);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default new ActivityLogService();
