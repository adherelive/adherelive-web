import chalk from "chalk";
import moment from "moment";
import os from "os";

// Add environment checks
const isDevelopment =
    process.env.APP_ENV === 'Development' ||
    process.env.NODE_ENV === 'development';

// Define log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

class Log {
  constructor(filename) {
    this.source = filename;
    this._dashString = "-".repeat(106);
    // Set log level from environment
    this.logLevel = isDevelopment ? LOG_LEVELS.debug : LOG_LEVELS.warn;
  }

  // Add level checking method
  shouldLog(level) {
    return level <= this.logLevel;
  }

  // Modified debug method with environment check
  debug(msg, code) {
    if (!this.shouldLog(LOG_LEVELS.debug)) return;

    console.log(
        `${this._dashString}\n${this.getLogDate()} [${chalk.yellow(
            this.source
        )}]\n\nMESSAGE: ${msg}\n`,
        code
    );
  }

  // Modified info method
  info(msg) {
    if (!this.shouldLog(LOG_LEVELS.info)) return;

    console.log(
        `\n${chalk.blue(this.getLogDate())} ${chalk.blue(
            `( ${this.source} )`
        )} : ${msg}\n`
    );
  }

  // Modified warn method
  warn(msg) {
    if (!this.shouldLog(LOG_LEVELS.warn)) return;

    console.log(
        `\n${chalk.red(this.getLogDate())} ${chalk.red(
            `( ${this.source} )`
        )} : ${msg}\n`
    );
  }

  // Keep error logging always active
  error(msg) {
    console.log(
        `\n${chalk.redBright(this.getLogDate())} ${chalk.redBright(
            `( ${this.source} )`
        )} : ${msg}\n`
    );
  }

  // Add production-safe object inspection
  objectInfo(msg, obj) {
    if (!this.shouldLog(LOG_LEVELS.debug)) return;

    const data = Object.entries(obj)
        .map(([key, value]) => {
          const stringValue = typeof value === 'object'
              ? JSON.stringify(value, null, 2)
              : value;
          return `${key} : ${stringValue}`;
        })
        .join("\n");

    console.log(
        `${this.source} ${this.getLogDate()}\n\n${msg} ->\n\n${data}\n`
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


  // Keep error logging as-is (always active)
  errLog(errorCode, methodName, description) {
    var serverName = os.hostname();
    var logDate = this.getLogDate();
    var errLog = "\n\n";
    errLog += "\x1b[34m" + logDate + "\x1b[0m" + "\n";
    errLog += "\x1b[34m" + "errorCode= " + "\x1b[0m" + errorCode + "\n";
    errLog += "\x1b[34m" + "Server=" + "\x1b[0m" + serverName + "\n";
    errLog += "\x1b[34m" + "Application=" + "\x1b[0m" + "sendnotification" + "\n";
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
    var serverName = os.hostname();
    var logDate = this.getLogDate();
    var errLog = "\n\n";
    errLog += "\x1b[34m" + logDate + "\x1b[0m" + "\n";
    errLog += "\x1b[34m" + "errorCode= " + "\x1b[0m" + errorCode + "\n";
    errLog += "\x1b[34m" + "Server=" + "\x1b[0m" + serverName + "\n";
    errLog += "\x1b[34m" + "Application=" + "\x1b[0m" + "sendnotification" + "\n";
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

export default (filename) => new Log(filename);