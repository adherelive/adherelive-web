import moment from "moment";

export default d1 => {
  const now = moment();
  const then = moment(d1);
  // days check

  const totalDays = now.diff(then, 'd');
  if(totalDays < 30) {
    return {age: totalDays, age_type: "1"};
  }

  const totalMonths = now.diff(then, 'months');
  console.log("totalMonths ----> ", totalMonths);
  if(totalMonths < 12) {
    return {age: totalMonths, age_type: "2"};
  }

  return {age: now.diff(then, 'y'), age_type: "3"};


  // let diff = now.getTime() - then.getTime();
  // // const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  // if (age >= 0) {
  //   return `${age}`;
  // }
  // return false;
};
