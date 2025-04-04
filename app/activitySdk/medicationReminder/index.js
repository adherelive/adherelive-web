import { onCancel, onComplete, onCreate, onPassed, onRescheduled, onStart, onUpdate, } from "../helper";
import { ACTIVITIES } from "../activityType";

// TODO: Going back to require, as the module export is used
// import ActivitySdk from "../index";
const { ActivitySdk } = require("../");

const { MEDICATION_REMINDER } = ACTIVITIES;

class MedicationReminderActivity {
  constructor({}) {
    this._event = ActivitySdk;
  }

  async create(data) {
    //do preProcessing task of create followupActivity
    const response = await onCreate(data);
    //do postProcessing task of create followUpActivity
  }

  async start(data) {
    //do preProcessing task
    const response = await onStart(data);
    //do postProcessing task
  }

  async cancel(data) {
    //do preProcessing task
    const response = await onCancel(data);
    //do postProcessing task
  }

  async update(data) {
    //do preProcessing task
    const response = await onUpdate(data);
    //do postProcessing task
  }

  async passed(data) {
    //do preProcessing task
    const response = await onPassed(data);
    //do postProcessing task
  }

  async reschedule(data) {
    //do preProcessing task
    const response = await onRescheduled(data);
    //do postProcessing task
  }

  async complete(data) {
    //do preProcessing task
    const response = await onComplete(data);
    //do postProcessing task
  }

  async editNotes(data) {
    //do preProcessing task
    const response = await onUpdate(data);
    //do postProcessing task
  }

  //define activity specific task here
  async extraActivity1() {}

  runObservers() {
    this._event.on(MEDICATION_REMINDER.INIT, this.create);
    this._event.on(MEDICATION_REMINDER.STARTED, this.start);
    this._event.on(MEDICATION_REMINDER.PASSED, this.passed);
    this._event.on(MEDICATION_REMINDER.RESCHEDULE, this.reschedule);
    this._event.on(MEDICATION_REMINDER.COMPLETE, this.complete);
    this._event.on(MEDICATION_REMINDER.CANCEL, this.cancel);
    this._event.on(MEDICATION_REMINDER.EDIT_NOTES, this.editNotes);
  }
}

export default new MedicationReminderActivity({});
