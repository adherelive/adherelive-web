const insuranceModel = require("../../models/insuranceProvider");

class InsuranceProviderService {
  constructor() {}

  async addInsuranceProvider(data) {
    try {
      let insuranceProvider = await insuranceModel.create(data);
      return insuranceProvider;
    } catch (err) {
      throw err;
    }
  }

  async getInsuranceProviderById(id) {
    try {
      const insuranceProvider = await insuranceModel.findById(id).lean();
      return insuranceProvider;
    } catch (err) {
      throw err;
    }
  }

  async updateInsuranceProvider(searchField, updateField) {
    try {
      let insuranceProvider = await insuranceModel.update(searchField, {
        $set: updateField
      });
      return insuranceProvider;
    } catch (err) {
      throw err;
    }
  }

  async getAllInsuranceProviders() {
    try {
      let insuranceProviders = await insuranceModel.find();
      return insuranceProviders;
    } catch (err) {
      throw err;
    }
  }

  async getInsuranceProvidersById(ids) {
    try {
      let insuranceProviders = await insuranceModel.find(
        { _id: { $in: ids } },
        { isActive: 1, providerName: 1 }
      );
      return insuranceProviders;
    } catch (err) {
      throw err;
    }
  }

  async getIsInsuranceActive(id) {
    try {
      let insuranceProvider = await insuranceModel.findOne(data);
      return insuranceProvider.isActive;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new InsuranceProviderService();
