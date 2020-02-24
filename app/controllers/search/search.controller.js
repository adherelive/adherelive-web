import { USER_CATEGORY } from "../../../constant";

const searchService = require("../../services/search/search.service");
const userService = require("../../services/user/user.service");
const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("searchController");
const ObjectId = require("mongodb").ObjectID;

class SearchController {
  constructor() {}

  async doSearch(req, res) {
    try {
      const {
        programId: programIDs,
        category,
        _id: loggedInUser
      } = req.userDetails.userData;
      const { query } = req.query;
      let findQuery = {};
      if (category === USER_CATEGORY.CARE_COACH) {
        const idArray = programIDs.map(id => ObjectId(id));
        findQuery = {
          //name: { $regex: `${query}`, $options: "$i" },
          programId: { $in: idArray },
          category: { $in: ["doctor", "patient"] }
        };
      } else if (category === USER_CATEGORY.DOCTOR) {
        const doctorsPatient = await searchService.getDoctorsPatient(
          loggedInUser,
          programIDs
        );
        findQuery = {
          _id: { $in: doctorsPatient }
          //name: { $regex: `${query}`, $options: "$i" }
        };
      }
      const users = await searchService.getUsers(findQuery, query);
      const programList = await searchService.getPrograms(programIDs, query);
      let programs = {};

      for (const value of programList) {
        const patientData = await userService.getAllUser(
          {
            programId: { $in: [value._id] },
            category: "patient"
          },
          "name email category  programId,_id"
        );
        const patients = patientData.map(patient => {
          const {
            basicInfo: { _id }
          } = patient;
          return _id;
        });
        programs = {
          ...programs,
          [value._id]: { ...value, patients: patients }
        };
      }

      let response = new Response(true, 200);
      response.setData({ users, programs });
      response.setMessage("Your Search is done.");
      res.send(response.getResponse());
    } catch (err) {
      console.log("err================>", err);
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new SearchController();
