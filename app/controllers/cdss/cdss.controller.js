import Log from "../../../libs/log";
// import fs from "fs";
const Response = require("../helper/responseFormat");
import Controller from "../index";
const Cdss = require("../../models/mongoModel/cdss");

const Logger = new Log("WEB USER CONTROLLER");

class CdssController extends Controller {
  constructor() {
    super();
  }

  addDyanosis = async (req, res) => {
    console.log("add Dyagonsis - called");
    let data = req.body;

    if (!data.dia) {
      return res.status(201).send({ error: "Please add Dia in Body" });
    }

    // check if it is alread exist or not.
    let dbcdss = await Cdss.find(data);
    if(dbcdss) return res.status(400).send({error: true, message: 'Already Added'});

    /*
    dbcdss = await Cdss.find({dia:data.dia});
    if(dbcdss) return res.status(400).send({error: true, message: 'Dia Already Added'});
    */

    let cdss = new Cdss(data);
    console.log({ cdss });
    cdss = await cdss.save();
    console.log(cdss);
    return res.status(201).send(cdss);
  };

  getDyanosis = async (req, res) => {
    console.log("get Dyagonsis - called");
    let data = req.body;
    console.log({ data });
    if (!(data.length > 0)) {
      return res.status(200).send([]);
    }
    let searchObject = [];
    for (let i in data) {
      let symp = {};
      symp[data[i]] = true;
      searchObject.push(symp);
    }
    console.log({ searchObject });
    let cdss = await Cdss.find({
      $or: searchObject,
    });

    let dict = {};

    for (let i = 0; i < cdss.length; i++) {
      let count = 0;
      for (let k in data) if (cdss[i][data[k]]) count += 1;
      dict[cdss[i]["dia"]] = count;
    }

    let keysSorted = Object.keys(dict).sort((a, b) => dict[b] - dict[a]);
    return res.status(200).send([...keysSorted]);
  };

  listDyanosis = async (req, res) => {
    console.log("list Dyagonsis - called-one");
    let keyword = '';
    if(req.query.dia)
      keyword = req.query.dia 
    try {
      let data = {
        $or: [
          { dia: { $regex: keyword, $options: 'i' } },
        ],
      };
      let cdss = await Cdss.find(data);
      return res.status(200).send(cdss);
    } catch (ex) {
      console.log(ex);
    }
  };
}

export default new CdssController();
