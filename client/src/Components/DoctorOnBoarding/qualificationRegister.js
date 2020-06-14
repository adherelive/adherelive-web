import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone, DeleteOutlined } from "@ant-design/icons";
import uuid from 'react-uuid';
import { Tabs, Button, Steps, Col, Select, Input, InputNumber, Upload, Modal, TimePicker, Icon, message } from "antd";
import SideMenu from "./sidebar";
import { REQUEST_TYPE, PATH } from '../../constant';
import { getUploadURL } from '../../Helper/urls/user';
import { getUploadQualificationDocumentUrl } from '../../Helper/urls/doctor';
import { doRequest } from '../../Helper/network';
import UploadSteps from './steps';
import plus from '../../Assets/images/plus.png';
import { withRouter } from "react-router-dom";


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
    let { qualificationData: { speciality = '', gender = '', registration_number = '', registration_council = '', registration_year = '', qualification_details = [] } = {} } = onBoarding || {};
    let educationKeys = [];
    let education = {};

    if (qualification_details.length) {
      for (let qualification of qualification_details) {
        let key = uuid();
        qualification.photo = [];
        education[key] = qualification;
        educationKeys.push(key);
      }

    } else {
      let key = uuid();
      education[key] = { degree: "", college: "", year: "", photo: [], photos: [],id:0 };
      educationKeys = [key];
    }

    console.log(onBoarding.qualificationData, speciality, gender, registration_number, registration_council, registration_year, education, educationKeys);
    this.setState({ speciality, gender, registration_number, registration_council, registration_year, education, educationKeys });
  }

  setSpeciality = e => {
    this.setState({ speciality: e.target.value });
  };

  setGender = value => {
    this.setState({ gender: value });
  };

  setRegNo = e => {
    this.setState({ registration_number: e.target.value });
  };

  setRegCouncil = e => {
    this.setState({ registration_council: e.target.value });
  };

  setRegYear = e => {
    this.setState({ registration_year: e.target.value });
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
  setYear = (key, e) => {
    let { education = {} } = this.state;
    let newEducation = education;
    newEducation[key].year = e.target.value;
    this.setState({ education: newEducation });
  }

  onUploadComplete = ({ files = [], qualification_id = 0 }, key) => {
     
    const { docs = [], education = {},speciality='',gender='' } = this.state;
    education[key].id = qualification_id;
    this.setState({ docs: [...docs, ...files], education }, () => {
      const { docs, fileList, education } = this.state;
      let { photos = [] } = education[key] || {};

      console.log('KEYS AND FILES IN ON UPLOAD COMPLETE', docs.length, education[key].photo.length, photos, docs.length === education[key].photo.length);
      if (docs.length === education[key].photo.length || docs.length + photos.length === education[key].photo.length) {
        let newEducation = education;
        newEducation[key].photos = [...photos, ...docs];
        console.log('KEYS AND FILES IN ON UPLOAD COMPLETE1111111', newEducation);
        const { registerQualification } = this.props;
        const { history, authenticated_user } = this.props;
        const { basic_info: { id:userId = 1 } = {} } = authenticated_user || {};
        newEducation[key].photo.forEach((item, index) => {
          item.status = 'done'
        })
        let qualData = newEducation[key];
        delete qualData.photo;
        let qualificationData={speciality,gender,qualification:qualData};
        registerQualification(qualificationData,userId).then(response=>{
          const{status,payload:{data:{qualification_id=0}={}}={}}=response;
          if(status){
          newEducation[key].id=qualification_id;
          this.setState({
            fileList: [],
            docs: [],
            education: newEducation
          });
        }else{
          message.error('Something went wrong.')
        }
        });
      

      

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

    setTimeout(async () => {
      let uploadResponse = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: getUploadQualificationDocumentUrl(id, qualificationId)
      })

      let { status = false } = uploadResponse;

      if (status) {
        onUploadComplete(uploadResponse.payload.data, key);
      } else {
        message.error('Something went wrong.')
      }
    }, 200)


    return {
      abort() { }
    };
  };

  handleChangeList = key => info => {

    const fileList = info.fileList;
    let { education = {} } = this.state;
    let newEducation = education;
    console.log('FILE LISTTTTTTTT', newEducation[key].photo, fileList);
    fileList.forEach((item, index) => {
      let uid = item.uid;
      let push = true;
      if (newEducation[key].photo && newEducation[key].photo.length) {
        newEducation[key].photo.forEach((pic, picindex) => {
          if (pic.uid === uid) {
            push = false;
          }
        })
      }
      if (push) {
        newEducation[key].photo.push(item);
      }
    })

    this.setState({ education: newEducation });
  };

  handleRemoveList = (key,pic) => () => {

    let { education = {} } = this.state;
    let newEducation = education;
    let{deleteDoctorQualificationImage}=this.props;
    let{id:qualificationId=0}=newEducation[key];
    let deleteIndex = -1;
    let deleteIndexOfUrls = -1;
    console.log('FILE REMOVEEEEEEEEE', key);
    
    deleteDoctorQualificationImage(qualificationId,pic).then(response=>{
      let{status=false}=response;
      if(status){
        
    // newEducation[key].photo.forEach((pic, index) => {
    //   if (pic.uid == file.uid) {
    //     deleteIndex = index;
    //   }
    // })

    newEducation[key].photos.forEach((picture, index) => {
      // if (pic.includes(fileName)) {
        if (pic==picture) {
        deleteIndexOfUrls = index;
      }
    })
    // if (deleteIndex > -1) {
    //   newEducation[key].photo.splice(deleteIndex, 1);
    // }
    if (deleteIndexOfUrls > -1) {
      newEducation[key].photos.splice(deleteIndexOfUrls, 1);
    }
    this.setState({ education: newEducation });
      }else{
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
    newEducation[key] = { degree: "", college: "", year: "", photo: [],id:0 };
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

  setId= (education)=>{
   let setEdu=  new Promise(resolve => this.setState({education }, resolve(true)))
   return setEdu;
  }

  // handleBeforeUpload = key => async (file, fileList) => {
  //   let { education = {},speciality='',gender='' } = this.state;
  //   let { degree = '', college = '', year = '', id = 0 } = education[key];
  //   console.log('IN BEFOREUPLOAD',file);
  //   if (id) {
  //     return true;
  //   } else {
  //     console.log('IN BEFOREUPLOAD ELSEEE');
  //     let { authenticated_user = {}, registerQualification } = this.props;
  //     const { basic_info: { id: userId = 1 } = {} } = authenticated_user || {};
  //     let quali={degree, year, college};
  //     let qualificationData = {gender , speciality ,qualification:quali };
  //       let response=await registerQualification(qualificationData, userId)
  //     //  .then(async response=>{
  //     console.log('IN BEFOREUPLOAD ELSEEE RESPONSE', response);
  //     let { status, payload } = response;
  //     if (status) {
  //       let { data: { qualification_id = 0 } = {} } = payload
  //       education[key].id = qualification_id;
  //      let value = await this.setId(education);
      
  //      console.log("VALUE RETURNEDDDDDD IN BEFOREUPLOAD ",value);
  //      return value;
  //     } else {
  //       console.log('IN BEFOREUPLOAD ELSEEE RESPONSE FALSSEEEE', response);
  //       message.error('Something went wrong');
  //       return false;
  //     }
  //     // }
  //     // );
  //   }
  // }

  renderEducation = () => {
    // console.log("Render Education is ==============> 23829823 ===========>  ", this.state);
    let { education = {}, educationKeys = [], fileList = [], previewImage = '', previewTitle = '', previewVisible = false } = this.state;
    // console.log(" 23829823  ------------------>  ", JSON.stringify(education, null, 4));
    // console.log(" 23829823 Keys  ------------------>  ", educationKeys);

    const uploadButton = (
      <div>
        <img src={plus} className={"w22 h22"} />
      </div>
    );
    return (
      <div className='flex direction-column'>
        {educationKeys.map(key => {
          let { photo = [], degree, college, year, photos = [] } = education[key];
          console.log('PHOTOOOOOOOOOOOOOOO', photo);
          return (

            <div key={key}>
              {educationKeys.indexOf(key) > 0 ? (
                <div className='wp100 flex justify-end'>
                  <DeleteTwoTone
                    className={"pointer align-self-end"}
                    onClick={this.deleteEducation(key)}
                    twoToneColor="#cc0000"
                  />
                </div>
              ) : null}
              <div className='form-headings'>Degree</div>
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
              <Input
                placeholder="Year"
                className={"form-inputs"}
                value={year}
                onChange={e => this.setYear(key, e)}
              />
              <div className='form-headings'>Photo</div>
              <div className='qualification-photo-uploads'>
                {photos.map(pic => {
                  return (
                    <div className={"qualification-avatar-uploader"}>
                      <img src={pic} className='wp100 hp100 br4' />
                      <div className="overlay"></div>
                      <div class="button"> <DeleteTwoTone
                        className={"del"}
                        onClick={this.handleRemoveList(key, pic)}
                        twoToneColor="#fff"
                      /> </div>
                    </div>
                  );
                })}
                <Upload
                  multiple={true}
                  // className="avatar-uploader"
                  style={{ width: 128, height: 128, margin: 6 }}
                  // beforeUpload={this.handleBeforeUpload(key)}
                  showUploadList={false}
                  disabled={!(degree && college && year)}
                  fileList={photo}
                  customRequest={this.customRequest(key)}
                  onChange={this.handleChangeList(key, fileList)}
                  // onRemove={this.handleRemoveList(key)}
                  listType="picture-card"
                  // fileList={fileList}
                  onPreview={this.handlePreview}

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

  onNextClick = () => {
    const { history, authenticated_user } = this.props;
    // const validate=this.validateData();
    // if(validate){
    const { basic_info: { id = 1 } = {} } = authenticated_user || {};
    const { speciality = '', gender = '', registration_number = '', registration_council = '', registration_year = '', education = {} } = this.state;
    let newEducation = Object.values(education);
    newEducation.forEach((edu, index) => {
      delete edu.photo;
    })
    console.log('ONCLICKKKKKK8797897', newEducation);
    const data = {  speciality, gender, registration_number, registration_council, registration_year, qualification_details: newEducation };
    const { doctorQualificationRegister } = this.props;
    doctorQualificationRegister(data,id).then(response => {
      const { status } = response;
      if (status) {
        history.replace(PATH.REGISTER_CLINICS);
      } else {
        message.error('Something went wrong');
      }
    });;
    // }
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
        <Select className=".form-inputs" value={gender} onChange={this.setGender}>
          {this.getGenderOptions()}
        </Select>

        <div className='form-category-headings'>Education</div>
        <div className='pointer align-self-end wp60 fs16 medium tar' onClick={this.addEducation}>Add More</div>
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
        <Input
          placeholder="Registration year"
          value={registration_year}
          className={"form-inputs"}
          onChange={this.setRegYear}
        />

      </div>
    );
  }



  render() {
    console.log("STATEEEEEEEEEEE", this.state);
    return (
      <Fragment>
        {/* <SideMenu {...this.props} /> */}
        <div className='registration-container'>
          <div className='header'>Create your Profile</div>
          <div className='registration-body'>
            <div className='flex'>
              <UploadSteps className="mt24" current={1} />
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