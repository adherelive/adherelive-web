const pharmaCompaniesModel = require("../../models/pharmaCompanies");

class PharmaCompaniesService {
  async getPharmaCompaniesById(id) {
    try {
      const pharmaCompany = await pharmaCompaniesModel.findById(id);
      return pharmaCompany;
    } catch (err) {
      throw err;
    }
  }

  async getAllPharmaCompanies() {
    try {
      let pharmaCompanies = await pharmaCompaniesModel.find();
      return pharmaCompanies;
    } catch (err) {
      throw err;
    }
  }

  async updateProductList(companyId, productId) {
    try {
      const updatedPharmaCompany = await pharmaCompaniesModel.findOneAndUpdate(
        { _id: companyId },
        { $push: { products: productId } }
      );
      return updatedPharmaCompany;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new PharmaCompaniesService();
