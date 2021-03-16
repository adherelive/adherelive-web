import { PRESCRIPTION_PDF_FOLDER } from "../../../constant";
// import {MEDICINE_UNITS} from "../../../client/src/constant";
import moment from "moment";
import PDFDocument from "pdfkit";

// const PDFDocument = require("pdfkit");
const fs = require("fs");
// const moment = require("moment");

const DOC_MARGIN = 30;
const NORMAL_FONT_SIZE = 12;
const BOLD_FONT_SIZE = 16;
const MEDICINE_FONT_SIZE = 16;
const SHORT_FONT_SIZE = 10;
const SMALLEST_FONT_SIZE = 10;
const DOC_HEIGHT = 792;
const DOC_BLOCK_BG_COLOR = "#dfdfdf";
const MAX_WIDTH = 100;
const DISTANCE_BETWEEN_ROWS = 25;
const DEFAULT_REVIEW_AFTER = "2 weeks";

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
        creationDate = "",
        medications = {},
        medicines = {},
        nextAppointmentDuration = null,
        currentTime = ""
      } = pdfData;
      const doc = new PDFDocument({ margin: DOC_MARGIN, bufferPages: true });


      const { allergies, comorbidities } = formatPatientData(
        patients,
        users
      );

      const fileName = getPdfName(pdfData)

      const stream = doc.pipe(
        fs.createWriteStream(`${PRESCRIPTION_PDF_FOLDER}/${fileName}.pdf`)
      );

      stream.on("finish", () => {
        resolve(fileName);
      });

      printDoctorBlockData(doc, doctors, users, degrees, registrations);

      const addressEndRowLevel = printPatientBlockData(
        doc,
        patients,
        users,
        creationDate
      );

      const addressSideElementsEnd = doc.y;

      const horizontalLineLevel =
        addressEndRowLevel > addressSideElementsEnd
          ? addressEndRowLevel
          : addressSideElementsEnd;

      generateHr(doc, horizontalLineLevel + 17);

      const suggestedInvestigationXLevelEnd = printCarePlanData(
        doc,
        horizontalLineLevel,
        care_plans,
        conditions,
        medications,
        medicines,
        allergies,
        comorbidities
      );

      generateHr(doc, doc.y + 17);

      generateVr(
        doc,
        suggestedInvestigationXLevelEnd + 240,
        horizontalLineLevel + 17,
        doc.y
      );

      printFooter(doc, signatureImage, nextAppointmentDuration, currentTime);
      doc.end();
    } catch (err) {
      console.log("Error got in the generation of pdf is: ", err);
      resolve(null);
    }
  });
};

function getPdfName (pdfData) {
  const {
    doctors = {}, users ={}, degrees = {}, registrations ={}, 
    care_plans = {}, conditions = {}
  } = pdfData

  const {
    name: doctorName = "",
  } = formatDoctorsData(doctors, users, degrees, registrations);

  const { diagnosis, carePlanId } = formatCarePlanData(
    care_plans,
    conditions
  );

  const now = new Date();
  const fileName = `${carePlanId}-${diagnosis}-${doctorName}-${now.getTime()}`;
  return fileName
}

function printDoctorBlockData(doc, doctors, users, degrees, registrations) {
  const {
    name: doctorName = "",
    city = "",
    degree = "",
    registrationNumber = "",
    email: doctorEmail = "",
    mobile_number: doctorMobileNumber = "",
    prefix = ""
  } = formatDoctorsData(doctors, users, degrees, registrations);

  doc
    .fillColor("black")
    .fontSize(BOLD_FONT_SIZE)
    .text(`Dr. ${doctorName}`, DOC_MARGIN);
  // .text("\n");
  const fullDegree = degree ? `${degree}, MBBS` : "MBBS";
  doc
    .fontSize(NORMAL_FONT_SIZE)
    .text(`${fullDegree}`)
    .text(`${registrationNumber}`)
    .text(`${city}`)
    .text(`${doctorEmail}`)
    .text(`${prefix}-${doctorMobileNumber}`);

  doc
    .rect(0, 0, 700, doc.y)
    .fillOpacity(0.5)
    .fill(DOC_BLOCK_BG_COLOR);
}

function printPatientBlockData(doc, patients, users, creationDate) {
  const creationDateObj = new moment(creationDate);
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
    prefix = ""
  } = formatPatientData(patients, users);

  doc
    .fill("black")
    .fillOpacity(1)
    .fontSize(NORMAL_FONT_SIZE)
    .text("\n Date of Consultation")
    .text(`${year}/${month}/${date}`, 190, doc.y - NORMAL_FONT_SIZE);

  const dateOfConsultationEnds = doc.y + NORMAL_FONT_SIZE;

  doc
    .fillColor("black")
    .fontSize(NORMAL_FONT_SIZE)
    .text(
      "\n Name of Patient",
      DOC_MARGIN,
      dateOfConsultationEnds - NORMAL_FONT_SIZE
    )
    .text(`${patientName}`, 190, doc.y - NORMAL_FONT_SIZE - 1, {
      width: MAX_WIDTH
    });

  const patientNameEnds = doc.y + NORMAL_FONT_SIZE;

  doc
    .text("Age", 390, dateOfConsultationEnds + 4)
    .text(`${age}`, doc.x + 35, dateOfConsultationEnds + 4)
    .text("Gender", doc.x + 55, dateOfConsultationEnds + 4)
    .text(`${gender ? gender : ""}`, doc.x + 60, dateOfConsultationEnds + 4);

  doc
    .fillColor("black")
    .fontSize(NORMAL_FONT_SIZE)
    .text("\n Mobile Number", DOC_MARGIN, patientNameEnds - NORMAL_FONT_SIZE)
    .text(`${prefix}-${mobile_number}`, 190, patientNameEnds)
    .text("\n Address", DOC_MARGIN, doc.y)
    .text(`${address ? address : ""}`, 190, doc.y - NORMAL_FONT_SIZE, {
      width: MAX_WIDTH
    });

  const addressEndRowLevel = doc.y;

  doc
    .text("Height", 390, patientNameEnds)
    .text(`${height === null ? "--" : height} cm`, 440, patientNameEnds)
    .text("Weight", 390, patientNameEnds + DISTANCE_BETWEEN_ROWS)
    .text(`${weight === null ? "--" : weight} kg`, 440, patientNameEnds + DISTANCE_BETWEEN_ROWS);

  return addressEndRowLevel;
}

function printCarePlanData(
  doc,
  horizontalLineLevel,
  care_plans,
  conditions,
  medications,
  medicines,
  allergies,
  comorbidities
) {
  const { diagnosis, condition, symptoms, clinicalNotes } = formatCarePlanData(
    care_plans,
    conditions
  );

  const medicationsList = formatMedicationsData(medications, medicines);

  doc
    .fillColor("black")
    .fontSize(SHORT_FONT_SIZE)
    .text("CHIEF COMPLAINTS", DOC_MARGIN, horizontalLineLevel + 34)
    .text(`${clinicalNotes}`, doc.x + 250, horizontalLineLevel + 34)
    .text(
      "RELEVANT POINTS FROM HISTORY",
      DOC_MARGIN,
      doc.y + DISTANCE_BETWEEN_ROWS
    )
    .text(`Allergies: ${allergies}`, doc.x + 250, doc.y - NORMAL_FONT_SIZE)
    .text(`Comorbidities: ${comorbidities}`, DOC_MARGIN + 250, doc.y);

  const relevantPointsEndLevel = doc.y;

  doc
    .text(
      "DIAGNOSIS",
      DOC_MARGIN,
      relevantPointsEndLevel + DISTANCE_BETWEEN_ROWS
    )
    .text(
      `${diagnosis}`,
      doc.x + 250,
      relevantPointsEndLevel + DISTANCE_BETWEEN_ROWS
    );

  const labFindingsEndLevel = doc.y;

  // doc.addPage();

  let docYLevel = labFindingsEndLevel + DISTANCE_BETWEEN_ROWS;

  doc.text("SUGGESTED INVESTIGATIONS", DOC_MARGIN, docYLevel);

  const suggestedInvestigationXLevelEnd = doc.x;

  for (const [index, medicationData] of medicationsList.entries()) {
    const {
      description,
      medicineName,
      medicineType,
      strength,
      frequency,
      startDate,
      // endDate,
      duration
    } = medicationData;

    const medicineData = `${medicineName} (${medicineType})`;

    doc
      .fontSize(MEDICINE_FONT_SIZE)
      .text(`${index + 1}.`, suggestedInvestigationXLevelEnd + 250, docYLevel)
      .fontSize(SHORT_FONT_SIZE)
      .text("Rx", doc.x + 20, doc.y - (MEDICINE_FONT_SIZE + 5))
      .fontSize(MEDICINE_FONT_SIZE)
      .text(`${medicineData}`, doc.x + 15, doc.y - SHORT_FONT_SIZE + 1)
      .fontSize(NORMAL_FONT_SIZE - 1)
      .text(
        `${strength}, ${
          frequency ? frequency : ""
        }, For ${duration} day(s) starting ${startDate}`,
        suggestedInvestigationXLevelEnd + 250,
        doc.y
      )
      .text(`${description ? description : ""}`, suggestedInvestigationXLevelEnd + 250, doc.y);

    docYLevel = doc.y + NORMAL_FONT_SIZE;
  }

  return suggestedInvestigationXLevelEnd;
}

function printFooter(doc, imageUrl, nextAppointmentDuration, currentTime) {
  doc
    .fontSize(NORMAL_FONT_SIZE)
    .text("Review After: ", DOC_MARGIN, doc.y + DISTANCE_BETWEEN_ROWS)
    .text(
      `${
        nextAppointmentDuration ? nextAppointmentDuration : DEFAULT_REVIEW_AFTER
      }`,
      doc.x + 80,
      doc.y - (NORMAL_FONT_SIZE + 2)
    );

  try {
    doc.image(`${imageUrl}`, 400, doc.y + 50, { width: 120, height: 40 });
  } catch (err) {
    console.log("ERROR in signature pic", err);
  }

  doc
    .fontSize(SMALLEST_FONT_SIZE - 2)
    .text(`${currentTime}`, 400, doc.y + 100)
    .fontSize(SMALLEST_FONT_SIZE)
    .text("RMPs Signature & Stamp", 400, doc.y + 10);

  generateHr(doc, doc.y + NORMAL_FONT_SIZE);

  doc.text(
    "Note: This prescription is generated on Adhere.",
    DOC_MARGIN,
    doc.y + 30
  );
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
    const {
      [conditionId]: { basic_info: { name = "" } = {} } = {}
    } = conditions;
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
          clinical_notes = ""
        } = {}
      }
    } = carePlans;
    diagnosis = description;
    symptoms = symptom;
    clinicalNotes = clinical_notes;
  }

  return { condition, diagnosis, symptoms, clinicalNotes, carePlanId };
}

function formatDoctorsData(doctors, users, degrees, registrations) {
  const doctorsIds = Object.keys(doctors);
  let degree = "";
  let registrationNumber = "";

  const doctorId = doctorsIds[0];

  const {
    [doctorId]: {
      basic_info: {
        user_id = null,
        first_name = "",
        middle_name = "",
        last_name = "",
        signature_image = ""
      } = {},
      city = ""
    } = {}
  } = doctors;
  const {
    [user_id]: {
      basic_info: { mobile_number = "", email = "", prefix = "" } = {}
    } = {}
  } = users;
  let name = first_name;
  name = middle_name ? `${name} ${middle_name}` : name;
  name = last_name ? `${name} ${last_name}` : name;

  const degreeIds = Object.keys(degrees);
  for (const id of degreeIds) {
    const {
      [id]: { basic_info: { name: degreeName = "" } = {} } = {}
    } = degrees;
    degree = degreeName ? degree + `${degreeName}, ` : degree;
  }

  const registrationIds = Object.keys(registrations);
  for (const regId of registrationIds) {
    const {
      [regId]: {
        number = "",
        council: { basic_info: { name: council_name = "" } = {} } = {}
      } = {}
    } = registrations;
    registrationNumber = registrationNumber + `Registration Number:${number}, `;
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
    mobile_number,
    city,
    degree,
    registrationNumber,
    signature_image,
    prefix
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
      } = {},
      details: { allergies = "", comorbidities = "" } = {}
    } = {}
  } = patients;

  let name = first_name;
  name = middle_name ? `${name} ${middle_name}` : name;
  name = last_name ? `${name} ${last_name}` : name;

  const {
    [user_id]: { basic_info: { mobile_number = "", prefix = "" } = {} } = {}
  } = users;

  console.log("189273812 full_name --> ", full_name);

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
    prefix
  };
}

function formatMedicationsData(medications, medicines) {
  // have to send the list of objects containing instruction medicine name, medicine type, strength, frequency, duration,
  let medicationsList = [];

  const medicationIds = Object.keys(medications);
  for (const medicationId of medicationIds) {
    let medicationDataObj = {};
    const {
      [medicationId]: {
        basic_info: { start_date = "", end_date = "", description = "", details = null } = {},
          details: mobileDetails = null
      }
    } = medications;

    let mainDetails = {};

    if(mobileDetails) {
      mainDetails = {...mobileDetails};
    } else {
      mainDetails = {...details};
    }

    const {
      medicine_id = null,
      when_to_take = [],
      medicine_type = "",
      strength = "",
        unit = "",
        quantity = null
    } = mainDetails || {};

    const {
      [medicine_id]: { basic_info: { name = "", type = "" } = {} } = {}
    } = medicines;

    const startDateObj = moment(start_date);

    // const duration = endDateObj.diff(startDateObj, "days");

    const startDate = `${startDateObj.format("LL")}`;
    let endDate = "";

    if (end_date) {
      const endDateObj = moment(end_date);
      endDate = `${endDateObj.get("year")}/${endDateObj.get(
        "month"
      )}/${endDateObj.get("date")}`;
    }

    medicationDataObj = {
      description,
      medicineName: name ? name.toUpperCase() : name,
      medicineType: type,
      // strength,
      strength: `${quantity ? `${quantity} Tab(s)` : `${strength} ${unit.toUpperCase()}`}`,
      frequency: getWhenToTakeText(when_to_take.length),
      startDate,
      endDate,
      duration: end_date ? moment(end_date).diff(moment(start_date), "days") : "Long term" // todo: change text here after discussion
    };

    medicationsList.push(medicationDataObj);
  }

  return medicationsList;
}

const getWhenToTakeText = (number) => {
  switch(number) {
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
    .strokeColor("black")
    .lineWidth(1)
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
