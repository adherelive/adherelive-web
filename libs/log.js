import chalk from "chalk";
import moment from "moment";

class Log {
  constructor(filename) {
    this.source = filename;
    this._dashString =
      "------------------------------------------------------------------------------------------------------";
  }

  getLogDate() {
    return moment().format(`D MMMM YYYY @ hh:mm A`);
  }

  debug(msg, code) {
    // console.log(
    //   `\n ${chalk.yellow(this.getLogDate())}  ${chalk.yellow(
    //     "( " + this.source + " )"
    //   )} : ${msg} \n`
    // );
    console.log(
      `${this._dashString}\n${this.getLogDate()} [${chalk.yellow(
        this.source
      )}] \n\nMESSAGE: ${msg}\n\n`,
      code
    );
  }

  request(data) {
    console.log(
        `${this._dashString}\n${this.getLogDate()} [${chalk.yellow(
            this.source
        )}] \n\n--- REQUEST ---\n\n`,
        data
    );
  }

  warn(msg) {
    console.log(
      `\n ${chalk.red(this.getLogDate())}  ${chalk.red(
        "( " + this.source + " )"
      )}  :  ${msg} \n`
    );
  }

  info(msg) {
    console.log(
      `\n ${chalk.blue(this.getLogDate())} ${chalk.blue(
        "( " + this.source + " )"
      )}  :  ${msg}  \n`
    );
  }

  success(msg) {
    console.log(
      `\n ${chalk.green(this.getLogDate())} ${chalk.green(
        "( " + this.source + " )"
      )} :  ${msg}  \n`
    );
  }

  getErrorStatement(code) {
    let statement = {
      500: "Server Error",
      1000: "Couldn't connect MongoDb",
      1002: "",
      1003: "",
      2000: "",
      3000: "",
      4000: "",
      5000: "",
      6000: "",
      7000: ""
    };
    return statement[code];
  }

  errLog(errorCode, methodName, description) {
    var serverName = require("os").hostname(),
      logDate = this.getLogDate();
    var errLog = "\n\n";
    errLog += "\x1b[34m" + logDate + "\x1b[0m" + "\n";
    errLog += "\x1b[34m" + "errorCode= " + "\x1b[0m" + errorCode + "\n";
    errLog += "\x1b[34m" + "Server=" + "\x1b[0m" + serverName + "\n";
    errLog +=
      "\x1b[34m" + "Application=" + "\x1b[0m" + "sendnotification" + "\n";
    errLog += "\x1b[34m" + "Source=" + "\x1b[0m" + this.source + "\n";
    errLog += "\x1b[34m" + "Method=" + "\x1b[0m" + methodName + "\n";
    errLog +=
      "\x1b[34m" +
      "Statement=" +
      "\x1b[0m" +
      this.getErrorStatement(errorCode) +
      "\n";
    errLog += "\x1b[34m" + "Description=" + "\x1b[0m" + description + "\n";
    console.error(errLog + "\n"); // eslint-disable-line
    console.log(description);
    throw new Error(errLog);
  }

  err(errorCode, methodName, description) {
    var serverName = require("os").hostname(),
      logDate = this.getLogDate();
    var errLog = "\n\n";
    errLog += "\x1b[34m" + logDate + "\x1b[0m" + "\n";
    errLog += "\x1b[34m" + "errorCode= " + "\x1b[0m" + errorCode + "\n";
    errLog += "\x1b[34m" + "Server=" + "\x1b[0m" + serverName + "\n";
    errLog +=
      "\x1b[34m" + "Application=" + "\x1b[0m" + "sendnotification" + "\n";
    errLog += "\x1b[34m" + "Source=" + "\x1b[0m" + this.source + "\n";
    errLog += "\x1b[34m" + "Method=" + "\x1b[0m" + methodName + "\n";
    errLog +=
      "\x1b[34m" +
      "Statement=" +
      "\x1b[0m" +
      this.getErrorStatement(errorCode) +
      "\n";
    errLog += "\x1b[34m" + "Description=" + "\x1b[0m" + description + "\n";
    console.error(errLog + "\n"); // eslint-disable-line
    console.log(description);
  }
}

module.exports = filename => {
  return new Log(filename);
};
