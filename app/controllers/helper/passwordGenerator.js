export const generatePassword = () => {
  const length = 8;
  let charset = "";
  let retVal = "";

  const lowerCaseChar = "abcdefghijklmnopqrstuvwxyz";
  const upperCaseChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChar = "!@#$%&*()";

  charset = lowerCaseChar + upperCaseChar + numbers + specialChar;

  retVal += lowerCaseChar.charAt(
    Math.floor(Math.random() * lowerCaseChar.length)
  );
  retVal += upperCaseChar.charAt(
    Math.floor(Math.random() * upperCaseChar.length)
  );
  retVal += numbers.charAt(Math.floor(Math.random() * numbers.length));
  retVal += specialChar.charAt(Math.floor(Math.random() * specialChar.length));

  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};
