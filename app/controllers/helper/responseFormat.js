class Response {
  constructor(status, statusCode) {
    this.status = status;
    this.statusCode = statusCode;
    this.data = {};
  }
  /**
   * @api {OPTIONS} /response Response format
   * @apiName responseFormat
   * @apiGroup Response
   *
   * @apiVersion 1.0.0
   *
   * @apiDescription Description of ResponseFormat
   * This class is a standard response format which gives successful response in the format.
   * The path /response does not exists.
   * It's just because of apidoc's structure.
   *
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *  "status": true,
   *  "statusCode": 200,
   *  "payload": {
   *    "data": {
   *      "somekey": "somevalue"
   *    },
   *    "message": "This is a successful response."
   *  }
   * }
   *
   *
   * @apiErrorExample {json} Error-Response:
   * {
   *  "status": false,
   *  "statusCode": 404,
   *  "payload": {
   *    "error": {
   *      "status": "NOT_FOUND",
   *      "message": "This is a unsuccessful response."
   *    }
   *  }
   * }
   *
   */
  setStatus(status) {
    this.status = status;
  }

  setStatusCode(statusCode) {
    this.statusCode = statusCode;
  }

  getStatus() {
    return this.status;
  }

  getStatusCode() {
    return this.statusCode;
  }

  /**
   * @api {OPTIONS} /setData Sets data field
   * @apiName setData
   * @apiGroup Response
   *
   *
   * @apiDescription Description of setData function.
   * This function takes variable arguments.
   * Bases on the no of arguments it populates the data field.
   * If no of arguments is 1(one), it assumes that the argument
   * is a object and copies to the data.
   * If the no of arguments is 2(two), it assumes that the arguments
   * are key value pairs and populates the data accordingly.
   * The path /setData does not exists.
   * It's just because of apidoc's structure.
   */
  setData() {
    if (arguments.length == 1) {
      let data = arguments["0"];
      this.data = Object.assign({}, data);
    } else if (arguments.length == 2) {
      let key = arguments["0"];
      let value = arguments["1"];
      this.data = Object.assign({}, { [key]: value });
    }
  }

  addData(args) {
    const data = this.data;
    this.data = { ...data, ...args };
  }

  getData() {
    return this.data;
  }
  setMessage(message) {
    this.message = message;
  }
  getMessage() {
    return this.message;
  }
  setError(error) {
    this.error = Object.assign({}, error);
  }
  getError() {
    return this.error;
  }
  /**
   * @api {OPTIONS} /getResponse Generates response
   * @apiName getResponse
   * @apiGroup Response
   *
   *
   * @apiDescription Description of getResponse function.
   * This function, based on the status, builds the response body.
   * The path /getResponse does not exists.
   * It's just because of apidoc's structure.
   */
  getResponse() {
    let payload;
    if (this.getStatus()) {
      payload = {
        data: this.getData(),
        message: this.getMessage()
      };
    } else {
      payload = {
        error: this.getError(),
        message: this.getMessage()
      };
    }
    return {
      status: this.getStatus(),
      statusCode: this.getStatusCode(),
      payload: payload
    };
  }
}

module.exports = Response;
