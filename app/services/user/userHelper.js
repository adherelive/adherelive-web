const userService = require("../../services/user/user.service");

class UserHelper {
  constructor(object) {
    if (object && typeof object === "object") {
      this.data = object;
    }
  }

  getDocuments = () => {
    const { documents = {} } = this.data;
    return documents;
  };

  getVerifiedStageConsent = () => {
    const { documents = {} } = this.data;
    const keys = Object.keys(documents);
    const stages = [];

    keys.forEach(key => {
      const document = documents[key] || {};
      const { is_verified = false } = document;
      if (is_verified) {
        stages.push(key);
      }
    });
    return stages;
  };

  getMedicationReminderStage = () => {
    const { documents = {} } = this.data;
    const keys = Object.keys(documents);
    const stages = [];

    keys.forEach(key => {
      const document = documents[key] || {};
      const {
        is_medication_reminder_available = false,
        is_verified = false
      } = document;
      if (is_medication_reminder_available && is_verified) {
        stages.push(key);
      }
    });
    return stages;
  };

  saveDocuments = async ({ type, docs, signed_date, upload_by }) => {
    const docs_key = `documents.${type}.docs`;
    const signed_date_key = `documents.${type}.signed_date`;
    const verified_key = `documents.${type}.is_verified`;
    const upload_by_key = `documents.${type}.upload_by`;
    const verified_by_key = `documents.${type}.verified_by`;

    const data = {
      [docs_key]: docs,
      [verified_key]: false,
      [signed_date_key]: signed_date,
      [upload_by_key]: upload_by,
      [verified_by_key]: null
    };

    await userService.updateUser({ _id: this.data.basicInfo._id }, data, true);
  };

  verifyDocs = async ({ type, verified_by }) => {
    const verified_key = `documents.${type}.is_verified`;
    const verified_by_key = `documents.${type}.verified_by`;

    const data = {
      [verified_key]: true,
      [verified_by_key]: verified_by
    };

    await userService.updateUser({ _id: this.data.basicInfo._id }, data);
  };
}

export default async (userId, userData = null) => {
  if (userData && userData === typeof Object) {
    return new UserHelper(userData);
  } else if (userId) {
    console.log("user :", userId);
    const res = await userService.getUserById(userId);
    console.log("res :", res);
    if (res) {
      return new UserHelper(res);
    } else return null;
  }
};
