const productModel = require("../../models/product");

class ProductService {
  constructor() {}
  async addProduct(data) {
    try {
      let product = await productModel.create(data);
      return product;
    } catch (err) {
      throw err;
    }
  }

  async getProduct(data) {
    try {
      let product = await productModel.findOne(data).lean();
      return product;
    } catch (err) {
      throw err;
    }
  }

  async getProducts(productIds) {
    try {
      let products = await productModel.find({
        _id: {
          $in: productIds
        }
      });
      return products;
    } catch (err) {
      throw err;
    }
  }

  async getProductById(ProgramId) {
    try {
      let product = await productModel.find({ _id: { $in: ProgramId } });

      return product;
    } catch (err) {
      throw err;
    }
  }

  async updateProduct(searchField, updateField) {
    try {
      let product = await productModel.update(searchField, updateField);
      return product;
    } catch (err) {
      throw err;
    }
  }

  async bulkFindProducts(productIds) {
    try {
      let products = await productModel.find({ _id: { $in: productIds } });
      return products;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new ProductService();
