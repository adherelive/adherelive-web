"use strict";

import chalk from "chalk";
import moment from "moment";
import os from "os";

export class Log {
  constructor(filename) {
    this.source = filename;
    this._dashString = "-".repeat(106);
  }

  setFileName(filename) {
    this.source = filename;
    return this;
  }

  getLogDate() {
    return moment().format(`D MMMM YYYY @ hh:mm A`);
  }

  debug(msg, code) {
    console.log(
      `${this._dashString}\n${this.getLogDate()} [${chalk.yellow(
        this.source
      )}]\n\nMESSAGE: ${msg}\n`,
      code
    );
  }

  objectInfo(msg, obj) {
    const data = Object.entries(obj)
      .map(([key, value]) => `${key} : ${value}`)
      .join("\n");

    console.log(
      `${this.source} ${this.getLogDate()}\n\n${msg} ->\n\n${data}\n`
    );
  }

  request(data) {
    console.log(
      `${this._dashString}\n${this.getLogDate()} [${chalk.yellow(
        this.source
      )}]\n\n--- REQUEST ---\n`,
      data
    );
  }

  warn(msg) {
    console.log(
      `\n${chalk.red(this.getLogDate())} ${chalk.red(
        `( ${this.source} )`
      )} : ${msg}\n`
    );
  }

  info(msg) {
    console.log(
      `\n${chalk.blue(this.getLogDate())} ${chalk.blue(
        `( ${this.source} )`
      )} : ${msg}\n`
    );
  }

  success(msg) {
    console.log(
      `\n${chalk.green(this.getLogDate())} ${chalk.green(
        `( ${this.source} )`
      )} : ${msg}\n`
    );
  }

  getErrorStatement(code) {
    const statements = {
      500: "Server Error",
      1000: "Couldn't connect to MongoDB",
      1002: "",
      1003: "",
      2000: "",
      3000: "",
      4000: "",
      5000: "",
      6000: "",
      7000: "",
    };
    return statements[code] || "Unknown Error, not mapped";
  }

  logError(errorCode, methodName, description) {
    const serverName = os.hostname();
    const logDate = this.getLogDate();
    const errorMessage = `
      ${chalk.blue(logDate)}
      ${chalk.blue("errorCode=")} ${errorCode}
      ${chalk.blue("Server=")} ${serverName}
      ${chalk.blue("Application=")} sendnotification
      ${chalk.blue("Source=")} ${this.source}
      ${chalk.blue("Method=")} ${methodName}
      ${chalk.blue("Statement=")} ${this.getErrorStatement(errorCode)}
      ${chalk.blue("Description=")} ${description}
    `;

    console.error(errorMessage.trim());
    console.log(description);
  }
}

export default (filename) => new Log(filename);
