import {
    onCreate,
    onPrior,
    onComplete,
    onCancel,
    onRescheduled,
    onStart,
    onUpdate,
    onPassed,
    onMarkInComplete
} from "../helper";
import {ACTIVITIES} from "../activityType";

const {ActivitySdk} = require("../");
const {FOLLOW_UP} = ACTIVITIES;

class FollowUpActivity {
    constructor({}) {
        this._event = ActivitySdk;
    }

    async create(data) {
        //do preProcessing task of create followupActivity
        const response = await onCreate(data);
        //do postProcessing task of create followUpActivity
    }

    async prior(data) {
        //do preProcessing task
        const response = await onPrior(data);
        //do postProcessing task
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

    async markedInComplete(data) {
        //do preProcessing task
        const response = await onMarkInComplete(data);
        //do postProcessing task
    }

    async editNotes(data) {
        //do preProcessing task
        const response = await onUpdate(data);
        //do postProcessing task
    }

    //define activity specific task here
    async extraActivity1() {
    }

    runObservers() {
        this._event.on(FOLLOW_UP.INIT, this.create);
        this._event.on(FOLLOW_UP.PRIOR, this.prior);
        this._event.on(FOLLOW_UP.STARTED, this.start);
        this._event.on(FOLLOW_UP.PASSED, this.passed);
        this._event.on(FOLLOW_UP.RESCHEDULE, this.reschedule);
        this._event.on(FOLLOW_UP.COMPLETE, this.complete);
        this._event.on(FOLLOW_UP.CANCEL, this.cancel);
        this._event.on(FOLLOW_UP.IN_COMPLETE, this.markedInComplete);
        this._event.on(FOLLOW_UP.EDIT_NOTES, this.editNotes);
    }
}

export default new FollowUpActivity({});
