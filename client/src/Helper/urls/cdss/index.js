export const getCdssDiagnosisList = () => {
  return "/cdss/get";
};

export const addCdssDiagnosisList = () => {
  return "/cdss";
};

export const getDiagnosisSearchUrl = (diagnosisName) => {
  return `cdss/?dia=${diagnosisName}`;
};
