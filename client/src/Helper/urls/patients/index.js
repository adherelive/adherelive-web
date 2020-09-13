export const getAddPatientUrl = () => {
    return `/doctors/patients`;
  };

export const getPatientVitalsURL = (id) => {
  return `/patients/${id}/vitals`;
};