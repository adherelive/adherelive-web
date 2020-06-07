export default d1 => {
  const now = new Date();
  const then = new Date(d1);
  const diff = now.getTime() - then.getTime();
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  if (age >= 0) {
    return `${age}`;
  }
  return false;
};
