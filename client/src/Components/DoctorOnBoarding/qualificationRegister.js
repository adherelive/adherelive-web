import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { DeleteTwoTone, LoadingOutlined, EyeTwoTone } from "@ant-design/icons";
import uuid from "react-uuid";
import { Input, DatePicker, Upload, message, Spin, Button } from "antd";

import Select from "antd/es/select";
import { REQUEST_TYPE, PATH, USER_CATEGORY } from "../../constant";
import {
  getUploadQualificationDocumentUrl,
  getUploadRegistrationDocumentUrl,
} from "../../Helper/urls/doctor";
import { doRequest } from "../../Helper/network";
import UploadSteps from "./steps";
import plus from "../../Assets/images/plus.png";
// import YearPicker from "react-year-picker";
import throttle from "lodash-es/throttle";
import moment from "moment";
import { withRouter } from "react-router-dom";
import messages from "./messages";
import Modal from "antd/es/modal";

const MALE = "m";
const FEMALE = "f";
const OTHER = "o";

const { Option } = Select;

class QualificationRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speciality: "",
      gender: "",
      education: {},
      educationKeys: [],
      registration: {},
      registrationKeys: [],
      docs: [],
      docsReg: [],
      loading: "",
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      degrees: {},
      fetchingDegrees: false,
      colleges: {},
      fetchingColleges: false,
      councils: {},
      fetchingCouncils: false,
      doctor_id: "",
      viewModalVisible: false,
      viewModalSrc: "",
      searchedDegreeText: "",
      searchSpecialityText: "",
      searchedCounciText: "",
    };

    // this.handleDegreeSearch = throttle(
    //   this.handleDegreeSearch.bind(this),
    //   2000
    // );

    // this.handleCollegeSearch = throttle(
    //   this.handleCollegeSearch.bind(this),
    //   2000
    // );
    // this.handleCouncilSearch = throttle(
    //   this.handleCouncilSearch.bind(this),
    //   2000
    // );

    // this.handleSpecialitySearch = throttle(
    //   this.handleSpecialitySearch.bind(this),
    //   2000
    // );
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    const url = window.location.href.split("/");
    const { doctorQualificationRegister, authenticated_category } = this.props;
    const { getDoctorQualificationRegisterData, callNewDoctorAction } =
      this.props;

    await getDoctorQualificationRegisterData({
      doctor_id: url.length > 4 ? url[url.length - 1] : 0,
    });
    let doctor_id = url.length > 4 ? url[url.length - 1] : 0;

    await callNewDoctorAction(doctor_id);

    const { authenticated_user = "", doctors = {} } = this.props;
    let docGender = "";
    let docSpeciality = "";
    let doctorId = 0;
    let docQualificationIds = [];
    let docRegistrationIds = [];
    for (let doctor of Object.values(doctors)) {
      const {
        basic_info: {
          user_id = 0,
          id = 0,
          gender = "",
          speciality_id = "",
        } = {},
        doctor_qualification_ids = [],
        doctor_registration_ids = [],
      } = doctor || {};

      if (parseInt(user_id) === parseInt(authenticated_user)) {
        docGender = gender;
        docSpeciality = speciality_id
          ? speciality_id.toString()
          : speciality_id;
        doctorId = id;
        docQualificationIds = doctor_qualification_ids;
        docRegistrationIds = doctor_registration_ids;
      } else {
        const {
          basic_info: {
            user_id = 0,
            id = 0,
            gender = "",
            speciality_id = "",
          } = {},
          doctor_qualification_ids = [],
          doctor_registration_ids = [],
        } = doctors[doctor_id] || {};
        docGender = gender;
        docSpeciality = speciality_id
          ? speciality_id.toString()
          : speciality_id;
        doctorId = id;
        docQualificationIds = doctor_qualification_ids;
        docRegistrationIds = doctor_registration_ids;
        this.setState({ doctor_id: doctorId });
      }

      if (
        authenticated_category === USER_CATEGORY.DOCTOR ||
        authenticated_category === USER_CATEGORY.HSP
      ) {
        await getDoctorQualificationRegisterData({ doctor_id: id });
      }
    }

    const {
      onBoarding = {},
      doctor_registrations = {},
      doctor_qualifications = {},
      upload_documents = {},
    } = this.props;
    // let { qualificationData: { speciality = '', gender = '', qualification_details = [] } = {} } = onBoarding || {};
    // registration_year=registration_year?registration_year:parseInt(moment().format("YYYY"));
    let educationKeys = [];
    let education = {};
    let registrationKeys = [];
    let registration = {};

    const degreeList = {};
    // Object.keys(degrees).forEach(id => {
    //   degreeList[id] = degrees[id];
    // });

    const collegeList = {};
    // Object.keys(colleges).forEach(id => {
    //   collegeList[id] = colleges[id];
    // });

    const councilList = {};
    // Object.keys(councils).forEach(id => {
    //   councilList[id] = councils[id];
    // });

    if (docQualificationIds.length) {
      for (let qualifi of docQualificationIds) {
        let key = uuid();

        let qualification = {};
        let {
          basic_info: {
            year = "",
            college_name = "",
            college_id = "",
            degree_id = "",
            id = 0,
          },
          upload_document_ids = [],
        } = doctor_qualifications[qualifi] || {};

        qualification.id = id;
        qualification.year = year;
        qualification.college_name = college_name;
        qualification.college_id = college_id;
        qualification.degree_id = degree_id;
        let photos = [];
        for (let doc of upload_document_ids) {
          let {
            basic_info: { document = "" },
          } = upload_documents[doc];
          photos.push(document);
        }
        qualification.photos = photos;
        qualification.photo = [];
        if (
          !qualification.photo ||
          (qualification.photo && !qualification.photo.length)
        ) {
          let newPhoto = [];
          for (let pic of qualification.photos) {
            newPhoto.push(pic);
          }
          qualification.photo = newPhoto;
        }

        education[key] = qualification;
        educationKeys.push(key);
      }
    } else {
      let key = uuid();

      education[key] = {
        degree_id: "",
        college_name: "",
        college_id: "",
        year: parseInt(moment().format("YYYY")),
        photo: [],
        photos: [],
        id: 0,
      };
      educationKeys = [key];
    }

    if (docRegistrationIds.length) {
      for (let regis of docRegistrationIds) {
        let photos = [];
        let key = uuid();
        let {
          basic_info: {
            year = "",
            registration_council_id = "",
            number = "",
            id = 0,
            doctor_id = 0,
          },
          upload_document_ids = [],
          expiry_date = "",
        } = doctor_registrations[regis] || {};
        if (parseInt(doctorId) === parseInt(doctor_id)) {
          registration[key] = {
            year,
            expiryDate: moment(expiry_date),
            registration_council_id,
            number,
            id,
          };
          registration[key].photo = [];
          for (let doc of upload_document_ids) {
            let {
              basic_info: { document = "" },
            } = upload_documents[doc];
            photos.push(document);
          }
          registration[key].photos = photos;
          registrationKeys.push(key);
        }
      }
    } else {
      let key1 = uuid();
      registration[key1] = {
        number: "",
        registration_council_id: "",
        year: parseInt(moment().format("YYYY")),
        expiryDate: "",
        photo: [],
        photos: [],
        id: 0,
      };
      registrationKeys = [key1];
    }

    this.setState({
      speciality_id: docSpeciality,
      gender: docGender,
      registration,
      registrationKeys,
      education,
      educationKeys,
      degrees: degreeList,
      councils: councilList,
      colleges: collegeList,
    });
  };

  setSpeciality = (value) => {
    this.setState({ speciality_id: value.toString() });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getYearOptions = () => {
    let currYear = moment().format("YYYY");
    let curryearNum = parseInt(currYear);
    let years = [];
    for (let year = curryearNum - 100; year <= curryearNum; year++) {
      years.push(
        <Option key={year} value={year} name={year}>
          {year}
        </Option>
      );
    }
    return years;
  };

  setGender = (value) => () => {
    this.setState({ gender: value });
  };

  setRegNo = (key, e) => {
    let { registration = {} } = this.state;
    let newRegistration = registration;
    newRegistration[key].number = e.target.value;
    const { value } = e.target;
    const reg = /^[a-zA-Z0-9]*$/;

    if (reg.test(value) || value === "" || value === "-") {
      this.setState({ registration: newRegistration });
    }
  };

  setRegCouncil = (key) => (value) => {
    let { registration = {} } = this.state;
    let newRegistration = registration;
    newRegistration[key].registration_council_id = value;
    this.setState({ registration: newRegistration });
  };

  setRegYear = (key) => (value) => {
    let { registration = {} } = this.state;
    let newRegistration = registration;
    newRegistration[key].year = value;
    this.setState({ registration: newRegistration });
  };

  setExpiryDate = (key) => (date, dateString) => {
    let { registration = {} } = this.state;
    let newRegistration = registration;
    newRegistration[key].expiryDate = date;
    this.setState({ registration: newRegistration });
  };

  getGenderOptions = () => {
    const genderes = [
      { name: "Female", value: "f" },
      { name: "Male", value: "m" },
      { name: "Other", value: "o" },
    ];
    let options = [];

    for (let id = 0; id < genderes.length; ++id) {
      const { name, value } = genderes[id];
      options.push(
        <Option key={id} value={value} name={name}>
          {name}
        </Option>
      );
    }
    return options;
  };

  setCustomDegree = (key) => {
    let { education = {} } = this.state;
    let newEducation = education;

    const { searchedDegreeText: value = "" } = this.state;

    newEducation[key].degree_id = value;
    this.setState({ education: newEducation });
  };

  setDegree = (key) => (value) => {
    let { education = {} } = this.state;
    let newEducation = education;

    newEducation[key].degree_id = value;
    this.setState({ education: newEducation });
  };

  // setCollege = (key) => e => {
  //   e.preventDefault();
  //   let { education = {} } = this.state;
  //   let newEducation = education;
  //   newEducation[key].college_id = e.target.value;
  //   this.setState({ education: newEducation });
  // }

  setCollege = (key) => (data) => {
    let { education = {} } = this.state;
    let newEducation = education;
    newEducation[key].college_id = data;
    newEducation[key].college_name = "";
    this.setState({ education: newEducation });
  };

  setYear = (key) => (value) => {
    let { education = {} } = this.state;
    let newEducation = education;
    newEducation[key].year = value;
    // newEducation[key].year = dateString;
    this.setState({ education: newEducation });
  };

  onUploadComplete = async ({ files = [] }, key) => {
    const {
      docs = [],
      speciality_id = "",
      gender = "",
      doctor_id = "",
    } = this.state;

    this.setState(
      { docs: [...docs, ...files], uploadProgress: false },
      async () => {
        const { docs, education } = this.state;
        let newEducation = education;

        if (
          docs.length === newEducation[key].photo.length ||
          docs.length + newEducation[key].photos.length ===
            newEducation[key].photo.length
        ) {
          let newPhotos = newEducation[key].photos;
          let newPhoto = newEducation[key].photo;
          const { registerQualification } = this.props;
          newEducation[key].photos = [...newPhotos, ...docs];
          newEducation[key].photo.forEach((item, index) => {
            if (typeof item != "string") {
              item.status = "done";
            }
          });

          let {
            degree_id = "",
            year = "",
            college_name = "",
            college_id = "",
            photos = [],
            id = 0,
          } = newEducation[key];
          let qualData = {
            degree_id: degree_id.toString(),
            year,
            college_name,
            college_id: college_id.toString(),
            photos,
            id: id.toString(),
          };
          let qualificationData = {
            speciality_id,
            gender,
            qualification: qualData,
            doctor_id,
          };
          let response = await registerQualification(qualificationData);
          // .then(response => {
          const {
            status,
            statusCode,
            payload: {
              message: res_message = "",
              data: { qualification_id = 0 } = {},
            } = {},
          } = response;

          if (status) {
            if (!newEducation[key].id) {
              newEducation[key].id = qualification_id;
            }

            this.setState({
              docs: [],
              education: newEducation,
            });

            this.fetchData();
          } else {
            let length = newEducation[key].photos.length;
            newEducation[key].photo = newPhoto.slice(0, length - docs.length);

            newEducation[key].photos = newPhotos;

            this.setState({
              docs: [],
              education: newEducation,
            });
            if (statusCode === 422) {
              message.error(res_message);
            } else {
              message.error(this.formatMessage(messages.somethingWentWrong));
            }
          }
          // });
        }
      }
    );
  };

  onUploadCompleteRegistration = async ({ files = [] }, key) => {
    let { docsReg = [], speciality_id = "", gender = "" } = this.state;

    this.setState(
      { docsReg: [...docsReg, ...files], uploadRegistrationProgress: false },
      async () => {
        //  async () => {

        let {
          docsReg,
          fileList,
          registration = {},
          education,
          doctor_id,
        } = this.state;
        let newRegistration = registration;
        if (
          docsReg.length === newRegistration[key].photo.length ||
          docsReg.length + newRegistration[key].photos.length ===
            newRegistration[key].photo.length
        ) {
          let newPhotos = newRegistration[key].photos;
          let newPhoto = newRegistration[key].photo;
          const { registerRegistration } = this.props;
          const { authenticated_user } = this.props;
          const { basic_info: { id: userId = 1 } = {} } =
            authenticated_user || {};
          newRegistration[key].photos = [...newPhotos, ...docsReg];
          newRegistration[key].photo.forEach((item, index) => {
            if (typeof item != "string") {
              item.status = "done";
            }
          });

          let {
            number = "",
            registration_council_id = "",
            year,
            expiryDate = "",
            photos = [],
            id = 0,
          } = newRegistration[key];
          let regData = {
            number,
            registration_council_id: registration_council_id.toString(),
            year,
            expiry_date: expiryDate,
            photos,
            id: id.toString(),
          };
          let newEdu = [];
          for (let edu of Object.values(education)) {
            let {
              college_id = "",
              college_name = "",
              degree_id = "",
              id = "",
              photos = [],
              year = "",
            } = edu;
            let localEdu = {
              college_name,
              college_id: college_id.toString(),
              degree_id: degree_id.toString(),
              id: id.toString(),
              photos,
              year,
            };
            newEdu.push(localEdu);
          }
          let registrationData = {
            speciality_id,
            gender,
            qualification_details: newEdu,
            registration: regData,
            doctor_id,
          };
          let response = await registerRegistration(registrationData, userId);
          // .then(response => {
          const {
            status,
            statusCode,
            payload: {
              data: { registration_id = 0 } = {},
              message: res_message = "",
            } = {},
          } = response;

          if (status) {
            if (!newRegistration[key].id) {
              newRegistration[key].id = registration_id;
            }

            this.setState({
              docsReg: [],
              registration: newRegistration,
            });

            this.fetchData();
          } else {
            let length = newRegistration[key].photos.length;
            newRegistration[key].photo = newPhoto.slice(
              0,
              length - docsReg.length
            );

            newRegistration[key].photos = newPhotos.slice(
              0,
              length - docsReg.length
            );

            this.setState({
              docsReg: [],
              registration: newRegistration,
            });
            if (statusCode == 422) {
              message.error(res_message);
            } else {
              message.error(this.formatMessage(messages.somethingWentWrong));
            }
          }
          // });
        }
      }
    );
  };

  customRequest =
    (key) =>
    async ({ file, filename, onError, onProgress, onSuccess }) => {
      const { onUploadComplete } = this;

      let { education = {} } = this.state;

      this.setState({ uploadProgress: true });

      let qualification = education[key];

      // let { degree_id = '', college_id = '', year = '' } = qualification;

      // const { basic_info: { id = 1 } = {} } = authenticated_user || {};
      // let qualificationData = { degree_id, college_id, year };

      let data = new FormData();
      data.append("files", file, file.name);
      // data.append("qualification", JSON.stringify(qualificationData));

      let uploadResponse = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: getUploadQualificationDocumentUrl(),
      });

      let { status = false, payload: { message: respMessage = "" } = {} } =
        uploadResponse;

      if (status) {
        onUploadComplete(uploadResponse.payload.data, key);
      } else {
        let newUnuploadedArr = this.handleRemoveAllUnuploadedFiles(key);
        if (newUnuploadedArr) {
          const { docs, education } = this.state;

          let newEducation = education;
          newEducation[key].photo = newUnuploadedArr;
          this.setState(
            { education: newEducation, uploadProgress: false },
            async () => {
              console.log("7865789", this.state);
            }
          );
        }
        message.error(respMessage);
      }

      return {
        abort() {},
      };
    };

  handleRemoveAllUnuploadedFiles = (key) => {
    let { education = {} } = this.state;
    let newEducationAfterUpload = education;
    const obj = newEducationAfterUpload[key].photo;
    let newUnuploadedArr = [];
    for (let each in obj) {
      const { status = "" } = obj[each] || {};
      if (status === "uploading") {
      } else {
        newUnuploadedArr.push(obj[each]);
      }
    }
    return newUnuploadedArr;
  };
  customRequestRegistration =
    (key) =>
    async ({ file, filename, onError, onProgress, onSuccess }) => {
      const { onUploadCompleteRegistration } = this;

      let { registration = {} } = this.state;

      this.setState({ uploadRegistrationProgress: true });

      let newReg = registration[key];

      let data = new FormData();
      data.append("files", file, file.name);

      let uploadResponse = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: getUploadRegistrationDocumentUrl(),
      });

      let { status = false, payload: { message: res_message = "" } = {} } =
        uploadResponse;

      if (status) {
        onUploadCompleteRegistration(uploadResponse.payload.data, key);
      } else {
        // console.log("7865789765678909876 --> before",this.state.registration);
        let newUnuploadedArr = this.handleRegRemoveAllUnuploadedFiles(key);
        if (newUnuploadedArr) {
          const { registration = {} } = this.state;

          let newRegistration = registration;
          newRegistration[key].photo = newUnuploadedArr;
          this.setState(
            {
              registration: newRegistration,
              uploadRegistrationProgress: false,
            },
            async () => {
              console.log(
                "7865789765678909876 --> After",
                this.state.registration
              );
            }
          );
        }
        message.error(res_message);
      }

      return {
        abort() {},
      };
    };

  handleRegRemoveAllUnuploadedFiles = (key) => {
    let { registration = {} } = this.state;
    let newRegistrationAfterUpload = registration;
    const obj = newRegistrationAfterUpload[key].photo;
    let newUnuploadedArr = [];
    for (let each in obj) {
      const { status = "" } = obj[each] || {};
      if (status === "uploading") {
      } else {
        newUnuploadedArr.push(obj[each]);
      }
    }
    return newUnuploadedArr;
  };

  handleChangeList = (key) => (info) => {
    const fileList = info.fileList;
    let { education = {} } = this.state;
    let newEducation = education;
    let { photos = [], photo = [] } = newEducation[key];
    for (let item of fileList) {
      let uid = item.uid;
      let push = true;

      if (typeof item == "object") {
        for (let photo of photos) {
          let { name = "" } = item;
          let fileName = name;
          let newFileName = fileName.replace(/\s/g, "");
          if (photo.includes(newFileName)) {
            push = false;
          }
        }
      }
      if (newEducation[key].photo && newEducation[key].photo.length) {
        for (let pic of newEducation[key].photo) {
          if (pic.uid === uid) {
            push = false;
          }
        }
      }
      if (push) {
        newEducation[key].photo.push(item);
      }
    }

    this.setState({ education: newEducation });
  };

  handleChangeListRegistration = (key) => (info) => {
    const fileList = info.fileList;
    let { registration = {} } = this.state;
    let newRegistration = registration;
    let { photos = [] } = newRegistration[key];
    for (let item of fileList) {
      let uid = item.uid;
      let push = true;

      if (typeof item == "object") {
        for (let photo of photos) {
          let { name = "" } = item;
          let fileName = name;
          let newFileName = fileName.replace(/\s/g, "");
          if (photo.includes(newFileName)) {
            push = false;
          }
        }
      }
      if (newRegistration[key].photo && newRegistration[key].photo.length) {
        for (let pic of newRegistration[key].photo) {
          if (pic.uid === uid) {
            push = false;
          }
        }
      }
      if (push) {
        newRegistration[key].photo.push(item);
      }
    }

    this.setState({ registration: newRegistration });
  };

  handleRemoveList = (key, pic) => () => {
    let { education = {} } = this.state;
    let newEducation = education;
    let { deleteDoctorQualificationImage } = this.props;
    let { id: qualificationId = 0 } = newEducation[key];
    let deleteIndex = -1;
    let deleteIndexOfUrls = -1;

    deleteDoctorQualificationImage(qualificationId, pic).then((response) => {
      let { status = false } = response;
      if (status) {
        let index = 0;
        // newEducation[key].photo.forEach((file, index) => {
        for (let file of newEducation[key].photo) {
          if (typeof file == "string") {
            if (file.localeCompare(pic) === 0) {
              deleteIndex = index;
            }
          } else {
            let fileName = file.name;
            let newFileName = fileName.replace(/\s/g, "");
            if (pic.includes(newFileName)) {
              deleteIndex = index;
            }
          }
          index++;
        }
        // );

        newEducation[key].photos.forEach((picture, index) => {
          // if (pic.includes(fileName)) {
          if (pic == picture) {
            deleteIndexOfUrls = index;
          }
        });
        if (deleteIndex > -1) {
          newEducation[key].photo.splice(deleteIndex, 1);
        }
        if (deleteIndexOfUrls > -1) {
          newEducation[key].photos.splice(deleteIndexOfUrls, 1);
        }
        this.setState({ education: newEducation });
      } else {
        message.error(this.formatMessage(messages.somethingWentWrong));
      }
    });
  };

  handleRemoveListRegistration = (key, pic) => () => {
    let { registration = {} } = this.state;
    let newRegistration = registration;
    let { deleteDoctorRegistrationImage } = this.props;
    let { id: registrationId = 0 } = newRegistration[key];
    let deleteIndex = -1;
    let deleteIndexOfUrls = -1;

    deleteDoctorRegistrationImage(registrationId, pic).then((response) => {
      let { status = false } = response;
      if (status) {
        let index = 0;
        // newRegistration[key].photo.forEach((file, index) => {
        for (let file of newRegistration[key].photo) {
          if (typeof file == "string") {
            if (file.localeCompare(pic) === 0) {
              deleteIndex = index;
            }
          } else {
            let fileName = file.name;
            let newFileName = fileName.replace(/\s/g, "");
            if (pic.includes(newFileName)) {
              deleteIndex = index;
            }
          }
          index++;
        }
        // );

        newRegistration[key].photos.forEach((picture, index) => {
          // if (pic.includes(fileName)) {
          if (pic == picture) {
            deleteIndexOfUrls = index;
          }
        });
        if (deleteIndex > -1) {
          newRegistration[key].photo.splice(deleteIndex, 1);
        }
        if (deleteIndexOfUrls > -1) {
          newRegistration[key].photos.splice(deleteIndexOfUrls, 1);
        }
        this.setState({ registration: newRegistration });
      } else {
        message.error(this.formatMessage(messages.somethingWentWrong));
      }
    });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  getBase64File = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64File(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
  };

  addEducation = () => {
    let key = uuid();
    let { education = {}, educationKeys = [] } = this.state;
    let newEducation = education;
    let newEducationKeys = educationKeys;
    newEducation[key] = {
      degree_id: "",
      college_name: "",
      college_id: "",
      year: parseInt(moment().format("YYYY")),
      photo: [],
      photos: [],
      id: 0,
    };
    newEducationKeys.unshift(key);
    this.setState({ education: newEducation, educationKeys: newEducationKeys });
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf("day");
  };

  addRegistration = () => {
    let key = uuid();
    let { registration = {}, registrationKeys = [] } = this.state;
    let newRegistration = registration;
    let newRegistrationKeys = registrationKeys;
    newRegistration[key] = {
      number: "",
      registration_council_id: "",
      year: parseInt(moment().format("YYYY")),
      expiryDate: "",
      photo: [],
      photos: [],
      id: 0,
    };
    newRegistrationKeys.unshift(key);
    this.setState({
      registration: newRegistration,
      registrationKeys: newRegistrationKeys,
    });
  };

  deleteEducation = (key) => () => {
    let { education = {}, educationKeys = [] } = this.state;
    let newEducation = education;
    let newEducationKeys = educationKeys;
    delete newEducation[key];
    newEducationKeys.splice(newEducationKeys.indexOf(key), 1);
    this.setState({ education: newEducation, educationKeys: newEducationKeys });
  };

  deleteRegistration = (key) => () => {
    let { registration = {}, registrationKeys = [] } = this.state;
    let newRegistration = registration;
    let newRegistrationKeys = registrationKeys;
    delete newRegistration[key];
    newRegistrationKeys.splice(newRegistrationKeys.indexOf(key), 1);
    this.setState({
      registration: newRegistration,
      registrationKeys: newRegistrationKeys,
    });
  };

  setId = (education) => {
    let setEdu = new Promise((resolve) =>
      this.setState({ education }, resolve(true))
    );
    return setEdu;
  };

  popLast = (key) => () => {
    let { education = {} } = this.state;
    let newPhoto = education[key].photo;
    newPhoto.pop();
    education[key].photo = newPhoto;
    this.setState({ education });
  };

  handleBeforeUpload = (key) => (file) => {
    let { education = {} } = this.state;
    let { photos = [] } = education[key];

    for (let photo of photos) {
      let fileName = file.name;
      let newFileName = fileName.replace(/\s/g, "");
      if (photo.includes(newFileName)) {
        message.error(this.formatMessage(messages.duplicateError));
        return false;
      }
    }
    return true;
  };

  handleBeforeUploadRegistration = (key) => (file) => {
    let { registration = {} } = this.state;
    let { photos = [] } = registration[key];
    for (let photo of photos) {
      let fileName = file.name;
      let newFileName = fileName.replace(/\s/g, "");
      if (photo.includes(newFileName)) {
        message.error(this.formatMessage(messages.duplicateError));
        return false;
      }
    }
    return true;
  };

  getDegreesOption = () => {
    const { degrees = {} } = this.props;

    return Object.keys(degrees).map((id) => {
      const { basic_info: { name, type } = {} } = degrees[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
  };

  getSpecialityOption = () => {
    const { specialities = {} } = this.props;

    return Object.keys(specialities).map((id) => {
      const { basic_info: { name } = {} } = specialities[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
  };

  getCollegesOption = () => {
    const { colleges = {} } = this.props;

    return Object.keys(colleges).map((id) => {
      const { basic_info: { name } = {} } = colleges[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
  };

  getCouncilOption = () => {
    const { councils = {} } = this.props;

    return Object.keys(councils).map((id) => {
      const { basic_info: { name } = {} } = councils[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
  };

  handleDegreeSearch = (key) => async (data) => {
    try {
      if (data) {
        const { searchDegree } = this.props;
        this.setState({ fetchingDegrees: true });
        const response = await searchDegree(data);
        const { status } = response;
        if (status) {
          this.setState({ fetchingDegrees: false });
        } else {
          this.setState({ fetchingDegrees: false });
        }
      } else {
        this.setState({ fetchingDegrees: false });
      }
      this.setState({ searchedDegreeText: data });

      await this.setCustomDegree(key);
    } catch (err) {
      console.log("err", err);
      message.error(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingDegrees: false });
    }
  };

  handleSpecialitySearch = async (data = "") => {
    try {
      // if (data) {
      const { searchSpecialities } = this.props;
      this.setState({ fetchingSpeciality: true });
      const response = await searchSpecialities(data);
      const { status } = response;
      if (status) {
        this.setState({ fetchingSpeciality: false });
      } else {
        this.setState({ fetchingSpeciality: false });
      }
      // } else {
      //   this.setState({ fetchingSpeciality: false });
      // }
      if (data.length) {
        this.setState({ searchSpecialityText: data });

        await this.setCustomSpeciality();
      }
    } catch (err) {
      console.log("err", err);
      message.warn("Something wen't wrong. Please try again later");
      this.setState({ fetchingSpeciality: false });
    }
  };

  setCustomSpeciality = () => {
    const { searchSpecialityText: value = "" } = this.state;

    this.setState({ speciality_id: value });
  };

  callHandleCollegeSearch = (key) => (data) => {
    this.handleCollegeSearch({ key, data });
  };

  // handleCollegeSearch =  (key) => async (data) => {
  handleCollegeSearch = async ({ key, data }) => {
    try {
      if (data) {
        const { searchCollege } = this.props;
        this.setState({ fetchingColleges: true });
        const response = await searchCollege(data);
        const { status } = response;

        if (status) {
          // const { colleges = {} } = responseData;
          // const collegeList = {};

          let { education = {} } = this.state;
          let newEducation = education;
          newEducation[key].college_name = data.trim();
          newEducation[key].college_id = "";

          // newEducation[key].college_id = data;
          this.setState({ education: newEducation, fetchingColleges: false });

          // Object.keys(colleges).forEach(id => {
          //   collegeList[id] = colleges[id];
          // });
          // this.setState({ colleges: collegeList, fetchingColleges: false });
        } else {
          let { education = {} } = this.state;
          let newEducation = education;
          newEducation[key].college_name = data.trim();
          newEducation[key].college_id = "";
          // newEducation[key].college_id = data;
          this.setState({ education: newEducation, fetchingColleges: false });
        }
      } else {
        this.setState({ fetchingColleges: false });
      }
    } catch (err) {
      console.log("err", err);
      message.error(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingColleges: false });
    }
  };

  handleCouncilSearch = (key) => async (data) => {
    try {
      if (data) {
        const { searchCouncil } = this.props;
        this.setState({ fetchingCouncils: true });
        const response = await searchCouncil(data);
        const { status } = response;
        if (status) {
          // const { registration_councils = {} } = responseData;
          // const councilList = {};
          // Object.keys(registration_councils).forEach(id => {
          //   councilList[id] = registration_councils[id];
          // });
          // this.setState({ councils: councilList, fetchingCouncils: false });

          this.setState({ fetchingCouncils: false });
        } else {
          this.setState({ fetchingCouncils: false });
        }
      } else {
        this.setState({ fetchingCouncils: false });
      }
      this.setState({ searchedCounciText: data });

      await this.setCustomCouncil(key);
    } catch (err) {
      console.log("err", err);
      message.error(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingCouncils: false });
    }
  };

  setCustomCouncil = (key) => {
    let { registration = {}, searchedCounciText = "" } = this.state;
    let newRegistration = registration;
    newRegistration[key].registration_council_id = searchedCounciText;
    this.setState({ registration: newRegistration });
  };

  handleDocumentViewOpen = (src) => () => {
    this.setState({
      viewModalVisible: true,
      viewModalSrc: src,
    });
  };

  handleDocumentViewClose = () => {
    this.setState({
      viewModalVisible: false,
      viewModalSrc: "",
    });
  };

  renderEducation = () => {
    let {
      education = {},
      educationKeys = [],
      fileList = [],
      uploadProgress = false,
    } = this.state;

    const uploadButton = (
      <div>
        {uploadProgress ? (
          <LoadingOutlined />
        ) : (
          <img src={plus} className={"w22 h22"} />
        )}
      </div>
    );
    return (
      <div className="flex direction-column">
        {educationKeys.map((key) => {
          let {
            photo = [],
            degree_id,
            college_name,
            college_id = null,
            year,
            photos = [],
          } = education[key];
          let college = "";

          const { colleges = {} } = this.props;
          const { basic_info: { name: collegeName } = {} } =
            colleges[college_id] || {};

          if (college_name !== "") {
            college = college_name;
          } else {
            college = collegeName;
          }

          return (
            <div key={key}>
              <div className="flex justify-space-between align-center direction-row">
                <div className="form-headings">
                  {this.formatMessage(messages.degree)}
                </div>
                {educationKeys.length > 1 ? (
                  <DeleteTwoTone
                    className={"pointer"}
                    onClick={this.deleteEducation(key)}
                    twoToneColor="#cc0000"
                  />
                ) : (
                  <div></div>
                )}
              </div>
              <Select
                onSearch={this.handleDegreeSearch(key)}
                notFoundContent={
                  this.state.fetchingDegrees ? (
                    <Spin size="small" />
                  ) : (
                    this.formatMessage(messages.noMatch)
                  )
                }
                showSearch
                className="form-inputs"
                placeholder={this.formatMessage(messages.selectDegree)}
                showSearch
                value={degree_id.toString()}
                onChange={this.setDegree(key)}
                // onFocus={() => handleMedicineSearch("")}
                autoComplete="off"
                // onFocus={() => handleMedicineSearch("")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                // getPopupContainer={getParentNode}
              >
                {this.getDegreesOption()}
              </Select>
              <div className="form-headings">
                {this.formatMessage(messages.college)}
              </div>

              <Select
                onSearch={this.callHandleCollegeSearch(key)}
                notFoundContent={
                  this.state.fetchingColleges ? (
                    <Spin size="small" />
                  ) : (
                    this.formatMessage(messages.noMatch)
                  )
                }
                className="form-inputs"
                placeholder={this.formatMessage(messages.selectCollege)}
                showSearch
                value={college}
                // value={college_id}
                // onChange={this.setCollege(key)}
                onSelect={this.setCollege(key)}
                // onFocus={() => handleMedicineSearch("")}
                autoComplete="off"
                // onFocus={() => handleMedicineSearch("")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                // getPopupContainer={getParentNode}
              >
                {this.getCollegesOption()}
              </Select>

              {/* <Input value={college_id} onChange={this.setCollege(key)} className={"form-inputs"}/> */}
              <div className="form-headings">
                {this.formatMessage(messages.year)}
              </div>
              {/* <Input
                placeholder="Year"
                className={"form-inputs"}

                value={year}
                onChange={e => this.setYear(key, e)}
              /> */}
              <Select
                className="form-inputs"
                placeholder="Select Year"
                value={year ? year : null}
                onChange={this.setYear(key)}
              >
                {this.getYearOptions()}
              </Select>

              {/* <DatePicker mode="year" value={moment(year,'YYYY')} format={'YYYY'} placeholder={'Select Year'} onChange={this.setYear}/> */}
              <div className="form-headings">
                {this.formatMessage(messages.photo)}
              </div>
              <div className="qualification-photo-uploads">
                {photos.map((pic, index) => {
                  return (
                    <div
                      key={`qualification-${index}`}
                      className={"qualification-avatar-uploader"}
                    >
                      <img src={pic} className="wp100 hp100 br4" />
                      <div className="overlay"></div>
                      <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
                        {" "}
                        <DeleteTwoTone
                          className={"del doc-opt"}
                          onClick={this.handleRemoveList(key, pic)}
                          twoToneColor="#fff"
                        />{" "}
                        <EyeTwoTone
                          className="w20"
                          className={"del doc-opt pointer"}
                          onClick={this.handleDocumentViewOpen(pic)}
                          twoToneColor="#fff"
                        />
                      </div>
                    </div>
                  );
                })}
                {photos.length < 3 && (
                  <Upload
                    multiple={true}
                    style={{ width: 128, height: 128, margin: 6 }}
                    beforeUpload={this.handleBeforeUpload(key)}
                    showUploadList={false}
                    disabled={
                      !((college_id || college_name) && degree_id && year) ||
                      photos.length >= 3
                    }
                    fileList={photo}
                    customRequest={this.customRequest(key)}
                    onChange={this.handleChangeList(key, fileList)}
                    // onRemove={this.handleRemoveList(key)}
                    listType="picture-card"
                    // onPreview={this.handlePreview}
                  >
                    {uploadButton}
                  </Upload>
                )}
                {/* <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal> */}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  renderRegistration = () => {
    let {
      registration = {},
      registrationKeys = [],
      fileList = [],
      uploadRegistrationProgress = false,
    } = this.state;

    const uploadButton = (
      <div>
        {uploadRegistrationProgress ? (
          <LoadingOutlined />
        ) : (
          <img src={plus} className={"w22 h22"} />
        )}
      </div>
    );
    return (
      <div className="flex direction-column">
        {registrationKeys.map((key) => {
          let {
            photo = [],
            number,
            registration_council_id,
            expiryDate,
            year,
            photos = [],
          } = registration[key];
          return (
            <div key={key}>
              <div className="flex justify-space-between align-center direction-row">
                <div className="form-headings">
                  {this.formatMessage(messages.regNo)}
                </div>
                {registrationKeys.length > 1 ? (
                  <DeleteTwoTone
                    className={"pointer"}
                    onClick={this.deleteRegistration(key)}
                    twoToneColor="#cc0000"
                  />
                ) : (
                  <div></div>
                )}
              </div>
              <Input
                placeholder="Registration number"
                value={number}
                maxLength={20}
                className={"form-inputs"}
                onChange={(e) => this.setRegNo(key, e)}
              />
              <div className="form-headings">
                {this.formatMessage(messages.regCouncil)}
              </div>
              {/* <Input
                placeholder="Registration council"
                value={council}
                className={"form-inputs"}
                onChange={e => this.setRegCouncil(key, e)}
              /> */}
              <Select
                onSearch={this.handleCouncilSearch(key)}
                notFoundContent={
                  this.state.fetchingCouncils ? (
                    <Spin size="small" />
                  ) : (
                    "No match found"
                  )
                }
                className="form-inputs"
                placeholder="Select Council"
                showSearch
                value={registration_council_id.toString()}
                onChange={this.setRegCouncil(key)}
                // onFocus={() => handleMedicineSearch("")}
                autoComplete="off"
                // onFocus={() => handleMedicineSearch("")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                // getPopupContainer={getParentNode}
              >
                {this.getCouncilOption()}
              </Select>
              <div className="form-headings">
                {this.formatMessage(messages.regYear)}
              </div>
              {/* <Input
                placeholder="Year"
                className={"form-inputs"}
                value={year}
                onChange={e => this.setYear(key, e)}
              /> */}
              <Select
                className="form-inputs"
                placeholder="Select Year"
                value={year ? year : null}
                onChange={this.setRegYear(key)}
              >
                {this.getYearOptions()}
              </Select>
              <div className="form-headings">
                {this.formatMessage(messages.expDate)}
              </div>

              <DatePicker
                value={expiryDate}
                disabledDate={this.disabledDate}
                onChange={this.setExpiryDate(key)}
                placeholder="Select Expiry Date"
              />

              <div className="form-headings">
                {this.formatMessage(messages.photo)}
              </div>
              <div className="qualification-photo-uploads">
                {photos.map((pic, index) => {
                  return (
                    <div
                      key={`registration-${index}`}
                      className={"qualification-avatar-uploader"}
                    >
                      <img src={pic} className="wp100 hp100 br4" />
                      <div className="overlay"></div>
                      <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container">
                        {" "}
                        <DeleteTwoTone
                          className={"del doc-opt "}
                          onClick={this.handleRemoveListRegistration(key, pic)}
                          twoToneColor="#fff"
                        />{" "}
                        <EyeTwoTone
                          className="w20"
                          className={"del doc-opt pointer"}
                          onClick={this.handleDocumentViewOpen(pic)}
                          twoToneColor="#fff"
                        />
                      </div>
                    </div>
                  );
                })}
                {photos.length < 3 && (
                  <Upload
                    multiple={true}
                    style={{ width: 128, height: 128, margin: 6 }}
                    beforeUpload={this.handleBeforeUploadRegistration(key)}
                    showUploadList={false}
                    disabled={
                      !(number && registration_council_id && year) ||
                      photos.length >= 3
                    }
                    fileList={photo}
                    customRequest={this.customRequestRegistration(key)}
                    onChange={this.handleChangeListRegistration(key, fileList)}
                    // onRemove={this.handleRemoveList(key)}
                    listType="picture-card"
                    // onPreview={this.handlePreview}
                  >
                    {uploadButton}
                  </Upload>
                )}
                {/* <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal> */}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  validateData = () => {
    let {
      speciality_id = "",
      gender = "",
      registration = {},
      education = {},
    } = this.state;
    let newEducation = Object.values(education);
    let newRegistration = Object.values(registration);

    if (!speciality_id) {
      message.error(this.formatMessage(messages.specialityError));
      return false;
    } else if (!gender) {
      message.error(this.formatMessage(messages.genderError));
      return false;
      // } else if (!registration_number) {
      //   message.error('Please enter your Registration number.')
      //   return false;
    } else if (!newEducation.length) {
      message.error(this.formatMessage(messages.eduDetError));
      return false;
      // }
      // else if (!registration_council) {
      //   message.error('Please enter Registration council.')
      //   return false;
      // } else if (!parseInt(registration_year)) {
      //   message.error('Please enter your Registration year.')
      //   return false;
    } else {
      for (let edu of newEducation) {
        let {
          degree_id = "",
          college_name = "",
          college_id = "",
          year = "",
          photos = [],
        } = edu;
        if (!degree_id || (!college_id && !college_name) || !parseInt(year)) {
          message.error(this.formatMessage(messages.allEduDetError));
          return false;
        }

        if (!photos.length) {
          message.error(this.formatMessage(messages.add1PhotoEduError));
          return false;
        }
      }
      for (let reg of newRegistration) {
        let {
          number = "",
          expiryDate = "",
          registration_council_id = "",
          year = "",
          photos = [],
        } = reg;
        if (
          year > moment(expiryDate).year() ||
          moment(expiryDate).isBefore(moment())
        ) {
          message.error(this.formatMessage(messages.expDateError));
          return false;
        }
        if (
          !number ||
          !expiryDate ||
          !parseInt(year) ||
          !registration_council_id
        ) {
          message.error(this.formatMessage(messages.allRegDetails));
          return false;
        }
        if (!photos.length) {
          message.error(this.formatMessage(messages.add1PhotoRegError));
          return false;
        }
      }
    }
    return true;
  };

  onNextClick = () => {
    const { history } = this.props;
    const validate = this.validateData();
    if (validate) {
      const {
        speciality_id = "",
        gender = "",
        registration = {},
        education = {},
        doctor_id = "",
      } = this.state;
      // let newEducation = Object.values(education);
      let newEducation = [];
      for (let edu of Object.values(education)) {
        let {
          college_name = "",
          college_id = "",
          degree_id = "",
          id = "",
          photos = [],
          year = "",
        } = edu;
        let localEdu = {
          college_name,
          college_id: college_id.toString(),
          degree_id: degree_id.toString(),
          id: id.toString(),
          photos,
          year,
        };
        newEducation.push(localEdu);
      }
      // let newRegistration = Object.values(registration);
      let newRegistration = [];
      for (let reg of Object.values(registration)) {
        let {
          expiryDate = "",
          registration_council_id = "",
          number = "",
          photos = [],
          year = "",
          id = "",
        } = reg;
        let localReg = {
          expiry_date: expiryDate,
          registration_council_id: registration_council_id.toString(),
          id: id.toString(),
          number,
          photos,
          year,
        };
        newRegistration.push(localReg);
      }

      newEducation.forEach((edu, index) => {
        // delete edu.photo;
      });
      newRegistration.forEach((reg, index) => {
        // delete reg.photo;
      });
      const data = {
        speciality_id,
        gender,
        registration_details: newRegistration,
        qualification_details: newEducation,
        doctor_id,
      };
      const { doctorQualificationRegister, authenticated_category } =
        this.props;
      doctorQualificationRegister(data).then((response) => {
        const { status, payload: { message: res_message = "" } = {} } =
          response;
        if (status) {
          message.success(this.formatMessage(messages.qualificationAddSuccess));

          if (authenticated_category === USER_CATEGORY.PROVIDER) {
            if (
              window.location.href.includes(`${PATH.REGISTER_FROM_PROFILE}`)
            ) {
              history.push(`/doctors/${doctor_id}`);
            } else {
              history.replace(`${PATH.REGISTER_CLINICS}/${doctor_id}`);
            }
          } else if (
            (authenticated_category === USER_CATEGORY.DOCTOR ||
              authenticated_category === USER_CATEGORY.HSP) &&
            window.location.href.includes(PATH.REGISTER_FROM_MY_PROFILE)
          ) {
            history.replace(PATH.PROFILE);
          } else {
            history.replace(PATH.REGISTER_CLINICS);
          }
        } else {
          message.error(res_message);
        }
      });
    } else {
      // message.error('Something went wrong');
    }
  };

  onBackClick = () => {
    const { history, authenticated_category } = this.props;
    const { doctor_id } = this.state;
    if (authenticated_category === USER_CATEGORY.PROVIDER) {
      if (window.location.href.includes(`${PATH.REGISTER_FROM_PROFILE}`)) {
        history.push(`/doctors/${doctor_id}`);
      } else {
        history.replace(`${PATH.REGISTER_PROFILE}/${doctor_id}`);
      }
    } else if (
      (authenticated_category === USER_CATEGORY.DOCTOR ||
        authenticated_category === USER_CATEGORY.HSP) &&
      window.location.href.includes(PATH.REGISTER_FROM_MY_PROFILE)
    ) {
      history.replace(PATH.PROFILE);
    } else {
      history.replace(PATH.REGISTER_PROFILE);
    }
  };

  renderQualificationForm = () => {
    const { speciality_id = "", gender = "" } = this.state;

    return (
      <div className="form-block">
        <div className="form-headings">
          {this.formatMessage(messages.speciality)}
        </div>

        <Select
          onFocus={this.handleSpecialitySearch}
          onSearch={this.handleSpecialitySearch}
          notFoundContent={
            this.state.fetchingSpeciality ? (
              <Spin size="small" />
            ) : (
              "No match found"
            )
          }
          className="form-inputs"
          placeholder="Select Speciality"
          showSearch
          value={`${speciality_id ? speciality_id.toString() : ""}`}
          onChange={this.setSpeciality}
          // onFocus={() => handleMedicineSearch("")}
          autoComplete="off"
          // onFocus={() => handleMedicineSearch("")}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          // getPopupContainer={getParentNode}
        >
          {this.getSpecialityOption()}
        </Select>
        {/*<Input*/}
        {/*  placeholder="Speciality"*/}
        {/*  className={"form-inputs"}*/}
        {/*  value={speciality}*/}
        {/*  onChange={this.setSpeciality}*/}
        {/*/>*/}
        <div className="form-headings">
          {this.formatMessage(messages.gender)}
        </div>
        <div className="wp100 mt6 mb18 flex justify-space-around">
          <div
            className={
              gender === MALE
                ? "gender-selected mr12"
                : "gender-unselected mr12"
            }
            onClick={this.setGender(MALE)}
          >
            M
          </div>

          <div
            className={
              gender === FEMALE
                ? "gender-selected mr12"
                : "gender-unselected mr12"
            }
            onClick={this.setGender(FEMALE)}
          >
            F
          </div>

          <div
            className={
              gender === OTHER
                ? "gender-selected mr12"
                : "gender-unselected mr12"
            }
            onClick={this.setGender(OTHER)}
          >
            O
          </div>
        </div>
        <div className="flex justify-space-between align-center direction-row">
          <div className="form-category-headings">
            {this.formatMessage(messages.education)}
          </div>
          <div
            className="pointer fs16 medium theme-green"
            onClick={this.addEducation}
          >
            {this.formatMessage(messages.addMore)}
          </div>
        </div>
        {this.renderEducation()}

        <div className="flex justify-space-between align-center direction-row">
          <div className="form-category-headings">
            {this.formatMessage(messages.regDetails)}
          </div>
          <div
            className="pointer fs16 medium theme-green"
            onClick={this.addRegistration}
          >
            {this.formatMessage(messages.addMore)}
          </div>
        </div>
        {this.renderRegistration()}
      </div>
    );
  };

  render() {
    const { authenticated_category = "" } = this.props;

    const { viewModalVisible, viewModalSrc } = this.state;

    const { handleDocumentViewClose } = this;

    return (
      <Fragment>
        {/* <SideMenu {...this.props} /> */}
        <div className="registration-container">
          {authenticated_category === USER_CATEGORY.PROVIDER ? (
            <div className="header">
              {this.formatMessage(messages.createNewProfile)}
            </div>
          ) : (
            <div className="header">
              {this.formatMessage(messages.createProfile)}
            </div>
          )}{" "}
          <div className="registration-body">
            <div className="flex mt36">
              <UploadSteps current={1} />
            </div>
            <div className="flex mb100">{this.renderQualificationForm()}</div>
          </div>
          <div className="footer">
            <div className={"footer-text-active"} onClick={this.onBackClick}>
              {this.formatMessage(messages.back)}
            </div>
            <div className={"footer-text-active"} onClick={this.onNextClick}>
              {this.formatMessage(messages.next)}
            </div>
          </div>
        </div>
        <Modal
          visible={viewModalVisible}
          closable
          mask
          maskClosable
          onCancel={handleDocumentViewClose}
          width={`50%`}
          footer={[
            <Button key="back" onClick={handleDocumentViewClose}>
              Close
            </Button>,
          ]}
        >
          <img
            src={viewModalSrc}
            alt="qualification document"
            className="wp100"
          />
        </Modal>
      </Fragment>
    );
  }
}

export default withRouter(injectIntl(QualificationRegister));
