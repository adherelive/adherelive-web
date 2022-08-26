// import React, { Component, Fragment } from "react";
// import { Form, Button, Input, message, Radio } from "antd";
// import moment from "moment";
// import participantsField from "../common/participants";
// import startTimeField from "../common/startTime";

// import RepeatFields from "../common/repeatFields";

// import repeatField from "../common/repeatType";
// import repeatIntervalField from "../common/repeatInterval";
// import repeatDaysField from "../common/selectedDays";
// import startDateField from "../common/startDate";
// import endDateField from "../common/endDate";
// import chooseMedicationField from "../common/medicine";

// import medicineStrengthField from "../common/medicineStrength";
// import criticalMedicationField from "../common/criticalMedication";
// import medicineStrengthUnitField from "../common/medicationStrengthUnit";
// import medicineQuantityField from "../common/medicineQuantity";
// import whenToTakeMedicineField from "../common/whenTotakeMedicaine";
// import instructions from "../common/instructions";
// import formulation from "../common/formulation";

// import messages from "../message";
// import { hasErrors, isNumber } from "../../../../Helper/validation";
// import {
//   REPEAT_TYPE,
//   USER_CATEGORY,
//   DAYS_NUMBER,
//   TABLET,
//   MEDICINE_UNITS,
// } from "../../../../constant";

// const InputGroup = Input.Group;
// const { Item: FormItem } = Form;

// const UNIT_FIELD = "unit";

// const UNIT_ML = "ml";

// const UNIT_MG = "mg";

// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;

// class AddMedicationReminderForm extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   componentDidMount() {
//     this.scrollToTop();
//     const {
//       form: { validateFields },
//       // currentUser: {
//       //   basicInfo: { _id, category },
//       //   programId = []
//       // },
//       fetchMedicationStages,
//       fetchProgramProducts,
//     } = this.props;
//     const { programId } = [];
//     const { _id } = "23";
//     const { category } = "PATIENT";
//     validateFields();

//     if (category === USER_CATEGORY.PATIENT) {
//       fetchProgramProducts(programId[0]);
//       fetchMedicationStages(_id).then((response) => {
//         const { status, payload } = response;
//         if (status) {
//           const {
//             data: { medicationStages = [], program_has_medication_stage } = {},
//           } = payload;
//           if (medicationStages.length > 0) {
//             this.setState({
//               medicationStages: medicationStages,
//               program_has_medication_stage,
//             });
//           } else {
//             this.setState({
//               medicationStages: [],
//               program_has_medication_stage,
//             });
//           }
//         }
//       });
//     }
//   }

//   scrollToTop = () => {
//     let antForm = document.getElementsByClassName("Form")[0];
//     let antDrawerBody = antForm.parentNode;
//     let antDrawerWrapperBody = antDrawerBody.parentNode;
//     antDrawerBody.scrollIntoView(true);
//     antDrawerWrapperBody.scrollTop -= 200;
//   };

//   formatMessage = (data) => this.props.intl.formatMessage(data);

//   handleCancel = (e) => {
//     if (e) {
//       e.preventDefault();
//     }
//     const { close } = this.props;
//     close();
//   };

//   getNewEndDate = (repeatValue) => {
//     const {
//       form: { getFieldValue },
//     } = this.props;

//     let repeat = getFieldValue(repeatField.field_name);

//     let selectedDays = getFieldValue(repeatDaysField.field_name);
//     let repeatInterval = getFieldValue(repeatIntervalField.field_name);

//     if (repeatValue) {
//       repeatInterval = repeatValue;
//     }

//     // if(!repeat){

//     // }

//     const startDate = getFieldValue(startDateField.field_name);
//     let startDateDay = startDate
//       ? moment(startDate).format("ddd")
//       : moment().format("ddd");
//     let startDayNumber = DAYS_NUMBER[startDateDay];
//     let dayDiffPos = 0;
//     let dayDiffNeg = 0;
//     let daysToAdd = 0;
//     if (selectedDays.length) {
//       // if (selectedDays.length === 1) {
//       //   selectedDays = [selectedDays];
//       // }
//       selectedDays = selectedDays.split(",");
//       for (let day of selectedDays) {
//         let dayNo = DAYS_NUMBER[day];
//         let dayDiff = dayNo - startDayNumber;

//         dayDiffPos =
//           dayDiffPos === 0 && dayDiff > 0
//             ? dayDiff
//             : dayDiff > 0 && dayDiff < dayDiffPos
//             ? dayDiff
//             : dayDiffPos;
//         dayDiffNeg =
//           dayDiffNeg === 0 && dayDiff < 0
//             ? dayDiff
//             : dayDiff < 0 && Math.abs(dayDiff) > Math.abs(dayDiffNeg)
//             ? dayDiff
//             : dayDiffNeg;
//       }

//       daysToAdd = dayDiffPos ? dayDiffPos : 7 + dayDiffNeg;
//     }

//     let newEndDate;

//     const startDateCopy = startDate.clone().endOf("day");

//     const res = isNumber(repeatInterval);
//     if (repeat === REPEAT_TYPE.DAILY || res.valid === true) {
//       switch (repeat) {
//         case REPEAT_TYPE.DAILY: {
//           newEndDate = startDateCopy.add(1, "d");
//           break;
//         }
//         case REPEAT_TYPE.WEEKLY: {
//           newEndDate = startDateCopy.add(res.value, "w");
//           break;
//         }
//         case REPEAT_TYPE.MONTHLY: {
//           newEndDate = startDateCopy.add(res.value, "M");
//           break;
//         }
//         case REPEAT_TYPE.YEARLY: {
//           newEndDate = startDateCopy.add(res.value, "y");
//           break;
//         }
//         default:
//           break;
//       }
//     }

//     if (!newEndDate) {
//       newEndDate = startDateCopy;
//     }

//     return moment(newEndDate).add(daysToAdd, "days");
//   };

//   adjustEndDate = (repeatValue) => {
//     const {
//       form: { setFieldsValue },
//     } = this.props;
//     const endDate = this.getNewEndDate(repeatValue);
//     if (endDate) {
//       setFieldsValue({ [endDateField.field_name]: endDate });
//     }
//   };

//   adjustEventOnStartDateChange = (prevDate) => {
//     const {
//       form: { getFieldValue, setFieldsValue, validateFields },
//     } = this.props;

//     const eventStartTime = getFieldValue(startTimeField.field_name);

//     if (prevDate.isSame(eventStartTime, "date")) {
//       return;
//     }

//     const startDate = getFieldValue(startDateField.field_name);

//     const newMonth = startDate.get("month");
//     const newDate = startDate.get("date");
//     const newYear = startDate.get("year");

//     let newEventStartTime;

//     if (eventStartTime) {
//       newEventStartTime = eventStartTime
//         .clone()
//         .set({ month: newMonth, year: newYear, date: newDate });
//     }

//     setFieldsValue({
//       [startTimeField.field_name]: newEventStartTime,
//     });
//     // this.adjustEndDate();
//     validateFields([startTimeField.field_name]);
//   };

//   onChangeEventStartTime = (startTime) => {};

//   onStartDateChange = (currentDate) => {
//     const {
//       form: { setFieldsValue },
//     } = this.props;

//     if (currentDate && currentDate.isValid) {
//       setFieldsValue({ [startDateField.field_name]: currentDate });
//       this.adjustEventOnStartDateChange();
//     }
//   };

//   disabledStartDate = (current) => {
//     // Can not select days before today
//     return current && current <= moment().subtract({ day: 1 });
//   };

//   disabledEndDate = (current) => {
//     const endDate = this.getNewEndDate();
//     if (endDate) {
//       return current && current < endDate;
//     }
//   };

//   onEndDateChange = () => {};

//   onStartTimeChange = () => {};

//   onEndTimeChange = () => {};

//   onEventDurationChange = (start, end) => {
//     const {
//       form: { setFieldsValue, validateFields },
//     } = this.props;
//     setFieldsValue({
//       [startTimeField.field_name]: start,
//     });
//     validateFields([startTimeField.field_name]);
//   };

//   onPrev = () => {
//     const {
//       form: { getFieldValue, setFieldsValue },
//     } = this.props;
//     const startDate = getFieldValue(startDateField.field_name);
//     if (startDate !== null) {
//       const newStartDate = startDate.clone().subtract(1, "days");
//       setFieldsValue({ [startDateField.field_name]: newStartDate });
//       this.adjustEventOnStartDateChange();
//     }
//   };

//   onNext = () => {
//     const {
//       form: { getFieldValue, setFieldsValue },
//     } = this.props;
//     const startDate = getFieldValue(startDateField.field_name);
//     if (startDate !== null) {
//       const newStartDate = startDate.clone().add(1, "days");
//       setFieldsValue({ [startDateField.field_name]: newStartDate });
//       this.adjustEventOnStartDateChange();
//     }
//   };

//   getOtherUser = () => {
//     const {
//       form: { getFieldValue },
//       members = [],
//     } = this.props;
//     let otherUser;

//     const otherUserId = getFieldValue(participantsField.field_name);
//     const n = members.length;
//     for (let i = 0; i < n; i++) {
//       const member = members[i] || {};
//       const {
//         basicInfo: { _id },
//       } = member;
//       if (otherUserId === _id) {
//         otherUser = member;
//         break;
//       }
//     }

//     return otherUser;
//   };

//   addMedicationReminder = (e) => {
//     e.preventDefault();
//     const {
//       form: { validateFields },
//       addMedicationReminder,
//       payload: { patient_id = "2" } = {},
//     } = this.props;
//     validateFields(async (err, values) => {
//       if (!err) {
//         let data_to_submit = {};
//         const startTime = values[startTimeField.field_name];
//         const startDate = values[startDateField.field_name];
//         const endDate = values[endDateField.field_name];
//         const repeatDays = values[repeatDaysField.field_name];
//         const critical = values[criticalMedicationField.field_name];
//         data_to_submit = {
//           ...values,
//           id: patient_id,

//           repeat: "weekly",
//           critical: critical,
//           [startTimeField.field_name]:
//             startTime && startTime !== null
//               ? startTime.startOf("minute").toISOString()
//               : startTime,
//           [startDateField.field_name]:
//             startDate && startDate !== null
//               ? startDate.clone().startOf("day").toISOString()
//               : startDate,
//           [endDateField.field_name]:
//             endDate && endDate !== null
//               ? endDate.clone().endOf("day").toISOString()
//               : endDate,
//         };

//         if (repeatDays) {
//           data_to_submit = {
//             ...data_to_submit,
//             [repeatDaysField.field_name]: repeatDays.split(","),
//           };
//         }
//         try {
//           const response = await addMedicationReminder(data_to_submit);
//           const { status, payload: { message: msg } = {} } = response;
//           if (status === true) {
//             message.success(msg);
//           } else {
//             message.error(msg);
//           }
//         } catch (error) {}
//       }
//     });
//   };

//   // onPatientChange = () => {
//   //   const {
//   //     form: { setFieldsValue },
//   //     fetchProgramProducts,
//   //     fetchMedicationStages
//   //   } = this.props;

//   //   const otherUser = this.getOtherUser();

//   //   if (otherUser) {
//   //     const {
//   //       basicInfo: { _id },
//   //       programId = []
//   //     } = otherUser;
//   //     fetchProgramProducts(programId[0]);
//   //     fetchMedicationStages(_id).then(response => {
//   //       const { status, payload } = response;
//   //       if (status) {
//   //         const {
//   //           data: { medicationStages = [], program_has_medication_stage } = {}
//   //         } = payload;
//   //         if (medicationStages.length > 0) {
//   //           this.setState({
//   //             medicationStages: medicationStages,
//   //             program_has_medication_stage
//   //           });
//   //         } else {
//   //           this.setState({
//   //             medicationStages: [],
//   //             program_has_medication_stage
//   //           });
//   //         }
//   //       }
//   //     });
//   //     setFieldsValue({ [chooseMedicationField.field_name]: null });
//   //   }
//   // };

//   getFooter = () => {
//     const {
//       form: { getFieldsError },
//       requesting,
//     } = this.props;
//     const { formatMessage } = this;

//     return (
//       <div className="footer">
//         <div className="flex fr h100">
//           <FormItem className="m0">
//             <Button
//               className="ant-btn ant-btn-primary pr30 pl30 mt46"
//               type="primary"
//               htmlType="submit"
//               loading={requesting}
//               disabled={hasErrors(getFieldsError())}
//             >
//               {formatMessage(messages.addMedicationReminder)}
//             </Button>
//           </FormItem>
//         </div>
//       </div>
//     );
//   };

//   setUnit = (e) => {
//     e.preventDefault();
//     const {
//       form: { setFieldsValue },
//     } = this.props;

//     setFieldsValue({ [UNIT_FIELD]: e.target.value });
//   };

//   setEndDateOneWeek = (e) => {
//     e.preventDefault();
//     const {
//       form: { setFieldsValue, getFieldValue },
//     } = this.props;

//     const startDate = getFieldValue(startDateField.field_name);
//     let newEndDate = moment(startDate).add(1, "week");
//     setFieldsValue({
//       [endDateField.field_name]: newEndDate,
//     });
//   };

//   setEndDateTwoWeek = (e) => {
//     e.preventDefault();
//     const {
//       form: { setFieldsValue, getFieldValue },
//     } = this.props;

//     const startDate = getFieldValue(startDateField.field_name);
//     let newEndDate = moment(startDate).add(2, "week");
//     setFieldsValue({
//       [endDateField.field_name]: newEndDate,
//     });
//   };

//   setEndDateLongTime = (e) => {
//     e.preventDefault();
//     const {
//       form: { setFieldsValue },
//     } = this.props;

//     setFieldsValue({
//       [endDateField.field_name]: null,
//     });
//   };

//   // setFormulation = (value) => {
//   //   const {
//   //     form: { setFieldsValue },
//   //     medicines
//   //   } = this.props;
//   //   // const { basic_info: { type = '' } = {} } = medicines[value] || {};
//   //
//   //   setFieldsValue({
//   //     [formulation.field_name]: TABLET
//   //   });
//   // };

//   setUnitByMedicineType = (unit) => {
//     const {
//       form: { setFieldsValue },
//     } = this.props;
//     setFieldsValue({ [UNIT_FIELD]: unit });
//   };

//   setStrength = (e) => {
//     e.preventDefault();
//     const {
//       form: { setFieldsValue, getFieldValue, validateFields },
//       enableSubmit,
//     } = this.props;
//     const currentValue = getFieldValue(medicineStrengthField.field_name) || 0.0;
//     console.log("currentValue", currentValue);

//     console.log("e.target.value", e.target.value);

//     if (e.target.value == 1) {
//       setFieldsValue({
//         [medicineStrengthField.field_name]: 1,
//       });
//     } else if (e.target.value != 1) {
//       setFieldsValue({
//         [medicineStrengthField.field_name]:
//           parseFloat(currentValue) + parseFloat(e.target.value),
//       });
//     }

//     validateFields([medicineStrengthField.field_name]);
//   };

//   render() {
//     const {
//       disabledEndDate,
//       disabledStartDate,
//       adjustEndDate,
//       adjustEventOnStartDateChange,
//       onPatientChange,
//       formatMessage,
//       setFormulation,
//       setUnit,
//       setEndDateOneWeek,
//       setEndDateTwoWeek,
//       setEndDateLongTime,
//       setStrength,
//     } = this;

//     const {
//       form: { getFieldValue },
//       medicines,
//     } = this.props;

//     const otherUser = this.getOtherUser();

//     const startTime = getFieldValue(startTimeField.field_name);

//     let medicineUnit = getFieldValue(medicineStrengthUnitField.field_name);

//     let endTime;

//     if (startTime && startTime.isValid) {
//       endTime = startTime.clone().add("minutes", 3);
//     }

//     const currentMLCalibValue =
//       getFieldValue(medicineStrengthField.field_name) || 0.0;

//     // const startDate = getFieldValue(startDateField.field_name);

//     return (
//       <Fragment>
//         <Form className="event-form pb80 wp100 Form">
//           {/* {participantsField.render({
//             ...this.props,
//             otherUser,
//             onPatientChange
//           })}
//           {medicationReminderStageField.render({
//             ...this.props,
//             ...this.state
//           })} */}

//           {chooseMedicationField.render({ ...this.props, otherUser })}
//           {criticalMedicationField.render(this.props)}
//           {formulation.render(this.props)}

//           {/* <div className="flex align-items-end justify-content-space-between">
//             <label
//               for="dose"
//               className="form-label flex-grow-1"
//               title="Dose"
//             >
//               {formatMessage(messages.dose)}
//             </label>
//           </div> */}

//           <div className="flex align-items-end justify-content-space-between">
//             <div className="flex direction-row flex-grow-1">
//               <label htmlFor="dose" className="form-label" title="Dose">
//                 {formatMessage(messages.dose)}
//               </label>

//               <div className="star-red">*</div>
//             </div>
//             {/* <div className="label-color fontsize12 mb8">

//             </div> */}
//             <div className="mg-ml-radio-group flex-grow-0">
//               <RadioGroup
//                 buttonStyle="solid"
//                 size="small"
//                 className="mg-ml flex justify-content-end"
//               >
//                 <RadioButton
//                   value={1}
//                   className={
//                     medicineUnit !== MEDICINE_UNITS.MG
//                       ? `unselected-text no-shadow`
//                       : "no-shadow"
//                   }
//                   onClick={setStrength}
//                   checked={medicineUnit === MEDICINE_UNITS.MG}
//                   disabled={medicineUnit !== MEDICINE_UNITS.MG}
//                 >
//                   One
//                 </RadioButton>
//                 <RadioButton
//                   value={MEDICINE_UNITS.ML}
//                   className={
//                     medicineUnit !== MEDICINE_UNITS.ML
//                       ? `unselected-text no-shadow`
//                       : "no-shadow"
//                   }
//                   onClick={setUnit}
//                   checked={medicineUnit === MEDICINE_UNITS.ML}
//                   disabled={medicineUnit !== MEDICINE_UNITS.ML}
//                 >
//                   ml
//                 </RadioButton>
//                 <RadioButton
//                   value={MEDICINE_UNITS.MG}
//                   className={
//                     medicineUnit !== MEDICINE_UNITS.MG
//                       ? `unselected-text no-shadow`
//                       : "no-shadow"
//                   }
//                   onClick={setUnit}
//                   checked={medicineUnit === MEDICINE_UNITS.MG}
//                   disabled={medicineUnit !== MEDICINE_UNITS.MG}
//                 >
//                   mg
//                 </RadioButton>
//                 {medicineUnit !== MEDICINE_UNITS.MG && (
//                   <RadioButton
//                     value={5}
//                     className={
//                       medicineUnit !== MEDICINE_UNITS.ML
//                         ? `unselected-text no-shadow`
//                         : "no-shadow"
//                     }
//                     onClick={setStrength}
//                     checked={medicineUnit === MEDICINE_UNITS.ML}
//                     disabled={medicineUnit !== MEDICINE_UNITS.ML}
//                   >
//                     +5
//                   </RadioButton>
//                 )}
//                 {medicineUnit !== MEDICINE_UNITS.MG && (
//                   <RadioButton
//                     value={-5}
//                     className={
//                       medicineUnit !== MEDICINE_UNITS.ML
//                         ? `unselected-text no-shadow`
//                         : "no-shadow"
//                     }
//                     onClick={setStrength}
//                     checked={medicineUnit === MEDICINE_UNITS.ML}
//                     disabled={
//                       medicineUnit !== MEDICINE_UNITS.ML ||
//                       currentMLCalibValue <= 5
//                     }
//                   >
//                     -5
//                   </RadioButton>
//                 )}
//                 {medicineUnit !== MEDICINE_UNITS.ML && (
//                   <RadioButton
//                     value={50}
//                     className={
//                       medicineUnit !== MEDICINE_UNITS.MG
//                         ? `unselected-text no-shadow`
//                         : "no-shadow"
//                     }
//                     onClick={setStrength}
//                     checked={medicineUnit === MEDICINE_UNITS.MG}
//                     disabled={medicineUnit !== MEDICINE_UNITS.MG}
//                   >
//                     +50
//                   </RadioButton>
//                 )}
//               </RadioGroup>
//             </div>
//           </div>
//           {/* <span className="form-label flex-grow-1">Dose</span> */}
//           <InputGroup compact>
//             {medicineStrengthField.render(this.props)}
//             {medicineStrengthUnitField.render(this.props)}
//           </InputGroup>

//           {medicineUnit !== MEDICINE_UNITS.ML && (
//             <div id="quantity">{medicineQuantityField.render(this.props)}</div>
//           )}

//           {/*<div id="timing"></div>*/}

//           {whenToTakeMedicineField.render(this.props)}

//           <RepeatFields
//             {...this.props}
//             formatMessage={formatMessage}
//             adjustEventOnStartDateChange={adjustEventOnStartDateChange}
//             disabledEndDate={disabledEndDate}
//             disabledStartDate={disabledStartDate}
//             adjustEndDate={adjustEndDate}
//             setEndDateOneWeek={setEndDateOneWeek}
//             setEndDateTwoWeek={setEndDateTwoWeek}
//             setEndDateLongTime={setEndDateLongTime}
//           />

//           {instructions.render(this.props)}
//           {/*{getFooter()}*/}
//         </Form>
//       </Fragment>
//     );
//   }
// }

// export default AddMedicationReminderForm;
