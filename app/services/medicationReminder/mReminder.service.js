import database from "../../../libs/mysql";

const {medications: MedicationReminder, medicines: Medicines} = database.models;

class MReminderService {
  async addMReminder(data) {
    try {
      const response = await MedicationReminder.create(data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  updateMedication = async (data, id) => {
    try {
      const medication = await MedicationReminder.update(data, {
        where: {
          id,
        },
      });
      return medication;
    } catch (err) {
      throw err;
    }
  };

  getMedication = async (data) => {
    try {
      const medication = await MedicationReminder.findOne({
        where: data,
        include: [Medicines]
      });
      return medication;
    } catch (err) {
      throw err;
    }
  };

  getMedicationsForParticipant = async (data) => {
    try {
      const medications = await MedicationReminder.findAll({
        where: data,
      });
      return medications;
    } catch (error) {
      throw error;
    }
  };

  deleteMedication = async (id) => {
    try {
      const medication = await MedicationReminder.destroy({
        where: {
          id,
        },
      });
      return medication;
    } catch (err) {
      throw err;
    }
  };
}

export default new MReminderService();
