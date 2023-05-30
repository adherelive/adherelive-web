import express from "express";
import Authenticated from "../middleware/auth";
import PatientController from "../../../app/controllers/patients/patients.controller";
import multer from "multer";

import userService from "../../../app/services/user/user.service";
import patientService from "../../../app/services/patients/patients.service";
import carePlanService from "../../../app/services/carePlan/carePlan.service";
import medicineService from "../../../app/services/medicine/medicine.service";
import appointmentService from "../../../app/services/appointment/appointment.service";
import medicationReminderService from "../../../app/services/medicationReminder/mReminder.service";
import conditionService from "../../../app/services/condition/condition.service";
import qualificationService from "../../../app/services/doctorQualifications/doctorQualification.service";
import doctorRegistrationService from "../../../app/services/doctorRegistration/doctorRegistration.service";
import userRolesService from "../../../app/services/userRoles/userRoles.service";
import DietService from "../../../app/services/diet/diet.service";
import PortionServiceService from "../../../app/services/portions/portions.service";
import RepetitionService from "../../../app/services/exerciseRepetitions/repetition.service";
import WorkoutService from "../../../app/services/workouts/workout.service";
import userPreferenceService from "../../../app/services/userPreferences/userPreference.service";


import ExerciseContentWrapper from "../../../app/ApiWrapper/web/exerciseContents";
import UserRolesWrapper from "../../../app/ApiWrapper/web/userRoles";
import VitalWrapper from "../../../app/ApiWrapper/web/vitals";
import UserWrapper from "../../../app/ApiWrapper/web/user";
import CarePlanWrapper from "../../../app/ApiWrapper/web/carePlan";
import AppointmentWrapper from "../../../app/ApiWrapper/web/appointments";
import MReminderWrapper from "../../../app/ApiWrapper/web/medicationReminder";
import MedicineApiWrapper from "../../../app/ApiWrapper/mobile/medicine";
import SymptomWrapper from "../../../app/ApiWrapper/web/symptoms";
import DoctorWrapper from "../../../app/ApiWrapper/web/doctor";
import ConsentWrapper from "../../../app/ApiWrapper/web/consent";
import PatientWrapper from "../../../app/ApiWrapper/web/patient";
import ReportWrapper from "../../../app/ApiWrapper/web/reports";
import ConditionWrapper from "../../../app/ApiWrapper/web/conditions";
import QualificationWrapper from "../../../app/ApiWrapper/web/doctorQualification";
import RegistrationWrapper from "../../../app/ApiWrapper/web/doctorRegistration";
import DegreeWrapper from "../../../app/ApiWrapper/web/degree";
import CouncilWrapper from "../../../app/ApiWrapper/web/council";
import TreatmentWrapper from "../../../app/ApiWrapper/web/treatments";
import DoctorPatientWatchlistWrapper from "../../../app/ApiWrapper/web/doctorPatientWatchlist";
import DietWrapper from "../../../app/ApiWrapper/web/diet";
import ProviderWrapper from "../../../app/ApiWrapper/web/provider";
import PortionWrapper from "../../../app/ApiWrapper/web/portions";
import WorkoutWrapper from "../../../app/ApiWrapper/web/workouts";
import UserPreferenceWrapper from "../../../app/ApiWrapper/web/userPreference";
import * as DietHelper from "../../../app/controllers/diet/dietHelper"

import moment from "moment";
import {
    BODY_VIEW,
    CONSENT_TYPE,
    EMAIL_TEMPLATE_NAME,
    USER_CATEGORY,
    S3_DOWNLOAD_FOLDER,
    PRESCRIPTION_PDF_FOLDER,
    DIAGNOSIS_TYPE,
    S3_DOWNLOAD_FOLDER_PROVIDER,
    ONBOARDING_STATUS,
    SIGN_IN_CATEGORY,
    PATIENT_MEAL_TIMINGS,
} from "../../../constant";
import { downloadFileFromS3 } from "../../../app/controllers/user/userHelper";

import { getFilePath } from "../../../app/helper/filePath";
import { checkAndCreateDirectory } from "../../../app/helper/common";

import { getDoctorCurrentTime } from "../../../app/helper/getUserTime";

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");

var storage = multer.memoryStorage();
var upload = multer({ dest: "../app/public/", storage: storage });
const dataBinding = {
    items: [
        {
            name: "item 1",
            price: 100,
        },
        {
            name: "item 2",
            price: 200,
        },
        {
            name: "item 3",
            price: 300,
        },
    ],
    total: 600,
    isWatermark: true,
};


async function html_to_pdf({ templateHtml, dataBinding, options }) {
    const template = handlebars.compile(templateHtml);
    const finalHtml = encodeURIComponent(template(dataBinding));

    const browser = await puppeteer.launch({
        args: ["--no-sandbox"],
        headless: true,
    });
    const page = await browser.newPage();
    await page.goto(`data:text/html;charset=UTF-8,${finalHtml}`, {
        waitUntil: "networkidle0",
    });

    let pdfBuffer = await page.pdf(options); // based on = pdf(options?: PDFOptions): Promise<Buffer>; from https://pptr.dev/api/puppeteer.page.pdf pdfBuffer will stored the PDF file Buffer content when "path is not provoded" 
    await browser.close();
    return pdfBuffer; // Returning the value when page.pdf promise gets resolved
};

const router = express.Router();

router.get(
    "/:care_plan_id",
    // Authenticated,
    // PatientController.generatePrescription,
    async (req, res) => {
        try {
            console.log(path.join("./routes/api/prescription/prescription.html"))
            console.log("./prescription.html")
            const templateHtml = fs.readFileSync(
                path.join("./routes/api/prescription/prescription.html"),
                "utf8"
            );
            console.log(path.join(process.cwd(), "prescription.html"))
            const options = {
                format: "A4",
                headerTemplate: "<p></p>",
                footerTemplate: "<p></p>",
                displayHeaderFooter: false,
                margin: {
                    top: "40px",
                    bottom: "100px",
                },
                printBackground: true,
                path: "invoice.pdf",
            };
            let pdf_buffer_vaule = await html_to_pdf({ templateHtml, dataBinding, options });
            res.contentType("application/pdf");
            return res.send(pdf_buffer_vaule);
        } catch (err) {
            console.log(err)
            console.log("care_plan_id", req.params.care_plan_id);
        }
    }
);

router.get(
    "/details/:care_plan_id",
    Authenticated,
    async (req, res) => {
        console.log("details")
        try {
            const { care_plan_id = null } = req.params;
            const {
                userDetails: {
                    userId,
                    userRoleId = null,
                    userData: { category } = {},
                } = {},
                permissions = [],
            } = req;

            const dietService = new DietService();
            const workoutService = new WorkoutService();
            // const carePlanId = parseInt(care_plan_id);
            let doctor_id = "";
            let dataForPdf = {};

            let usersData = {};
            let userRolesData = {};
            let qualifications = {};
            let degrees = {};
            let registrationsData = {};
            let conditions = {};
            let medications = {};
            let medicines = {};
            let nextAppointmentDuration = null;
            if (!care_plan_id) {
                return raiseClientError(res, 422, {}, "Invalid Care Plan.");
            }
            const carePlan = await carePlanService.getCarePlanById(care_plan_id);
            const carePlanData = await CarePlanWrapper(carePlan);
            const { clinical_notes, follow_up_advise } =
                (await carePlanData.getCarePlanDetails()) || {};

            const curr_patient_id = carePlanData.getPatientId();
            const doctorUserRoleId = carePlanData.getUserRoleId();
            const userRoles = await userRolesService.getSingleUserRoleByData({
                id: doctorUserRoleId,
            });
            if (userRoles) {
                const userRolesWrapper = await UserRolesWrapper(userRoles);
                userRolesData = {
                    ...userRolesData,
                    [doctorUserRoleId]: userRolesWrapper.getBasicInfo(),
                };
            }
            const carePlanCreatedDate = carePlanData.getCreatedAt();
            const {
                details: { condition_id = null } = {},
                medication_ids = [],
                appointment_ids = [],
                diet_ids = [],
                workout_ids = [],
            } = await carePlanData.getAllInfo();

            const conditionData = await conditionService.getByData({
                id: condition_id,
            });

            if (conditionData) {
                const condition = await ConditionWrapper(conditionData);
                conditions[condition_id] = condition.getBasicInfo();
            }

            for (const medicationId of medication_ids) {
                const medication = await medicationReminderService.getMedication({
                    id: medicationId,
                });

                if (medication) {
                    const medicationWrapper = await MReminderWrapper(medication);
                    const medicineId = medicationWrapper.getMedicineId();
                    const medicineData = await medicineService.getMedicineByData({
                        id: medicineId,
                    });

                    for (const medicine of medicineData) {
                        const medicineWrapper = await MedicineApiWrapper(medicine);
                        medicines = {
                            ...medicines,
                            ...{
                                [medicineWrapper.getMedicineId()]: medicineWrapper.getAllInfo(),
                            },
                        };
                    }

                    let mediactionNewData = await medicationWrapper.getBasicInfo();

                    medications = {
                        ...medications,
                        ...{ [medicationId]: await medicationWrapper.getBasicInfo() },
                    };
                }
            }
            // }

            const now = moment();
            let nextAppointment = null;

            let suggestedInvestigations = [];
            for (const appointmentId of appointment_ids) {
                const appointment = await appointmentService.getAppointmentById(
                    appointmentId
                );

                if (appointment) {
                    const appointmentWrapper = await AppointmentWrapper(appointment);

                    const startDate = appointmentWrapper.getStartTime();
                    const startDateObj = moment(startDate);
                    const { organizer, provider_id } =
                        await appointmentWrapper.getBasicInfo();
                    const diff = startDateObj.diff(now);

                    if (diff > 0) {
                        if (!nextAppointment || nextAppointment.diff(startDateObj) > 0) {
                            nextAppointment = startDateObj;
                        }
                    }

                    const { type } = appointmentWrapper.getDetails() || {};

                    // if (type !== CONSULTATION) {
                    const {
                        type_description = "",
                        radiology_type = "",
                        description = "",
                        reason = ""
                    } = appointmentWrapper.getDetails() || {};
                    suggestedInvestigations.push({
                        type,
                        description,
                        type_description,
                        radiology_type,
                        provider_id,
                        start_date: startDate,
                        organizer,
                        reason
                    });
                    // }
                }
            }

            let dietApiData = {},
                dietIds = [],
                workoutApiData = {},
                workoutIds = [];

            // diet
            for (const id of diet_ids) {
                const diet = await dietService.getByData({ id });

                if (diet) {
                    const dietData = await dietService.findOne({ id });
                    const dietWrapper = await DietWrapper({ data: dietData });
                    const expired_on = await dietWrapper.getExpiredOn();

                    if (expired_on) {
                        continue;
                    }

                    const referenceInfo = await dietWrapper.getReferenceInfo();

                    let dietFoodGroupsApidata = {},
                        dietBasicInfo = {};

                    dietBasicInfo[dietWrapper.getId()] = await dietWrapper.getBasicInfo();

                    const {
                        diet_food_group_mappings = {},
                        food_groups = {},
                        food_items = {},
                        food_item_details = {},
                    } = referenceInfo || {};

                    const timeWise = await DietHelper.getTimeWiseDietFoodGroupMappings({
                        diet_food_group_mappings,
                    });

                    for (let eachTime in timeWise) {
                        const { mappingIds = [] } = timeWise[eachTime] || {};

                        for (let ele of mappingIds) {
                            let primary = null,
                                related_diet_food_group_mapping_ids = [];

                            if (Array.isArray(ele)) {
                                ele.sort(function (a, b) {
                                    return a - b;
                                });

                                primary = ele[0] || null;
                                related_diet_food_group_mapping_ids = ele.slice(1);
                            } else {
                                primary = ele;
                            }

                            let currentfodmattedData = {};

                            // const related_diet_food_group_mapping_ids = mappingIds.slice(1);
                            let similarFoodGroups = [],
                                notes = "";

                            const current_mapping = diet_food_group_mappings[primary] || {};
                            const { basic_info: { time = "", food_group_id = null } = {} } =
                                current_mapping;
                            const {
                                basic_info: { food_item_detail_id = null, serving = null } = {},
                                details = {},
                            } = food_groups[food_group_id] || {};
                            const { basic_info: { portion_id = null } = {} } =
                                food_item_details[food_item_detail_id] || {};

                            if (details) {
                                const { notes: detail_notes = "" } = details;
                                notes = detail_notes;
                            }
                            if (related_diet_food_group_mapping_ids.length) {
                                for (
                                    let i = 0;
                                    i < related_diet_food_group_mapping_ids.length;
                                    i++
                                ) {
                                    const similarMappingId =
                                        related_diet_food_group_mapping_ids[i];

                                    const {
                                        basic_info: {
                                            food_group_id: similar_food_group_id = null,
                                        } = {},
                                    } = diet_food_group_mappings[similarMappingId] || {};
                                    const {
                                        basic_info: {
                                            food_item_detail_id: similar_food_item_detail_id = null,
                                            serving: similar_serving = null,
                                        } = {},
                                        details: similar_details = {},
                                    } = food_groups[similar_food_group_id] || {};

                                    const {
                                        basic_info: { portion_id: similar_portion_id = null } = {},
                                    } = food_item_details[similar_food_item_detail_id] || {};

                                    let similar_notes = "";
                                    if (similar_details) {
                                        const { notes = "" } = similar_details || {};
                                        similar_notes = notes;
                                    }

                                    const similarData = {
                                        serving: similar_serving,
                                        portion_id: similar_portion_id,
                                        food_item_detail_id: similar_food_item_detail_id,
                                        food_group_id: similar_food_group_id,
                                        notes: similar_notes,
                                    };

                                    similarFoodGroups.push(similarData);
                                    // delete diet_food_group_mappings[similarMappingId];
                                }
                            }

                            currentfodmattedData = {
                                serving,
                                portion_id,
                                food_group_id,
                                notes,
                                food_item_detail_id,
                                similar: [...similarFoodGroups],
                            };

                            const currentDietDataForTime = dietFoodGroupsApidata[time] || [];
                            currentDietDataForTime.push(currentfodmattedData);

                            dietFoodGroupsApidata[`${time}`] = [...currentDietDataForTime];
                        }
                    }

                    dietApiData[id] = {
                        diets: {
                            ...dietBasicInfo,
                        },
                        diet_food_groups: {
                            ...dietFoodGroupsApidata,
                        },
                        food_items,
                        food_item_details,
                    };

                    dietIds.push(id);
                }
            }

            for (const id of workout_ids) {
                const workout = await workoutService.findOne({ id });

                if (workout) {
                    const workoutWrapper = await WorkoutWrapper({ data: workout });
                    const expired_on = await workoutWrapper.getExpiredOn();
                    if (expired_on) {
                        continue;
                    }

                    let workout_exercise_groups = [];
                    const { exercises, exercise_groups, exercise_details } =
                        await workoutWrapper.getReferenceInfo();

                    for (const exerciseGroupId of Object.keys(exercise_groups)) {
                        const {
                            basic_info: { id: exercise_group_id, exercise_detail_id } = {},
                            sets,
                            details = {},
                        } = exercise_groups[exerciseGroupId] || {};

                        const { basic_info: { exercise_id } = {} } =
                            exercise_details[exercise_detail_id] || {};

                        workout_exercise_groups.push({
                            exercise_group_id,
                            exercise_detail_id,
                            sets,
                            ...details,
                        });
                    }

                    workoutApiData[workoutWrapper.getId()] = {
                        ...(await workoutWrapper.getReferenceInfo()),
                        workout_exercise_groups,
                    };

                    workoutIds.push(workoutWrapper.getId());
                }
            }

            const sortedInvestigations = suggestedInvestigations.sort((a, b) => {
                const { start_date: aStartDate } = a || {};
                const { start_date: bStartDate } = b || {};
                if (moment(bStartDate).diff(moment(aStartDate), "minutes") > 0) {
                    return 1;
                } else {
                    return -1;
                }
            });

            if (nextAppointment) {
                nextAppointmentDuration =
                    nextAppointment.diff(now, "days") !== 0
                        ? `${nextAppointment.diff(now, "days")} days`
                        : `${nextAppointment.diff(now, "hours")} hours`;
            }

            let patient = null;

            if (category === USER_CATEGORY.DOCTOR) {
                patient = await patientService.getPatientById({ id: curr_patient_id });
                doctor_id = req.userDetails.userCategoryData.basic_info.id;
            } else if (category === USER_CATEGORY.HSP) {
                patient = await patientService.getPatientById({ id: curr_patient_id });
                ({ doctor_id } = await carePlanData.getReferenceInfo());
            } else {
                patient = await patientService.getPatientByUserId(userId);
                ({ doctor_id } = await carePlanData.getReferenceInfo());
            }

            const patientData = await PatientWrapper(patient);

            const timingPreference = await userPreferenceService.getPreferenceByData({
                user_id: patientData.getUserId(),
            });
            const userPrefOptions = await UserPreferenceWrapper(timingPreference);
            const { timings: userTimings = {} } = userPrefOptions.getAllDetails();
            const timings = DietHelper.getTimings(userTimings);

            // const { doctors, doctor_id } = await carePlanData.getReferenceInfo();
            const { doctors } = await carePlanData.getReferenceInfo();

            const {
                [doctor_id]: {
                    basic_info: { signature_pic = "", full_name = "", profile_pic } = {},
                } = {},
            } = doctors;

            checkAndCreateDirectory(S3_DOWNLOAD_FOLDER);

            const doctorSignImage = `${S3_DOWNLOAD_FOLDER}/${full_name}.jpeg`;

            const downloadImage = await downloadFileFromS3(
                getFilePath(signature_pic),
                doctorSignImage
            );

            const doctorQualifications =
                await qualificationService.getQualificationsByDoctorId(doctor_id);

            await doctorQualifications.forEach(async (doctorQualification) => {
                const doctorQualificationWrapper = await QualificationWrapper(
                    doctorQualification
                );
                const degreeId = doctorQualificationWrapper.getDegreeId();
                const degreeWrapper = await DegreeWrapper(null, degreeId);
                degrees[degreeId] = degreeWrapper.getBasicInfo();
            });

            const doctorRegistrations =
                await doctorRegistrationService.getRegistrationByDoctorId(doctor_id);

            for (const doctorRegistration of doctorRegistrations) {
                const registrationData = await RegistrationWrapper(doctorRegistration);
                const council_id = registrationData.getCouncilId();
                const councilWrapper = await CouncilWrapper(null, council_id);

                const regData = registrationData.getBasicInfo();
                const { basic_info: { number = "" } = {} } = regData;
                registrationsData[registrationData.getDoctorRegistrationId()] = {
                    number,
                    council: councilWrapper.getBasicInfo(),
                };
            }

            const {
                [`${doctor_id}`]: { basic_info: { user_id: doctorUserId = null } = {} },
            } = doctors;

            let user_ids = [doctorUserId, userId];
            if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
                const curr_data = await patientData.getAllInfo();
                const { basic_info: { user_id: curr_p_user_id = "" } = {} } =
                    curr_data || {};
                user_ids = [doctorUserId, curr_p_user_id];
            }

            for (const id of user_ids) {
                const intId = parseInt(id);
                const user = await userService.getUserById(intId);

                if (user) {
                    const userWrapper = await UserWrapper(user.get());
                    usersData = { ...usersData, ...{ [id]: userWrapper.getBasicInfo() } };
                }
            }

            // provider data
            const {
                [doctorUserRoleId]: {
                    basic_info: { linked_id: provider_id = null } = {},
                } = {},
            } = userRolesData || {};

            let providerData = {};

            let providerIcon = "";
            let providerPrescriptionDetails = "";
            if (provider_id) {
                const providerWrapper = await ProviderWrapper(null, provider_id);
                const { providers, users } = await providerWrapper.getReferenceInfo();

                const { details: { icon = null, prescription_details = "" } = {} } =
                    providers[provider_id] || {};
                checkAndCreateDirectory(S3_DOWNLOAD_FOLDER_PROVIDER);
                providerPrescriptionDetails = prescription_details;
                if (icon) {
                    providerIcon = `${S3_DOWNLOAD_FOLDER_PROVIDER}/provider-${provider_id}-icon.jpeg`;

                    const downloadProviderImage = await downloadFileFromS3(
                        getFilePath(icon),
                        providerIcon
                    );
                }

                providerData = { ...providers[provider_id] };
                usersData = { ...usersData, ...users };
            }

            const portionServiceService = new PortionServiceService();
            const allPortions = await portionServiceService.getAll();
            let portionApiData = {};

            for (let each in allPortions) {
                const portion = allPortions[each] || {};
                const portionWrapper = await PortionWrapper({ data: portion });
                portionApiData[portionWrapper.getId()] = portionWrapper.getBasicInfo();
            }

            const repetitionService = new RepetitionService();
            let repetitionApiData = {};

            const { count, rows: repetitions = [] } =
                (await repetitionService.findAndCountAll()) || {};
            if (count) {
                for (let index = 0; index < repetitions.length; index++) {
                    const { id, type } = repetitions[index] || {};
                    repetitionApiData[id] = { id, type };
                }
            }

            dataForPdf = {
                users: { ...usersData },
                // ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {
                //   medications,
                // }),
                // ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {
                //   medicines,
                // }),
                medications,
                clinical_notes,
                follow_up_advise,
                clinical_notes,
                follow_up_advise,
                medicines,
                care_plans: {
                    [carePlanData.getCarePlanId()]: {
                        ...carePlanData.getBasicInfo(),
                    },
                },
                doctors,
                degrees,
                portions: { ...portionApiData },
                repetitions: { ...repetitionApiData },
                conditions,
                providers: providerData,
                providerIcon,
                providerPrescriptionDetails,
                doctor_id,
                registrations: registrationsData,
                creationDate: carePlanCreatedDate,
                nextAppointmentDuration,
                suggestedInvestigations: sortedInvestigations,
                patients: {
                    ...{ [patientData.getPatientId()]: patientData.getBasicInfo() },
                },
                diets_formatted_data: { ...dietApiData },
                workouts_formatted_data: { ...workoutApiData },
                workout_ids: workoutIds,
                diet_ids: dietIds,
                timings,
                currentTime: getDoctorCurrentTime(doctorUserId).format(
                    "Do MMMM YYYY, hh:mm a"
                ),
            };
        }
        catch (err) {
            Logger.debug("Error while generating the prescription: ", err);
            return raiseServerError(res);
        }
    }
);

router.get(
    "/detailss/:care_plan_id",
    Authenticated,
    async (req, res) => {
        try {
            const { care_plan_id = null } = req.params;
            const {
                userDetails: {
                    userId,
                    userRoleId = null,
                    userData: { category } = {},
                } = {},
                permissions = [],
            } = req;

            const dietService = new DietService();
            const workoutService = new WorkoutService();
            // const carePlanId = parseInt(care_plan_id);
            let doctor_id = "";
            let dataForPdf = {};

            let usersData = {};
            let userRolesData = {};
            let qualifications = {};
            let degrees = {};
            let registrationsData = {};
            let conditions = {};
            let medications = {};
            let medicines = {};
            let nextAppointmentDuration = null;
            if (!care_plan_id) {
                return raiseClientError(res, 422, {}, "Invalid Care Plan.");
            }
            const carePlan = await carePlanService.getCarePlanById(care_plan_id);
            const carePlanData = await CarePlanWrapper(carePlan);
            const { clinical_notes, follow_up_advise } =
                (await carePlanData.getCarePlanDetails()) || {};

            const curr_patient_id = carePlanData.getPatientId();
            const doctorUserRoleId = carePlanData.getUserRoleId();
            const userRoles = await userRolesService.getSingleUserRoleByData({
                id: doctorUserRoleId,
            });
            if (userRoles) {
                const userRolesWrapper = await UserRolesWrapper(userRoles);
                userRolesData = {
                    ...userRolesData,
                    [doctorUserRoleId]: userRolesWrapper.getBasicInfo(),
                };
            }
            const carePlanCreatedDate = carePlanData.getCreatedAt();
            const {
                details: { condition_id = null } = {},
                medication_ids = [],
                appointment_ids = [],
                diet_ids = [],
                workout_ids = [],
            } = await carePlanData.getAllInfo();

            const conditionData = await conditionService.getByData({
                id: condition_id,
            });

            if (conditionData) {
                const condition = await ConditionWrapper(conditionData);
                conditions[condition_id] = condition.getBasicInfo();
            }

            for (const medicationId of medication_ids) {
                const medication = await medicationReminderService.getMedication({
                    id: medicationId,
                });

                if (medication) {
                    const medicationWrapper = await MReminderWrapper(medication);
                    const medicineId = medicationWrapper.getMedicineId();
                    const medicineData = await medicineService.getMedicineByData({
                        id: medicineId,
                    });

                    for (const medicine of medicineData) {
                        const medicineWrapper = await MedicineApiWrapper(medicine);
                        medicines = {
                            ...medicines,
                            ...{
                                [medicineWrapper.getMedicineId()]: medicineWrapper.getAllInfo(),
                            },
                        };
                    }

                    let mediactionNewData = await medicationWrapper.getBasicInfo();

                    medications = {
                        ...medications,
                        ...{ [medicationId]: await medicationWrapper.getBasicInfo() },
                    };
                }
            }
            // }

            const now = moment();
            let nextAppointment = null;

            let suggestedInvestigations = [];
            for (const appointmentId of appointment_ids) {
                const appointment = await appointmentService.getAppointmentById(
                    appointmentId
                );

                if (appointment) {
                    const appointmentWrapper = await AppointmentWrapper(appointment);

                    const startDate = appointmentWrapper.getStartTime();
                    const startDateObj = moment(startDate);
                    const { organizer, provider_id } =
                        await appointmentWrapper.getBasicInfo();
                    const diff = startDateObj.diff(now);

                    if (diff > 0) {
                        if (!nextAppointment || nextAppointment.diff(startDateObj) > 0) {
                            nextAppointment = startDateObj;
                        }
                    }

                    const { type } = appointmentWrapper.getDetails() || {};

                    // if (type !== CONSULTATION) {
                    const {
                        type_description = "",
                        radiology_type = "",
                        description = "",
                        reason = ""
                    } = appointmentWrapper.getDetails() || {};
                    suggestedInvestigations.push({
                        type,
                        description,
                        type_description,
                        radiology_type,
                        provider_id,
                        start_date: startDate,
                        organizer,
                        reason
                    });
                    // }
                }
            }

            let dietApiData = {},
                dietIds = [],
                workoutApiData = {},
                workoutIds = [];

            // diet
            for (const id of diet_ids) {
                const diet = await dietService.getByData({ id });

                if (diet) {
                    const dietData = await dietService.findOne({ id });
                    const dietWrapper = await DietWrapper({ data: dietData });
                    const expired_on = await dietWrapper.getExpiredOn();

                    if (expired_on) {
                        continue;
                    }

                    const referenceInfo = await dietWrapper.getReferenceInfo();

                    let dietFoodGroupsApidata = {},
                        dietBasicInfo = {};

                    dietBasicInfo[dietWrapper.getId()] = await dietWrapper.getBasicInfo();

                    const {
                        diet_food_group_mappings = {},
                        food_groups = {},
                        food_items = {},
                        food_item_details = {},
                    } = referenceInfo || {};

                    const timeWise = await DietHelper.getTimeWiseDietFoodGroupMappings({
                        diet_food_group_mappings,
                    });

                    for (let eachTime in timeWise) {
                        const { mappingIds = [] } = timeWise[eachTime] || {};

                        for (let ele of mappingIds) {
                            let primary = null,
                                related_diet_food_group_mapping_ids = [];

                            if (Array.isArray(ele)) {
                                ele.sort(function (a, b) {
                                    return a - b;
                                });

                                primary = ele[0] || null;
                                related_diet_food_group_mapping_ids = ele.slice(1);
                            } else {
                                primary = ele;
                            }

                            let currentfodmattedData = {};

                            // const related_diet_food_group_mapping_ids = mappingIds.slice(1);
                            let similarFoodGroups = [],
                                notes = "";

                            const current_mapping = diet_food_group_mappings[primary] || {};
                            const { basic_info: { time = "", food_group_id = null } = {} } =
                                current_mapping;
                            const {
                                basic_info: { food_item_detail_id = null, serving = null } = {},
                                details = {},
                            } = food_groups[food_group_id] || {};
                            const { basic_info: { portion_id = null } = {} } =
                                food_item_details[food_item_detail_id] || {};

                            if (details) {
                                const { notes: detail_notes = "" } = details;
                                notes = detail_notes;
                            }
                            if (related_diet_food_group_mapping_ids.length) {
                                for (
                                    let i = 0;
                                    i < related_diet_food_group_mapping_ids.length;
                                    i++
                                ) {
                                    const similarMappingId =
                                        related_diet_food_group_mapping_ids[i];

                                    const {
                                        basic_info: {
                                            food_group_id: similar_food_group_id = null,
                                        } = {},
                                    } = diet_food_group_mappings[similarMappingId] || {};
                                    const {
                                        basic_info: {
                                            food_item_detail_id: similar_food_item_detail_id = null,
                                            serving: similar_serving = null,
                                        } = {},
                                        details: similar_details = {},
                                    } = food_groups[similar_food_group_id] || {};

                                    const {
                                        basic_info: { portion_id: similar_portion_id = null } = {},
                                    } = food_item_details[similar_food_item_detail_id] || {};

                                    let similar_notes = "";
                                    if (similar_details) {
                                        const { notes = "" } = similar_details || {};
                                        similar_notes = notes;
                                    }

                                    const similarData = {
                                        serving: similar_serving,
                                        portion_id: similar_portion_id,
                                        food_item_detail_id: similar_food_item_detail_id,
                                        food_group_id: similar_food_group_id,
                                        notes: similar_notes,
                                    };

                                    similarFoodGroups.push(similarData);
                                    // delete diet_food_group_mappings[similarMappingId];
                                }
                            }

                            currentfodmattedData = {
                                serving,
                                portion_id,
                                food_group_id,
                                notes,
                                food_item_detail_id,
                                similar: [...similarFoodGroups],
                            };

                            const currentDietDataForTime = dietFoodGroupsApidata[time] || [];
                            currentDietDataForTime.push(currentfodmattedData);

                            dietFoodGroupsApidata[`${time}`] = [...currentDietDataForTime];
                        }
                    }

                    dietApiData[id] = {
                        diets: {
                            ...dietBasicInfo,
                        },
                        diet_food_groups: {
                            ...dietFoodGroupsApidata,
                        },
                        food_items,
                        food_item_details,
                    };

                    dietIds.push(id);
                }
            }

            for (const id of workout_ids) {
                const workout = await workoutService.findOne({ id });

                if (workout) {
                    const workoutWrapper = await WorkoutWrapper({ data: workout });
                    const expired_on = await workoutWrapper.getExpiredOn();
                    if (expired_on) {
                        continue;
                    }

                    let workout_exercise_groups = [];
                    const { exercises, exercise_groups, exercise_details } =
                        await workoutWrapper.getReferenceInfo();

                    for (const exerciseGroupId of Object.keys(exercise_groups)) {
                        const {
                            basic_info: { id: exercise_group_id, exercise_detail_id } = {},
                            sets,
                            details = {},
                        } = exercise_groups[exerciseGroupId] || {};

                        const { basic_info: { exercise_id } = {} } =
                            exercise_details[exercise_detail_id] || {};

                        workout_exercise_groups.push({
                            exercise_group_id,
                            exercise_detail_id,
                            sets,
                            ...details,
                        });
                    }

                    workoutApiData[workoutWrapper.getId()] = {
                        ...(await workoutWrapper.getReferenceInfo()),
                        workout_exercise_groups,
                    };

                    workoutIds.push(workoutWrapper.getId());
                }
            }

            const sortedInvestigations = suggestedInvestigations.sort((a, b) => {
                const { start_date: aStartDate } = a || {};
                const { start_date: bStartDate } = b || {};
                if (moment(bStartDate).diff(moment(aStartDate), "minutes") > 0) {
                    return 1;
                } else {
                    return -1;
                }
            });

            if (nextAppointment) {
                nextAppointmentDuration =
                    nextAppointment.diff(now, "days") !== 0
                        ? `${nextAppointment.diff(now, "days")} days`
                        : `${nextAppointment.diff(now, "hours")} hours`;
            }

            let patient = null;

            if (category === USER_CATEGORY.DOCTOR) {
                patient = await patientService.getPatientById({ id: curr_patient_id });
                doctor_id = req.userDetails.userCategoryData.basic_info.id;
            } else if (category === USER_CATEGORY.HSP) {
                patient = await patientService.getPatientById({ id: curr_patient_id });
                ({ doctor_id } = await carePlanData.getReferenceInfo());
            } else {
                patient = await patientService.getPatientByUserId(userId);
                ({ doctor_id } = await carePlanData.getReferenceInfo());
            }

            const patientData = await PatientWrapper(patient);

            const timingPreference = await userPreferenceService.getPreferenceByData({
                user_id: patientData.getUserId(),
            });
            const userPrefOptions = await UserPreferenceWrapper(timingPreference);
            const { timings: userTimings = {} } = userPrefOptions.getAllDetails();
            const timings = DietHelper.getTimings(userTimings);

            // const { doctors, doctor_id } = await carePlanData.getReferenceInfo();
            const { doctors } = await carePlanData.getReferenceInfo();

            const {
                [doctor_id]: {
                    basic_info: { signature_pic = "", full_name = "", profile_pic } = {},
                } = {},
            } = doctors;

            checkAndCreateDirectory(S3_DOWNLOAD_FOLDER);

            const doctorSignImage = `${S3_DOWNLOAD_FOLDER}/${full_name}.jpeg`;

            const downloadImage = await downloadFileFromS3(
                getFilePath(signature_pic),
                doctorSignImage
            );

            const doctorQualifications =
                await qualificationService.getQualificationsByDoctorId(doctor_id);

            await doctorQualifications.forEach(async (doctorQualification) => {
                const doctorQualificationWrapper = await QualificationWrapper(
                    doctorQualification
                );
                const degreeId = doctorQualificationWrapper.getDegreeId();
                const degreeWrapper = await DegreeWrapper(null, degreeId);
                degrees[degreeId] = degreeWrapper.getBasicInfo();
            });

            const doctorRegistrations =
                await doctorRegistrationService.getRegistrationByDoctorId(doctor_id);

            for (const doctorRegistration of doctorRegistrations) {
                const registrationData = await RegistrationWrapper(doctorRegistration);
                const council_id = registrationData.getCouncilId();
                const councilWrapper = await CouncilWrapper(null, council_id);

                const regData = registrationData.getBasicInfo();
                const { basic_info: { number = "" } = {} } = regData;
                registrationsData[registrationData.getDoctorRegistrationId()] = {
                    number,
                    council: councilWrapper.getBasicInfo(),
                };
            }

            const {
                [`${doctor_id}`]: { basic_info: { user_id: doctorUserId = null } = {} },
            } = doctors;

            let user_ids = [doctorUserId, userId];
            if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
                const curr_data = await patientData.getAllInfo();
                const { basic_info: { user_id: curr_p_user_id = "" } = {} } =
                    curr_data || {};
                user_ids = [doctorUserId, curr_p_user_id];
            }

            for (const id of user_ids) {
                const intId = parseInt(id);
                const user = await userService.getUserById(intId);

                if (user) {
                    const userWrapper = await UserWrapper(user.get());
                    usersData = { ...usersData, ...{ [id]: userWrapper.getBasicInfo() } };
                }
            }

            // provider data
            const {
                [doctorUserRoleId]: {
                    basic_info: { linked_id: provider_id = null } = {},
                } = {},
            } = userRolesData || {};

            let providerData = {};

            let providerIcon = "";
            let providerPrescriptionDetails = "";
            if (provider_id) {
                const providerWrapper = await ProviderWrapper(null, provider_id);
                const { providers, users } = await providerWrapper.getReferenceInfo();

                const { details: { icon = null, prescription_details = "" } = {} } =
                    providers[provider_id] || {};
                checkAndCreateDirectory(S3_DOWNLOAD_FOLDER_PROVIDER);
                providerPrescriptionDetails = prescription_details;
                if (icon) {
                    providerIcon = `${S3_DOWNLOAD_FOLDER_PROVIDER}/provider-${provider_id}-icon.jpeg`;

                    const downloadProviderImage = await downloadFileFromS3(
                        getFilePath(icon),
                        providerIcon
                    );
                }

                providerData = { ...providers[provider_id] };
                usersData = { ...usersData, ...users };
            }

            const portionServiceService = new PortionServiceService();
            const allPortions = await portionServiceService.getAll();
            let portionApiData = {};

            for (let each in allPortions) {
                const portion = allPortions[each] || {};
                const portionWrapper = await PortionWrapper({ data: portion });
                portionApiData[portionWrapper.getId()] = portionWrapper.getBasicInfo();
            }

            const repetitionService = new RepetitionService();
            let repetitionApiData = {};

            const { count, rows: repetitions = [] } =
                (await repetitionService.findAndCountAll()) || {};
            if (count) {
                for (let index = 0; index < repetitions.length; index++) {
                    const { id, type } = repetitions[index] || {};
                    repetitionApiData[id] = { id, type };
                }
            }
            console.log("============================")
            console.log(" doctor id ", doctor_id);
            console.log(doctors)
            console.log("============================")
            dataForPdf = {
                users: { ...usersData },
                // ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {
                //   medications,
                // }),
                // ...(permissions.includes(PERMISSIONS.MEDICATIONS.VIEW) && {
                //   medicines,
                // }),
                medications,
                clinical_notes,
                follow_up_advise,
                clinical_notes,
                follow_up_advise,
                medicines,
                care_plans: {
                    [carePlanData.getCarePlanId()]: {
                        ...carePlanData.getBasicInfo(),
                    },
                },
                doctors,
                degrees,
                portions: { ...portionApiData },
                repetitions: { ...repetitionApiData },
                conditions,
                providers: providerData,
                providerIcon,
                providerPrescriptionDetails,
                doctor_id: JSON.stringify(doctor_id),
                registrations: registrationsData,
                creationDate: carePlanCreatedDate,
                nextAppointmentDuration,
                suggestedInvestigations: sortedInvestigations,
                patients: {
                    ...{ [patientData.getPatientId()]: patientData.getBasicInfo() },
                },
                diets_formatted_data: { ...dietApiData },
                workouts_formatted_data: { ...workoutApiData },
                workout_ids: workoutIds,
                diet_ids: dietIds,
                timings,
                currentTime: getDoctorCurrentTime(doctorUserId).format(
                    "Do MMMM YYYY, hh:mm a"
                ),
            };

            const templateHtml = fs.readFileSync(
                path.join("./routes/api/prescription/prescription.html"),
                "utf8"
            );
            const options = {
                format: "A4",
                headerTemplate: "<p></p>",
                footerTemplate: "<p></p>",
                displayHeaderFooter: false,
                margin: {
                    top: "40px",
                    bottom: "100px",
                },
                printBackground: true,
                path: "invoice.pdf",
            };

            let pdf_buffer_vaule = await html_to_pdf({ templateHtml, dataBinding: dataForPdf, options });
            res.contentType("application/pdf");
            return res.send(pdf_buffer_vaule);
        }
        catch (err) {
            Logger.debug("Error while generating the prescription: ", err);
            return raiseServerError(res);
        }
    }
);

module.exports = router;
