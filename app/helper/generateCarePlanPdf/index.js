import {
  MEDICATION_TIMING,
  PRESCRIPTION_PDF_FOLDER,
  DOSE_UNIT,
  WHEN_TO_TAKE_ABBREVATIONS,
  APPOINTMENT_TYPE,
  PATIENT_MEAL_TIMINGS,
  // CATEGORY_ONE,
  categories,
} from "../../../constant";
import moment from "moment";
import PDFDocument from "pdfkit";
import { getConvertedTime } from "../getUserTime/index";
// const PDFDocument = require("pdfkit");
const fs = require("fs");
// const moment = require("moment");

const DOC_MARGIN = 30;
const DOC_WIDTH_MARGIN = 550;
const BOLD_FONT_SIZE = 16;
const NORMAL_FONT_SIZE = 12;
const MEDICINE_FONT_SIZE = 16;
const SHORT_FONT_SIZE = 10;
const SMALLEST_FONT_SIZE = 10;
const DOC_HEIGHT = 792;
const DOC_BLOCK_BG_COLOR = "#dfdfdf";
const MAX_WIDTH = 100;
const DISTANCE_BETWEEN_ROWS = 15;
const DEFAULT_REVIEW_AFTER = "2 weeks";

const PAGE_END_LIMIT = 760;

let pageCount = 1;

const LABEL_COLOR = "black";
const VALUE_COLOR = "#7f8c8d";

const BOLD_FONT = "fonts/PlusJakartaSans-Bold.ttf";
const MEDIUM_FONT = "fonts/PlusJakartaSans-Medium.ttf";
const REGULAR_FONT = "fonts/PlusJakartaSans-Regular.ttf";
const HINDI_FONT = "fonts/TiroDevanagariHindi-Regular.ttf";

const SOS_CASE = 0;

export default async (pdfData, signatureImage) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        users = {},
        doctors = {},
        conditions = {},
        patients = {},
        registrations = {},
        degrees = {},
        care_plans = {},
        providers = {},
        doctor_id,
        creationDate = "",
        medications = {},
        medicines = {},
        nextAppointmentDuration = null,
        currentTime = "",
        suggestedInvestigations = [],
        providerIcon = null,
        portions = {},
        repetitions = {},
        diets_formatted_data = {},
        diet_ids = [],
        workouts_formatted_data = {},
        workout_ids = [],
        timings = {},
        clinical_notes = "",
        follow_up_advise = [],
        providerPrescriptionDetails: pdfproviderPrescriptionDetails = "",
      } = pdfData;
      const doc = new PDFDocument({
        size: "A4",
        margin: DOC_MARGIN,
        bufferPages: true,
      });

      let { date: prescriptionDate } = getLatestUpdateDate(medications);

      let providerPrescriptionDetails = pdfproviderPrescriptionDetails.length
        ? pdfproviderPrescriptionDetails
        : "";
      const { allergies, comorbidities } = formatPatientData(patients, users);

      const fileName = getPdfName(pdfData);

      doc.on("pageAdded", () => {
        addPageFooter(doc, providerPrescriptionDetails);
      });

      const stream = doc.pipe(
        fs.createWriteStream(`${PRESCRIPTION_PDF_FOLDER}/${fileName}.pdf`)
      );

      stream.on("finish", () => {
        resolve(fileName);
      });

      // todo: signatureImage : need to be provider icon image

      const doctorBlockEndRowLevel = printDoctorBlockData(
        doc,
        doctors,
        users,
        degrees,
        registrations,
        providers,
        doctor_id,
        providerIcon,
        providerPrescriptionDetails
      );
      prescriptionDate = prescriptionDate || creationDate;
      const addressEndRowLevel = printPatientBlockData(
        doc,
        patients,
        users,
        // creationDate,
        prescriptionDate,
        doctorBlockEndRowLevel
      );

      const addressSideElementsEnd = doc.y;

      const horizontalLineLevel =
        addressEndRowLevel > addressSideElementsEnd
          ? addressEndRowLevel
          : addressSideElementsEnd;

      // generateHr(doc, horizontalLineLevel + 17);

      const suggestedInvestigationXLevelEnd = printCarePlanData({
        doc,
        horizontalLineLevel,
        care_plans,
        conditions,
        medications,
        medicines,
        allergies,
        comorbidities,
        suggestedInvestigations,
        providerPrescriptionDetails,
        follow_up_advise,
      });

      // generateHr(doc, doc.y + 17);

      // generateVr(
      //   doc,
      //   suggestedInvestigationXLevelEnd + 240,
      //   horizontalLineLevel + 17,
      //   doc.y
      // );

      const footerYLevelEnd = printFooter(
        doc,
        signatureImage,
        nextAppointmentDuration,
        // currentTime,
        moment(prescriptionDate)
          .add(330, "minutes")
          .format("Do MMMM YYYY, h:mm a"),
        // moment(prescriptionDate).format("Do MMMM YYYY, h:mm a"),
        providerPrescriptionDetails,
        // AKSHAY NEW CODE IMPLEMENTATION
        suggestedInvestigations
      );

      //  SUGGESTED INVESTIGATION AND NEXT CONSULATION ADDED BY US

      // if (Object.keys(suggestedInvestigations).length) {
      //   const appointmentLevelEnd = printAppointment({
      //     doc,
      //     providerPrescriptionDetails,
      //     suggestedInvestigations,
      //   });
      // }

      // if (Object.keys(suggestedInvestigations).length) {
      //   const consultationLevelEnd = printConsultation({
      //     doc,
      //     providerPrescriptionDetails,
      //     suggestedInvestigations,
      //   });
      // }

      //  SUGGESTED INVESTIGATION CONSULTATION ENDED

      if (pageCount === 1) {
        addPageFooter(doc, providerPrescriptionDetails);
      }

      if (
        Object.keys(diets_formatted_data).length ||
        Object.keys(workouts_formatted_data).length
      ) {
        addPageAndNumber(doc);
        doc
          .font(BOLD_FONT)
          .fontSize(BOLD_FONT_SIZE)
          .text("ADVICE", DOC_MARGIN, DOC_MARGIN);
      }

      const dietStartLevel = doc.y + 10;

      const dietBlockLevelEnd = Object.keys(diets_formatted_data).length
        ? printDiet(
            doc,
            dietStartLevel,
            portions,
            diets_formatted_data,
            timings,
            diet_ids
          )
        : null;

      // const dietYLevel =
      // dietBlockLevelEnd
      // ? dietBlockLevelEnd + NORMAL_FONT_SIZE + 12
      // :
      // footerYLevelEnd + NORMAL_FONT_SIZE + 12 ;

      let workoutBlockLevelEnd = doc.y;
      let workoutStartLevel = doc.y;

      if (Object.keys(workouts_formatted_data).length) {
        if (Object.keys(diets_formatted_data).length) {
          addPageAndNumber(doc);
          workoutStartLevel = DOC_MARGIN;
        }

        workoutBlockLevelEnd = printWorkout(
          doc,
          workoutStartLevel,
          repetitions,
          workouts_formatted_data,
          workout_ids
        );
      }

      let singleDietDetailYLevel;

      if (doc.y + 3 * MEDIUM_FONT > PAGE_END_LIMIT) {
        addPageAndNumber(doc);
        singleDietDetailYLevel = DOC_MARGIN;
      }

      // if(providerPrescriptionDetails){
      //   doc
      //   .fontSize(NORMAL_FONT_SIZE)
      //   .fillColor("#212b36")
      //   .font(BOLD_FONT)
      //   .text("Provider Details",DOC_MARGIN,  doc.y + 20)
      //   .font(MEDIUM_FONT)
      //   .text(`${providerPrescriptionDetails}`, DOC_MARGIN,
      //   doc.y + 20)
      // }

      doc
        .fontSize(SHORT_FONT_SIZE)
        .text(
          "Note: This prescription is generated on the AdhereLive platform.",
          DOC_MARGIN,
          doc.y + 20
        );

      // doc
      // .font(MEDIUM_FONT)
      // .text(`${pageCount}`, DOC_MARGIN, height-25)

      // printProviderPrescriptionDetails(doc);

      pageCount = 1;
      doc.end();
    } catch (err) {
      resolve(null);
    }
  });
};

function getPdfName(pdfData) {
  const {
    doctors = {},
    users = {},
    degrees = {},
    registrations = {},
    care_plans = {},
    conditions = {},
  } = pdfData;

  const { name: doctorName = "" } = formatDoctorsData(
    doctors,
    users,
    degrees,
    registrations
  );

  const { diagnosis, carePlanId } = formatCarePlanData(care_plans, conditions);

  // const now = new Date();
  return `${carePlanId}-${diagnosis}-${doctorName}-${moment().format(
    "DD-MM-YY-hh-mm-ss"
  )}`;
}

function printDiet(
  doc,
  medicationYLevel,
  portions,
  diets_formatted_data,
  timings,
  diet_ids
) {
  doc
    .font(BOLD_FONT)
    .fontSize(BOLD_FONT_SIZE)
    .text("DIET", DOC_MARGIN, medicationYLevel);

  const dietsHeaderEnds = doc.y;

  const serialNoXStart = DOC_MARGIN;
  // AKSHAY NEW CODE IMPLEMENTATIONS START
  // const drNameDietXStart = DOC_MARGIN + 50;
  // AKSHAY NEW CODE IMPLEMENTATIONS END
  const dietNameXStart = DOC_MARGIN + 40;
  const dietDetailsTimeXStart = DOC_MARGIN + 120;
  const dietDetailsDataXStart = DOC_MARGIN + 300;
  const startDateXStart = DOC_MARGIN + 430;
  const endDateXStart = DOC_MARGIN + 560;

  doc
    .fillColor("#4a90e2")
    .fontSize(NORMAL_FONT_SIZE)
    .font(BOLD_FONT)
    .text("S.No.", serialNoXStart, dietsHeaderEnds + 20)
    // AKSHAY NEW CODE IMPLEMENTATIONS START
    // .font(BOLD_FONT)
    // .text("Provider Name", drNameDietXStart, dietsHeaderEnds + 20)
    // AKSHAY NEW CODE IMPLEMENTATIONS END
    .font(BOLD_FONT)
    .text("Diet Name", dietNameXStart, dietsHeaderEnds + 20)
    .font(BOLD_FONT)
    .text("Time", dietDetailsTimeXStart, dietsHeaderEnds + 20)
    .font(BOLD_FONT)
    .text("Details", dietDetailsDataXStart, dietsHeaderEnds + 20)
    .font(BOLD_FONT)
    .text("Duration", startDateXStart, dietsHeaderEnds + 20)
    .font(BOLD_FONT);
  // .text("End Date", endDateXStart, dietsHeaderEnds + 20)

  // generateHr(doc, dietsHeaderEnds+10);

  let dietCount = 1;
  let singleDietDetailYLevel = doc.y;

  for (let each in diets_formatted_data) {
    if (doc.y + 3 * SHORT_FONT_SIZE > PAGE_END_LIMIT) {
      addPageAndNumber(doc);
      singleDietDetailYLevel = DOC_MARGIN;
    }

    const {
      diets = {},
      diet_food_groups = {},
      food_items = {},
      food_item_details = {},
    } = diets_formatted_data[each];

    const {
      basic_info: {
        name: diet_name,
        start_date = null,
        end_date = null,
        total_calories = 0,
      } = {},
      details: { not_to_do = "", repeat_days = [] } = {},
    } = diets[Object.keys(diets)[0]] || {};

    let basicDetailsYLevel = singleDietDetailYLevel + 20,
      formattedStartDate = "--",
      formattedEndDate = "--";

    if (start_date) {
      formattedStartDate = moment(start_date);
    }
    if (end_date) {
      formattedEndDate = moment(end_date);
    }

    let duration = null;
    let durationText = "";
    if (end_date) {
      duration = formattedEndDate.diff(formattedStartDate, "days");
      durationText = `${duration}${" "}days`;
      if (duration >= 7) {
        const weeks = Math.floor(duration / 7) || 0;
        const days = duration % 7 || 0;
        durationText = `${
          weeks > 0 ? `${weeks}${" "}${weeks > 1 ? "weeks" : "week"}${" "}` : ""
        }${days > 0 ? `${days}${" "}${days > 1 ? "days" : "day"}` : ""} `;
      }
    }

    doc
      .fillColor("#212b36")
      .fontSize(SHORT_FONT_SIZE)
      .font(MEDIUM_FONT)
      .text(`${dietCount}.`, serialNoXStart, basicDetailsYLevel)
      // AKSHAY NEW CODE IMPLEMENTATIONS START
      // .text(`Dr akshay`, drNameDietXStart, basicDetailsYLevel, {
      //   width: dietNameXStart - drNameDietXStart,
      // })
      // AKSHAY NEW CODE IMPLEMENTATIONS END
      .text(`${diet_name}`, dietNameXStart, basicDetailsYLevel, {
        width: dietDetailsTimeXStart - dietNameXStart,
      })
      .text(
        `${!end_date ? "Long Term" : durationText}`,
        startDateXStart,
        basicDetailsYLevel,
        {
          width: endDateXStart - startDateXStart,
        }
      );
    // .text(`${formattedEndDate}`, endDateXStart, basicDetailsYLevel)

    for (let time in diet_food_groups) {
      const foodGroupArrayForTime = diet_food_groups[time] || [];

      const timeObj = Object.keys(timings).length
        ? timings[time]
        : PATIENT_MEAL_TIMINGS[time];
      const { text: timeText = "", time: timeVal = "" } = timeObj || {};
      const formattedTime = moment(timeVal)
        .add(330, "minutes")
        .format("hh:mm A");
      doc
        .fillColor("#212b36")
        .font(MEDIUM_FONT)
        .text(
          `${timeText}${" "}(${formattedTime})${" "}`,
          dietDetailsTimeXStart,
          singleDietDetailYLevel + 20,
          {
            width: dietDetailsDataXStart - dietDetailsTimeXStart,
            // continued:true
          }
        );

      for (let foodGroup of foodGroupArrayForTime) {
        const {
          food_group_id = null,
          food_item_detail_id = null,
          notes = "",
          portion_id = null,
          serving = null,
          similar = [],
        } = foodGroup || {};

        const {
          basic_info: { food_item_id = null, portion_size = null } = {},
        } = food_item_details[food_item_detail_id] || {};
        const { basic_info: { name: food_name = "" } = {} } =
          food_items[food_item_id] || {};
        const { basic_info: { name: portion_type = "" } = {} } =
          portions[portion_id] || {};

        let singleData = `${serving}x${" "}${portion_size}${" "}${portion_type}${" "}${food_name}${
          similar.length > 0 && notes.length ? `${" "}(${notes})${" "}` : ""
        }`;

        for (let i in similar) {
          const eachSimilar = similar[i] || {};

          const {
            food_group_id = null,
            food_item_detail_id = null,
            notes = "",
            portion_id = null,
            serving = null,
          } = eachSimilar || {};

          const {
            basic_info: { food_item_id = null, portion_size = null } = {},
          } = food_item_details[food_item_detail_id] || {};
          const { basic_info: { name: food_name = "" } = {} } =
            food_items[food_item_id] || {};
          const { basic_info: { name: portion_type = "" } = {} } =
            portions[portion_id] || {};

          singleData =
            singleData +
            `${" "}/${" "}${serving}x${" "}${portion_size}${" "}${portion_type}${" "}${food_name}${
              notes.length ? `${" "}(${notes})${" "}` : ""
            }`;
        }

        if (doc.y + 3 * MEDIUM_FONT > PAGE_END_LIMIT) {
          addPageAndNumber(doc);
          singleDietDetailYLevel = DOC_MARGIN;
        }

        doc
          .fillColor("#212b36")
          .font(MEDIUM_FONT)
          .text(
            `${singleData}`,
            dietDetailsDataXStart,
            singleDietDetailYLevel + 20,
            {
              width: startDateXStart - dietDetailsDataXStart,
            }
          );

        singleDietDetailYLevel = doc.y;

        similar && notes && similar.length === 0 && notes.length
          ? doc
              .fillColor("#212b36")
              .font(BOLD_FONT)
              .text(
                `Instructions:${" "}`,
                dietDetailsDataXStart,
                singleDietDetailYLevel + 5,
                {
                  width: startDateXStart - dietDetailsDataXStart,
                  continued: true,
                }
              )
              .font(MEDIUM_FONT)
              .text(
                `${notes}`,
                dietDetailsDataXStart,
                singleDietDetailYLevel + 5,
                {
                  width: startDateXStart - dietDetailsDataXStart,
                }
              )
          : null;

        if (doc.y + 3 * SHORT_FONT_SIZE > PAGE_END_LIMIT) {
          addPageAndNumber(doc);
          singleDietDetailYLevel = DOC_MARGIN;
        }

        singleDietDetailYLevel = doc.y;
      }

      singleDietDetailYLevel = doc.y + 20;
    }

    singleDietDetailYLevel = doc.y;

    doc
      .fillColor("#212b36")
      .font(BOLD_FONT)
      .text(
        `Repeat Days${" "}${"-"}`,
        dietDetailsTimeXStart,
        singleDietDetailYLevel + 20,
        {
          width: startDateXStart - dietDetailsTimeXStart,
          continued: true,
        }
      )
      .font(MEDIUM_FONT)
      .text(
        `${repeat_days}`,
        dietDetailsTimeXStart + 10,
        singleDietDetailYLevel + 20,
        {
          width: startDateXStart - dietDetailsTimeXStart,
        }
      );

    singleDietDetailYLevel = doc.y;

    doc
      .font(BOLD_FONT)
      .text(
        `What Not to Do${" "}${"-"}`,
        dietDetailsTimeXStart,
        singleDietDetailYLevel + 10,
        {
          width: startDateXStart - dietDetailsTimeXStart,
          continued: true,
        }
      )
      .font(MEDIUM_FONT)
      .text(
        `${not_to_do ? not_to_do : "--"}`,
        dietDetailsTimeXStart + 10,
        singleDietDetailYLevel + 10,
        {
          width: startDateXStart - dietDetailsTimeXStart,
        }
      );

    singleDietDetailYLevel = doc.y;

    doc
      .font(BOLD_FONT)
      .text(
        `Total Calories${" "}${"-"}`,
        dietDetailsTimeXStart,
        singleDietDetailYLevel + 10,
        {
          width: startDateXStart - dietDetailsTimeXStart,
          continued: true,
        }
      )
      .font(MEDIUM_FONT)
      .text(
        `${total_calories}${" "}Cal`,
        dietDetailsTimeXStart + 10,
        singleDietDetailYLevel + 10,
        {
          width: startDateXStart - dietDetailsTimeXStart,
        }
      );

    singleDietDetailYLevel = doc.y;

    generateHr(doc, singleDietDetailYLevel + 10);

    singleDietDetailYLevel = doc.y;

    dietCount++;

    if (doc.y + 3 * SHORT_FONT_SIZE > PAGE_END_LIMIT) {
      addPageAndNumber(doc);
      singleDietDetailYLevel = DOC_MARGIN;
    }
  }

  return doc.y + 20;
}

function printWorkout(
  doc,
  dietYLevel,
  repetitions,
  workouts_formatted_data,
  workout_ids
) {
  const serialNoXStart = DOC_MARGIN;
  // AKSHAY NEW CODE IMPLEMENTATIONS START
  // const drNameWorkoutXStart = DOC_MARGIN + 50;
  // AKSHAY NEW CODE IMPLEMENTATIONS END
  const workoutNameXStart = DOC_MARGIN + 40;
  const workoutTimeXStart = DOC_MARGIN + 160;
  const workoutDetailsDataXStart = DOC_MARGIN + 230;
  const startDateXStart = DOC_MARGIN + 430;
  const endDateXStart = DOC_MARGIN + 560;

  doc
    .font(BOLD_FONT)
    .fontSize(BOLD_FONT_SIZE)
    .text("WORKOUT", DOC_MARGIN, dietYLevel);

  const workoutsHeaderEnds = doc.y;

  doc
    .fillColor("#4a90e2")
    .fontSize(NORMAL_FONT_SIZE)
    .font(BOLD_FONT)
    .text("S.No.", serialNoXStart, workoutsHeaderEnds + 20)
    // AKSHAY NEW CODE IMPLEMENTATIONS START
    // .font(BOLD_FONT)
    // .text("Provider Name", drNameWorkoutXStart, workoutsHeaderEnds + 20)
    // AKSHAY NEW CODE IMPLEMENTATIONS END
    .font(BOLD_FONT)
    .text("Workout Name", workoutNameXStart, workoutsHeaderEnds + 20)
    .font(BOLD_FONT)
    .text("Time", workoutTimeXStart, workoutsHeaderEnds + 20)
    .font(BOLD_FONT)
    .text("Details", workoutDetailsDataXStart, workoutsHeaderEnds + 20)
    .font(BOLD_FONT)
    .text("Duration", startDateXStart, workoutsHeaderEnds + 20)
    .font(BOLD_FONT);
  // .text("End Date",endDateXStart, workoutsHeaderEnds + 20)

  let workoutCount = 1;
  let singleWorkoutDetailYLevel = doc.y;

  for (let each in workouts_formatted_data) {
    if (doc.y + 3 * SHORT_FONT_SIZE > PAGE_END_LIMIT) {
      addPageAndNumber(doc);
      singleWorkoutDetailYLevel = DOC_MARGIN;
    }

    const {
      workouts = {},
      exercises = {},
      exercise_details = {},
      workout_exercise_groups = {},
    } = workouts_formatted_data[each];

    const {
      basic_info: { name: workout_name } = {},
      details: { not_to_do = "", repeat_days = [] } = {},
      time: workoutTime = "",
      start_date = null,
      end_date = null,
      total_calories = 0,
    } = workouts[Object.keys(workouts)[0]] || {};

    let basicDetailsYLevel = singleWorkoutDetailYLevel + 20,
      formattedStartDate = "--",
      formattedEndDate = "--";

    if (start_date) {
      formattedStartDate = moment(start_date);
    }
    if (end_date) {
      formattedEndDate = moment(end_date);
    }

    let duration = null;
    let durationText = "";
    if (end_date) {
      duration = formattedEndDate.diff(formattedStartDate, "days");
      durationText = `${duration}${" "}days`;
      if (duration >= 7) {
        const weeks = Math.floor(duration / 7) || 0;
        const days = duration % 7 || 0;
        durationText = `${
          weeks > 0 ? `${weeks}${" "}${weeks > 1 ? "weeks" : "week"}${" "}` : ""
        }${days > 0 ? `${days}${" "}${days > 1 ? "days" : "day"}` : ""} `;
      }
    }

    const formattedTime = getConvertedTime({ time: workoutTime }).format(
      "hh:mm A"
    );
    doc
      .fillColor("#212b36")
      .fontSize(SHORT_FONT_SIZE)
      .font(MEDIUM_FONT)
      .text(`${workoutCount}.`, serialNoXStart, basicDetailsYLevel)
      // AKSHAY NEW CODE IMPLEMENTATIONS START
      // .text(`Dr akshay`, drNameWorkoutXStart, basicDetailsYLevel, {
      //   width: workoutNameXStart - drNameWorkoutXStart,
      // })
      // AKSHAY NEW CODE IMPLEMENTATIONS END
      .text(`${workout_name}`, workoutNameXStart, basicDetailsYLevel, {
        width: workoutTimeXStart - workoutNameXStart,
      })
      .text(`${formattedTime}`, workoutTimeXStart, basicDetailsYLevel, {
        width: workoutDetailsDataXStart - workoutTimeXStart,
      })
      .text(
        `${!end_date ? "Long Term" : durationText}`,
        startDateXStart,
        basicDetailsYLevel,
        {
          width: endDateXStart - startDateXStart,
        }
      );
    // .text(`${formattedEndDate}`, endDateXStart, basicDetailsYLevel)

    for (let each in workout_exercise_groups) {
      const exerciseGroupArrayForEach = workout_exercise_groups[each] || [];

      const {
        exercise_detail_id = null,
        notes = "",
        sets = null,
      } = exerciseGroupArrayForEach || {};

      const {
        basic_info: {
          exercise_id = null,
          repetition_value = null,
          repetition_id = null,
        } = {},
      } = exercise_details[exercise_detail_id] || {};
      const { basic_info: { name: exercise_name = "" } = {} } =
        exercises[exercise_id] || {};
      const { type: repetition_type = "" } = repetitions[repetition_id] || {};

      let singleData = `${sets}${" "}set${" "}x${" "}${repetition_value}${" "}${repetition_type}${" "}${exercise_name}`;

      if (doc.y + 3 * MEDIUM_FONT > PAGE_END_LIMIT) {
        addPageAndNumber(doc);
        singleWorkoutDetailYLevel = DOC_MARGIN;
      }

      doc
        .fillColor("#212b36")
        .font(MEDIUM_FONT)
        .text(
          `${singleData}`,
          workoutDetailsDataXStart,
          singleWorkoutDetailYLevel + 20,
          {
            width: startDateXStart - workoutDetailsDataXStart,
          }
        );

      singleWorkoutDetailYLevel = doc.y;

      notes.length
        ? doc
            .fillColor("#212b36")
            .font(BOLD_FONT)
            .text(
              `Instructions:${" "}`,
              workoutDetailsDataXStart,
              singleWorkoutDetailYLevel + 5,
              {
                width: startDateXStart - workoutDetailsDataXStart,
                continued: true,
              }
            )
            .font(MEDIUM_FONT)
            .text(
              `${notes}`,
              workoutDetailsDataXStart,
              singleWorkoutDetailYLevel + 5,
              {
                width: startDateXStart - workoutDetailsDataXStart,
              }
            )
        : null;

      if (doc.y + 3 * SHORT_FONT_SIZE > PAGE_END_LIMIT) {
        addPageAndNumber(doc);
        singleWorkoutDetailYLevel = DOC_MARGIN;
      }

      singleWorkoutDetailYLevel = doc.y;
    }

    singleWorkoutDetailYLevel = doc.y;

    doc
      .fillColor("#212b36")
      .font(BOLD_FONT)
      .text(
        `Repeat Days${" "}${"-"}`,
        workoutDetailsDataXStart,
        singleWorkoutDetailYLevel + 20,
        {
          width: startDateXStart - workoutDetailsDataXStart,
          continued: true,
        }
      )
      .font(MEDIUM_FONT)
      .text(
        `${repeat_days}`,
        workoutDetailsDataXStart + 10,
        singleWorkoutDetailYLevel + 20,
        {
          width: startDateXStart - workoutDetailsDataXStart,
        }
      );

    singleWorkoutDetailYLevel = doc.y;

    doc
      .font(BOLD_FONT)
      .text(
        `What Not to Do${" "}${"-"}`,
        workoutDetailsDataXStart,
        singleWorkoutDetailYLevel + 10,
        {
          width: startDateXStart - workoutDetailsDataXStart,
          continued: true,
        }
      )
      .font(MEDIUM_FONT)
      .text(
        `${not_to_do ? not_to_do : "--"}`,
        workoutDetailsDataXStart + 10,
        singleWorkoutDetailYLevel + 10,
        {
          width: startDateXStart - workoutDetailsDataXStart,
        }
      );

    singleWorkoutDetailYLevel = doc.y;

    doc
      .font(BOLD_FONT)
      .text(
        `Total Calories${" "}${"-"}`,
        workoutDetailsDataXStart,
        singleWorkoutDetailYLevel + 10,
        {
          width: startDateXStart - workoutDetailsDataXStart,
          continued: true,
        }
      )
      .font(MEDIUM_FONT)
      .text(
        `${total_calories}${" "}Cal`,
        workoutDetailsDataXStart + 10,
        singleWorkoutDetailYLevel + 10,
        {
          width: startDateXStart - workoutDetailsDataXStart,
        }
      );

    singleWorkoutDetailYLevel = doc.y;

    generateHr(doc, singleWorkoutDetailYLevel + 10);

    singleWorkoutDetailYLevel = doc.y;

    workoutCount++;

    if (doc.y + 3 * SHORT_FONT_SIZE > PAGE_END_LIMIT) {
      addPageAndNumber(doc);
      singleWorkoutDetailYLevel = DOC_MARGIN;
    }
  }

  return doc.y + 20;
}

function printAppointment({
  doc,
  providerPrescriptionDetails,
  suggestedInvestigations,
  docYLevel,
}) {
  try {
    let labFindingsEndLevel = doc.y;
    if (suggestedInvestigations.length > 0) {
      addPageAndNumber(doc);
      labFindingsEndLevel = DOC_MARGIN;
    }

    let medicationYLevel = doc.y;

    // MEDICATIONS
    // addPageFooter(doc, providerPrescriptionDetails);

    if (suggestedInvestigations.length > 0) {
      doc
        .font(BOLD_FONT)
        .fontSize(BOLD_FONT_SIZE)
        .text("Suggested Investigations", DOC_MARGIN, labFindingsEndLevel + 15);

      const rXLabelEndLevelY = doc.y;

      const serialNoXStart = DOC_MARGIN;
      // const drXStart = DOC_MARGIN + 35;
      // const medicineXStart = DOC_MARGIN + 40;
      const medicineXStart = DOC_MARGIN + 40;
      const dosageXStart = DOC_MARGIN + 220;
      const quantityXStart = DOC_MARGIN + 330;
      const frequencyXStart = DOC_MARGIN + 410;
      const timingFrequencyXStart = DOC_MARGIN + 410;

      // generateHr(doc, doc.y);
      // medicine table header
      doc
        .fillColor("#4a90e2")
        .fontSize(NORMAL_FONT_SIZE)
        .font(BOLD_FONT)
        .text("SNo", serialNoXStart, rXLabelEndLevelY + 10)
        // .text("Provider Name", drXStart, rXLabelEndLevelY + 10)
        .text("Description", medicineXStart, rXLabelEndLevelY + 10)
        .text("Test Date", dosageXStart, rXLabelEndLevelY + 10)
        .text("Provider", quantityXStart, rXLabelEndLevelY + 10)
        .text("Purpose", frequencyXStart, rXLabelEndLevelY + 10);
      // .text("Time-Duration", timingFrequencyXStart, rXLabelEndLevelY + 10);
      //AKSHAY NEW CODE IMPLEMENTATIONS
      // .text(
      //   "Start Date / Duration",
      //   timingFrequencyXStart,
      //   rXLabelEndLevelY + 10
      // );

      // generateHr(doc, doc.y);

      const medicationTableHeaderEndYLevel = doc.y;
      medicationYLevel = doc.y + 10;
      let srNumber = 1;

      for (let each in suggestedInvestigations) {
        const {
          type,
          type_description,
          radiology_type,
          start_date,
          organizer,
        } = suggestedInvestigations[each] || {};

        // gaurav new changes - start
        if (doc.y + 3 * SHORT_FONT_SIZE > PAGE_END_LIMIT) {
          if (pageCount === 1) {
            // addPageFooter(doc, providerPrescriptionDetails);
          }
          // addPageAndNumber(doc);
          medicationYLevel = DOC_MARGIN;
        }

        if (APPOINTMENT_TYPE[type].title === "Consultation") continue;

        // let today = new moment();
        // let start = moment(start_date);

        // if (start.isSameOrAfter(today)) {
          // gaurav new changes - start
          doc
            .fillColor("#212b36")
            .fontSize(SHORT_FONT_SIZE)
            .font(MEDIUM_FONT)
            .text(
              `Test Date`,
              dosageXStart,
              medicationYLevel
            )
            .text(`Self`, quantityXStart, medicationYLevel)
            .text(`Test purpose`, frequencyXStart, medicationYLevel, {
              width: timingFrequencyXStart - frequencyXStart - 25,
            });

          doc
            .fillColor("#212b36")
            .fontSize(SHORT_FONT_SIZE)
            .font(MEDIUM_FONT)
            .text(`${srNumber}.`, serialNoXStart, medicationYLevel)
            // gaurav new changes - end

            // .text(`${organizer.name}`, drXStart, medicationYLevel, {
            //   width: medicineXStart - drXStart,
            // })
            .text(
              `${type_description}${radiology_type ? `-${radiology_type}` : ""
              }(${APPOINTMENT_TYPE[type].title})`,
              medicineXStart,
              medicationYLevel,
              {
                width: dosageXStart - medicineXStart,
              }
            )
            // AKSHAY NEW CODE IMPLEMENTATIONS
            .text(
              `Prescribed by Dr. ${organizer.name}`,
              medicineXStart,
              doc.y,
              {
                width: dosageXStart - medicineXStart,
              }
            )
            .text(`Note:-`, medicineXStart, doc.y, {
              width: dosageXStart - medicineXStart - 20,
            });
        // }

        const medicationYLevelEnd = doc.y;

        const horizontalLineY =
          medicationYLevelEnd > doc.y ? medicationYLevelEnd : doc.y;
        generateHr(doc, horizontalLineY + 5);

        medicationYLevel = medicationYLevelEnd + NORMAL_FONT_SIZE + 12;

        if (doc.y > PAGE_END_LIMIT) {
          if (pageCount === 1) {
            // addPageFooter(doc, providerPrescriptionDetails);
          }
        }
        srNumber++;
      }
    }

    // if (!medicationsList.length > 0) {
    //   medicationYLevel = generalExaminationEndLevel + NORMAL_FONT_SIZE + 12;
    // }
  } catch (ex) {
    console.log(ex);
  }
}

function printConsultation({
  doc,
  providerPrescriptionDetails,
  suggestedInvestigations,
}) {
  try {
    const labFindingsEndLevel = doc.y;
    let medicationYLevel = doc.y;

    // MEDICATIONS
    // addPageFooter(doc, providerPrescriptionDetails);


    if (suggestedInvestigations.length > 0) {
      // addPageAndNumber(doc);
      labFindingsEndLevel = DOC_MARGIN;
    }



    // MEDICATIONS
    // addPageFooter(doc, providerPrescriptionDetails);




    if (suggestedInvestigations.length > 0) {
      doc
        .font(BOLD_FONT)
        .fontSize(BOLD_FONT_SIZE)
        .text("Next Consultation ", DOC_MARGIN, labFindingsEndLevel + 15);

      const rXLabelEndLevelY = doc.y;

      const serialNoXStart = DOC_MARGIN;
      // const drXStart = DOC_MARGIN + 35;
      // const medicineXStart = DOC_MARGIN + 40;
      const medicineXStart = DOC_MARGIN + 40;
      const dosageXStart = DOC_MARGIN + 220;
      const quantityXStart = DOC_MARGIN + 360;
      const frequencyXStart = DOC_MARGIN + 440;
      const timingFrequencyXStart = DOC_MARGIN + 410;

      // generateHr(doc, doc.y);
      // medicine table header
      doc
        .fillColor("#4a90e2")
        .fontSize(NORMAL_FONT_SIZE)
        .font(BOLD_FONT)
        .text("SNo", serialNoXStart, rXLabelEndLevelY + 10)
        // .text("Provider Name", drXStart, rXLabelEndLevelY + 10)
        .text("Description", medicineXStart, rXLabelEndLevelY + 10)
        .text("Appointment date", dosageXStart, rXLabelEndLevelY + 10)
        .text("Provider", quantityXStart, rXLabelEndLevelY + 10)
        .text("Purpose", frequencyXStart, rXLabelEndLevelY + 10);
      // .text("Time-Duration", timingFrequencyXStart, rXLabelEndLevelY + 10);
      //AKSHAY NEW CODE IMPLEMENTATIONS
      // .text(
      //   "Start Date / Duration",
      //   timingFrequencyXStart,
      //   rXLabelEndLevelY + 10
      // );

      // generateHr(doc, doc.y);

      const medicationTableHeaderEndYLevel = doc.y;
      medicationYLevel = doc.y + 10;
      let srNumber = 1;

      for (let each in suggestedInvestigations) {
        const {
          type,
          type_description,
          radiology_type,
          start_date,
          organizer,
        } = suggestedInvestigations[each] || {};

        // gaurav new changes - start
        if (doc.y + 3 * SHORT_FONT_SIZE > PAGE_END_LIMIT) {
          if (pageCount === 1) {
            addPageFooter(doc, providerPrescriptionDetails);
          }
          addPageAndNumber(doc);
          medicationYLevel = DOC_MARGIN;
        }

        if (APPOINTMENT_TYPE[type].title !== "Consultation") continue;

        // let today = new moment();
        // let start = moment(start_date);

        // if (start.isSameOrAfter(today)) {
          // gaurav new changes - start
          doc
            .fillColor("#212b36")
            .fontSize(SHORT_FONT_SIZE)
            .font(MEDIUM_FONT)
            .text(
              `test date`,
              dosageXStart,
              medicationYLevel
            )
            .text(`Self`, quantityXStart, medicationYLevel)
            .text(`Test purpose`, frequencyXStart, medicationYLevel, {
              width: timingFrequencyXStart - frequencyXStart - 25,
            });

          doc
            .fillColor("#212b36")
            .fontSize(SHORT_FONT_SIZE)
            .font(MEDIUM_FONT)
            .text(`${srNumber}.`, serialNoXStart, medicationYLevel)
            // gaurav new changes - end

            // .text(`${organizer.name}`, drXStart, medicationYLevel, {
            //   width: medicineXStart - drXStart,
            // })
            .text(
              `${type_description}${radiology_type ? `-${radiology_type}` : ""
              }(${APPOINTMENT_TYPE[type].title})`,
              medicineXStart,
              medicationYLevel,
              {
                width: dosageXStart - medicineXStart,
              }
            )
            // AKSHAY NEW CODE IMPLEMENTATIONS
            .text(`Prescribed by Dr.${organizer.name}`, medicineXStart, doc.y, {
              width: dosageXStart - medicineXStart,
            })
            .text(`Note:-`, medicineXStart, doc.y, {
              width: dosageXStart - medicineXStart - 20,
            });
        // }

        const medicationYLevelEnd = doc.y;

        const horizontalLineY =
          medicationYLevelEnd > doc.y ? medicationYLevelEnd : doc.y;
        generateHr(doc, horizontalLineY + 5);

        medicationYLevel = medicationYLevelEnd + NORMAL_FONT_SIZE + 12;

        if (doc.y > PAGE_END_LIMIT) {
          if (pageCount === 1) {
            addPageFooter(doc, providerPrescriptionDetails);
          }
        }
        srNumber++;
      }
    }

    // if (!medicationsList.length > 0) {
    //   medicationYLevel = generalExaminationEndLevel + NORMAL_FONT_SIZE + 12;
    // }
  } catch (ex) {
    console.log(ex);
  }
}

function printDoctorBlockData(
  doc,
  doctors,
  users,
  degrees,
  registrations,
  providers,
  doctor_id,
  providerIcon,
  providerPrescriptionDetails
) {
  const {
    name: doctorName = "",
    city = "",
    degree = "",
    registrationNumber = "",
    email: doctorEmail = "",
    mobile_number: doctorMobileNumber = "",
    prefix = "",
    providerLogo = "",
    providerName = "",
    providerAddress = "",
  } = formatDoctorsData(
    doctors,
    users,
    degrees,
    registrations,
    providers,
    doctor_id
  );

  let doctorBlockStartX = doc.x;

  let doctorBlockStartY = doc.y;

  if (providerIcon) {
    doc.image(`${providerIcon}`, DOC_MARGIN, doctorBlockStartY, {
      width: 80,
      height: 80,
    });

    doctorBlockStartX = doc.x + 100;

    doc
      .fontSize(BOLD_FONT_SIZE)
      .font(MEDIUM_FONT)
      .text(`${providerName}`, doctorBlockStartX, doctorBlockStartY);

    doc
      .fontSize(NORMAL_FONT_SIZE)
      .font(MEDIUM_FONT)
      .text(`${providerAddress}`, doctorBlockStartX, doc.y);
  }

  doc
    .fillColor("#3f76cd")
    .fontSize(BOLD_FONT_SIZE)
    .font(BOLD_FONT)
    .text(`Dr. ${doctorName}`, doctorBlockStartX, doc.y);

  const doctorNameEndsY = doc.y;
  const fullDegree = degree ? `${degree}` : degree;

  doc
    .fontSize(NORMAL_FONT_SIZE)
    .fillColor("#212b36")
    .font(MEDIUM_FONT)
    .text(`${fullDegree}`, doc.x, doctorNameEndsY)
    .font(REGULAR_FONT)
    .text(`Registration Number: ${registrationNumber}`, doc.x, doc.y)
    .text(`Email: ${doctorEmail}`, doc.x, doc.y)
    .text(`Phone: +${prefix}-${doctorMobileNumber}`, doc.x, doc.y)
    .text(`Address: ${city}`, doc.x, doc.y);

  let doctorDetailsEnd = doc.y;

  if (providerPrescriptionDetails) {
    let fontSize =
      NORMAL_FONT_SIZE -
      2 * Math.ceil(providerPrescriptionDetails.length / 150);

    doc
      .font(REGULAR_FONT)
      .fontSize(fontSize)
      .text(`${providerPrescriptionDetails}`, DOC_MARGIN + 30, doc.y + 5, {
        width: 500 - 30,
        height: 30,
      });

    doctorDetailsEnd = doc.y;
  }

  // generateHr(doc, doc.y + 10);

  // if (providerIcon) {
  doc.image(`${__dirname}/qr-code.png`, 480, doctorBlockStartY, {
    width: 80,
    height: 80,
  });
  // }

  return doctorDetailsEnd;
}

function printPatientBlockData(
  doc,
  patients,
  users,
  creationDate,
  doctorBlockEndRowLevel
) {
  // const creationDateObj = new moment(creationDate);

  const creationDateObj =
    (creationDate && new moment(creationDate)).add(330, "minutes") ||
    new moment();
  const month = creationDateObj.get("month") + 1;
  const date = creationDateObj.get("date");
  const year = creationDateObj.get("year");

  const {
    name: patientName = "",
    address = "",
    age = "",
    gender = "",
    height = null,
    weight = null,
    mobile_number = "",
    prefix = "",
    uid = "",
  } = formatPatientData(patients, users);

  doc
    .fontSize(NORMAL_FONT_SIZE)
    .font(BOLD_FONT)
    .text("Name: ", DOC_MARGIN, doctorBlockEndRowLevel + 20, {
      continued: true,
    })
    .font(REGULAR_FONT)
    .text(`${patientName}`, DOC_MARGIN + 10, doctorBlockEndRowLevel + 20),
    {
      continued: true,
    };

  doc
    .fontSize(NORMAL_FONT_SIZE)
    .font(BOLD_FONT)
    .text("Date: ", DOC_MARGIN + 400, doctorBlockEndRowLevel + 20, {
      continued: true,
    })
    .font(REGULAR_FONT)
    .text(
      `${date}/${month}/${year}`,
      DOC_MARGIN + 410,
      doctorBlockEndRowLevel + 20
    );

  // doc
  //   .text(
  //     "\n Name of Patient",
  //     DOC_MARGIN,
  //     dateOfConsultationEnds - NORMAL_FONT_SIZE
  //   )
  //   .text(`${patientName}`, 190, doc.y - NORMAL_FONT_SIZE - 1, {
  //     width: MAX_WIDTH,
  //   });

  const patientNameEnds = doc.y;

  // doc
  //   .text("Age", 390, dateOfConsultationEnds + 4)
  //   .text(`${age}`, doc.x + 35, dateOfConsultationEnds + 4)
  //   .text("Gender", doc.x + 55, dateOfConsultationEnds + 4)
  //   .text(`${gender ? gender : ""}`, doc.x + 60, dateOfConsultationEnds + 4);

  doc
    .fontSize(NORMAL_FONT_SIZE)
    .font(BOLD_FONT)
    .text("Mobile Number :", DOC_MARGIN, patientNameEnds + 10, {
      continued: true,
    })
    .font(REGULAR_FONT)
    .text(`+${prefix}-${mobile_number}`, DOC_MARGIN + 10, patientNameEnds + 10);

  const mobileNumberEnds = doc.y;

  doc
    .fontSize(NORMAL_FONT_SIZE)
    .font(BOLD_FONT)
    .text("Patient ID: ", DOC_MARGIN, mobileNumberEnds + 10, {
      continued: true,
    })
    .font(REGULAR_FONT)
    .text(uid, DOC_MARGIN + 10, mobileNumberEnds + 10);

  const patientIdEnds = doc.y;

  doc
    .fontSize(NORMAL_FONT_SIZE)
    .font(BOLD_FONT)
    .text("Address :", DOC_MARGIN, patientIdEnds + 10, { continued: true })
    .font(REGULAR_FONT)
    .text(`${address ? address : "--"}`, DOC_MARGIN + 10, patientIdEnds + 10);

  // doc
  //   .fillColor("black")
  //   .fontSize(NORMAL_FONT_SIZE)
  //   .text("\n Mobile Number", DOC_MARGIN, patientNameEnds - NORMAL_FONT_SIZE)
  //   .text(`${prefix}-${mobile_number}`, 190, patientNameEnds)
  //   .text("\n Address", DOC_MARGIN, doc.y)
  //   .text(`${address ? address : ""}`, 190, doc.y - NORMAL_FONT_SIZE, {
  //     width: MAX_WIDTH,
  //   });

  const addressEndRowLevel = doc.y;

  // doc
  //   .text("Height", 390, patientNameEnds)
  //   .text(`${height === null ? "--" : height} cm`, 440, patientNameEnds)
  //   .text("Weight", 390, patientNameEnds + DISTANCE_BETWEEN_ROWS)
  //   .text(
  //     `${weight === null ? "--" : weight} kg`,
  //     440,
  //     patientNameEnds + DISTANCE_BETWEEN_ROWS
  //   );

  doc
    .fontSize(NORMAL_FONT_SIZE)
    .font(BOLD_FONT)
    .text("Age: ", DOC_MARGIN, addressEndRowLevel + 10, { continued: true })
    .font(REGULAR_FONT)
    .text(`${age}`, DOC_MARGIN + 10, addressEndRowLevel + 10, {
      continued: true,
    })
    .font(BOLD_FONT)
    .text("Gender: ", DOC_MARGIN + 40, addressEndRowLevel + 10, {
      continued: true,
    })
    .font(REGULAR_FONT)
    .text(`${gender ? gender : ""}`, DOC_MARGIN + 50, addressEndRowLevel + 10, {
      continued: true,
    })
    .font(BOLD_FONT)
    .text("Height: ", DOC_MARGIN + 70, addressEndRowLevel + 10, {
      continued: true,
    })
    .font(REGULAR_FONT)
    .text(
      `${height ? height : "--"} cm`,
      DOC_MARGIN + 80,
      addressEndRowLevel + 10,
      { continued: true }
    )
    .font(BOLD_FONT)
    .text("Weight: ", DOC_MARGIN + 100, addressEndRowLevel + 10, {
      continued: true,
    })
    .font(REGULAR_FONT)
    .text(
      `${weight ? weight : "--"} kg`,
      DOC_MARGIN + 110,
      addressEndRowLevel + 10
    );

  return doc.y + 10;
}

function isMedicationsUpdatedInExistingMedicin(medications) {
  const medicationIds = Object.keys(medications);
  let date = null;
  let isMedicinsUpdate = false;
  for (const medicationId of medicationIds) {
    const {
      [medicationId]: {
        basic_info: { updated_at, created_at } = {},
        details: mobileDetails = null,
      },
    } = medications;
    let updated_date = `${moment(new Date(updated_at)).format("DD MM YY")}`;
    let created_date = `${moment(new Date(created_at)).format("DD MM YY")}`;

    if (created_date !== updated_date) {
      // all medicin written in same days an there is no update on medicins
      isMedicinsUpdate = true;
    }
    return isMedicinsUpdate;
  }
  return date;
}

// AKSHAY NEW CODE IMPLEMETATIONS

function renderChiefComplaints({ symptoms }) {
  try {
    let finalSymptom = "";

    if (
      symptoms === undefined ||
      symptoms === null ||
      (typeof symptoms === "object" && Object.keys(symptoms).length === 0) ||
      (typeof symptoms === "string" && symptoms.trim().length === 0)
    ) {
      finalSymptom = "";
    } else {
      finalSymptom = symptoms;
    }

    return finalSymptom;
  } catch (err) {
    console.log("error in chief complience", err);
  }
}

function printCarePlanData({
  doc,
  horizontalLineLevel,
  care_plans,
  conditions,
  medications,
  medicines,
  allergies,
  comorbidities,
  suggestedInvestigations,
  providerPrescriptionDetails,
  follow_up_advise,
}) {
  try {
    const { diagnosis, condition, symptoms, clinicalNotes } =
      formatCarePlanData(care_plans, conditions);
    const medicationsList = formatMedicationsData(medications, medicines);

    // AKSHAY NEW CODE IMPLEMENTATIONS

    let stringSymptomArray = [];
    let stringSymptom = "";

    if (symptoms) {
      try {
        let object = JSON.parse(symptoms);
        object.forEach((element) => {
          let symName = element.symptomName;
          let bodyPart =
            element.bodyParts.length > 0
              ? `(${String(element.bodyParts)})`
              : "";
          let duration = element.duration;
          stringSymptomArray.push(`${symName} ${bodyPart} for ${duration}`);
        });
      } catch (e) {
        stringSymptom = symptoms;
      }
    }

    doc
      .fillColor("#4a90e2")
      .font(BOLD_FONT)
      .text("RELEVANT HISTORY", DOC_MARGIN, horizontalLineLevel);

    doc
      .fillColor("#212b36")
      .font(BOLD_FONT)
      .text("Allergies: ", doc.x, doc.y + 10, { continued: true })
      .font(REGULAR_FONT)
      .text(`${allergies ? allergies : "--"}`, doc.x + 10, doc.y)
      .font(BOLD_FONT)
      .text("Comorbidities: ", doc.x, doc.y + 10, { continued: true })
      .font(REGULAR_FONT)
      .text(`${comorbidities ? comorbidities : "--"}`, doc.x + 10, doc.y);

    const relevantHistoryEndLevel = doc.y + 10;

    generateHr(doc, relevantHistoryEndLevel);

    doc
      .fillColor("#212b36")
      .font(BOLD_FONT)
      .text("Chief Complaints: ", DOC_MARGIN, relevantHistoryEndLevel + 10, {
        // continued: true,
      });
    doc.moveDown();
    if (stringSymptomArray.length < 1) {
      doc
        .font(REGULAR_FONT)
        .text(
          `${renderChiefComplaints({ symptoms: stringSymptom })}`,
          DOC_MARGIN + 10,
          doc.y
        );
    } else {
      for (let i = 0; i < stringSymptomArray.length; i++) {
        doc
          .font(REGULAR_FONT)
          .text(
            `${stringSymptomArray[i]}`,
            // `${symptoms}`,
            DOC_MARGIN + 10,
            // relevantHistoryEndLevel + 10
            doc.y - 10
          )
          .moveDown();
      }
    }

    const chiefComplaintsEndLevel = doc.y + 20;

    doc
      .font(BOLD_FONT)
      .fontSize(NORMAL_FONT_SIZE)
      .text(
        "General | Systemic  Examination: ",
        DOC_MARGIN,
        chiefComplaintsEndLevel,
        {
          continued: true,
        }
      )
      .font(HINDI_FONT)
      .text(`${clinicalNotes}`, doc.x + 10, chiefComplaintsEndLevel);

    const generalExaminationEndLevel = doc.y + 20;

    doc
      .font(BOLD_FONT)
      .fontSize(NORMAL_FONT_SIZE)
      .text("Diagnosis :", DOC_MARGIN, generalExaminationEndLevel, {
        continued: true,
      })
      .font(REGULAR_FONT)
      .text(`${diagnosis}`, doc.x + 10, generalExaminationEndLevel);

    // doc
    //   .text(
    //     "DIAGNOSIS",
    //     DOC_MARGIN,
    //     relevantPointsEndLevel + DISTANCE_BETWEEN_ROWS
    //   )
    //   .text(
    //     `${diagnosis}`,
    //     doc.x + 250,
    //     relevantPointsEndLevel + DISTANCE_BETWEEN_ROWS
    //   );

    const labFindingsEndLevel = doc.y;
    let medicationYLevel = doc.y;

    // MEDICATIONS
    addPageFooter(doc, providerPrescriptionDetails);

    if (medicationsList.length > 0) {
      doc
        .font(BOLD_FONT)
        .fontSize(BOLD_FONT_SIZE)
        .text("Rx", DOC_MARGIN, labFindingsEndLevel + 15);

      const rXLabelEndLevelY = doc.y;

      const serialNoXStart = DOC_MARGIN;
      // const drXStart = DOC_MARGIN + 35;
      // const medicineXStart = DOC_MARGIN + 40;
      const medicineXStart = DOC_MARGIN + 40;
      const dosageXStart = DOC_MARGIN + 220;
      const quantityXStart = DOC_MARGIN + 280;
      const frequencyXStart = DOC_MARGIN + 320;
      const timingFrequencyXStart = DOC_MARGIN + 410;

      // generateHr(doc, doc.y);
      // medicine table header
      doc
        .fillColor("#4a90e2")
        .fontSize(NORMAL_FONT_SIZE)
        .font(BOLD_FONT)
        .text("SNo", serialNoXStart, rXLabelEndLevelY + 10)
        // .text("Provider Name", drXStart, rXLabelEndLevelY + 10)
        .text("Medicines", medicineXStart, rXLabelEndLevelY + 10)
        .text("Dosage", dosageXStart, rXLabelEndLevelY + 10)
        .text("Qty", quantityXStart, rXLabelEndLevelY + 10)
        .text("Days", frequencyXStart, rXLabelEndLevelY + 10)
        // .text("Time-Duration", timingFrequencyXStart, rXLabelEndLevelY + 10);
        //AKSHAY NEW CODE IMPLEMENTATIONS
        .text(
          "Start Date / Duration",
          timingFrequencyXStart,
          rXLabelEndLevelY + 10
        );

      // generateHr(doc, doc.y);

      const medicationTableHeaderEndYLevel = doc.y;
      medicationYLevel = doc.y + 10;
      let srNumber = 1;

      // Gaurav New Chnages - start
      let { date: latestUpdateDate, isPrescriptionUpdated } =
        getLatestUpdateDate(medications);
      let isMedicationsUpdate =
        isMedicationsUpdatedInExistingMedicin(medications);
      let wantToShow = true;
      if (isPrescriptionUpdated || isMedicationsUpdate) wantToShow = false;
      // Gaurav New Chnages - end

      for (const [index, medicationData] of medicationsList.entries()) {
        const {
          description,
          medicineName,
          medicineType,
          genericName,
          organizer,
          strength,
          frequency,
          startDate,
          quantity,
          endDate,
          duration,
          dosage,
          timings,
          repeat_days,
          unit,
        } = medicationData;
        // TODO: need to add type here.
        let today = new Date();
        let endDateobj = new Date(endDate);

        let medi_type = categories.items.find((x) => x.id == medicineType).name;
        const medicineData = `(${medi_type}) ${medicineName} `;

        let medicationStatus = endDateobj > today; // 30>29

        if (!wantToShow && !medicationStatus) continue;

        // gaurav new changes - start
        if (doc.y + 3 * SHORT_FONT_SIZE > PAGE_END_LIMIT) {
          if (pageCount === 1) {
            addPageFooter(doc, providerPrescriptionDetails);
          }
          addPageAndNumber(doc);
          medicationYLevel = DOC_MARGIN;
        }
        // gaurav new changes - start
        doc
          .fillColor("#212b36")
          .fontSize(SHORT_FONT_SIZE)
          .font(MEDIUM_FONT)
          .text(
            `${unit === "3" ? "One" : strength}`,
            dosageXStart,
            medicationYLevel
          )
          .text(
            `${quantity ? quantity : "-"}`,
            quantityXStart,
            medicationYLevel
          )
          .text(`${String(repeat_days)} `, frequencyXStart, medicationYLevel, {
            width: timingFrequencyXStart - frequencyXStart - 25,
          });

        doc
          .text(`${dosage}`, timingFrequencyXStart, medicationYLevel)
          .text(`${timings}`, timingFrequencyXStart, doc.y)
          // .text(
          //   `${frequency}`,
          //   timingFrequencyXStart,
          //   doc.y
          // )
          .text(
            `${moment(startDate).format("DD MMM 'YY")} /${duration} day(s)`,
            timingFrequencyXStart,
            doc.y
          );
        doc
          .fillColor("#212b36")
          .fontSize(SHORT_FONT_SIZE)
          .font(MEDIUM_FONT)
          .text(`${srNumber}.`, serialNoXStart, medicationYLevel)
          // gaurav new changes - end

          // .text(`${organizer.name}`, drXStart, medicationYLevel, {
          //   width: medicineXStart - drXStart,
          // })
          .text(`${medicineData}`, medicineXStart, medicationYLevel, {
            width: dosageXStart - medicineXStart,
          })
          .text(`${genericName}`, medicineXStart, doc.y, {
            width: dosageXStart - medicineXStart,
            // strike:true
          })
          // .underline(medicineXStart, doc.y,  dosageXStart - medicineXStart)
          // .underline(medicineXStart, medicationYLevel, dosageXStart - medicineXStart, undefined, { color: 'blue' })
          // .link(medicineXStart, medicationYLevel, dosageXStart - medicineXStart, undefined, `${genericName}`)
          // AKSHAY NEW CODE IMPLEMENTATIONS
          .text(`Prescribed by Dr. ${organizer.name}`, medicineXStart, doc.y, {
            width: dosageXStart - medicineXStart,
          })
          .text(
            `Note: ${description ? description : "-"}`,
            medicineXStart,
            doc.y,
            {
              width: dosageXStart - medicineXStart - 20,
            }
          );

        const medicationYLevelEnd = doc.y;

        // doc
        //   .fillColor("#212b36")
        //   .fontSize(SHORT_FONT_SIZE)
        //   .font(MEDIUM_FONT)
        //   .text(
        //     `${strength == "1 MG" || strength == "1 ML" ? "One" : strength}`,
        //     dosageXStart,
        //     medicationYLevel
        //   )
        //   .text(
        //     `${quantity ? quantity : "-"}`,
        //     quantityXStart,
        //     medicationYLevel
        //   )
        //   .text(`${String(repeat_days)} `, frequencyXStart, medicationYLevel, {
        //     width: timingFrequencyXStart - frequencyXStart - 25,
        //   });

        // doc
        //   .text(`${dosage}`, timingFrequencyXStart, medicationYLevel)
        //   .text(`${timings}`, timingFrequencyXStart, doc.y)
        //   // .text(
        //   //   `${frequency}`,
        //   //   timingFrequencyXStart,
        //   //   doc.y
        //   // )
        //   .text(
        //     `${moment(startDate).format("DD MMM 'YY")} /${duration} day(s)`,
        //     timingFrequencyXStart,
        //     doc.y
        //   );

        const horizontalLineY =
          medicationYLevelEnd > doc.y ? medicationYLevelEnd : doc.y;
        generateHr(doc, horizontalLineY + 5);

        medicationYLevel = medicationYLevelEnd + NORMAL_FONT_SIZE + 12;

        if (doc.y > PAGE_END_LIMIT) {
          if (pageCount === 1) {
            addPageFooter(doc, providerPrescriptionDetails);
          }
        }
        srNumber++;
      }
    }

    if (!medicationsList.length > 0) {
      medicationYLevel = generalExaminationEndLevel + NORMAL_FONT_SIZE + 12;
    }

    let docYLevel = medicationYLevel + 10;

    // doc
    //   .font(BOLD_FONT)
    //   .fontSize(NORMAL_FONT_SIZE)
    //   .text("Suggested Investigation :", DOC_MARGIN, docYLevel);

    // for (let index = 0; index < suggestedInvestigations.length; index++) {
    //   const { type, type_description, radiology_type, start_date, organizer } =
    //     suggestedInvestigations[index] || {};
    //   // GAURAV NEW CHNAGES
    //   if (APPOINTMENT_TYPE[type].title === "Consultation") continue;
    //   // IF STARTDATE LESSTHAN TODAY THEN WE WILL NOT PRINT THIS
    //   // let today = moment().add(25, "days");
    //   let today = new moment();
    //   let start = moment(start_date);
    //   if (start.isSameOrAfter(today)) {
    //     doc
    //       .font(REGULAR_FONT)
    //       .text(
    //         `${type_description}${radiology_type ? `-${radiology_type}` : ""}(${
    //           APPOINTMENT_TYPE[type].title
    //         }) on ${moment(start_date).format("DD/MM/YYYY")} by Dr. ${
    //           organizer.name
    //         }`,
    //         DOC_MARGIN,
    //         doc.y + 5
    //       );
    //   }

    //   if (doc.y > PAGE_END_LIMIT) {
    //     if (pageCount === 1) {
    //       addPageFooter(doc, providerPrescriptionDetails);
    //     }
    //     addPageAndNumber(doc);
    //   }
    // }

    if (Object.keys(suggestedInvestigations).length) {
      const appointmentLevelEnd = printAppointment({
        doc,
        providerPrescriptionDetails,
        suggestedInvestigations,
        docYLevel,
      });
    }

    // if (Object.keys(suggestedInvestigations).length) {
    //   const consultationLevelEnd = printConsultation({
    //     doc,
    //     providerPrescriptionDetails,
    //     suggestedInvestigations,
    //   });
    // }


    doc
      .font(BOLD_FONT)
      .fontSize(NORMAL_FONT_SIZE)
      .text("Advice/Instructions: ", DOC_MARGIN, doc.y + 20);

    doc.font(HINDI_FONT).text(follow_up_advise, DOC_MARGIN, doc.y + 5);

    if (Object.keys(suggestedInvestigations).length) {
      const consultationLevelEnd = printConsultation({
        doc,
        providerPrescriptionDetails,
        suggestedInvestigations,
      });
    }

    if (doc.y > PAGE_END_LIMIT) {
      if (pageCount === 1) {
        addPageFooter(doc, providerPrescriptionDetails);
      }
      addPageAndNumber(doc);
    }

    const suggestedInvestigationXLevelEnd = doc.x;
    return suggestedInvestigationXLevelEnd;
  } catch (ex) {
    console.log(ex);
  }
}

function printConsultationAppointment({
  doc,
  suggestedInvestigations,
  providerPrescriptionDetails,
}) {
  try {
    let docYLevel =
      // workoutBlockLevelEnd
      // ? workoutBlockLevelEnd
      // : dietBlockLevelEnd ? dietBlockLevelEnd
      // :
      doc.y + 20;

    doc
      .font(BOLD_FONT)
      .fontSize(NORMAL_FONT_SIZE)
      .text("Next Consultation:", DOC_MARGIN, docYLevel + 10);

    for (let index = 0; index < suggestedInvestigations.length; index++) {
      const { type, type_description, radiology_type, start_date, organizer } =
        suggestedInvestigations[index] || {};

      // GAURAV NEW CHNAGES
      if (APPOINTMENT_TYPE[type].title !== "Consultation") continue;
      let today = new moment();
      let start = moment(start_date);
      if (start.isSameOrAfter(today)) {
        doc
          .font(REGULAR_FONT)
          .text(
            `${type_description}${radiology_type ? `-${radiology_type}` : ""}(${
              APPOINTMENT_TYPE[type].title
            }) on ${moment(start_date).format("DD/MM/YYYY")} by Dr. ${
              organizer.name
            }`,
            DOC_MARGIN,
            doc.y + 5
          );
      }

      if (doc.y > PAGE_END_LIMIT) {
        if (pageCount === 1) {
          addPageFooter(doc, providerPrescriptionDetails);
        }
        addPageAndNumber(doc);
      }
    }

    const suggestedInvestigationXLevelEnd = doc.x;
    return suggestedInvestigationXLevelEnd;
  } catch (ex) {
    console.log(ex);
  }
}

function addPageAndNumber(doc) {
  //  const {page : { height = 0  }  = {}} = doc;

  //  doc
  //  .font(MEDIUM_FONT)
  //  .text(`${pageCount}`, DOC_MARGIN, height-45)

  //  printProviderPrescriptionDetails(doc);

  doc.addPage();
  // pageCount+=1;
}

function addPageFooter(doc, providerPrescriptionDetails = "") {
  let initialDocY = doc.y;

  doc
    .font(REGULAR_FONT)
    .fontSize(SHORT_FONT_SIZE)
    .text(`Page ${pageCount}`, DOC_WIDTH_MARGIN - 20, PAGE_END_LIMIT + 35);
  // pageCount+=1;
  printProviderPrescriptionDetails(doc, providerPrescriptionDetails);

  doc.y = initialDocY;
  pageCount += 1;
}

function printProviderPrescriptionDetails(doc, providerPrescriptionDetails) {
  // let textFontSize = NORMAL_FONT_SIZE;
  // const providerDetailsStart = DOC_MARGIN;
  // const providerDetailsEnd =DOC_MARGIN+500;
  // const providerDetailsHeight = 30;

  // const {page : { height = 0 , width = 0 }  = {}} = doc;

  // let prescription = "";
  // if(providerPrescriptionDetails.length) {
  //   prescription = providerPrescriptionDetails;
  // }

  let fontSize =
    SHORT_FONT_SIZE - 2 * Math.ceil(providerPrescriptionDetails.length / 150);

  doc
    .font(REGULAR_FONT)
    .fontSize(fontSize)
    .text(`${providerPrescriptionDetails}`, DOC_MARGIN, PAGE_END_LIMIT + 35, {
      width: 500 - DOC_MARGIN,
      height: 30,
    });

  //   let strHeight=doc.heightOfString(providerPrescriptionDetails, {lineGap: 0, width: providerDetailsEnd-providerDetailsStart});

  //   if(providerPrescriptionDetails){

  //    while(strHeight>providerDetailsHeight && textFontSize > 1){
  //      textFontSize = textFontSize-1;
  //      doc
  //      .fontSize(fontSize);
  //      strHeight=doc.heightOfString(providerPrescriptionDetails, {lineGap: 0, width: providerDetailsEnd-providerDetailsStart});

  //    }

  //    doc
  //    .fontSize(textFontSize)
  //    .fillColor("#212b36")
  //    .text(`${providerPrescriptionDetails}`, providerDetailsStart,PAGE_END_LIMIT + 30,{
  //      width:providerDetailsEnd-providerDetailsStart,
  //      height:providerDetailsHeight
  //    })
  //  }
}

function printFooter(
  doc,
  imageUrl,
  nextAppointmentDuration,
  currentTime,
  providerPrescriptionDetails,
  // AKSHAY NEW CODE IMPLEMENTATIONS
  suggestedInvestigations
) {
  // checkAndAddNewPage(doc);

  if (doc.y > PAGE_END_LIMIT) {
    if (pageCount === 1) {
      addPageFooter(doc, providerPrescriptionDetails);
    }
    addPageAndNumber(doc);
    // medicationYLevel = DOC_MARGIN;
  }

  const footerStartLevel = doc.y + 10;
  // doc
  //   .font(BOLD_FONT)
  //   .fontSize(NORMAL_FONT_SIZE)
  //   .text("Review After: ", DOC_MARGIN, footerStartLevel, { continued: true })
  //   .font(REGULAR_FONT)
  //   .text(
  //     `${
  //       nextAppointmentDuration ? nextAppointmentDuration : DEFAULT_REVIEW_AFTER
  //     }`,
  //     DOC_MARGIN + 10
  //     // footerStartLevel
  //   );

  // AKSHAY NEW CODE IMPLEMENTATIONS

  // const consultationAppointment = printConsultationAppointment({
  //   doc,
  //   suggestedInvestigations,
  //   providerPrescriptionDetails,
  // });

  const signaturePictureHeight = 40;

  if (doc.y > PAGE_END_LIMIT - signaturePictureHeight) {
    if (pageCount === 1) {
      addPageFooter(doc, providerPrescriptionDetails);
    }
    addPageAndNumber(doc);
  }

  try {
    doc.image(`${imageUrl}`, 400, doc.y + 10, {
      width: 120,
      height: signaturePictureHeight,
    });
  } catch (err) {
    console.log("ERROR in signature pic", err);
  }

  if (doc.y + 3 * SMALLEST_FONT_SIZE > PAGE_END_LIMIT) {
    if (pageCount === 1) {
      addPageFooter(doc);
    }
    addPageAndNumber(doc);
  }

  doc
    .fontSize(SMALLEST_FONT_SIZE - 2)
    .text(`${currentTime}`, 400, doc.y + 60)
    .fontSize(SMALLEST_FONT_SIZE)
    .text("RMPs Signature & Stamp", 400, doc.y + 5);

  // generateHr(doc, doc.y + NORMAL_FONT_SIZE);

  return doc.y + 10;
}

function formatCarePlanData(carePlans, conditions) {
  let condition = "",
    diagnosis = "",
    symptoms = "",
    clinicalNotes = "",
    carePlanId = null;
  const conditionIds = Object.keys(conditions);
  if (conditionIds && conditionIds.length) {
    const conditionId = conditionIds[0];
    const { [conditionId]: { basic_info: { name = "" } = {} } = {} } =
      conditions;
    condition = name;
  }

  const carePlanIds = Object.keys(carePlans);
  if (carePlanIds && carePlanIds.length) {
    carePlanId = carePlanIds[0];
    const {
      [carePlanId]: {
        details: {
          symptoms: symptom = "",
          diagnosis: { description = "" } = {},
          clinical_notes = "",
        } = {},
      },
    } = carePlans;

    diagnosis = description;
    symptoms = symptom ? symptom : "";
    clinicalNotes = clinical_notes;
  }

  return { condition, diagnosis, symptoms, clinicalNotes, carePlanId };
}

function formatDoctorsData(
  doctors,
  users,
  degrees,
  registrations,
  providers = {},
  doctor_id
) {
  // const doctorsIds = Object.keys(doctors);
  let degree = "";
  let registrationNumber = "";

  const doctorId = doctor_id;

  const {
    [doctorId]: {
      basic_info: {
        user_id = null,
        first_name = "",
        middle_name = "",
        last_name = "",
        signature_image = "",
        profile_pic,
      } = {},
      city = "",
      provider_id,
    } = {},
  } = doctors;

  const {
    [user_id]: {
      basic_info: { mobile_number = "", email = "", prefix = "" } = {},
    } = {},
  } = users;

  let providerLogo = "";
  let providerName = "";
  let providerAddress = "";

  let mobileNumber = mobile_number;
  let prefixToShow = prefix;

  if (Object.keys(providers).length > 0) {
    const {
      basic_info: { user_id: providerUserId, name, address } = {},
      details: { icon: providerIcon } = {},
    } = providers || {};
    providerName = name;
    providerAddress = address;
    providerLogo = providerIcon;

    const { basic_info: { mobile_number, prefix } = {} } =
      users[providerUserId] || {};
    mobileNumber = mobile_number;
    prefixToShow = prefix;
  }

  let name = first_name;
  name = middle_name ? `${name} ${middle_name}` : name;
  name = last_name ? `${name} ${last_name}` : name;

  const degreeIds = Object.keys(degrees);
  for (const id of degreeIds) {
    const { [id]: { basic_info: { name: degreeName = "" } = {} } = {} } =
      degrees;
    degree = degreeName ? degree + `${degreeName}, ` : degree;
  }

  const registrationIds = Object.keys(registrations);
  for (const regId of registrationIds) {
    const {
      [regId]: {
        number = "",
        council: { basic_info: { name: council_name = "" } = {} } = {},
      } = {},
    } = registrations;
    registrationNumber = registrationNumber + `${number}, `;
  }

  if (degree) {
    degree = degree.substring(0, degree.length - 2);
  }

  if (registrationNumber) {
    registrationNumber = registrationNumber.substring(
      0,
      registrationNumber.length - 2
    );
  }

  return {
    name,
    email,
    mobile_number: mobileNumber,
    city,
    degree,
    registrationNumber,
    signature_image,
    prefix: prefixToShow,
    providerLogo,
    providerName,
    providerAddress,
  };
}

function formatPatientData(patients, users) {
  const patientIds = Object.keys(patients);

  const patientId = patientIds[0];

  const {
    [patientId]: {
      basic_info: {
        gender = "",
        age = "",
        first_name = "",
        middle_name = "",
        last_name = "",
        address = "",
        height = "",
        weight = "",
        user_id = null,
        full_name = "",
        uid = "",
      } = {},
      details: { allergies = "", comorbidities = "" } = {},
    } = {},
  } = patients;

  let name = first_name;
  name = middle_name ? `${name} ${middle_name}` : name;
  name = last_name ? `${name} ${last_name}` : name;

  const {
    [user_id]: { basic_info: { mobile_number = "", prefix = "" } = {} } = {},
  } = users;

  return {
    name,
    age,
    gender,
    address,
    height,
    weight,
    allergies,
    comorbidities,
    mobile_number,
    prefix,
    uid,
  };
}

function getLatestUpdateDate(medications) {
  const medicationIds = Object.keys(medications);
  let date = null;
  let isPrescriptionUpdated = false;
  for (const medicationId of medicationIds) {
    const {
      [medicationId]: {
        basic_info: { updated_at } = {},
        details: mobileDetails = null,
      },
    } = medications;
    let newdate = new Date(updated_at);

    if (date == null) {
      date = newdate;
    } else if (newdate > date) {
      date = newdate;
      isPrescriptionUpdated = true;
    }
  }
  return { date, isPrescriptionUpdated };
}

function formatMedicationsData(medications, medicines) {
  // have to send the list of objects containing instruction medicine name, medicine type, strength, frequency, duration,
  let medicationsList = [];

  const medicationIds = Object.keys(medications);
  let date = null;
  for (const medicationId of medicationIds) {
    let medicationDataObj = {};
    const {
      [medicationId]: {
        basic_info: {
          start_date = "",
          end_date = "",
          description = "",
          details = null,
          updated_at,
        } = {},
        details: mobileDetails = null,
        organizer,
      },
    } = medications;
    let repeat_days = medications[medicationId].basic_info.details.repeat_days;
    let mainDetails = {};

    if (mobileDetails) {
      mainDetails = { ...mobileDetails };
    } else {
      mainDetails = { ...details };
    }

    const {
      medicine_id = null,
      when_to_take = [],
      medicine_type = "",
      strength = "",
      unit = "",
      quantity = null,
      description: detailDescription = ""
    } = mainDetails || {};

    const {
      [medicine_id]: {
        basic_info: { name = "", type = "" } = {},
        details: medicineExtraDetails = {},
      } = {},
    } = medicines || {};
    const { generic_name = "" } = medicineExtraDetails || {};

    const startDateObj = moment(start_date);

    // const duration = endDateObj.diff(startDateObj, "days");

    const startDate = `${startDateObj.format("LL")}`;
    let endDate = "";

    if (end_date) {
      const endDateObj = moment(end_date);
      // Gaurav New Changes - start
      endDate = end_date;
      // Gaurav New Changes - End
      // endDate = `${endDateObj.get("year")}/${endDateObj.get(
      //   "month"
      // )}/${endDateObj.get("date")}`;
    }

    const { [unit]: { text = "" } = {} } = DOSE_UNIT;
    const unitToShow = text ? text : unit;

    medicationDataObj = {
      description: description || detailDescription,
      medicineName: name ? name.toUpperCase() : name,
      genericName: generic_name,
      medicineType: medicine_type,
      // strength,
      strength: `${`${strength} ${unitToShow.toUpperCase()}`}`,
      quantity,
      organizer,
      frequency: getWhenToTakeText(when_to_take.length),
      startDate,
      endDate,
      timings: getWhenToTakeTimings(when_to_take),
      dosage: getWhenToTakeDosage(when_to_take),
      duration: end_date
        ? moment(end_date).diff(moment(start_date), "days") + 1
        : "Long term", // todo: change text here after discussion
      repeat_days,
      unit: unitToShow.toUpperCase(),
    };

    medicationsList.push(medicationDataObj);
  }

  return medicationsList;
}

const getWhenToTakeDosage = (when_to_take) => {
  switch (when_to_take.length) {
    case WHEN_TO_TAKE_ABBREVATIONS.OD:
      return "Once a day";
    case WHEN_TO_TAKE_ABBREVATIONS.BD:
      return "Twice a day";
    case WHEN_TO_TAKE_ABBREVATIONS.TDS:
      return "Thrice a day";
    case SOS_CASE:
      return "Whenever required";
    default:
      return null;
  }
};

const getWhenToTakeTimings = (when_to_take = []) => {
  return when_to_take.map((id) => MEDICATION_TIMING[id].text).join(", ");
};

const getWhenToTakeText = (number) => {
  switch (number) {
    case 1:
      return `Once a day`;
    case 2:
      return `Twice a day`;
    case 3:
      return `Thrice a day`;
    default:
      return "";
  }
};

function generateHr(doc, y) {
  doc
    .strokeColor("#e7e7e7")
    .lineWidth(0.5)
    .moveTo(DOC_MARGIN, y)
    .lineTo(600, y)
    .stroke();
}

function generateVr(doc, x, yStart, yEnd) {
  const { onePageHeight, totalPagesToDrawLine } = getPageDetails(doc);

  for (let pageNumber = 0; pageNumber < totalPagesToDrawLine; pageNumber++) {
    const pageLimit = (pageNumber + 1) * onePageHeight;

    doc.switchToPage(pageNumber);
    const startPoint = pageNumber === 0 ? yStart : 0;
    const endPoint =
      pageNumber === totalPagesToDrawLine - 1
        ? yEnd + NORMAL_FONT_SIZE
        : pageLimit;

    doc
      .strokeColor("black")
      .lineWidth(1)
      .moveTo(x, startPoint)
      .lineTo(x, endPoint)
      .stroke();
  }
}

function getPageDetails(doc) {
  const range = doc.bufferedPageRange();
  const totalPagesToDrawLine = range.start + range.count;
  const totalHeight = doc.page.height;

  const onePageHeight = DOC_HEIGHT;

  return { onePageHeight, totalPagesToDrawLine };
}

const reStyleText = (text) => {
  return `${text.charAt(0).toUpperCase()}${text
    .substring(1, text.length)
    .toLowerCase()}`;
};

const checkAndAddNewPage = (doc) => {
  if (doc.y > PAGE_END_LIMIT) {
    addPageAndNumber(doc);
  }
};
