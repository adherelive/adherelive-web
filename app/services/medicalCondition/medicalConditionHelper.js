import { VITALFIELD, FIELD_TYPE } from "../../../constant";
import moment from "moment";
import forIn from "lodash/forIn";

const medicalConditionService = require("../../services/medicalCondition/medicalCondition.service");

const getFieldValueToShow = (field, value) => {
  let result = "--";
  if (value && value !== null) {
    const { type } = field;

    switch (type) {
      case FIELD_TYPE.INPUT:
        result = value;
        break;
      case FIELD_TYPE.RADIO:
        result = value;
        break;
      case FIELD_TYPE.DATE: {
        const date = new moment(value);
        if (date.isValid()) {
          const { format } = field;
          result = date.format(format);
        }
        break;
      }

      default:
        break;
    }
  }

  return result;
};

class MedicalConditionHelper {
  constructor(object) {
    if (object && typeof object === "object") {
      this.data = object;
    }
  }

  getData() {
    return this.data;
  }

  getParseVitals() {
    const { vitals = [] } = this.data;

    let parsedVitals = vitals.map(vital => {
      const {
        temperatureUnit,
        temperature,
        respirationRate,
        pulse,
        bloodPressure,
        updatedAt
      } = vital;
      let temperatureValInC, temperatureValInF;
      if (temperatureUnit === VITALFIELD.TEMPERATURE_UNIT_C) {
        temperatureValInF = Math.round(temperature * (9 / 5) + 32);
        temperatureValInC = temperature;
      }
      if (temperatureUnit === VITALFIELD.TEMPERATURE_UNIT_F) {
        temperatureValInF = temperature;
        temperatureValInC = Math.round((temperature - 32) * (5 / 9));
      }
      const newTemp =
        temperatureValInC && temperatureValInF
          ? `${temperatureValInC}/${temperatureValInF}`
          : undefined;
      return {
        updatedAt: updatedAt ? moment(updatedAt).format("DD-MM-YYYY") : "",
        temperature: newTemp,
        respirationRate,
        pulse,
        bloodPressure
      };
    });
    parsedVitals = parsedVitals.reverse();
    const suffix = {
      updatedAt: "",
      temperature: "℃/℉",
      respirationRate: "breathe per minute",
      pulse: "bpm",
      bloodPressure: "systolic/diastolic in mmHg"
    };
    const header = {
      updatedAt: "Updated At",
      temperature: "Temperature",
      respirationRate: "Respiration Rate",
      pulse: "Pulse",
      bloodPressure: "Blood Pressure"
    };
    parsedVitals.unshift(suffix);
    let columns = [];
    forIn(header, (value, key) => {
      columns.push({
        title: value,
        key: key,
        dataIndex: key
      });
    });
    parsedVitals = parsedVitals.filter(vitals => {
      const { temperature, respirationRate, pulse, bloodPressure } = vitals;
      return temperature && respirationRate && pulse && bloodPressure;
    });
    return { dataSource: parsedVitals, columns };
  }

  parseClReading(clinicalTestTemplates) {
    const { clinicalReadings: { readings = {} } = {} } = this.data;
    const allTests = Object.keys(readings);
    const { type = {} } = clinicalTestTemplates || {};

    const clinicalDataSet = [];

    allTests.forEach(test => {
      const { name: testName, fields, field_ids } = type[test] || {};
      if (testName) {
        const data = readings[test] || [];
        const dataSource = [];

        data.reverse();
        data.forEach((item, index) => {
          const { updatedAt, data: value = {} } = item;
          let source = {
            key: index,
            updatedAt: new moment(updatedAt).format("LL LT")
          };
          field_ids.forEach(field_id => {
            const field_value = getFieldValueToShow(
              fields[field_id],
              value[field_id]
            );
            source = { ...source, [field_id]: field_value };
          });
          dataSource.push(source);
        });
        const columns = [];
        field_ids.forEach(field_id => {
          const { id, name } = fields[field_id] || {};
          columns.push({ title: name, key: id, dataIndex: id });
        });
        columns.push({
          title: "Updated At",
          key: "updatedAt",
          dataIndex: "updatedAt"
        });
        clinicalDataSet.push({ testName, dataSource, columns });
      }
    });

    return clinicalDataSet;
  }
}

export default async (userId, medicalConditionData = null) => {
  if (medicalConditionData && medicalConditionData === typeof Object) {
    return new MedicalConditionHelper(medicalConditionData);
  } else if (userId) {
    const res = await medicalConditionService.getMedicalsDetails({
      userId: userId
    });
    const medicalData = res[0];
    console.log("res=======", medicalData);
    if (medicalData) {
      return new MedicalConditionHelper(medicalData);
    } else return null;
  }
};
