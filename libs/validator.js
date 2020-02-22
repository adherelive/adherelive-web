class Validator {
  validateCityData(req, res, next) {
    next();
  }
}

module.exports = new Validator();
