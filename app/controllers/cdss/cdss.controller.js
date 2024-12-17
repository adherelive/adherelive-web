import Log from "../../../libs/log";
import Controller from "../index";
import mongoose from "mongoose";
// import fs from "fs";
// const express = require('express');
// const mongoose = require(('mongoose');
const Response = require("../helper/responseFormat");

const Cdss = require("../../models/mongoModel/Cdss");

const Logger = new Log("Web CDSS user controller");

// Add this line to handle the deprecation warning
//mongoose.set("strictQuery", true);

class CdssController extends Controller {
  constructor() {
    super();
  }

  addDiagnosis = async (req, res) => {
    let data = req.body;

    if (!data.dia) {
      return res.status(201).send({ error: "Please add Diagnosis in Body" });
    }

    // check if it is already exist or not.
    let dbCdss = await Cdss.find(data);
    if (!dbCdss)
      return res.status(400).send({ error: true, message: "Already Added" });

    /*
        dbCdss = await Cdss.find({dia:data.dia});
        if(dbCdss) return res.status(400).send({error: true, message: 'Dia Already Added'});
        */
    let CdssResponse = [];
    if (data.dia.length > 0) {
      for (let i in data.dia) {
        let newDia = data.dia[i];
        let newData = { ...data, dia: newDia };
        let Cdss = new Cdss(newData);
        Cdss = await Cdss.save();
        CdssResponse.push(Cdss);
      }
    } else {
      let Cdss = new Cdss(data);
      Cdss = await Cdss.save();
      CdssResponse.push(Cdss);
    }
    return res.status(201).send(CdssResponse);
  };

  getDiagnosis = async (req, res) => {
    let data = req.body;

    if (!(data.length > 0)) {
      return res.status(200).send([]);
    }
    let searchObject = [];
    for (let i in data) {
      let symp = {};
      symp[data[i]] = true;
      searchObject.push(symp);
    }

    let Cdss = await Cdss.find({
      $or: searchObject,
    });

    let dict = {};

    for (let i = 0; i < Cdss.length; i++) {
      let count = 0;
      for (let k in data) if (Cdss[i][data[k]]) count += 1;
      dict[Cdss[i]["dia"]] = count;
    }

    let keysSorted = Object.keys(dict).sort((a, b) => dict[b] - dict[a]);
    return res.status(200).send([...keysSorted]);
  };

  listDiagnosis = async (req, res) => {
    let keyword = "";
    if (req.query.dia) keyword = req.query.dia;
    try {
      let data = {
        $or: [{ dia: { $regex: keyword, $options: "i" } }],
      };
      let Cdss = await Cdss.find(data);
      let filterDia = [];
      for (let i in Cdss) {
        filterDia.push(Cdss[i].dia);
      }
      return res.status(200).send(filterDia);
    } catch (ex) {
      console.log(ex);
    }
  };
}

export default new CdssController();
