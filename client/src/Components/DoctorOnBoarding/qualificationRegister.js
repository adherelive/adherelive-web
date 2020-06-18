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
import { getUploadQualificationDocumentUrl } from '../../Helper/urls/doctor';
import { doRequest } from '../../Helper/network';
import UploadSteps from './steps';
import plus from '../../Assets/images/plus.png';
// import YearPicker from "react-year-picker";
import moment from 'moment';
import { withRouter } from "react-router-dom";

const { YearPicker } = DatePicker;


const { Option } = Select;

let wait = ms => new Promise((r, j) => setTimeout(r, ms))


class QualificationRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      speciality: '',
      gender: '',
      registration_number: '',
      registration_council: '',
      registration_year: '',
      education: {},
      educationKeys: [],
      docs: [],
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
    const { authenticated_user = {}, getDoctorQualificationRegisterData } = this.props;

    const { basic_info: { id = 1 } = {} } = authenticated_user;

    await getDoctorQualificationRegisterData(id);

    const { onBoarding = {} } = this.props;
    let { qualificationData: { speciality = '', gender = '', registration_number = '', registration_council = '', registration_year = parseInt(moment().format("YYYY")), qualification_details = [] } = {} } = onBoarding || {};
    registration_year=registration_year?registration_year:parseInt(moment().format("YYYY"));
    let educationKeys = [];
    let education = {};

    if (qualification_details.length) {
      for (let qualification of qualification_details) {
        let key = uuid();
        qualification.photo = [];
        qualification.photos = qualification.photos && qualification.photos.length ? qualification.photos : [];
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

    console.log("DID MOUNT KA SETSTATEE",onBoarding.qualificationData, speciality, gender, registration_number, registration_council, registration_year, education, educationKeys);
    this.setState({ speciality, gender, registration_number, registration_council, registration_year, education, educationKeys });
  }

  setSpeciality = e => {
    this.setState({ speciality: e.target.value });
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

  setGender = value => {
    this.setState({ gender: value });
  };

  setRegNo = e => {
    this.setState({ registration_number: e.target.value });
  };

  setRegCouncil = e => {
    this.setState({ registration_council: e.target.value });
  };

  setRegYear = value => {
    this.setState({ registration_year: value });
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
    newEducation[key].degree = e.target.value;
    this.setState({ education: newEducation });
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

      console.log('KEYS AND FILES IN ON UPLOAD COMPLETE BEFORE SET STATE', docs,files);
    this.setState({ docs: [...docs, ...files] },async ()=>{
    //  async () => {

      const { docs, fileList, education } = this.state;
      console.log('KEYS AND FILES IN ON UPLOAD COMPLETE AFTER SET STATE', docs,files);
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
        console.log('KEYS AND FILES IN ON UPLOAD COMPLETE0000000',degree,year,college,photos,id,newEducation);
      let response=await  registerQualification(qualificationData, userId)
        // .then(response => {
          const { status,statusCode, payload: { data: { qualification_id = 0 } = {} } = {} } = response;

          console.log('KEYS AND FILES IN ON UPLOAD COMPLETE111111111',status,statusCode,docs);
          if (status) {
            if(!newEducation[key].id){
            newEducation[key].id = qualification_id;
            }
     
            console.log('KEYS AND FILES IN ON UPLOAD COMPLETE22222222',newEducation);

            this.setState({
              docs: [],
              education: newEducation
            });
          } else {

            let length=newEducation[key].photos.length;
            newEducation[key].photo=newPhoto.slice(0,length-docs.length);

            newEducation[key].photos=newPhotos;
            
            console.log('KEYS AND FILES IN ON UPLOAD ELSEEEEEEEEEE',newEducation);
            this.setState({
              docs: [],
              education: newEducation
            });
            if(statusCode==422){

            message.error('Please do not add more than 3 per education.')
            }else{
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
    const { basic_info: { id = 1 } = {} } = authenticated_user || {};
    let qualificationData = { degree, college, year };
    console.log('FILEEE IN CUSTOM REQUESTTTTIFFFFFFFF', qualification, id);


    let data = new FormData();
    data.append("files", file, file.name);
    // data.append("qualification", JSON.stringify(qualificationData));

    let uploadResponse = await doRequest({
      method: REQUEST_TYPE.POST,
      data: data,
      url: getUploadQualificationDocumentUrl(id)
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

        let index=0;
        // newEducation[key].photo.forEach((file, index) => {
          for(let file of newEducation[key].photo){
          console.log('TYPE OFFFF STRING ===========>', typeof (file), typeof (file) == 'string' && file.localeCompare(pic));
          if (typeof (file) == 'string') {

            console.log('TYPE OFFFF STRING IFFF TRUEE=========>', typeof (file), file);
            if (file.localeCompare(pic)) {
              deleteIndex = index;
            }
          } else {
            
            let fileName = file.name
            let newFileName = fileName.replace(/\s/g, '');
            console.log('TYPE OFFFF STRING ELSEEEE TRUEE=======>', typeof (file), pic,newFileName,pic.includes(newFileName),file);
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
    newEducation[key] = { degree: "", college: "", year:parseInt(moment().format('YYYY')) , photo: [], photos: [], id: 0 };
    newEducationKeys.push(key);
    // console.log("NEWWWWWWWWWW AFTER ADDDDD",key,newEducation[key],newEducationKeys);
    this.setState({ education: newEducation, educationKeys: newEducationKeys });
  }

  deleteEducation = (key) => () => {
    let { education = {}, educationKeys = [] } = this.state;
    let newEducation = education;
    let newEducationKeys = educationKeys;
    delete newEducation[key];
    newEducationKeys.splice(newEducationKeys.indexOf(key), 1);
    this.setState({ education: newEducation, educationKeys: newEducationKeys });
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
                  disabled={!(degree && college && year) ||photos.length>=3}
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

  validateData = () => {
    let { speciality = '',
      gender = '',
      registration_number = '',
      registration_council = '',
      registration_year = '',
      education = {} } = this.state;
    let newEducation = Object.values(education);
    if (!speciality) {
      message.error('Please enter you Speciality.')
      return false;
    } else if (!gender) {
      message.error('Please select your gender.')
      return false;
    } else if (!registration_number) {
      message.error('Please enter your Registration number.')
      return false;
    } else if (!newEducation.length) {
      message.error('Please enter your Education details.')
      return false;
    }
    else if (!registration_council) {
      message.error('Please enter Registration council.')
      return false;
    } else if (!parseInt(registration_year)) {
      console.log("REGISTRATION YEARRRRRRR",!parseInt(registration_year),registration_year,registration_year,this.state.registration_year,this.state);
      message.error('Please enter your Registration year.')
      return false;
    } else {
      for (let edu of newEducation) {
        let { degree = '', college = '', year = '', photos = [] } = edu;
        if (!degree || !college || !parseInt(year) || !photos.length) {

          message.error('Please enter all Education details.')
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
      const { speciality = '', gender = '', registration_number = '', registration_council = '', registration_year = '', education = {} } = this.state;
      let newEducation = Object.values(education);
      newEducation.forEach((edu, index) => {
        delete edu.photo;
      })
      // console.log('ONCLICKKKKKK8797897', newEducation);
      const data = { speciality, gender, registration_number, registration_council, registration_year, qualification_details: newEducation };
      const { doctorQualificationRegister } = this.props;
      doctorQualificationRegister(data, id).then(response => {
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
        <Select className="form-inputs" placeholder="Select Gender" value={gender} onChange={this.setGender}>
          {this.getGenderOptions()}
        </Select>

        <div className='flex justify-space-between align-center direction-row'>
          <div className='form-category-headings'>Education</div>
          <div className='pointer fs16 medium' onClick={this.addEducation}>Add More</div>
        </div>
        {this.renderEducation()}
        <div className='form-category-headings'>Registration details</div>
        <div className='form-headings'>Registration number</div>
        <Input
          placeholder="Registration number"
          value={registration_number}
          className={"form-inputs"}
          onChange={this.setRegNo}
        />

        <div className='form-headings'>Registration council</div>
        <Input
          placeholder="Registration council"
          value={registration_council}
          className={"form-inputs"}
          onChange={this.setRegCouncil}
        />

        <div className='form-headings'>Registration year</div>
        <Select className="form-inputs" placeholder="Select Registration Year" value={registration_year ? registration_year : null} placeholder={'Select Registration Year'} onChange={this.setRegYear}>
          {this.getYearOptions()}
        </Select>
      </div>
    );
  }



  render() {
    console.log("STATEEEEEEEEEEE BEFOREUPLOAD", this.state,parseInt(moment().format("YYYY")));
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