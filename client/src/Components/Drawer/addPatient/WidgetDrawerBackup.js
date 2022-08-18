// import React, { Component, Fragment, useState } from "react";
// import { injectIntl } from "react-intl";
// import {
//   Drawer,
//   Icon,
//   Select,
//   Input,
//   message,
//   Button,
//   Spin,
//   Radio,
//   DatePicker,
// } from "antd";
// import { Checkbox, Row, Col } from "antd";

// // import { CONSULTATION_FEE_TYPE_TEXT } from "../../../constant";

// import moment from "moment";
// import throttle from "lodash-es/throttle";

// // import messages from "./message";
// import Footer from "../footer";
// import { durations } from "./durationList.json";

// const { Option } = Select;

// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;

// const bodyPartsOptions = [
//   { label: "Generalised", value: "Generalised" },
//   { label: "Head", value: "Head" },
//   { label: "Left Eye", value: "Left Eye" },
//   { label: "Right Eye", value: "Right Eye" },
//   { label: "Right Ear", value: "Right Ear" },
//   { label: "Left Ear", value: "Left Ear" },
//   { label: "Nose", value: "Nose" },
//   { label: "Mouth", value: "Mouth" },
//   { label: "Neck", value: "Neck" },
//   { label: "Right Shoulder", value: "Right Shoulder" },
//   { label: "Left Shoulder", value: "Left Shoulder" },
//   { label: "Chest", value: "Chest" },
//   { label: "Right Arm", value: "Right Arm" },
//   { label: "Left Arm", value: "Left Arm" },
//   { label: "Right Elbow", value: "Right Elbow" },
//   { label: "Left Elbow", value: "Left Elbow" },
//   { label: "Stomach", value: "Stomach" },
//   { label: "Abdomen", value: "Abdomen" },
//   { label: "Right Forearm", value: "Right Forearm" },
//   { label: "Left Forearm", value: "Left Forearm" },
//   { label: "Right Wrist", value: "Right Wrist" },
//   { label: "Left Wrist", value: "Left Wrist" },
//   { label: "Right Hand", value: "Right Hand" },
//   { label: "Left Hand", value: "Left Hand" },
//   { label: "Right Hand Finger", value: "Right Hand Finger" },
//   { label: "Left Hand Finger", value: "Left Hand Finger" },
//   { label: "Right Hip", value: "Right Hip" },
//   { label: "Left Hip", value: "Left Hip" },
//   { label: "Right Thigh", value: "Right Thigh" },
//   { label: "Left Thigh", value: "Left Thigh" },
//   { label: "Right Knee", value: "Right Knee" },
//   { label: "Left Knee", value: "Left Knee" },
//   { label: "Right Shin", value: "Right Shin" },
//   { label: "Left Shin", value: "Left Shin" },
//   { label: "Right Ankle", value: "Right Ankle" },
//   { label: "Left Ankle", value: "Left Ankle" },
//   { label: "Right Foot", value: "Right Foot" },
//   { label: "Left Foot", value: "Left Foot" },
//   { label: "Right Toe", value: "Right Toe" },
//   { label: "Left Toe", value: "Left Toe" },
//   { label: "Urinary Bladder", value: "Urinary Bladder" },
//   { label: "Back", value: "Back" },
//   { label: "Lower Back", value: "Lower Back" },
//   { label: "Left Tricep", value: "Left Tricep" },
//   { label: "Right Tricep", value: "Right Tricep" },
//   { label: "Left Hamstring", value: "Left Hamstring" },
//   { label: "Right Hamstring", value: "Right Hamstring" },
//   { label: "Left Calf", value: "Left Calf" },
//   { label: "Right Calf", value: "Right Calf" },
// ];

// function WidgetDrawer({
//   visible,
//   onCloseDrawer,
//   finalSymptomData,
//   generateFinalSymptomData,
//   selectedSymptom,
// }) {
//   const [values, setValues] = useState({
//     duration: "1 Day",
//     submitting: false,
//     bodyParts: ["Generalised"],
//   });

//   const onSubmit = () => {
//     const { duration, bodyParts } = values;
//     // console.log(finalSymptomData);
//     let data = finalSymptomData;

//     data.forEach((symptom) => {
//       if (symptom.symptomName === selectedSymptom) {
//         symptom.duration = values.duration;
//         symptom.bodyParts = values.bodyParts;
//       }
//     });

//     generateFinalSymptomData(data);

//     onCloseDrawer();
//   };

//   // formatMessage = (data) => this.props.intl.formatMessage(data);

//   const onClose = () => {};

//   const setDuration = (value) => {
//     setValues({
//       ...values,
//       duration: value,
//     });
//   };

//   const getDurationOptions = () => {
//     let options = [];
//     durations.forEach((service) => {
//       options.push(
//         <Option key={service.id} value={service.name}>
//           {service.name}
//         </Option>
//       );
//     });

//     return options;
//   };

//   const onChangeCheckbox = (checkedValues) => {
//     // console.log("checked = ", checkedValues);
//     setValues({
//       ...values,
//       bodyParts: checkedValues,
//     });
//   };

//   const renderWidgetForm = () => {
//     const { duration = "" } = values;

//     return (
//       <div className="form-block-ap">
//         <div
//           className="form-headings
//                 //    flex align-center justify-start
//                    tac"
//         >
//           <span className="fwbolder fs18 mb10">
//             {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
//             Body Parts
//           </span>
//         </div>
//         <div className="mb10">
//           <Checkbox.Group
//             style={{ width: "100%" }}
//             onChange={onChangeCheckbox}
//             defaultValue={["Generalised"]}
//           >
//             <Row>
//               {bodyPartsOptions.map((part, index) => {
//                 return (
//                   <Col
//                     style={
//                       part.value === "Generalised"
//                         ? { position: "absolute", top: "-35px", left: "143px" }
//                         : {}
//                     }
//                     key={index}
//                     span={8}
//                   >
//                     <Checkbox value={part.value}>{part.value}</Checkbox>
//                   </Col>
//                 );
//               })}
//             </Row>
//           </Checkbox.Group>
//         </div>

//         <div
//           className="form-headings
//                 //    flex align-center justify-start
//                    tac"
//         >
//           <span className="fwbolder fs18 ">
//             {/* {this.formatMessage(messages.defaultConsultationOptions)} */}
//             Duration
//           </span>
//         </div>

//         <Select
//           showSearch
//           placeholder="Select Duration"
//           className="form-inputs-ap drawer-select"
//           value={duration}
//           onChange={setDuration}
//           autoComplete="off"
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             option.props.children
//               .toLowerCase()
//               .indexOf(input.trim().toLowerCase()) >= 0
//           }
//         >
//           {getDurationOptions()}
//         </Select>
//       </div>
//     );
//   };

//   return (
//     // const { consultation, submitting } = this.state;

//     <Fragment>
//       <Drawer
//         title={"Widget Form"}
//         placement="right"
//         maskClosable={false}
//         headerStyle={{
//           position: "sticky",
//           zIndex: "9999",
//           top: "0px",
//         }}
//         destroyOnClose={true}
//         onClose={onCloseDrawer}
//         visible={visible} // todo: change as per state, -- WIP --
//         width={480}
//       >
//         {renderWidgetForm()}

//         <Footer
//           onSubmit={onSubmit}
//           onClose={onClose}
//           // submitText={this.formatMessage(messages.submit)}
//           submitText={"Submit"}
//           submitButtonProps={{}}
//           cancelComponent={null}
//           submitting={values.submitting}
//         />
//       </Drawer>
//     </Fragment>
//   );
// }

// export default WidgetDrawer;
