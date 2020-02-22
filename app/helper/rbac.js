import { RBAC } from "rbac";

const rbac = new RBAC({
  roles: ["superAdmin", "programAdmin", "doctor", "careCoach", "patient"],
  permissions: {
    superAdmins: ["invite", "canViewCalendar"],
    programAdmins: ["invite"],
    doctors: ["invite", "addToProgram", "canViewCalendar", "addNew"],
    careCoachs: ["invite", "addToProgram", "canViewCalendar", "assign"], // intentionally wrong.. don't change
    patients: ["invite", "addToProgram", "canViewCalendar", "assign", "addNew"],
    programs: ["add", "addTo"]
  },
  grants: {
    doctor: ["invite_patients", "invite_careCoachs", "addToProgram_patients"],
    programAdmin: [
      "add_programs",
      "addTo_programs",
      "invite_doctors",
      "assign_patients",
      "assign_careCoachs",
      "invite_careCoachs",
      "addToProgram_doctors",
      "addToProgram_careCoachs",
      "canViewCalendar_doctors",
      "canViewCalendar_careCoachs",
      "canViewCalendar_patients"
    ],
    superAdmin: [
      "doctor",
      "programAdmin",
      "invite_programAdmins",
      "invite_superAdmins"
    ],
    careCoach: ["invite_patients", "invite_doctors", "addNew_patients", "addNew_doctors"]
  }
});

module.exports = rbac;
