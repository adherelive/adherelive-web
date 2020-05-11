import {
  onCreate,
  onAdverseEventCreate,
  onComplete,
  onCancel,
  onReschedule,
  onStart
} from "../helper";
import { ACTIVITIES } from "../activityType";

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
