const programService = require("./program.service");
const programKeyValuesService = require("../programKeyValue/programKeyValue.service");

class ProgramHelper {
  constructor(object, config) {
    if (
      object &&
      typeof object === "object" &&
      config &&
      typeof config === "object"
    ) {
      this.data = object;
      this.config = config.values;
    }
  }

  getStages = () => {
    const { stage = {} } = this.config;
    console.log("stage :", stage);
    return stage;
  };

  getDropOutReasons = () => {
    const { dropOutReasons = {} } = this.config;
    return dropOutReasons;
  };

  getProgramData = () => {
    return this.data;
  };

  getProgramKeyValues = () => {
    return this.config;
  };

  getBasicInfo = () => {
    const {
      _id,
      name,
      pharmaCo,
      targetLocation,
      products,
      expiresOn,
      insuranceProviders,
      isBenefitsApplicable,
      isBenefitDocumentsRequired
    } = this.data;

    return {
      _id,
      name,
      pharmaCo,
      targetLocation,
      products,
      expiresOn,
      insuranceProviders,
      isBenefitsApplicable,
      isBenefitDocumentsRequired
    };
  };
}

export default async (programId, programData = null) => {
  if (programData && programData === typeof Object) {
    const { _id } = object;
    const programKeyValues = await programKeyValuesService.getProgramValues(
      _id
    );
    return new ProgramHelper(programData, programKeyValues);
  } else if (programId) {
    const res = await programService.getProgramsById([programId]);
    if (res && res.length) {
      const programKeyValues = await programKeyValuesService.getProgramValues(
        programId
      );
      return new ProgramHelper(res[0], programKeyValues);
    } else return null;
  }
};
