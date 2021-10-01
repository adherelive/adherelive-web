import moment from "moment";

export default dob => {
  const now = moment();
  const then = moment(dob);

  const totalDays = now.diff(then, 'd');
  if (totalDays < 30) {
    return `${totalDays} d`;
  } else if (totalDays > 30 && totalDays < 365) {
    const months = now.diff(then, 'months');
    const remainingDays = totalDays % 30;
    return remainingDays ? `${months} m ${remainingDays} d` : `${months} m`;
  } else if(totalDays > 365 && totalDays < (365 * 5))  {
    const totalMonths = now.diff(then, 'months');
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    return remainingMonths ? `${years} y ${remainingMonths} m` : `${years} y`;
  } else {
    const years = now.diff(then, "years");
    return `${years} y`;
  }
};
