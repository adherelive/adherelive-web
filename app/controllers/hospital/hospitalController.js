const hospitalService = require("../../services/hospital/hospital.service");
const userService = require("../../services/user/user.service");
const programService = require("../../services/program/program.service");
const { validationResult } = require("express-validator/check");
const Response = require("../../helper/responseFormat");

class HospitalController {
  constructor() {}

  async getHospitals(req, res) {
    const errors = validationResult(req);
    //
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const { countryId } = req.query;
      let hospitals = await hospitalService.getHospitalsForCountry(countryId);
      if (!hospitals) {
        throw new Error(constants.NO_HOSPITALS_FOUND);
      } else {
        let response = new Response(true, 200);
        response.setData(hospitals);
        response.setMessage("Patient's hospital updated successfully");
        return res.send(response.getResponse());
      }
    } catch (err) {
      let payload;
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async getDoctorHospitals(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const doctorId = req.params.doctorId;
      let doctorHospitals = await hospitalService.getDoctorHospitals(doctorId);
      if (!doctorHospitals) {
        throw new Error(constants.NO_HOSPITALS_FOUND);
      } else {
        let response = new Response(true, 200);
        response.setData(doctorHospitals);
        response.setMessage("hospital data set");
        return res.send(response.getResponse());
      }
    } catch (err) {
      let payload;
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async updatePatientHospital(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let response = new Response(false, 422);
      response.setError(errors.mapped());
      return res.status(422).json(response.getResponse());
    }
    try {
      const {
        body: formData,
        params: { userId: id }
      } = req;
      const { hospital } = formData;
      // const { userId: currUserId } = req.userDetails;
      const user = await userService.getUser({
        _id: id
      });
      const userDetails = user
        ? {
            userId: id,
            userData: user
          }
        : {};
      const {
        userId,
        userData: { category, programId = [] } = {}
      } = userDetails;
      let message;
      if (category === "patient" && (hospital === null || hospital)) {
        if (hospital === null) {
          message = "Patient's hospital unassigned successfully";
        } else {
          message = "Patient's hospital updated successfully";
        }
        const userDoctor = await programService.getDoctorOfUser(
          userId,
          programId[0]
        );
        const { doctors = [] } = userDoctor[0];
        const { patients = [] } = doctors[0];
        let patientIndex = 0;
        patientIndex = patients.findIndex(
          x => x._id.toString() === userId.toString()
        );

        const updateHospital = await hospitalService.updatePatientHospital(
          userId,
          hospital,
          patientIndex
        );
        const { nModified } = updateHospital;
        if (nModified) {
          let response = new Response(true, 200);
          response.setData({
            hospitalId: hospital,
            userId: id
          });
          response.setMessage(message);
          return res.json(response.getResponse());
        }
      }
      let response = new Response(false, 422);
      response.setMessage("Hospital not available");
      return res.send(response.getResponse());
    } catch (error) {
      let payload;
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new HospitalController();
