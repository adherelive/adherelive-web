const productService = require("../../services/product/product.service");
const Log = require("../../../libs/log")("productController");
const Response = require("../../helper/responseFormat");

class ProductController {
  constructor() {}

  async addProduct(req, res) {
    // try {
    //     if(req.userDetails.exists){
    //         response = new Response(true, 200);
    //         response.setData({});
    //         response.setMessage("Your Product is created.")
    //         res.status().json(response.getResponse());
    //     }
    //     else{
    //         response = new Response(false, 403);
    //         response.setError({status:"COOKIES_NOT_SET", message: "Can't add the product, cookies are not set."});
    //         res.status(403).json(response.getResponse());
    //     }
    // } catch (err) {
    // }
  }

  async getProductById(req, res) {
    try {
      const Id = req.params.id;

      let productsData = await productService.getProductById(Id);

      let response = new Response(true, 200);
      response.setData({ productsData });
      response.setMessage("Program Data Added");
      return res.send(response.getResponse());
    } catch (err) {
      let payload;

      // let response = new Response(false, payload.code);
      // response.setError(payload.error);
      // return res.status(payload.code).json(response.getResponse());
    }
  }

  async getProductForProgram(req, res) {
    try {
      const { programId } = req.params;
      console.log("req.params===============>", req.params);
      let products = await productService.getProductById(programId);
      console.log("products=====================>", products);
      let response = new Response(true, 200);
      response.setData({ products });
      response.setMessage("Program Data Added");
      return res.send(response.getResponse());
    } catch (err) {
      let payload;

      // let response = new Response(false, payload.code);
      // response.setError(payload.error);
      // return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new ProductController();
