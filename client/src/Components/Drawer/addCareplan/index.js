// import React, { Component, Fragment } from "react";
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
// import moment from "moment";
// import throttle from "lodash-es/throttle";
// import { getName } from "../../../Helper/validation";

// import messages from "./message";
// import "react-datepicker/dist/react-datepicker.css";
// import TextArea from "antd/lib/input/TextArea";
// import { FINAL, PROBABLE, DIAGNOSIS_TYPE } from "../../../constant";
// import Footer from "../footer";

// const { Option } = Select;

// class AddCareplanDrawer extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       treatment: "",
//       severity: "",
//       condition: "",
//       fetchingCondition: false,
//       fetchingTreatment: false,
//       fetchingSeverity: false,
//       clinical_notes: "",
//       diagnosis_description: "",
//       diagnosis_type: "2",
//       symptoms: "",
//       submitting: false,
//     };
//     this.handleConditionSearch = throttle(
//       this.handleConditionSearch.bind(this),
//       2000
//     );
//     this.handleTreatmentSearch = throttle(
//       this.handleTreatmentSearch.bind(this),
//       2000
//     );
//     this.handleSeveritySearch = throttle(
//       this.handleSeveritySearch.bind(this),
//       2000
//     );
//     this.handleConditionSearch = throttle(
//       this.handleConditionSearch.bind(this),
//       2000
//     );
//   }

//   componentDidMount() {}

//   componentDidUpdate(prevProps, prevState) {}

//   formatMessage = (data) => this.props.intl.formatMessage(data);

//   setClinicalNotes = (e) => {
//     const value = e.target.value.trim();

//     if (value.length > 0 || value === "") {
//       this.setState({ clinical_notes: e.target.value });
//     }
//   };

//   setSymptoms = (e) => {
//     const value = e.target.value.trim();

//     if (value.length > 0 || value === "") {
//       this.setState({ symptoms: e.target.value });
//     }
//   };

//   setPastedClinicalNotes = (e) => {
//     e.preventDefault();
//     let pastedValue = "";
//     if (typeof e.clipboardData !== "undefined") {
//       pastedValue = e.clipboardData.getData("text").trim();
//     }
//     if (pastedValue.length > 0 || pastedValue === "") {
//       this.setState({ clinical_notes: pastedValue });
//     }
//   };

//   setPastedSymptoms = (e) => {
//     e.preventDefault();
//     let pastedValue = "";
//     if (typeof e.clipboardData !== "undefined") {
//       pastedValue = e.clipboardData.getData("text").trim();
//     }
//     if (pastedValue.length > 0 || pastedValue === "") {
//       this.setState({ symptoms: pastedValue });
//     }
//   };

//   setDiagnosis = (e) => {
//     const value = e.target.value.trim();

//     if (value.length > 0 || value === "") {
//       this.setState({ diagnosis_description: e.target.value });
//     }
//   };

//   setPastedDiagnosis = (e) => {
//     e.preventDefault();
//     let pastedValue = "";
//     if (typeof e.clipboardData !== "undefined") {
//       pastedValue = e.clipboardData.getData("text").trim();
//     }
//     if (pastedValue.length > 0 || pastedValue === "") {
//       this.setState({ diagnosis_description: pastedValue });
//     }
//   };

//   setDiagnosisType = (value) => {
//     this.setState({ diagnosis_type: value });
//   };

//   setTreatment = (value) => {
//     this.setState({ treatment: value });
//   };

//   setSeverity = (value) => {
//     this.setState({ severity: value });
//   };

//   setCondition = async (value) => {
//     const { searchTreatment } = this.props;
//     this.setState({ condition: value });

//     const response = await searchTreatment(value);

//     const {
//       status,
//       payload: { data: { treatments = {} } = {}, message } = {},
//     } = response;
//     if (status) {
//       this.setState({ treatments, treatment: "" });
//     }
//   };

//   getTreatmentOption = () => {
//     let { treatments = {} } = this.props;
//     let newTreatments = [];
//     for (let treatment of Object.values(treatments)) {
//       let { basic_info: { id = 0, name = "" } = {} } = treatment;
//       newTreatments.push(
//         <Option key={id} value={id}>
//           {name}
//         </Option>
//       );
//     }
//     return newTreatments;
//   };

//   getSeverityOption = () => {
//     let { severity = {} } = this.props;
//     let newSeverity = [];
//     for (let sev of Object.values(severity)) {
//       let { basic_info: { id = 0, name = "" } = {} } = sev;
//       newSeverity.push(
//         <Option key={id} value={id}>
//           {name}
//         </Option>
//       );
//     }
//     return newSeverity;
//   };

//   getConditionOption = () => {
//     let { conditions = {} } = this.props;
//     let newConditions = [];
//     for (let condition of Object.values(conditions)) {
//       let { basic_info: { id = 0, name = "" } = {} } = condition;
//       newConditions.push(
//         <Option key={id} value={id}>
//           {name}
//         </Option>
//       );
//     }
//     return newConditions;
//   };

//   async handleConditionSearch(data) {
//     try {
//       if (data) {
//         const { searchCondition } = this.props;
//         this.setState({ fetchingCondition: true });
//         const response = await searchCondition(data);
//         const { status, payload: { data: responseData, message } = {} } =
//           response;
//         if (status) {
//           this.setState({ fetchingCondition: false });
//         } else {
//           this.setState({ fetchingCondition: false });
//         }
//       } else {
//         this.setState({ fetchingCondition: false });
//       }
//     } catch (err) {
//       console.log("err", err);
//       message.warn(this.formatMessage(messages.somethingWentWrong));
//       this.setState({ fetchingCondition: false });
//     }
//   }

//   async handleTreatmentSearch(data) {
//     try {
//       if (data) {
//         const { searchTreatment } = this.props;
//         this.setState({ fetchingTreatment: true });
//         const response = await searchTreatment(data);
//         const { status, payload: { data: treatments, message } = {} } =
//           response;
//         if (status) {
//           this.setState({ fetchingTreatment: false });
//         } else {
//           this.setState({ fetchingTreatment: false });
//         }
//       } else {
//         this.setState({ fetchingTreatment: false });
//       }
//     } catch (err) {
//       console.log("err", err);
//       message.warn(this.formatMessage(messages.somethingWentWrong));
//       this.setState({ fetchingCondition: false });
//     }
//   }

//   async handleSeveritySearch(data) {
//     try {
//       if (data) {
//         const { searchSeverity } = this.props;
//         this.setState({ fetchingSeverity: true });
//         const response = await searchSeverity(data);
//         const { status } = response;
//         if (status) {
//           this.setState({ fetchingSeverity: false });
//         } else {
//           this.setState({ fetchingSeverity: false });
//         }
//       } else {
//         this.setState({ fetchingSeverity: false });
//       }
//     } catch (err) {
//       console.log("err", err);
//       message.warn(this.formatMessage(messages.somethingWentWrong));
//       this.setState({ fetchingSeverity: false });
//     }
//   }

//   renderAddCareplan = () => {
//     let dtToday = new Date();

//     let month = dtToday.getMonth() + 1;
//     let day = dtToday.getDate();
//     let year = dtToday.getFullYear();

//     if (day < 10) {
//       day = "0" + day;
//     } else if (month < 10) {
//       month = "0" + month;
//     }

//     const {
//       condition = "",
//       diagnosis_description = "",
//       clinical_notes = "",
//       diagnosis_type = "2",
//       severity = "",
//       treatment = "",
//       symptoms = "",
//     } = this.state;

//     return (
//       <div className="form-block-ap ">
//         <div className="form-headings-ap flex align-center justify-start">
//           {this.formatMessage(messages.clinicalNotes)}
//         </div>

//         <TextArea
//           placeholder={this.formatMessage(messages.writeHere)}
//           value={clinical_notes}
//           className={"form-textarea-ap "}
//           onChange={this.setClinicalNotes}
//           onPaste={this.setPastedClinicalNotes}
//         />

//         <div className="form-headings-ap flex align-center justify-start">
//           {this.formatMessage(messages.symptoms)}
//         </div>

//         <TextArea
//           placeholder={this.formatMessage(messages.writeHere)}
//           value={symptoms}
//           className={"form-textarea-ap "}
//           onChange={this.setSymptoms}
//           onPaste={this.setPastedSymptoms}
//         />

//         <div className="form-headings-ap flex  justify-space-between">
//           <div className="flex direction-column align-center justify-center">
//             <div className="flex direction-row " key="diagnosis-h">
//               {this.formatMessage(messages.diagnosis)}
//               <div className="star-red">*</div>
//             </div>
//           </div>
//           <div>
//             <Select
//               key={`diagnonsis-${diagnosis_type}`}
//               value={diagnosis_type}
//               onChange={this.setDiagnosisType}
//             >
//               <Option
//                 value={DIAGNOSIS_TYPE[FINAL].diagnosis_type}
//                 key={`final-${DIAGNOSIS_TYPE[FINAL].diagnosis_type}`}
//               >
//                 {DIAGNOSIS_TYPE[FINAL].value}
//               </Option>

//               <Option
//                 value={DIAGNOSIS_TYPE[PROBABLE].diagnosis_type}
//                 key={`probable-${DIAGNOSIS_TYPE[PROBABLE].diagnosis_type}`}
//               >
//                 {DIAGNOSIS_TYPE[PROBABLE].value}
//               </Option>
//             </Select>
//           </div>
//         </div>

//         <TextArea
//           placeholder={this.formatMessage(messages.writeHere)}
//           value={diagnosis_description}
//           className={"form-textarea-ap"}
//           onChange={this.setDiagnosis}
//           onPaste={this.setPastedDiagnosis}
//         />

//         <div className="form-headings-ap flex align-center justify-start">
//           {this.formatMessage(messages.condition)}
//         </div>

//         <Select
//           className="form-inputs-ap drawer-select"
//           placeholder="Select Condition"
//           value={this.state.condition}
//           onChange={this.setCondition}
//           onSearch={this.handleConditionSearch}
//           notFoundContent={
//             this.state.fetchingCondition ? (
//               <Spin size="small" />
//             ) : (
//               "No match found"
//             )
//           }
//           showSearch
//           autoComplete="off"
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
//             0
//           }
//         >
//           {this.getConditionOption()}
//         </Select>

//         <div className="form-headings-ap  flex align-center justify-start">
//           {this.formatMessage(messages.severity)}
//         </div>

//         <Select
//           className="form-inputs-ap drawer-select"
//           placeholder="Select Severity"
//           value={severity}
//           onChange={this.setSeverity}
//           onSearch={this.handleSeveritySearch}
//           notFoundContent={
//             this.state.fetchingSeverity ? (
//               <Spin size="small" />
//             ) : (
//               "No match found"
//             )
//           }
//           showSearch
//           autoComplete="off"
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
//             0
//           }
//         >
//           {this.getSeverityOption()}
//         </Select>

//         <div className="form-headings-ap flex align-center justify-start">
//           {this.formatMessage(messages.treatment)}
//           <div className="star-red">*</div>
//         </div>

//         <Select
//           className="form-inputs-ap drawer-select"
//           placeholder="Select Treatment"
//           value={treatment}
//           onChange={this.setTreatment}
//           notFoundContent={
//             this.state.fetchingTreatment ? (
//               <Spin size="small" />
//             ) : (
//               "No match found"
//             )
//           }
//           showSearch
//           // onSearch={this.handleTreatmentSearch}
//           autoComplete="off"
//           optionFilterProp="children"
//           filterOption={(input, option) =>
//             option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
//             0
//           }
//         >
//           {this.getTreatmentOption()}
//         </Select>
//       </div>
//     );
//   };

//   validateData = () => {
//     const {
//       treatment = "",
//       diagnosis_description = "",
//       diagnosis_type = "",
//     } = this.state;
//     if (!treatment) {
//       message.error(this.formatMessage(messages.treatmentError));
//       return false;
//     } else if (!diagnosis_description) {
//       message.error(this.formatMessage(messages.diagnosisError));
//       return false;
//     } else if (!diagnosis_type) {
//       message.error(this.formatMessage(messages.diagnosisTypeError));
//       return false;
//     }

//     return true;
//   };

//   async handleDataSubmit(patient_id, data) {
//     const { addCareplanForPatient } = this.props;
//     const { close } = this.props;
//     this.setState({ submitting: true });
//     const response = await addCareplanForPatient(patient_id, data);
//     const {
//       status,
//       statusCode: code,
//       payload: { message: errorMessage = "", error: { error_type = "" } = {} },
//     } = response || {};
//     if (status === true) {
//       message.success(this.formatMessage(messages.add_careplan_success));
//       this.onClose();
//     } else {
//       if (code === 500) {
//         message.warn("Something went wrong, please try again.");
//       } else {
//         message.warn(errorMessage);
//       }
//     }
//     this.setState({ submitting: false });
//   }
//   onSubmit = () => {
//     const { addCareplanForPatient, patientId: patient_id } = this.props;
//     const {
//       treatment = "",
//       severity = "",
//       condition = "",
//       diagnosis_description = "",
//       diagnosis_type = "",
//       clinical_notes = "",
//       symptoms = "",
//     } = this.state;
//     const validate = this.validateData();
//     // const { submit } = this.props;

//     if (validate) {
//       // submit({  treatment_id: treatment, severity_id: severity, condition_id: condition, diagnosis_description,diagnosis_type,clinical_notes, symptoms})
//       const data = {
//         treatment_id: treatment,
//         severity_id: severity,
//         condition_id: condition,
//         diagnosis_description,
//         diagnosis_type,
//         clinical_notes,
//         symptoms,
//       };

//       try {
//         this.handleDataSubmit(patient_id, data);
//       } catch (error) {
//         this.setState({ submitting: false });
//         console.log("error", error);
//         message.warn(this.formatMessage(messages.somethingWentWrong));
//       }
//     }
//   };

//   onClose = () => {
//     const { close } = this.props;

//     this.setState({
//       treatment: "",
//       severity: "",
//       condition: "",
//       fetchingCondition: false,
//       fetchingTreatment: false,
//       fetchingSeverity: false,
//       clinical_notes: "",
//       diagnosis_description: "",
//       diagnosis_type: "2",
//       symptoms: "",
//     });
//     close();
//   };

//   render() {
//     const { visible } = this.props;
//     const { onClose, renderAddCareplan } = this;
//     const { submitting = false } = this.state;

//     if (visible !== true) {
//       return null;
//     }
//     return (
//       <Fragment>
//         <Drawer
//           title={this.formatMessage(messages.newTreatmentPlan)}
//           placement="right"
//           maskClosable={false}
//           headerStyle={{
//             position: "sticky",
//             zIndex: "9999",
//             top: "0px",
//           }}
//           onClose={onClose}
//           visible={visible} // todo: change as per state, -- WIP --
//           width={"35%"}
//         >
//           {renderAddCareplan()}

//           <Footer
//             onSubmit={this.onSubmit}
//             onClose={this.onClose}
//             submitText={this.formatMessage(messages.submit)}
//             submitButtonProps={{}}
//             cancelComponent={
//               <Button onClick={this.onClose} style={{ marginRight: 8 }}>
//                 {this.formatMessage(messages.cancel)}
//               </Button>
//             }
//             submitting={submitting}
//           />

//           {/* <div className='add-patient-footer'>
//                         <Button onClick={this.onClose} style={{ marginRight: 8 }}>
//                             {this.formatMessage(messages.cancel)}
//                         </Button>
//                         <Button onClick={this.onSubmit} type="primary">
//                             {this.formatMessage(messages.submit)}
//                         </Button>
//                     </div> */}
//         </Drawer>
//       </Fragment>
//     );
//   }
// }

// export default injectIntl(AddCareplanDrawer);

import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {
  Drawer,
  Icon,
  Select,
  Input,
  message,
  Button,
  Spin,
  Radio,
  DatePicker,
} from "antd";
import moment from "moment";
import throttle from "lodash-es/throttle";
import { getName } from "../../../Helper/validation";

import messages from "./message";
import "react-datepicker/dist/react-datepicker.css";
import TextArea from "antd/lib/input/TextArea";
import { FINAL, PROBABLE, DIAGNOSIS_TYPE } from "../../../constant";
import Footer from "../footer";

import { PlusCircleOutlined } from "@ant-design/icons";
import { MinusCircleOutlined } from "@ant-design/icons";
import isEmpty from "../../../Helper/is-empty";

// AKSHAY NEW CODE IMPLEMENTATIONS

import CustomSymptoms from "../addPatient/CustomSymptoms";
import CustomDiagnosis from "../addPatient/CustomDiagnosis";
import MultipleTreatmentAlert from "../addPatient/MultipleTreatmentAlert";
import WidgetDrawer from "../addPatient/WidgetDrawer";

const { Option } = Select;

class AddCareplanDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treatment: "",
      severity: "",
      condition: "",
      fetchingCondition: false,
      fetchingTreatment: false,
      fetchingSeverity: false,
      clinical_notes: "",
      diagnosis_description: "",
      diagnosis_type: "2",
      symptoms: "",
      submitting: false,
      isCollapse: false,
      // AKSHAY NEW CODE IMPLEMENTATIONS
      widgetDrawerOpen: false,
      finalSymptomData: [],
    };
    this.handleConditionSearch = throttle(
      this.handleConditionSearch.bind(this),
      2000
    );
    this.handleTreatmentSearch = throttle(
      this.handleTreatmentSearch.bind(this),
      2000
    );
    this.handleSeveritySearch = throttle(
      this.handleSeveritySearch.bind(this),
      2000
    );
    this.handleConditionSearch = throttle(
      this.handleConditionSearch.bind(this),
      2000
    );
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  formatMessage = (data) => this.props.intl.formatMessage(data);

  setClinicalNotes = (e) => {
    const value = e.target.value.trim();

    if (value.length > 0 || value === "") {
      this.setState({ clinical_notes: e.target.value });
    }
  };

  setSymptoms = (e) => {
    const value = e.target.value.trim();

    if (value.length > 0 || value === "") {
      this.setState({ symptoms: e.target.value });
    }
  };

  setPastedClinicalNotes = (e) => {
    e.preventDefault();
    let pastedValue = "";
    if (typeof e.clipboardData !== "undefined") {
      pastedValue = e.clipboardData.getData("text").trim();
    }
    if (pastedValue.length > 0 || pastedValue === "") {
      this.setState({ clinical_notes: pastedValue });
    }
  };

  setPastedSymptoms = (e) => {
    e.preventDefault();
    let pastedValue = "";
    if (typeof e.clipboardData !== "undefined") {
      pastedValue = e.clipboardData.getData("text").trim();
    }
    if (pastedValue.length > 0 || pastedValue === "") {
      this.setState({ symptoms: pastedValue });
    }
  };

  setDiagnosis = (e) => {
    const value = e.target.value.trim();

    if (value.length > 0 || value === "") {
      this.setState({ diagnosis_description: e.target.value });
    }
  };

  setPastedDiagnosis = (e) => {
    e.preventDefault();
    let pastedValue = "";
    if (typeof e.clipboardData !== "undefined") {
      pastedValue = e.clipboardData.getData("text").trim();
    }
    if (pastedValue.length > 0 || pastedValue === "") {
      this.setState({ diagnosis_description: pastedValue });
    }
  };

  setDiagnosisType = (value) => {
    this.setState({ diagnosis_type: value });
  };

  setTreatment = (value) => {
    this.setState({ treatment: value });
  };

  setSeverity = (value) => {
    this.setState({ severity: value });
  };

  setCondition = async (value) => {
    const { searchTreatment } = this.props;
    this.setState({ condition: value });

    const response = await searchTreatment(value);

    const {
      status,
      payload: { data: { treatments = {} } = {}, message } = {},
    } = response;
    if (status) {
      this.setState({ treatments, treatment: "" });
    }
  };

  getTreatmentOption = () => {
    let { treatments = {} } = this.props;
    let newTreatments = [];
    for (let treatment of Object.values(treatments)) {
      let { basic_info: { id = 0, name = "" } = {} } = treatment;
      newTreatments.push(
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    }
    return newTreatments;
  };

  getSeverityOption = () => {
    let { severity = {} } = this.props;
    let newSeverity = [];
    for (let sev of Object.values(severity)) {
      let { basic_info: { id = 0, name = "" } = {} } = sev;
      newSeverity.push(
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    }
    return newSeverity;
  };

  getConditionOption = () => {
    let { conditions = {} } = this.props;
    let newConditions = [];
    for (let condition of Object.values(conditions)) {
      let { basic_info: { id = 0, name = "" } = {} } = condition;
      newConditions.push(
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    }
    return newConditions;
  };

  async handleConditionSearch(data) {
    try {
      if (data) {
        const { searchCondition } = this.props;
        this.setState({ fetchingCondition: true });
        const response = await searchCondition(data);
        const { status, payload: { data: responseData, message } = {} } =
          response;
        if (status) {
          this.setState({ fetchingCondition: false });
        } else {
          this.setState({ fetchingCondition: false });
        }
      } else {
        this.setState({ fetchingCondition: false });
      }
    } catch (err) {
      console.log("err", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingCondition: false });
    }
  }

  async handleTreatmentSearch(data) {
    try {
      if (data) {
        const { searchTreatment } = this.props;
        this.setState({ fetchingTreatment: true });
        const response = await searchTreatment(data);
        const { status, payload: { data: treatments, message } = {} } =
          response;
        if (status) {
          this.setState({ fetchingTreatment: false });
        } else {
          this.setState({ fetchingTreatment: false });
        }
      } else {
        this.setState({ fetchingTreatment: false });
      }
    } catch (err) {
      console.log("err", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingCondition: false });
    }
  }

  async handleSeveritySearch(data) {
    try {
      if (data) {
        const { searchSeverity } = this.props;
        this.setState({ fetchingSeverity: true });
        const response = await searchSeverity(data);
        const { status } = response;
        if (status) {
          this.setState({ fetchingSeverity: false });
        } else {
          this.setState({ fetchingSeverity: false });
        }
      } else {
        this.setState({ fetchingSeverity: false });
      }
    } catch (err) {
      console.log("err", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingSeverity: false });
    }
  }

  // AKSHAY NEW CODE IMPLEMENTATIONS FOR CDSS

  onDiagnosisSearchHanlder = (value) => {
    this.props.diagnosisSearch(value);
  };

  handleDiagnosisChanges = (value) => {
    console.log(`selected ${value}`);

    this.setState({ diagnosis_description: value });
  };

  handleSymptomsChanges = (value) => {
    console.log(`selected ${value}`);
    this.props.getDiagnosisList(value);

    this.setState({ symptoms: value });
  };

  handleSymptomSelect = (value) => {
    console.log(`selected ${value}`);
    if (!isEmpty(value)) {
      let data = this.state.finalSymptomData;
      let symptomObject = {
        symptomName: value,
        bodyParts: [],
        duration: "",
      };
      data.push(symptomObject);

      this.setState({
        widgetDrawerOpen: true,
        finalSymptomData: data,
        selectedSymptom: value,
      });
    }
  };

  hendleSymptomDeselect = (value) => {
    console.log(`deselected ${value}`);
    let data = this.state.finalSymptomData;
    var filteredArray = data.filter((ele) => ele.symptomName !== value);

    this.setState({
      finalSymptomData: filteredArray,
    });
  };

  generateFinalSymptomData = (data) => {
    console.log("finalSymptomData", data);
    this.setState({
      finalSymptomData: data,
    });
  };

  collpaseHanlder = (label) => {
    this.setState({
      isCollapse: label,
    });
  };

  onCloseWidgetDrawer = () => {
    this.setState({
      widgetDrawerOpen: false,
    });
  };

  renderAddCareplan = () => {
    let dtToday = new Date();

    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    let year = dtToday.getFullYear();

    if (day < 10) {
      day = "0" + day;
    } else if (month < 10) {
      month = "0" + month;
    }

    const {
      condition = "",
      diagnosis_description = "",
      clinical_notes = "",
      diagnosis_type = "2",
      severity = "",
      treatment = "",
      symptoms = "",
      isCollapse = false,
    } = this.state;

    return (
      <div className="form-block-ap ">
        {/* AKSHAY NEW CODE IMPLEMENTATION */}

        <div className="form-headings-ap flex align-center justify-start">
          {this.formatMessage(messages.symptoms)}
        </div>

        <CustomSymptoms
          handleSymptomsChanges={this.handleSymptomsChanges}
          handleSymptomSelect={this.handleSymptomSelect}
          hendleSymptomDeselect={this.hendleSymptomDeselect}
        />

        {/* <TextArea
          placeholder={this.formatMessage(messages.writeHere)}
          value={symptoms}
          className={"form-textarea-ap "}
          onChange={this.setSymptoms}
          onPaste={this.setPastedSymptoms}
        /> */}

        <div className="form-headings-ap flex  justify-space-between">
          <div className="flex direction-column align-center justify-center">
            <div className="flex direction-row " key="diagnosis-h">
              {this.formatMessage(messages.diagnosis)}
              <div className="star-red">*</div>
            </div>
          </div>
          <div>
            <Select
              key={`diagnonsis-${diagnosis_type}`}
              value={diagnosis_type}
              onChange={this.setDiagnosisType}
            >
              <Option
                value={DIAGNOSIS_TYPE[FINAL].diagnosis_type}
                key={`final-${DIAGNOSIS_TYPE[FINAL].diagnosis_type}`}
              >
                {DIAGNOSIS_TYPE[FINAL].value}
              </Option>

              <Option
                value={DIAGNOSIS_TYPE[PROBABLE].diagnosis_type}
                key={`probable-${DIAGNOSIS_TYPE[PROBABLE].diagnosis_type}`}
              >
                {DIAGNOSIS_TYPE[PROBABLE].value}
              </Option>
            </Select>
          </div>
        </div>
        <CustomDiagnosis
          handleDiagnosisChanges={this.handleDiagnosisChanges}
          onDiagnosisSearchHanlder={this.onDiagnosisSearchHanlder}
        />
        {/* <TextArea
          placeholder={this.formatMessage(messages.writeHere)}
          value={diagnosis_description}
          className={"form-textarea-ap"}
          onChange={this.setDiagnosis}
          onPaste={this.setPastedDiagnosis}
        /> */}

        <div className="form-headings-ap flex align-center justify-start">
          {this.formatMessage(messages.treatment)}
          <div className="star-red">*</div>
        </div>

        <Select
          className="form-inputs-ap drawer-select"
          placeholder="Select Treatment"
          value={treatment}
          onChange={this.setTreatment}
          notFoundContent={
            this.state.fetchingTreatment ? (
              <Spin size="small" />
            ) : (
              "No match found"
            )
          }
          showSearch
          // onSearch={this.handleTreatmentSearch}
          autoComplete="off"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {this.getTreatmentOption()}
        </Select>

        <div className="form-headings-ap flex align-center justify-space-between mt10 mb10">
          {this.formatMessage(messages.clinicalNotes)}
          <div>
            {isCollapse === "clinicalNotes" ? (
              <MinusCircleOutlined onClick={() => this.collpaseHanlder("")} />
            ) : (
              <PlusCircleOutlined
                onClick={() => this.collpaseHanlder("clinicalNotes")}
              />
            )}
          </div>
        </div>

        {isCollapse === "clinicalNotes" && (
          <TextArea
            placeholder={this.formatMessage(messages.writeHere)}
            value={clinical_notes}
            className={"form-textarea-ap "}
            onChange={this.setClinicalNotes}
            onPaste={this.setPastedClinicalNotes}
          />
        )}

        <div className="form-headings-ap flex align-center justify-space-between mt10 mb10">
          {this.formatMessage(messages.condition)}
          <div>
            {isCollapse === "condition" ? (
              <MinusCircleOutlined onClick={() => this.collpaseHanlder("")} />
            ) : (
              <PlusCircleOutlined
                onClick={() => this.collpaseHanlder("condition")}
              />
            )}
          </div>
        </div>

        {isCollapse === "condition" && (
          <Select
            className="form-inputs-ap drawer-select"
            placeholder="Select Condition"
            value={this.state.condition}
            onChange={this.setCondition}
            onSearch={this.handleConditionSearch}
            notFoundContent={
              this.state.fetchingCondition ? (
                <Spin size="small" />
              ) : (
                "No match found"
              )
            }
            showSearch
            autoComplete="off"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.getConditionOption()}
          </Select>
        )}

        <div className="form-headings-ap  flex align-center justify-space-between mt10 mb10">
          {this.formatMessage(messages.severity)}
          <div>
            {isCollapse === "severity" ? (
              <MinusCircleOutlined onClick={() => this.collpaseHanlder("")} />
            ) : (
              <PlusCircleOutlined
                onClick={() => this.collpaseHanlder("severity")}
              />
            )}
          </div>
        </div>

        {isCollapse === "severity" && (
          <Select
            className="form-inputs-ap drawer-select"
            placeholder="Select Severity"
            value={severity}
            onChange={this.setSeverity}
            onSearch={this.handleSeveritySearch}
            notFoundContent={
              this.state.fetchingSeverity ? (
                <Spin size="small" />
              ) : (
                "No match found"
              )
            }
            showSearch
            autoComplete="off"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.props.children
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            }
          >
            {this.getSeverityOption()}
          </Select>
        )}
      </div>
    );
  };

  validateData = () => {
    const {
      treatment = "",
      diagnosis_description = "",
      diagnosis_type = "",
    } = this.state;
    if (!treatment) {
      message.error(this.formatMessage(messages.treatmentError));
      return false;
    } else if (!diagnosis_description) {
      message.error(this.formatMessage(messages.diagnosisError));
      return false;
    } else if (!diagnosis_type) {
      message.error(this.formatMessage(messages.diagnosisTypeError));
      return false;
    }

    return true;
  };

  async handleDataSubmit(patient_id, data) {
    const { addCareplanForPatient } = this.props;
    const { close } = this.props;
    this.setState({ submitting: true });
    const response = await addCareplanForPatient(patient_id, data);
    const {
      status,
      statusCode: code,
      payload: { message: errorMessage = "", error: { error_type = "" } = {} },
    } = response || {};

    if (status === true) {
      message.success(this.formatMessage(messages.add_careplan_success));
      this.onClose();
    } else {
      if (code === 500) {
        message.warn("Something went wrong, please try again.");
      } else {
        message.warn(errorMessage);
      }
    }

    this.setState({ submitting: false });
  }

  onSubmit = () => {
    const { addCareplanForPatient, patientId: patient_id } = this.props;
    const {
      treatment = "",
      severity = "",
      condition = "",
      diagnosis_description = "",
      diagnosis_type = "",
      clinical_notes = "",
      symptoms = "",
    } = this.state;
    const validate = this.validateData();
    // const { submit } = this.props;

    if (validate) {
      // submit({  treatment_id: treatment, severity_id: severity, condition_id: condition, diagnosis_description,diagnosis_type,clinical_notes, symptoms})
      const data = {
        treatment_id: treatment,
        severity_id: severity,
        condition_id: condition,
        diagnosis_description: String(diagnosis_description),
        diagnosis_type,
        clinical_notes,
        symptoms: JSON.stringify(this.state.finalSymptomData),
      };
      try {
        // AKSHAY NEW CODE IMPLEMENTATION FOR CDS
        let cdssPost = {};
        let symptomData = JSON.parse(data.symptoms);

        if (symptomData.length > 0) {
          symptomData.forEach((ele) => {
            cdssPost[ele.symptomName] = true;
          });
        }

        if (!isEmpty(cdssPost)) {
          cdssPost["dia"] = diagnosis_description;
        }
        if (!isEmpty(cdssPost["dia"])) {
          this.props.addDiagnosis(cdssPost);
        }

        this.handleDataSubmit(patient_id, data);
      } catch (error) {
        this.setState({ submitting: false });
        console.log("error", error);
        message.warn(this.formatMessage(messages.somethingWentWrong));
      }
    }
  };

  onClose = () => {
    const { close } = this.props;

    this.setState({
      treatment: "",
      severity: "",
      condition: "",
      fetchingCondition: false,
      fetchingTreatment: false,
      fetchingSeverity: false,
      clinical_notes: "",
      diagnosis_description: "",
      diagnosis_type: "2",
      symptoms: "",
      finalSymptomData: [],
    });
    close();
  };

  render() {
    const { visible } = this.props;
    const { onClose, renderAddCareplan } = this;
    const { submitting = false } = this.state;
    const { widgetDrawerOpen } = this.state;
    if (visible !== true) {
      return null;
    }
    return (
      <Fragment>
        <Drawer
          title={this.formatMessage(messages.newTreatmentPlan)}
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          onClose={onClose}
          visible={visible} // todo: change as per state, -- WIP --
          width={"35%"}
        >
          {renderAddCareplan()}
          {/* AKSHAY NEW CODE IMPLEMENTATIONS */}
          <WidgetDrawer
            visible={widgetDrawerOpen}
            onCloseDrawer={this.onCloseWidgetDrawer}
            finalSymptomData={this.state.finalSymptomData}
            generateFinalSymptomData={this.generateFinalSymptomData}
            selectedSymptom={this.state.selectedSymptom}
          />
          <Footer
            onSubmit={this.onSubmit}
            onClose={this.onClose}
            submitText={this.formatMessage(messages.submit)}
            submitButtonProps={{}}
            cancelComponent={
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                {this.formatMessage(messages.cancel)}
              </Button>
            }
            submitting={submitting}
          />

          {/* <div className='add-patient-footer'>
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            {this.formatMessage(messages.cancel)}
                        </Button>
                        <Button onClick={this.onSubmit} type="primary">
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div> */}
        </Drawer>
        <MultipleTreatmentAlert
          diagnosis_description={this.state.diagnosis_description}
        />
      </Fragment>
    );
  }
}

export default injectIntl(AddCareplanDrawer);
