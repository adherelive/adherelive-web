import moment from "moment";

export default d1 => {
  const now = moment();
  const then = moment(d1);
  // days check

  const totalDays = now.diff(then, 'd');
  if(totalDays < 30) {
    return `${totalDays} d`;
  } else if(totalDays > 30 && totalDays < 365) {
    const months = now.diff(then, 'months');
    const remainingDays = totalDays % 30;
    return `${months} m ${remainingDays} d`;
  } else if(totalDays > 365 && totalDays < (365 * 5))  {
    const totalMonths = now.diff(then, 'months');
    const years = totalMonths / 12;
    const remainingMonths = totalMonths % 12;
    return `${years} y ${remainingMonths} m`;
  } else {
    const years = now.diff(then, "years");
    return `${years} y`;
  }

  // const totalMonths = now.diff(then, 'months');
  // console.log("totalMonths ----> ", totalMonths);
  // if(totalMonths < 12) {
  //   return {age: totalMonths, age_type: "2"};
  // }
  //
  // return {age: now.diff(then, 'y'), age_type: "3"};


  // let diff = now.getTime() - then.getTime();
  // // const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  // if (age >= 0) {
  //   return `${age}`;
  // }
  // return false;
};
