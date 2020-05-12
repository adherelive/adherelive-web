// const createError = require("http-errors");

const Config = require("../config/config-prev");
const express = require("express");

Config();

const app = express();

module.exports = app;
