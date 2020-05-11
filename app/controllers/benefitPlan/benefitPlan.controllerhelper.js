const programKeyValueService = require("../../services/programKeyValue/programKeyValue.service");

import userHelper from "../../services/user/userHelper";

export const checkIfAllDocVerifed = async (userId, benefitDocs, documentId) => {
  console.log("------------came here------------");
  const user = await userHelper(userId);

  const { data: { programId = [] } = {} } = user;
  console.log("programId----------------------- :", programId);
  const programValues = await programKeyValueService.getProgramValues(
    programId[0]
  );
  console.log("programValues==================== :", documentId);
  let {
    values: { benefitDocuments: programBenefitDocs = [] } = {}
  } = programValues;
  const uploadedDocs = Object.keys(benefitDocs);
  console.log("UploadDocs============= :", programBenefitDocs, uploadedDocs);
  if (programBenefitDocs.length === uploadedDocs.length) {
    const verifiedUploadDocs = uploadedDocs.filter(doc => {
      if (doc === documentId) {
        return true;
      } else {
        const { isVerified } = benefitDocs[doc] || {};
        return isVerified;
      }
    });
    console.log(
      "verifiedUploadDocs============= :",
      programBenefitDocs,
      verifiedUploadDocs
    );
    if (programBenefitDocs.length === verifiedUploadDocs.length) {
      return true;
    }
    return false;
  }
};
