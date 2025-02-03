import Controller from "../index";

import { createLogger } from "../../../libs/log";

// Services
import NotesService from "../../services/notes/notes.service";
import { USER_CATEGORY } from "../../../constant";

const log = createLogger("WEB > CONTROLLER > NOTES");

class NotesController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    log.debug("notes controller - create - called");

    const {
      userDetails: { userId, userData: { category } = {}, userCategoryId } = {},
      permissions = [],
    } = req;
    let doctor_id,
      provider_type,
      provider_id = null;
    let data = null;

    if (category === USER_CATEGORY.DOCTOR) {
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      provider_type = USER_CATEGORY.DOCTOR;
    }

    if (req.userDetails.userRoleData.basic_info.linked_with === "provider") {
      provider_id = req.userDetails.userRoleData.basic_info.linked_id;
      doctor_id = req.userDetails.userCategoryData.basic_info.id;
      provider_type = req.userDetails.userRoleData.basic_info.linked_with;
    }

    try {
      let data = { ...req.body, doctor_id, provider_type, provider_id };
      log.debug("notes controller data: ", data);
      const notesService = new NotesService();
      let notes = await notesService.addNotes(data);
      return raiseSuccess(res, 200, { notes }, "FlashCard Notes added successfully");
    } catch (error) {
      log.debug("Notes 500 error: ", error);
      return raiseServerError(res);
    }
  };

  getNotesByPatientId = async (req, res) => {
    let { params: { patient_id } = {}, body } = req;
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      if (!patient_id)
        return raiseClientError(
          res,
          422,
          {},
          "Please select correct ServiceOffer to update"
        );

      let data = { patient_id };
      const notesService = new NotesService();
      let notes = await notesService.getAllNotesByData(data);
      return raiseSuccess(res, 200, { notes }, "success");
    } catch (error) {
      log.debug("getNotesByPatientId 500 error: ", error);
      return raiseServerError(res);
    }
  };
}

export default new NotesController();
