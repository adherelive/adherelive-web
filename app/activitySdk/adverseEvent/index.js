import { onAdverseEventCreate, } from "../helper";
import { ACTIVITIES } from "../activityType";

// TODO: Going back to require, as the module export is used
// import ActivitySdk from "../index";
const { ActivitySdk } = require("../");

const { ADVERSE_EVENT } = ACTIVITIES;

class AdverseEventActivity {
  constructor({}) {
    this._event = ActivitySdk;
  }

  async create(data) {
    //do preProcessing task of create followupActivity
    const response = await onAdverseEventCreate(data);
    //do postProcessing task of create followUpActivity
  }

  runObservers() {
    this._event.on(ADVERSE_EVENT.INIT, this.create);
  }
}

export default new AdverseEventActivity({});
