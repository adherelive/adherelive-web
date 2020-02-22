const io = require("socket.io");
const Log = require("./log")("lib:socketServer");

class socketServer {
  constructor(port = 8000) {
    this._io = io;
    this._port = port;
  }

  start() {
    try {
      Log.info(`starting socket server at ${this._port}`);
      this._io.listen(this._port);
      Log.success(`socket server started successfully at port:${this._port}`);
    } catch (err) {
      Log.warn(err);
    }
  }

  getIO() {
    return this._io;
  }

  // getSocketClients() {
  //   let current = this;
  //   return new Promise((resolve, reject) => {
  //     current._io.on("connection", client => {
  //       client.on("connection_error", error => {
  //         reject(error);
  //         return;
  //       });
  //       client.on("connection_timeout", timeout => {
  //         reject(timeout);
  //         return;
  //       });
  //       client.on("error", error => {
  //         reject(error);
  //         return;
  //       });
  //       resolve(client);
  //       return;
  //     });
  //   });
  // }
}

module.exports = socketServer;
