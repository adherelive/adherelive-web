import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { DeleteTwoTone } from "@ant-design/icons";
import uuid from "react-uuid";
import {
  Tabs,
  Button,
  Steps,
  Col,
  Select,
  Input,
  Upload,
  Modal,
  TimePicker,
  Icon,
  message,
} from "antd";
import SideMenu from "./sidebar";
import { REQUEST_TYPE } from "../../constant";
import { getUploadURL } from "../../Helper/urls/user";
import { doRequest } from "../../Helper/network";
import plus from "../../Assets/images/plus.png";

const { Step } = Steps;

const { Option } = Select;

const UploadSteps = ({ current, className }) => {
  const { Step } = Steps;
  return (
    <Steps
      className={`ml64 mr64 wa ${className}`}
      current={current}
      direction="vertical"
    >
      <Step title={"Profile"} />
      <Step title={"Qualifications"} />
      <Step title={"Clinics"} />
    </Steps>
  );
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: "",
      previewTitle: "",
      name: "",
      email: "",
      phone_no: "",
      category: "",
      city: "",
      prefix: "",
      imageUrl: "",
      gender: "",
      speciality: "",
      registrationNumber: "",
      registrationCouncil: "",
      registrationYear: "",
      loading: false,
      education: {},
      educationKeys: [],
      clinics: {},
      clinicsKeys: [],
      docs: [],
      fileList: [],
      step: 0,
    };
  }

  componentDidMount() {
    let key = uuid();
    let key1 = uuid();

    let education = {};
    education[key] = { degree: "", college: "", year: "", photo: [] };
    let educationKeys = [key];
    this.setState({ education, educationKeys });

    let clinics = {};
    clinics[key1] = { name: "", location: "", startTime: {}, endTime: {} };
    let clinicsKeys = [key1];
    this.setState({ clinics, clinicsKeys });
    // window.addEventListener('popstate', this.onBackButtonEvent);
  }

  // onBackButtonEvent=

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  addEducation = () => {
    let key = uuid();
    let { education = {}, educationKeys = [] } = this.state;
    let newEducation = education;
    let newEducationKeys = educationKeys;
    newEducation[key] = { degree: "", college: "", year: "", photo: [] };
    newEducationKeys.push(key);
    this.setState({ education: newEducation, educationKeys: newEducationKeys });
  };

  addClinic = () => {
    let key = uuid();
    let { clinics = {}, clinicsKeys = [] } = this.state;
    let newClinics = clinics;
    let newclinicsKeys = clinicsKeys;
    newClinics[key] = { name: "", location: "", startTime: "", endTime: "" };
    newclinicsKeys.push(key);
    this.setState({ clinics: newClinics, clinicsKeys: newclinicsKeys });
  };

  deleteClinic = (key) => () => {
    let { clinics = {}, clinicsKeys = [] } = this.state;
    let newClinics = clinics;
    let newclinicsKeys = clinicsKeys;
    delete newClinics[key];
    newclinicsKeys.splice(newclinicsKeys.indexOf(key), 1);
    this.setState({ clinics: newClinics, clinicsKeys: newclinicsKeys });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  deleteEducation = (key) => () => {
    let { education = {}, educationKeys = [] } = this.state;
    let newEducation = education;
    let newEducationKeys = educationKeys;
    delete newEducation[key];
    newEducationKeys.splice(newEducationKeys.indexOf(key), 1);
    this.setState({ education: newEducation, educationKeys: newEducationKeys });
  };

  handleChange = (info) => {
    // if (info.file.status === 'uploading') {
    //   this.setState({ loading: true });
    //   return;
    // }
    // if (info.file.status === 'done') {
    // Get this url from response in real world.
    this.getBase64(info.file.originFileObj, (imageUrl) =>
      this.setState({
        imageUrl,
        loading: false,
      })
    );
  };
  //   };

  setName = (e) => {
    this.setState({ name: e.target.value });
  };

  setSpeciality = (e) => {
    this.setState({ speciality: e.target.value });
  };

  setRegNo = (e) => {
    this.setState({ registrationNumber: e.target.value });
  };

  setRegCouncil = (e) => {
    this.setState({ registrationCouncil: e.target.value });
  };

  setRegYear = (e) => {
    this.setState({ registrationYear: e.target.value });
  };

  setNumber = (e) => {
    this.setState({ phone_no: e.target.value });
  };

  setCategory = (value) => {
    this.setState({ category: value });
  };

  setGender = (value) => {
    this.setState({ gender: value });
  };

  setCity = (e) => {
    this.setState({ city: e.target.value });
  };

  setEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  setPrefix = (value) => {
    this.setState({ prefix: value });
  };

  setDegree = (key, e) => {
    let { education = {} } = this.state;
    let newEducation = education;
    newEducation[key].degree = e.target.value;
    this.setState({ education: newEducation });
  };
  setCollege = (key, e) => {
    let { education = {} } = this.state;
    let newEducation = education;
    newEducation[key].college = e.target.value;
    this.setState({ education: newEducation });
  };
  setYear = (key, e) => {
    let { education = {} } = this.state;
    let newEducation = education;
    newEducation[key].year = e.target.value;
    this.setState({ education: newEducation });
  };

  setClinicName = (key, e) => {
    let { clinics = {} } = this.state;
    let newClinics = clinics;
    newClinics[key].name = e.target.value;
    this.setState({ clinics: newClinics });
  };

  setClinicLocation = (key, e) => {
    let { clinics = {} } = this.state;
    let newClinics = clinics;
    newClinics[key].location = e.target.value;
    this.setState({ clinics: newClinics });
  };

  setClinicStartTime = (key) => (time, timeString) => {
    let { clinics = {} } = this.state;
    let newClinics = clinics;
    newClinics[key].startTime = time;
    this.setState({ clinics: newClinics });
  };

  setClinicEndTime = (key) => (time, timeString) => {
    let { clinics = {} } = this.state;
    let newClinics = clinics;
    newClinics[key].endTime = time;
    this.setState({ clinics: newClinics });
  };

  onBackClick = () => {
    let { step = 0 } = this.state;
    step--;
    this.setState({ step });
  };
  onNextClick = () => {
    let { step = 0 } = this.state;
    step++;
    this.setState({ step });
  };

  getCategoryOptions = () => {
    const genderes = [
      { name: "Doctor", value: "dactor" },
      { name: "Patient", value: "patient" },
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

  onUploadComplete = ({ files = [] }, key) => {
    const { docs } = this.state;
    this.setState({ docs: [...docs, ...files] }, () => {
      const { docs, fileList, education } = this.state;
      let { photos = [] } = education[key] || {};

      if (
        docs.length === education[key].photo.length ||
        docs.length + photos.length === education[key].photo.length
      ) {
        let newEducation = education;
        newEducation[key].photos = [...photos, ...docs];
        education[key].photo.forEach((item, index) => {
          item.status = "done";
        });
        this.setState({
          fileList: [],
          docs: [],
          education: newEducation,
        });
      }
    });
  };

  customRequest =
    (key) =>
    ({ file, filename, onError, onProgress, onSuccess }) => {
      const { onUploadComplete } = this;

      const { docs, fileList, education } = this.state;
      // setTimeout(() => {
      //     education[key].photo.forEach((item,index)=>{
      //         item.status='done'
      //     })
      // },100);

      let data = new FormData();
      data.append("files", file, file.name);
      doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: getUploadURL(),
      }).then((response) => {
        onUploadComplete(response.payload.data, key);
      });

      return {
        abort() {},
      };
    };

  handleChangeList = (key) => (info) => {
    const fileList = info.fileList;
    let { education = {} } = this.state;
    let newEducation = education;
    fileList.forEach((item, index) => {
      let uid = item.uid;
      let push = true;
      newEducation[key].photo.forEach((pic, picindex) => {
        if (pic.uid === uid) {
          push = false;
        }
      });
      if (push) {
        newEducation[key].photo.push(item);
      }
    });

    this.setState({ education: newEducation });
  };

  handleRemoveList = (key) => (file) => {
    let { education = {} } = this.state;
    let newEducation = education;
    let deleteIndex = -1;
    let deleteIndexOfUrls = -1;
    let fileName = file.name.replace(/\s+/g, "");
    newEducation[key].photo.forEach((pic, index) => {
      if (pic.uid == file.uid) {
        deleteIndex = index;
      }
    });

    newEducation[key].photos.forEach((pic, index) => {
      if (pic.includes(fileName)) {
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
  };

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

  renderEducation = () => {
    let {
      education = {},
      educationKeys = [],
      fileList = [],
      previewImage = "",
      previewTitle = "",
      previewVisible = false,
    } = this.state;

    const uploadButton = (
      <div>
        <img src={plus} className={"w22 h22"} />
      </div>
    );
    return (
      <div className="flex direction-column">
        {educationKeys.map((key) => {
          let { photo = [] } = education[key];
          return (
            <div key={key}>
              {educationKeys.indexOf(key) > 0 ? (
                <div className="wp100 flex justify-end">
                  <DeleteTwoTone
                    className={"pointer align-self-end"}
                    onClick={this.deleteEducation(key)}
                    twoToneColor="#cc0000"
                  />
                </div>
              ) : null}
              <div className="form-headings">Degree</div>
              <Input
                placeholder="Degree"
                className={"form-inputs"}
                onChange={(e) => this.setDegree(key, e)}
              />
              <div className="form-headings">College</div>
              <Input
                placeholder="College"
                className={"form-inputs"}
                onChange={(e) => this.setCollege(key, e)}
              />
              <div className="form-headings">Year</div>
              <Input
                placeholder="Year"
                className={"form-inputs"}
                onChange={(e) => this.setYear(key, e)}
              />
              <div className="form-headings">Photo</div>
              <div className="qualification-photo-uploads">
                <Upload
                  multiple={true}
                  className="avatar-uploader"
                  //      showUploadList={false}
                  fileList={photo}
                  customRequest={this.customRequest(key)}
                  onChange={this.handleChangeList(key, fileList)}
                  onRemove={this.handleRemoveList(key)}
                  listType="picture-card"
                  // fileList={fileList}
                  onPreview={this.handlePreview}
                >
                  {uploadButton}
                </Upload>
                <Modal
                  visible={previewVisible}
                  title={previewTitle}
                  footer={null}
                  onCancel={this.handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={previewImage}
                  />
                </Modal>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  renderClinics = () => {
    let { clinicsKeys = [] } = this.state;

    return (
      <div className="flex direction-column">
        {clinicsKeys.map((key) => {
          return (
            <div key={key}>
              {clinicsKeys.indexOf(key) > 0 ? (
                <div className="wp100 flex justify-end">
                  <DeleteTwoTone
                    className={"pointer align-self-end"}
                    onClick={this.deleteClinic(key)}
                    twoToneColor="#cc0000"
                  />
                </div>
              ) : null}
              <div className="form-headings">Name</div>
              <Input
                placeholder="Clinic name"
                className={"form-inputs"}
                onChange={(e) => this.setClinicName(key, e)}
              />
              <div className="form-headings">Location</div>
              <Input
                placeholder="Location"
                className={"form-inputs"}
                onChange={(e) => this.setClinicLocation(key, e)}
              />
              <div className="flex justify-space-between mb10">
                <div className="flex direction-column">
                  <div className="form-headings">Start Time</div>
                  <TimePicker onChange={this.setClinicStartTime(key)} />
                </div>
                <div className="flex direction-column">
                  <div className="form-headings">End Time</div>
                  <TimePicker onChange={this.setClinicEndTime(key)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  uploadDp = (file) => {
    const { imageUrl } = this.state;

    return {
      abort() {},
    };
  };

  renderProfileForm = () => {
    const prefixSelector = (
      <Select className="flex align-center h50 w70" onChange={this.setPrefix}>
        {/* australia */}
        <Option value="61">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+61</div>
          </div>
        </Option>
        {/* india */}
        <Option value="91">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+91</div>
          </div>
        </Option>
        {/* us */}
        <Option value="1">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+1</div>
          </div>
        </Option>
        {/* uk */}
        <Option value="44">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+44</div>
          </div>
        </Option>
        {/* china */}
        <Option value="86">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+86</div>
          </div>
        </Option>
        {/* japan */}
        <Option value="81">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+81</div>
          </div>
        </Option>
        {/* germany */}
        <Option value="49">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+49</div>
          </div>
        </Option>
        {/* france */}
        <Option value="33">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+33</div>
          </div>
        </Option>
        {/* switzerland */}
        <Option value="41">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+41</div>
          </div>
        </Option>

        {/* russia */}
        <Option value="7">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+7</div>
          </div>
        </Option>
        {/* south africa */}
        <Option value="27">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+27</div>
          </div>
        </Option>
        {/* pakistan */}
        <Option value="92">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+92</div>
          </div>
        </Option>
        {/* bangladesh */}
        <Option value="880">
          <div className="flex align-center">
            <Icon type="flag" theme="filled" />
            <div className="ml4">+880</div>
          </div>
        </Option>
      </Select>
    );
    const uploadButton = (
      <div>
        <img src={plus} className={"w22 h22"} />
      </div>
    );
    const { imageUrl } = this.state;
    return (
      <div className="form-block">
        <div className="form-headings">Profile Type</div>
        <Select className="form-inputs" onChange={this.setCategory}>
          {this.getCategoryOptions()}
        </Select>
        <div className="form-headings">Profile Picture</div>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={this.uploadDp}
          beforeUpload={this.beforeUpload}
          onChange={this.handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            uploadButton
          )}
        </Upload>
        <div className="form-headings">Name</div>
        <Input
          placeholder="Name"
          className={"form-inputs"}
          onChange={this.setName}
        />

        <div className="form-headings">Phone number</div>
        <Input
          addonBefore={prefixSelector}
          placeholder="Phone number"
          className={"form-inputs"}
          onChange={this.setNumber}
        />

        <div className="form-headings">Email</div>
        <Input
          placeholder="Email"
          className={"form-inputs"}
          onChange={this.setEmail}
        />

        <div className="form-headings">City</div>
        <Input
          placeholder="City"
          className={"form-inputs"}
          onChange={this.setCity}
        />
      </div>
    );
  };
  renderQualificationForm = () => {
    return (
      <div className="form-block">
        <div className="form-headings">Speciality</div>
        <Input
          placeholder="Speciality"
          className={"form-inputs"}
          onChange={this.setSpeciality}
        />
        <div className="form-headings">Gender</div>
        <Select className=".form-inputs" onChange={this.setGender}>
          {this.getGenderOptions()}
        </Select>

        <div className="form-category-headings">Education</div>
        <div
          className="pointer align-self-end wp60 fs16 medium tar"
          onClick={this.addEducation}
        >
          Add More
        </div>
        {this.renderEducation()}
        <div className="form-category-headings">Registration details</div>
        <div className="form-headings">Registration number</div>
        <Input
          placeholder="Registration number"
          className={"form-inputs"}
          onChange={this.setRegNo}
        />

        <div className="form-headings">Registration council</div>
        <Input
          placeholder="Registration council"
          className={"form-inputs"}
          onChange={this.setRegCouncil}
        />

        <div className="form-headings">Registration year</div>
        <Input
          placeholder="Registration year"
          className={"form-inputs"}
          onChange={this.setRegYear}
        />
      </div>
    );
  };

  renderClinicForm = () => {
    return (
      <div className="form-block">
        <div className="form-category-headings">Clinic</div>
        <div
          className="pointer align-self-end wp60 fs16 medium tar"
          onClick={this.addClinic}
        >
          Add More
        </div>
        {this.renderClinics()}
      </div>
    );
  };

  // // formatMessage = data => this.props.intl.formatMessage(data);

  render() {
    // const {graphs} = this.props;
    // const {formatMessage, renderChartTabs} = this;
    const { step } = this.state;

    return (
      <Fragment>
        <SideMenu {...this.props} />
        <div className="registration-container">
          <div className="header">Create your Profile</div>
          <div className="registration-body">
            <div className="flex">
              <UploadSteps className="mt24" current={step} />
            </div>
            <div className="flex">
              {step == 0
                ? this.renderProfileForm()
                : step == 1
                ? this.renderQualificationForm()
                : this.renderClinicForm()}
            </div>
          </div>
          <div className="footer">
            <div
              className={
                step > 0 ? "footer-text-active" : "footer-text-inactive"
              }
              onClick={step != 0 ? this.onBackClick : null}
            >
              Back
            </div>
            <div
              className={
                step < 2 ? "footer-text-active" : "footer-text-inactive"
              }
              onClick={step < 2 ? this.onNextClick : null}
            >
              Next
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(Register);
