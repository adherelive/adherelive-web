import {
  MEDICATION_TIMING,
  PRESCRIPTION_PDF_FOLDER,
  DOSE_UNIT,
  WHEN_TO_TAKE_ABBREVATIONS,
  APPOINTMENT_TYPE,
} from "../../../constant";
import moment from "moment";
import PDFDocument from "pdfkit";

// const PDFDocument = require("pdfkit");
const fs = require("fs");
// const moment = require("moment");

const DOC_MARGIN = 30;
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

const PAGE_END_LIMIT = 750;

const LABEL_COLOR = "black";
const VALUE_COLOR = "#7f8c8d";

const BOLD_FONT = "fonts/PlusJakartaSans-Bold.ttf";
const MEDIUM_FONT = "fonts/PlusJakartaSans-Medium.ttf";
const REGULAR_FONT = "fonts/PlusJakartaSans-Regular.ttf";

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
        providerIcon,
      } = pdfData;
      const doc = new PDFDocument({ size:"A4",margin: DOC_MARGIN, bufferPages: true });

      const { allergies, comorbidities } = formatPatientData(patients, users);

      const fileName = getPdfName(pdfData);

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
        providerIcon
      );

      const addressEndRowLevel = printPatientBlockData(
        doc,
        patients,
        users,
        creationDate,
        doctorBlockEndRowLevel
      );

      const addressSideElementsEnd = doc.y;

      const horizontalLineLevel =
        addressEndRowLevel > addressSideElementsEnd
          ? addressEndRowLevel
          : addressSideElementsEnd;

      // generateHr(doc, horizontalLineLevel + 17);

      const suggestedInvestigationXLevelEnd = printCarePlanData(
        doc,
        horizontalLineLevel,
        care_plans,
        conditions,
        medications,
        medicines,
        allergies,
        comorbidities,
        suggestedInvestigations
      );

      // generateHr(doc, doc.y + 17);

      // generateVr(
      //   doc,
      //   suggestedInvestigationXLevelEnd + 240,
      //   horizontalLineLevel + 17,
      //   doc.y
      // );

      printFooter(doc, signatureImage, nextAppointmentDuration, currentTime);
      doc.end();
    } catch (err) {
      console.log("Error got in the generation of pdf is: ", err);
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
  return `${carePlanId}-${diagnosis}-${doctorName}-${moment().format("DD-MM-YY-hh-mm-ss")}`;
}

function printDoctorBlockData(
  doc,
  doctors,
  users,
  degrees,
  registrations,
  providers,
  doctor_id,
  providerIcon
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
  } = formatDoctorsData(
    doctors,
    users,
    degrees,
    registrations,
    providers,
    doctor_id
  );

  const doctorBlockStartX = doc.x;

  doc
    .fillColor("#3f76cd")
    .fontSize(BOLD_FONT_SIZE)
    .font(BOLD_FONT)
    .text(`Dr. ${doctorName}`, DOC_MARGIN);

  const doctorNameEndsY = doc.y;

  // temp | remove after provider logo
  // doc.rect(400, doctorBlockStartX, 100, 100).fill("#ecf0f1");
  // doc.image(`${imageUrl}`, 400, doctorBlockStartX, { width: 120, height: 40 });
  // .text("\n");
  const fullDegree = degree ? `${degree}, MBBS` : "MBBS";
  doc
    .fontSize(NORMAL_FONT_SIZE)
    .fillColor("#212b36")
    .font(MEDIUM_FONT)
    .text(`${fullDegree}`, doc.x, doctorNameEndsY)
    .font(REGULAR_FONT)
    .text(`Registration Number: ${registrationNumber}`)
    .text(`Email: ${doctorEmail}`)
    .text(`Phone: +${prefix}-${doctorMobileNumber}`)
    .text(`Address: ${city}`);

  // doc
  //   .rect(0, 0, 700, doc.y + 10)
  //   .fillOpacity(0.5)
  //   .fill(DOC_BLOCK_BG_COLOR);
  generateHr(doc, doc.y + 10);

  if (providerIcon) {
    doc.image(`${providerIcon}`, 480, doctorBlockStartX, {
      width: 80,
      height: 80,
    });
  }

  return doc.y;
}

function printPatientBlockData(
  doc,
  patients,
  users,
  creationDate,
  doctorBlockEndRowLevel
) {
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
    prefix = "",
  } = formatPatientData(patients, users);

  doc
    .fontSize(NORMAL_FONT_SIZE)
    .font(BOLD_FONT)
    .text("Name: ", DOC_MARGIN, doctorBlockEndRowLevel + 20, {
      continued: true,
    })
    .font(REGULAR_FONT)
    .text(`${patientName}`, DOC_MARGIN + 10, doctorBlockEndRowLevel + 20),
    { continued: true };

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
    .text("Address :", DOC_MARGIN, mobileNumberEnds + 10, { continued: true })
    .font(REGULAR_FONT)
    .text(
      `${address ? address : "--"}`,
      DOC_MARGIN + 10,
      mobileNumberEnds + 10
    );

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

function printCarePlanData(
  doc,
  horizontalLineLevel,
  care_plans,
  conditions,
  medications,
  medicines,
  allergies,
  comorbidities,
  suggestedInvestigations
) {
  const { diagnosis, condition, symptoms, clinicalNotes } = formatCarePlanData(
    care_plans,
    conditions
  );

  const medicationsList = formatMedicationsData(medications, medicines);

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
      continued: true,
    })

    .font(REGULAR_FONT)
    .text(`${symptoms}`, DOC_MARGIN + 10, relevantHistoryEndLevel + 10);

  const chiefComplaintsEndLevel = doc.y + 20;

  doc
    .font(BOLD_FONT)
    .fontSize(NORMAL_FONT_SIZE)
    .text("General Examination: ", DOC_MARGIN, chiefComplaintsEndLevel, {
      continued: true,
    })
    .font(REGULAR_FONT)
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

  if (medicationsList.length > 0) {
    doc
      .font(BOLD_FONT)
      .fontSize(BOLD_FONT_SIZE)
      .text("Rx", DOC_MARGIN, labFindingsEndLevel + 15);

    const rXLabelEndLevelY = doc.y;

    const serialNoXStart = DOC_MARGIN;
    const medicineXStart = DOC_MARGIN + 40;
    const dosageXStart = DOC_MARGIN + 210;
    const quantityXStart = DOC_MARGIN + 260;
    const frequencyXStart = DOC_MARGIN + 320;
    const timingFrequencyXStart = DOC_MARGIN + 390;

    // generateHr(doc, doc.y);
    // medicine table header
    doc
      .fillColor("#4a90e2")
      .fontSize(NORMAL_FONT_SIZE)
      .font(BOLD_FONT)
      .text("S.No.", serialNoXStart, rXLabelEndLevelY + 10)
      .text("Medicines", medicineXStart, rXLabelEndLevelY + 10)
      .text("Dosage", dosageXStart, rXLabelEndLevelY + 10)
      .text("Quantity", quantityXStart, rXLabelEndLevelY + 10)
      .text("Frequency", frequencyXStart, rXLabelEndLevelY + 10)
      .text("Time-Duration", timingFrequencyXStart, rXLabelEndLevelY + 10);

    // generateHr(doc, doc.y);

    const medicationTableHeaderEndYLevel = doc.y;
    medicationYLevel = doc.y + 10;

    for (const [index, medicationData] of medicationsList.entries()) {

      const {
        description,
        medicineName,
        medicineType,
        genericName,
        strength,
        frequency,
        startDate,
        quantity,
        // endDate,
        duration,
        dosage,
        timings,
      } = medicationData;

      const medicineData = `(${medicineType}) ${medicineName} `;


      // .fontSize(MEDICINE_FONT_SIZE)
      // .text(`${index + 1}.`, currentMedicationXLevel, medicationYLevel)
      // .fontSize(SHORT_FONT_SIZE)
      // .text("Rx", doc.x + 20, doc.y - (MEDICINE_FONT_SIZE + 5))

      if(doc.y + (3 * SHORT_FONT_SIZE) > PAGE_END_LIMIT) {
        doc.addPage();
        medicationYLevel = DOC_MARGIN;
      }

      doc
        .fillColor("#212b36")
        .fontSize(SHORT_FONT_SIZE)
        .font(MEDIUM_FONT)
        .text(`${index + 1}.`, serialNoXStart, medicationYLevel)
        .text(`${medicineData}`, medicineXStart, medicationYLevel,   {
          width: dosageXStart - medicineXStart,
        })
        .text(`${genericName}`, medicineXStart, doc.y,   {
          width: dosageXStart - medicineXStart,
        })
        .text(
          `Note: ${description ? description : "-"}`,
          medicineXStart,
          doc.y,
          {
            width: dosageXStart - medicineXStart,
          }
        );

      const medicationYLevelEnd = doc.y;

      // console.log("30183012093 medicationYLevelEnd, medicationYLevel",{medicationYLevelEnd, medicationYLevel, condition: (medicationYLevel - medicationYLevelEnd) > NORMAL_FONT_SIZE});

      // if((medicationYLevel - medicationYLevelEnd) > NORMAL_FONT_SIZE) {
      //   // doc.addPage();

      //   const {start, count} = doc.bufferedPageRange();
      //   console.log("183129837129 count, start", {count, start});
      //   doc.switchToPage(0);
      // }

      // console.log("1936129387 doc.x, doc.y", {x: doc.x, y: doc.y});
      // const {start, count} = doc.bufferedPageRange();
      //   console.log("1833129837129 count, start", {count, start});


      doc
        .text(`${strength}`, dosageXStart, medicationYLevel)
        .text(`${quantity ? quantity : "-"}`, quantityXStart, medicationYLevel)
        .text(`${dosage}`, frequencyXStart, medicationYLevel,
        {
          width: timingFrequencyXStart - frequencyXStart,
        }
        );

        doc.text(`${timings}`, timingFrequencyXStart, medicationYLevel)
        // .text(
        //   `${frequency}`,
        //   timingFrequencyXStart,
        //   doc.y
        // )
        .text(`${duration} day(s)`, timingFrequencyXStart, doc.y);

        // if((medicationYLevel - doc.y) > NORMAL_FONT_SIZE) {
        //   // doc.addPage();
  
        //   const {start, count} = doc.bufferedPageRange();
        //   console.log("183129837129 count, start", {count, start});
        //   doc.switchToPage(start);
        // }
      // .fontSize(NORMAL_FONT_SIZE - 1)
      // .text(
      //   `${strength}, ${
      //     frequency ? frequency : ""
      //   }, For ${duration} day(s) starting ${startDate}`,
      //   medicationYLevel + 250,
      //   doc.y
      // )

      // if((medicationYLevel - medicationYLevelEnd) > NORMAL_FONT_SIZE) {
      //   const {start, count} = doc.bufferedPageRange();
      //   console.log("183129837129 count, start", {count, start});
      //   doc.switchToPage(start);
      // }
      
      const horizontalLineY =
        medicationYLevelEnd > doc.y ? medicationYLevelEnd : doc.y;
      generateHr(doc, horizontalLineY + 5);

      medicationYLevel = medicationYLevelEnd + NORMAL_FONT_SIZE;

      // checkAndAddNewPage(doc);
    }
  }

  // checkAndAddNewPage(doc);

  let docYLevel = medicationYLevel;

  doc
    .font(BOLD_FONT)
    .fontSize(NORMAL_FONT_SIZE)
    .text("Suggested Investigation :", DOC_MARGIN, docYLevel + 10);

  for (let index = 0; index < suggestedInvestigations.length; index++) {
    const { type, type_description, radiology_type, start_date } =
      suggestedInvestigations[index] || {};

    doc
      .font(REGULAR_FONT)
      .text(
        `${type_description}${radiology_type ? `-${radiology_type}` : ""}(${
          APPOINTMENT_TYPE[type].title
        }) on ${moment(start_date).format("DD/MM/YYYY")}`,
        DOC_MARGIN,
        doc.y + 5
      );
  }

  const suggestedInvestigationXLevelEnd = doc.x;
  return suggestedInvestigationXLevelEnd;
}

function printFooter(doc, imageUrl, nextAppointmentDuration, currentTime) {

  // checkAndAddNewPage(doc);

  if(doc.y > PAGE_END_LIMIT) {
    doc.addPage();
    // medicationYLevel = DOC_MARGIN;
  }

  const footerStartLevel = doc.y + 10;
  doc
    .font(BOLD_FONT)
    .fontSize(NORMAL_FONT_SIZE)
    .text("Review After: ", DOC_MARGIN, footerStartLevel, { continued: true })
    .font(REGULAR_FONT)
    .text(
      `${
        nextAppointmentDuration ? nextAppointmentDuration : DEFAULT_REVIEW_AFTER
      }`,
      DOC_MARGIN + 10
      // footerStartLevel
    );

    if(doc.y > (PAGE_END_LIMIT - 50)) {
      doc.addPage();
      // medicationYLevel = DOC_MARGIN;
    }

  try {
    doc.image(`${imageUrl}`, 400, doc.y + 10, { width: 120, height: 40 });
  } catch (err) {
    console.log("ERROR in signature pic", err);
  }

  doc
    .fontSize(SMALLEST_FONT_SIZE - 2)
    .text(`${currentTime}`, 400, doc.y + 60)
    .fontSize(SMALLEST_FONT_SIZE)
    .text("RMPs Signature & Stamp", 400, doc.y + 10);

  generateHr(doc, doc.y + NORMAL_FONT_SIZE);

  doc.text(
    "Note: This prescription is generated on Adhere.",
    DOC_MARGIN,
    doc.y + 15
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
      [conditionId]: { basic_info: { name = "" } = {} } = {},
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
          clinical_notes = "",
        } = {},
      },
    } = carePlans;
    diagnosis = description;
    symptoms = symptom;
    clinicalNotes = clinical_notes;
  }

  return { condition, diagnosis, symptoms, clinicalNotes, carePlanId };
}

function formatDoctorsData(
  doctors,
  users,
  degrees,
  registrations,
  providers,
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

  let mobileNumber = mobile_number;
  let prefixToShow = prefix;
  if (provider_id) {
    const {
      [provider_id]: {
        basic_info: { user_id: providerUserId, name } = {},
        details: { icon: providerIcon } = {},
      } = {},
    } = providers || {};
    providerName = name;
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
    const {
      [id]: { basic_info: { name: degreeName = "" } = {} } = {},
    } = degrees;
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
        basic_info: {
          start_date = "",
          end_date = "",
          description = "",
          details = null,
        } = {},
        details: mobileDetails = null,
      },
    } = medications;

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
      endDate = `${endDateObj.get("year")}/${endDateObj.get(
        "month"
      )}/${endDateObj.get("date")}`;
    }

    const { [unit]: { text = "" } = {} } = DOSE_UNIT;
    const unitToShow = text ? text : unit;

    medicationDataObj = {
      description,
      medicineName: name ? name.toUpperCase() : name,
      genericName: generic_name,
      medicineType: type,
      // strength,
      strength: `${`${strength} ${unitToShow.toUpperCase()}`}`,
      quantity,
      frequency: getWhenToTakeText(when_to_take.length),
      startDate,
      endDate,
      timings: getWhenToTakeTimings(when_to_take),
      dosage: getWhenToTakeDosage(when_to_take),
      duration: end_date
        ? moment(end_date).diff(moment(start_date), "days")
        : "Long term", // todo: change text here after discussion
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
  if (doc.y > PAGE_END_LIMIT){ doc.addPage(); }
};