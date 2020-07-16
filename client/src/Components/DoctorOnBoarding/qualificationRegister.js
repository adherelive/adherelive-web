import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone, DeleteOutlined } from "@ant-design/icons";
import uuid from 'react-uuid';
import { Tabs, Button, Steps, Col, Select, Input, InputNumber, DatePicker, Upload, Modal, TimePicker, Icon, message } from "antd";
import SideMenu from "./sidebar";
import { REQUEST_TYPE, PATH } from '../../constant';
import { getUploadURL } from '../../Helper/urls/user';
import { getUploadQualificationDocumentUrl, getUploadRegistrationDocumentUrl } from '../../Helper/urls/doctor';
import { doRequest } from '../../Helper/network';
import UploadSteps from './steps';
import plus from '../../Assets/images/plus.png';
// import YearPicker from "react-year-picker";
import moment from 'moment';
import { withRouter } from "react-router-dom";

const MALE = 'm';
const FEMALE = 'f';
const OTHER = 'o';

const { YearPicker } = DatePicker;


const { Option } = Select;

let wait = ms => new Promise((r, j) => setTimeout(r, ms))


class QualificationRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speciality: '',
      gender: '',
      education: {},
      educationKeys: [],
      registration: {},
      registrationKeys: [],
      docs: [],
      docsReg: [],
      loading: '',
      previewVisible: false,
      previewImage: '',
      previewTitle: '',

    };
  }


  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {


    const { getDoctorQualificationRegisterData } = this.props;
    await getDoctorQualificationRegisterData();
    const { authenticated_user = '', users, doctors = {} } = this.props;
    let docGender = '';
    let docSpeciality = '';
    let doctorId = 0;
    let docQualificationIds = [];
    let docRegistrationIds = [];
    for (let doctor of Object.values(doctors)) {
      console.log("ONBOARDING DATA IN FETCH DATATA+++++++ 213124343242", doctor);
      const { basic_info: { user_id = 0, id = 0, gender = '', speciality = '' }, doctor_qualification_ids = [], doctor_registration_ids = [] } = doctor;

      console.log("ONBOARDING DATA IN FETCH DATATA-------- 213124343242", doctor_qualification_ids, doctor_registration_ids);
      if (parseInt(user_id) === parseInt(authenticated_user)) {
        docGender = gender;
        docSpeciality = speciality;
        doctorId = id;
        docQualificationIds = doctor_qualification_ids;
        docRegistrationIds = doctor_registration_ids;
      }
    }

    const { onBoarding = {}, doctor_registrations = {}, doctor_qualifications = {}, upload_documents = {} } = this.props;
    let { qualificationData: { speciality = '', gender = '', qualification_details = [] } = {} } = onBoarding || {};
    // registration_year=registration_year?registration_year:parseInt(moment().format("YYYY"));
    let educationKeys = [];
    let education = {};
    let registrationKeys = [];
    let registration = {};

    if (docQualificationIds.length) {
      for (let qualifi of docQualificationIds) {
        let key = uuid();

        let qualification = {};
        let { basic_info: { year = '', college = '', degree = '', id = 0, doctor_id = 0 }, upload_document_ids = [], expiry_date = '' } = doctor_qualifications[qualifi];

        qualification.id = id;
        qualification.year = year;
        qualification.college = college;
        qualification.degree = degree;
        let photos = [];
        for (let doc of upload_document_ids) {
          let { basic_info: { document = '' } } = upload_documents[doc];
          photos.push(document);
        }
        qualification.photos = photos;
        qualification.photo = [];
        if (!qualification.photo || qualification.photo && !qualification.photo.length) {

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

      education[key] = { degree: "", college: "", year: parseInt(moment().format("YYYY")), photo: [], photos: [], id: 0 };
      educationKeys = [key];
    }


    console.log("ONBOARDING DATA IN FETCH DATATA0000 213124343242", docQualificationIds, docRegistrationIds, doctor_qualifications, Object.values(doctor_registrations).length);
    if (docRegistrationIds.length) {

      for (let regis of docRegistrationIds) {

        console.log("ONBOARDING DATA IN FETCH DATATA 213124343242", regis);
        let photos = [];
        let key = uuid();
        let { basic_info: { year = '', council = '', number = '', id = 0, doctor_id = 0 }, upload_document_ids = [], expiry_date = '' } = doctor_registrations[regis];
        if (parseInt(doctorId) === parseInt(doctor_id)) {
          registration[key] = { year, expiryDate: moment(expiry_date), council, number, id };
          registration[key].photo = [];
          for (let doc of upload_document_ids) {
            let { basic_info: { document = '' } } = upload_documents[doc];
            photos.push(document);
          }
          registration[key].photos = photos;
          registrationKeys.push(key);
        }
        console.log("ONBOARDING DATA IN FETCH DATATA", registration, registrationKeys);
      }

    } else {
      let key1 = uuid();
      registration[key1] = { number: "", council: "", year: parseInt(moment().format("YYYY")), expiryDate: '', photo: [], photos: [], id: 0 };
      registrationKeys = [key1];
    }

    // console.log(onBoarding.qualificationData, speciality, gender, registration_number, registration_council, registration_year, education, educationKeys);
    this.setState({ speciality: docSpeciality, gender: docGender, registration, registrationKeys, education, educationKeys });
  }

  setSpeciality = e => {
    const { value } = e.target;
    const reg = /^[a-zA-Z][a-zA-Z\s]*$/;
    // console.log('8423907492837589723859325', value, reg.test(value));
    if (reg.test(value) || value === '') {
      this.setState({ speciality: e.target.value });
    }
  };

  getYearOptions = () => {
    let currYear = moment().format("YYYY");
    let curryearNum = parseInt(currYear);
    let years = [];
    for (let year = curryearNum - 100; year <= curryearNum; year++) {
      years.push(<Option key={year} value={year} name={year}>
        {year}
      </Option>)
    }
    return years;
  }

  setGender = value => () => {
    this.setState({ gender: value });
  };

  setRegNo = (key, e) => {
    let { registration = {} } = this.state;
    let newRegistration = registration;
    newRegistration[key].number = e.target.value;
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({ registration: newRegistration });
    }
  };

  setRegCouncil = (key, e) => {
    let { registration = {} } = this.state;
    let newRegistration = registration;
    newRegistration[key].council = e.target.value;
    this.setState({ registration: newRegistration });
  };

  setRegYear = key => (value) => {
    let { registration = {} } = this.state;
    let newRegistration = registration;
    newRegistration[key].year = value;
    this.setState({ registration: newRegistration });
  };


  setExpiryDate = key => (date, dateString) => {
    let { registration = {} } = this.state;
    let newRegistration = registration;
    newRegistration[key].expiryDate = date;
    this.setState({ registration: newRegistration });
  };

  getGenderOptions = () => {
    const genderes = [
      { name: "Female", value: "f" },
      { name: "Male", value: "m" },
      { name: "Other", value: "o" }
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



  setDegree = (key, e) => {
    let { education = {} } = this.state;
    let newEducation = education;
    const { value } = e.target;
    const reg = /^[a-zA-Z][a-zA-Z\s]*$/;
    // console.log('8423907492837589723859325', value, reg.test(value));
    if (reg.test(value) || value === '') {
      newEducation[key].degree = e.target.value;
      this.setState({ education: newEducation });
    }
  }
  setCollege = (key, e) => {
    let { education = {} } = this.state;
    let newEducation = education;
    newEducation[key].college = e.target.value;
    this.setState({ education: newEducation });
  }
  setYear = key => (value) => {
    let { education = {} } = this.state;
    let newEducation = education;
    console.log('DATEEEEEEEEEEEEEEEEEE', value);
    newEducation[key].year = value;
    // newEducation[key].year = dateString;
    this.setState({ education: newEducation });
  }

  onUploadComplete = async ({ files = [] }, key) => {

    const { docs = [], education = {}, speciality = '', gender = '' } = this.state;

    console.log('KEYS AND FILES IN ON UPLOAD COMPLETE BEFORE SET STATE', docs, files);
    this.setState({ docs: [...docs, ...files] }, async () => {
      //  async () => {

      const { docs, fileList, education } = this.state;
      console.log('KEYS AND FILES IN ON UPLOAD COMPLETE AFTER SET STATE', docs, files);
      let newEducation = education;
      // console.log('KEYS AND FILES IN ON UPLOAD COMPLETE', docs.length, newEducation[key].photo.length,  newEducation[key].photos, docs.length === newEducation[key].photo.length);
      if (docs.length === newEducation[key].photo.length || docs.length + newEducation[key].photos.length === newEducation[key].photo.length) {
        let newPhotos = newEducation[key].photos;
        let newPhoto = newEducation[key].photo;
        // console.log('KEYS AND FILES IN ON UPLOAD COMPLETE1111111', newEducation);
        const { registerQualification } = this.props;
        const { authenticated_user } = this.props;
        const { basic_info: { id: userId = 1 } = {} } = authenticated_user || {};
        newEducation[key].photos = [...newPhotos, ...docs];
        newEducation[key].photo.forEach((item, index) => {
          if (typeof (item) != 'string') {
            item.status = 'done'
          }
        })

        const { degree = '', year = '', college = '', photos = [], id = 0 } = newEducation[key];
        let qualData = { degree, year, college, photos, id };
        let qualificationData = { speciality, gender, qualification: qualData };
        console.log('KEYS AND FILES IN ON UPLOAD COMPLETE0000000', degree, year, college, photos, id, newEducation);
        let response = await registerQualification(qualificationData)
        // .then(response => {
        const { status, statusCode, payload: { data: { qualification_id = 0 } = {} } = {} } = response;

        console.log('KEYS AND FILES IN ON UPLOAD COMPLETE111111111', status, statusCode, docs);
        if (status) {
          if (!newEducation[key].id) {
            newEducation[key].id = qualification_id;
          }

          console.log('KEYS AND FILES IN ON UPLOAD COMPLETE22222222', newEducation);

          this.setState({
            docs: [],
            education: newEducation
          });
        } else {

          let length = newEducation[key].photos.length;
          newEducation[key].photo = newPhoto.slice(0, length - docs.length);

          newEducation[key].photos = newPhotos;

          console.log('KEYS AND FILES IN ON UPLOAD ELSEEEEEEEEEE', newEducation);
          this.setState({
            docs: [],
            education: newEducation
          });
          if (statusCode == 422) {

            message.error('Please do not add more than 3 per education.')
          } else {
            message.error('Something went wrong.')
          }
        }
        // });
      }
    });
  };

  onUploadCompleteRegistration = async ({ files = [] }, key) => {

    let { docsReg = [], speciality = '', gender = '' } = this.state;

    console.log('KEYS AND FILES IN ON UPLOAD COMPLETE BEFORE SET STATE', docsReg, files);
    this.setState({ docsReg: [...docsReg, ...files] }, async () => {
      //  async () => {

      let { docsReg, fileList, registration = {}, education } = this.state;
      console.log('KEYS AND FILES IN ON UPLOAD COMPLETE AFTER SET STATE', docsReg, files);
      let newRegistration = registration;
      // console.log('KEYS AND FILES IN ON UPLOAD COMPLETE', docs.length, newRegistration[key].photo.length,  newRegistration[key].photos, docs.length === newRegistration[key].photo.length);
      if (docsReg.length === newRegistration[key].photo.length || docsReg.length + newRegistration[key].photos.length === newRegistration[key].photo.length) {
        let newPhotos = newRegistration[key].photos;
        let newPhoto = newRegistration[key].photo;
        console.log('KEYS AND FILES IN ON UPLOAD COMPLETE==========>', newPhotos);
        const { registerRegistration } = this.props;
        const { authenticated_user } = this.props;
        const { basic_info: { id: userId = 1 } = {} } = authenticated_user || {};
        newRegistration[key].photos = [...newPhotos, ...docsReg];
        newRegistration[key].photo.forEach((item, index) => {
          if (typeof (item) != 'string') {
            item.status = 'done'
          }
        })

        const { number = '', council = '', year, expiryDate = '', photos = [], id = 0 } = newRegistration[key];
        let regData = { number, council, year, expiry_date: expiryDate, photos, id };
        let registrationData = { speciality, gender, qualification_details: Object.values(education), registration: regData };
        // console.log('KEYS AND FILES IN ON UPLOAD COMPLETE0000000',degree,year,college,photos,id,newRegistration);
        let response = await registerRegistration(registrationData, userId)
        // .then(response => {
        const { status, statusCode, payload: { data: { registration_id = 0 } = {} } = {} } = response;

        console.log('KEYS AND FILES IN ON UPLOAD COMPLETE111111111', status, statusCode, docsReg);
        if (status) {
          if (!newRegistration[key].id) {
            newRegistration[key].id = registration_id;
          }

          console.log('KEYS AND FILES IN ON UPLOAD COMPLETE22222222', newRegistration);

          this.setState({
            docsReg: [],
            registration: newRegistration
          });
        } else {

          let length = newRegistration[key].photos.length;
          newRegistration[key].photo = newPhoto.slice(0, length - docsReg.length);

          newRegistration[key].photos = newPhotos.slice(0, length - docsReg.length);

          console.log('KEYS AND FILES IN ON UPLOAD ELSEEEEEEEEEE', newRegistration, length, newPhotos);
          this.setState({
            docsReg: [],
            registration: newRegistration
          });
          if (statusCode == 422) {

            message.error('Please do not add more than 3 per registration.')
          } else {
            message.error('Something went wrong.')
          }
        }
        // });
      }
    });
  };


  customRequest = key => async ({ file, filename, onError, onProgress, onSuccess }) => {

    const { onUploadComplete } = this;
    console.log(" IN customRequest AFTRE BEFOREUPLOAD");

    let { docs = [], fileList = [], education = {}, speciality = '', gender = '' } = this.state;


    let qualification = education[key];

    let { id: qualificationId = 0, degree = '', college = '', year = '' } = qualification;

    console.log('FILEEE IN CUSTOM REQUESTTTT', file, file.uid, typeof (file));

    const { registerQualification } = this.props;
    const { history, authenticated_user } = this.props;
    // const { basic_info: { id = 1 } = {} } = authenticated_user || {};
    let qualificationData = { degree, college, year };
    console.log('FILEEE IN CUSTOM REQUESTTTTIFFFFFFFF', qualification);


    let data = new FormData();
    data.append("files", file, file.name);
    // data.append("qualification", JSON.stringify(qualificationData));

    let uploadResponse = await doRequest({
      method: REQUEST_TYPE.POST,
      data: data,
      url: getUploadQualificationDocumentUrl()
    })

    let { status = false } = uploadResponse;

    if (status) {
      onUploadComplete(uploadResponse.payload.data, key);
    } else {
      message.error('Something went wrong.')
    }



    return {
      abort() { }
    };
  };

  customRequestRegistration = key => async ({ file, filename, onError, onProgress, onSuccess }) => {

    const { onUploadCompleteRegistration } = this;
    console.log(" IN customRequest AFTRE BEFOREUPLOAD");

    let { docs = [], fileList = [], registration = {}, speciality = '', gender = '' } = this.state;


    let newReg = registration[key];

    let { id: qualificationId = 0, degree = '', college = '', year = '' } = newReg;

    console.log('FILEEE IN CUSTOM REQUESTTTT', file, file.uid, typeof (file));


    let data = new FormData();
    data.append("files", file, file.name);

    let uploadResponse = await doRequest({
      method: REQUEST_TYPE.POST,
      data: data,
      url: getUploadRegistrationDocumentUrl()
    })

    let { status = false } = uploadResponse;

    if (status) {
      onUploadCompleteRegistration(uploadResponse.payload.data, key);
    } else {
      message.error('Something went wrong.')
    }



    return {
      abort() { }
    };
  };

  handleChangeList = key => info => {

    const fileList = info.fileList;
    let { education = {} } = this.state;
    let newEducation = education;
    let { photos = [], photo = [] } = newEducation[key];
    console.log('FILE LISTTTTTTTT', newEducation[key].photo, fileList);
    for (let item of fileList) {

      let uid = item.uid;
      let push = true;
      console.log('Please do not add duplicate files FILE LISTTTTTTTT', item, fileList, typeof (item) == 'object');


      if (typeof (item) == 'object') {
        for (let photo of photos) {

          console.log('BEFOREUPLOAD CALLEDDDDDDDDDD RETURN FALSEEE');
          let { name = '' } = item;
          let fileName = name;
          let newFileName = fileName.replace(/\s/g, '');
          if (photo.includes(newFileName)) {
            push = false;
          }
        }
      }
      if (newEducation[key].photo && newEducation[key].photo.length) {
        for (let pic of newEducation[key].photo) {
          // console.log('UIDS BEFOREUPLOADDDDD=========>',pic.uid && pic.uid === uid ,pic.status,pic,item);
          if (pic.uid === uid) {
            push = false;
          }
        }
      }
      if (push) {
        newEducation[key].photo.push(item);
      }
    };

    this.setState({ education: newEducation });
  };


  handleChangeListRegistration = key => info => {

    const fileList = info.fileList;
    let { registration = {} } = this.state;
    let newRegistration = registration;
    let { photos = [], photo = [] } = newRegistration[key];
    console.log('FILE LISTTTTTTTT', newRegistration[key].photo, fileList);
    for (let item of fileList) {

      let uid = item.uid;
      let push = true;
      console.log('Please do not add duplicate files FILE LISTTTTTTTT', item, fileList, typeof (item) == 'object');


      if (typeof (item) == 'object') {
        for (let photo of photos) {

          console.log('BEFOREUPLOAD CALLEDDDDDDDDDD RETURN FALSEEE');
          let { name = '' } = item;
          let fileName = name;
          let newFileName = fileName.replace(/\s/g, '');
          if (photo.includes(newFileName)) {
            push = false;
          }
        }
      }
      if (newRegistration[key].photo && newRegistration[key].photo.length) {
        for (let pic of newRegistration[key].photo) {
          // console.log('UIDS BEFOREUPLOADDDDD=========>',pic.uid && pic.uid === uid ,pic.status,pic,item);
          if (pic.uid === uid) {
            push = false;
          }
        }
      }
      if (push) {
        newRegistration[key].photo.push(item);
      }
    };

    this.setState({ registration: newRegistration });
  };

  handleRemoveList = (key, pic) => () => {

    let { education = {} } = this.state;
    let newEducation = education;
    let { deleteDoctorQualificationImage } = this.props;
    let { id: qualificationId = 0 } = newEducation[key];
    let deleteIndex = -1;
    let deleteIndexOfUrls = -1;

    deleteDoctorQualificationImage(qualificationId, pic).then(response => {
      let { status = false } = response;
      if (status) {

        let index = 0;
        // newEducation[key].photo.forEach((file, index) => {
        for (let file of newEducation[key].photo) {
          console.log('TYPE OFFFF STRING ===========>', typeof (file), typeof (file) == 'string' && file.localeCompare(pic));
          if (typeof (file) == 'string') {

            console.log('TYPE OFFFF STRING IFFF TRUEE=========>', typeof (file), file);
            if (file.localeCompare(pic)) {
              deleteIndex = index;
            }
          } else {

            let fileName = file.name
            let newFileName = fileName.replace(/\s/g, '');
            console.log('TYPE OFFFF STRING ELSEEEE TRUEE=======>', typeof (file), pic, newFileName, pic.includes(newFileName), file);
            if (pic.includes(newFileName)) {

              console.log('TYPE OFFFF STRING ELSEEEE IFFFF TRUEE=======>', typeof (file));
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
        })
        if (deleteIndex > -1) {
          newEducation[key].photo.splice(deleteIndex, 1);
        }
        if (deleteIndexOfUrls > -1) {
          newEducation[key].photos.splice(deleteIndexOfUrls, 1);
        }
        this.setState({ education: newEducation });
      } else {
        message.error('Something went wrong');
      }
    })

  };


  handleRemoveListRegistration = (key, pic) => () => {

    let { registration = {} } = this.state;
    let newRegistration = registration;
    let { deleteDoctorRegistrationImage } = this.props;
    let { id: registrationId = 0 } = newRegistration[key];
    let deleteIndex = -1;
    let deleteIndexOfUrls = -1;

    deleteDoctorRegistrationImage(registrationId, pic).then(response => {
      let { status = false } = response;
      if (status) {

        let index = 0;
        // newRegistration[key].photo.forEach((file, index) => {
        for (let file of newRegistration[key].photo) {
          console.log('TYPE OFFFF STRING ===========>', typeof (file), typeof (file) == 'string' && file.localeCompare(pic));
          if (typeof (file) == 'string') {

            console.log('TYPE OFFFF STRING IFFF TRUEE=========>', typeof (file), file);
            if (file.localeCompare(pic)) {
              deleteIndex = index;
            }
          } else {

            let fileName = file.name
            let newFileName = fileName.replace(/\s/g, '');
            console.log('TYPE OFFFF STRING ELSEEEE TRUEE=======>', typeof (file), pic, newFileName, pic.includes(newFileName), file);
            if (pic.includes(newFileName)) {

              console.log('TYPE OFFFF STRING ELSEEEE IFFFF TRUEE=======>', typeof (file));
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
        })
        if (deleteIndex > -1) {
          newRegistration[key].photo.splice(deleteIndex, 1);
        }
        if (deleteIndexOfUrls > -1) {
          newRegistration[key].photos.splice(deleteIndexOfUrls, 1);
        }
        this.setState({ registration: newRegistration });
      } else {
        message.error('Something went wrong');
      }
    })

  };

  handleCancel = () => this.setState({ previewVisible: false });

  getBase64File = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64File(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  addEducation = () => {
    let key = uuid();
    let { education = {}, educationKeys = [] } = this.state;
    let newEducation = education;
    let newEducationKeys = educationKeys;
    newEducation[key] = { degree: "", college: "", year: parseInt(moment().format('YYYY')), photo: [], photos: [], id: 0 };
    newEducationKeys.push(key);
    // console.log("NEWWWWWWWWWW AFTER ADDDDD",key,newEducation[key],newEducationKeys);
    this.setState({ education: newEducation, educationKeys: newEducationKeys });
  }

  addRegistration = () => {
    let key = uuid();
    let { registration = {}, registrationKeys = [] } = this.state;
    let newRegistration = registration;
    let newRegistrationKeys = registrationKeys;
    newRegistration[key] = { number: "", council: "", year: parseInt(moment().format('YYYY')), expiryDate: '', photo: [], photos: [], id: 0 };
    newRegistrationKeys.push(key);
    // console.log("NEWWWWWWWWWW AFTER ADDDDD",key,newEducation[key],newEducationKeys);
    this.setState({ registration: newRegistration, registrationKeys: newRegistrationKeys });

  }

  deleteEducation = (key) => () => {
    let { education = {}, educationKeys = [] } = this.state;
    let newEducation = education;
    let newEducationKeys = educationKeys;
    delete newEducation[key];
    newEducationKeys.splice(newEducationKeys.indexOf(key), 1);
    this.setState({ education: newEducation, educationKeys: newEducationKeys });
  }

  deleteRegistration = (key) => () => {
    let { registration = {}, registrationKeys = [] } = this.state;
    let newRegistration = registration;
    let newRegistrationKeys = registrationKeys;
    delete newRegistration[key];
    newRegistrationKeys.splice(newRegistrationKeys.indexOf(key), 1);
    this.setState({ registration: newRegistration, registrationKeys: newRegistrationKeys });
  }

  setId = (education) => {
    let setEdu = new Promise(resolve => this.setState({ education }, resolve(true)))
    return setEdu;
  }

  popLast = key => () => {
    console.log('POPLAST WAS CALLEDDD', key);
    let { education = {} } = this.state;
    let newPhoto = education[key].photo;
    newPhoto.pop();
    education[key].photo = newPhoto;
    this.setState({ education });
  }

  handleBeforeUpload = key => (file, fileList) => {
    let { education = {}, speciality = '', gender = '' } = this.state;
    let { degree = '', college = '', year = '', id = 0, photos = [] } = education[key];
    console.log('BEFOREUPLOAD CALLEDDDDDDDDDD')


    for (let photo of photos) {
      let fileName = file.name
      let newFileName = fileName.replace(/\s/g, '');
      if (photo.includes(newFileName)) {
        message.error('Please do not add duplicate files');
        return false;
      }
    }
    return true

  }

  handleBeforeUploadRegistration = key => (file, fileList) => {
    let { registration = {}, speciality = '', gender = '' } = this.state;
    let { degree = '', college = '', year = '', id = 0, photos = [] } = registration[key];
    console.log('BEFOREUPLOAD CALLEDDDDDDDDDD')
    for (let photo of photos) {
      let fileName = file.name
      let newFileName = fileName.replace(/\s/g, '');
      if (photo.includes(newFileName)) {
        message.error('Please do not add duplicate files');
        return false;
      }
    }
    return true;

  }

  renderEducation = () => {
    // console.log("Render Education is ==============> 23829823 ===========>  ", this.state);
    let { education = {}, educationKeys = [], fileList = [], previewImage = '', previewTitle = '', previewVisible = false, isopen, time } = this.state;


    const uploadButton = (
      <div>
        <img src={plus} className={"w22 h22"} />
      </div>
    );
    return (
      <div className='flex direction-column'>
        {educationKeys.map(key => {
          let { photo = [], degree, college, year, photos = [] } = education[key];
          // console.log('PHOTOOOOOOOOOOOOOOO', photo);
          return (

            <div key={key}>
              <div className='flex justify-space-between align-center direction-row'>
                <div className='form-headings'>Degree</div>
                {educationKeys.indexOf(key) > 0 ? (
                  <DeleteTwoTone
                    className={"pointer"}
                    onClick={this.deleteEducation(key)}
                    twoToneColor="#cc0000"
                  />
                ) : <div></div>}
              </div>
              <Input
                placeholder="Degree"
                value={degree}
                className={"form-inputs"}
                onChange={e => this.setDegree(key, e)}
              />
              <div className='form-headings'>College</div>
              <Input
                placeholder="College"
                value={college}
                className={"form-inputs"}
                onChange={e => this.setCollege(key, e)}
              />
              <div className='form-headings'>Year</div>
              {/* <Input
                placeholder="Year"
                className={"form-inputs"}
                value={year}
                onChange={e => this.setYear(key, e)}
              /> */}
              <Select className="form-inputs" placeholder="Select Year" value={year ? year : null} onChange={this.setYear(key)}>
                {this.getYearOptions()}
              </Select>

              {/* <DatePicker mode="year" value={moment(year,'YYYY')} format={'YYYY'} placeholder={'Select Year'} onChange={this.setYear}/> */}
              <div className='form-headings'>Photo</div>
              <div className='qualification-photo-uploads'>
                {photos.map(pic => {
                  return (
                    <div key={pic} className={"qualification-avatar-uploader"}>
                      <img src={pic} className='wp100 hp100 br4' />
                      <div className="overlay"></div>
                      <div className="button"> <DeleteTwoTone
                        className={"del"}
                        onClick={this.handleRemoveList(key, pic)}
                        twoToneColor="#fff"
                      /> </div>
                    </div>
                  );
                })}
                <Upload
                  multiple={true}
                  style={{ width: 128, height: 128, margin: 6 }}
                  beforeUpload={this.handleBeforeUpload(key)}
                  showUploadList={false}
                  disabled={!(degree && college && year) || photos.length >= 3}
                  fileList={photo}
                  customRequest={this.customRequest(key)}
                  onChange={this.handleChangeList(key, fileList)}
                  // onRemove={this.handleRemoveList(key)}
                  listType="picture-card"
                // onPreview={this.handlePreview}

                >
                  {uploadButton}
                </Upload>
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
        })
        }
      </div>
    );

  }

  renderRegistration = () => {
    // console.log("Render Education is ==============> 23829823 ===========>  ", this.state);
    let { registration = {}, registrationKeys = [], fileList = [], previewImage = '', previewTitle = '', previewVisible = false, isopen, time } = this.state;


    const uploadButton = (
      <div>
        <img src={plus} className={"w22 h22"} />
      </div>
    );
    return (
      <div className='flex direction-column'>
        {registrationKeys.map(key => {
          let { photo = [], number, council, expiryDate, year, photos = [] } = registration[key];
          // console.log('PHOTOOOOOOOOOOOOOOO', photo);
          return (

            <div key={key}>
              <div className='flex justify-space-between align-center direction-row'>
                <div className='form-headings'>Registration Number</div>
                {registrationKeys.indexOf(key) > 0 ? (
                  <DeleteTwoTone
                    className={"pointer"}
                    onClick={this.deleteRegistration(key)}
                    twoToneColor="#cc0000"
                  />
                ) : <div></div>}
              </div>
              <Input
                placeholder="Registration number"
                value={number}
                maxLength={20}
                className={"form-inputs"}
                onChange={e => this.setRegNo(key, e)}
              />
              <div className='form-headings'>Registration Council</div>
              <Input
                placeholder="Registration council"
                value={council}
                className={"form-inputs"}
                onChange={e => this.setRegCouncil(key, e)}
              />
              <div className='form-headings'> Registration Year</div>
              {/* <Input
                placeholder="Year"
                className={"form-inputs"}
                value={year}
                onChange={e => this.setYear(key, e)}
              /> */}
              <Select className="form-inputs" placeholder="Select Year" value={year ? year : null} onChange={this.setRegYear(key)}>
                {this.getYearOptions()}
              </Select>
              <div className='form-headings'> Expiry Date</div>

              <DatePicker value={expiryDate} onChange={this.setExpiryDate(key)} placeholder='Select Expiry Date' />

              <div className='form-headings'>Photo</div>
              <div className='qualification-photo-uploads'>
                {photos.map(pic => {
                  return (
                    <div key={pic} className={"qualification-avatar-uploader"}>
                      <img src={pic} className='wp100 hp100 br4' />
                      <div className="overlay"></div>
                      <div className="button"> <DeleteTwoTone
                        className={"del"}
                        onClick={this.handleRemoveListRegistration(key, pic)}
                        twoToneColor="#fff"
                      /> </div>
                    </div>
                  );
                })}
                <Upload
                  multiple={true}
                  style={{ width: 128, height: 128, margin: 6 }}
                  beforeUpload={this.handleBeforeUploadRegistration(key)}
                  showUploadList={false}
                  disabled={!(number && council && year) || photos.length >= 3}
                  fileList={photo}
                  customRequest={this.customRequestRegistration(key)}
                  onChange={this.handleChangeListRegistration(key, fileList)}
                  // onRemove={this.handleRemoveList(key)}
                  listType="picture-card"
                // onPreview={this.handlePreview}

                >
                  {uploadButton}
                </Upload>
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
        })
        }
      </div>
    );

  }

  validateData = () => {
    let { speciality = '',
      gender = '',
      registration = {},
      education = {} } = this.state;
    let newEducation = Object.values(education);
    let newRegistration = Object.values(registration);
    if (!speciality) {
      message.error('Please enter you Speciality.')
      return false;
    } else if (!gender) {
      message.error('Please select your gender.')
      return false;
      // } else if (!registration_number) {
      //   message.error('Please enter your Registration number.')
      //   return false;
    } else if (!newEducation.length) {
      message.error('Please enter your Education details.')
      return false;
      // }
      // else if (!registration_council) {
      //   message.error('Please enter Registration council.')
      //   return false;
      // } else if (!parseInt(registration_year)) {
      //   console.log("REGISTRATION YEARRRRRRR",!parseInt(registration_year),registration_year,registration_year,this.state.registration_year,this.state);
      //   message.error('Please enter your Registration year.')
      //   return false;
    } else {
      for (let edu of newEducation) {
        let { degree = '', college = '', year = '', photos = [] } = edu;
        if (!degree || !college || !parseInt(year)) {

          message.error('Please enter all Education details.')
          return false;
        }
      }
      for (let reg of newRegistration) {
        let { number = '', expiryDate = '', council = '', year = '', photos = [] } = reg;
        if (year > moment(expiryDate).year() || moment(expiryDate).isBefore(moment())) {
          message.error('Please select valid expiry date for registration.')
          return false;
        }
        if (!number || !expiryDate || !parseInt(year) || !photos.length || !council) {

          message.error('Please enter all Registration details.')
          return false;
        }
      }
    }
    return true;
  }

  onNextClick = () => {
    const { history, authenticated_user } = this.props;
    const validate = this.validateData();
    if (validate) {
      const { basic_info: { id = 1 } = {} } = authenticated_user || {};
      const { speciality = '', gender = '', registration = {}, education = {} } = this.state;
      let newEducation = Object.values(education);
      let newRegistration = Object.values(registration);
      newEducation.forEach((edu, index) => {
        delete edu.photo;
      })
      newRegistration.forEach((reg, index) => {
        delete reg.photo;
      })
      // console.log('ONCLICKKKKKK8797897', newEducation);
      const data = { speciality, gender, registration_details: newRegistration, qualification_details: newEducation };
      const { doctorQualificationRegister } = this.props;
      doctorQualificationRegister(data).then(response => {
        const { status } = response;
        if (status) {
          history.replace(PATH.REGISTER_CLINICS);
        } else {
          message.error('Something went wrong');
        }
      });
    } else {
      // message.error('Something went wrong');
    }
  }

  onBackClick = () => {
    const { history } = this.props;
    history.replace(PATH.REGISTER_PROFILE);
  }



  renderQualificationForm = () => {
    const { speciality = '', gender = '', registration_number = '', registration_council = '', registration_year = '' } = this.state
    return (
      <div className='form-block'>
        <div className='form-headings'>Speciality</div>
        <Input
          placeholder="Speciality"
          className={"form-inputs"}
          value={speciality}
          onChange={this.setSpeciality}
        />
        <div className='form-headings'>Gender</div>
        <div className='wp100 mt6 mb18 flex justify-space-around'>
          <div className={gender === MALE ? 'gender-selected mr12' : 'gender-unselected mr12'} onClick={this.setGender(MALE)}>M</div>

          <div className={gender === FEMALE ? 'gender-selected mr12' : 'gender-unselected mr12'} onClick={this.setGender(FEMALE)}>F</div>

          <div className={gender === OTHER ? 'gender-selected mr12' : 'gender-unselected mr12'} onClick={this.setGender(OTHER)}>O</div>
        </div>
        <div className='flex justify-space-between align-center direction-row'>
          <div className='form-category-headings'>Education</div>
          <div className='pointer fs16 medium theme-green' onClick={this.addEducation}>Add More</div>
        </div>
        {this.renderEducation()}

        <div className='flex justify-space-between align-center direction-row'>
          <div className='form-category-headings'>Registration details</div>
          <div className='pointer fs16 medium theme-green' onClick={this.addRegistration}>Add More</div>
        </div>
        {this.renderRegistration()}
      </div>
    );
  }



  render() {
    console.log("STATEEEEEEEEEEE BEFOREUPLOAD", this.state);
    return (
      <Fragment>
        {/* <SideMenu {...this.props} /> */}
        <div className='registration-container'>
          <div className='header'>Create your Profile</div>
          <div className='registration-body'>
            <div className='flex mt36'>
              <UploadSteps current={1} />
            </div>
            <div className='flex'>
              {this.renderQualificationForm()}
            </div>
          </div>
          <div className='footer'>
            <div className={'footer-text-active'} onClick={this.onBackClick}>
              Back
                      </div>
            <div className={'footer-text-active'} onClick={this.onNextClick}>Next</div></div>
        </div>
      </Fragment>
    );
  }
}
export default withRouter(injectIntl(QualificationRegister));