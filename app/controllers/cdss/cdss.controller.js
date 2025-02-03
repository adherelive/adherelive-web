import Controller from "../index";

import { createLogger } from "../../../libs/log";

const Response = require("../helper/responseFormat");
const Cdss = require("../../models/mongoModel/cdss");
const log = createLogger("Web CDSS user controller");

class CdssController extends Controller {
  constructor() {
    super();
  }

  /**
   * Add a diagnosis based on the Symptoms entered.
   * The MongoDB structure stores 'dia' as the key and all other fields are optional,
   * but based on those values we later list/retrieve the data
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  addDiagnosis = async (req, res) => {
    const data = req.body;

    if (!data.dia) {
      return res
        .status(400)
        .send({ error: "Please add the Diagnosis in the form for MongoDB" });
    }

    // Check if the symptoms combination already exists or not
    const dbcdss = await Cdss.findOne({ dia: data.dia });
    if (dbcdss) {
      return res
        .status(400)
        .send({ error: true, message: "Diagnosis already exists in MongoDB" });
    }

    const cdssResponse = [];

    if (Array.isArray(data.dia) && data.dia.length > 0) {
      const promises = data.dia.map(async (newDia) => {
        const newData = { ...data, dia: newDia };
        const cdss = new Cdss(newData);
        return cdss.save();
      });
      cdssResponse.push(...(await Promise.all(promises)));
    } else {
      const cdss = new Cdss(data);
      cdssResponse.push(await cdss.save());
    }

    return res.status(201).send(cdssResponse);
  };

  /**
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  getDiagnosis = async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(200).send([]);
    }

    const searchObject = data.map((symptom) => ({ [symptom]: true }));

    try {
      const cdss = await Cdss.find({ $or: searchObject });

      const dict = cdss.reduce((acc, item) => {
        const count = data.reduce(
          (sum, symptom) => sum + (item[symptom] ? 1 : 0),
          0
        );
        acc[item.dia] = (acc[item.dia] || 0) + count;
        return acc;
      }, {});

      const keysSorted = Object.keys(dict).sort((a, b) => dict[b] - dict[a]);
      return res.status(200).send(keysSorted);
    } catch (error) {
      return res
        .status(500)
        .send({ error: "Error fetching data from mongodb database" });
    }
  };

  /**
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  listDiagnosis = async (req, res) => {
    const { dia = "" } = req.query;

    try {
      const data = { dia: { $regex: dia, $options: "i" } };
      const cdss = await Cdss.find(data);

      const filterDia = cdss.map((item) => item.dia);

      return res.status(200).send(filterDia);
    } catch (ex) {
      log.debug(ex);
      return res
        .status(500)
        .send({ error: "Error fetching data from mongodb database" });
    }
  };
}

export default new CdssController();
