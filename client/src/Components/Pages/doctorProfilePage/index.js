import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import { Avatar, Upload, Input, Select, Spin } from "antd";
import throttle from "lodash-es/throttle";
import { doRequest } from '../../../Helper/network';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  ArrowLeftOutlined,
  FileTextOutlined,
  UserOutlined,
  EditOutlined,
  CameraFilled
} from "@ant-design/icons";
import moment from "moment";
import messages from "./messages";
import { getUploadURL, updateDoctorURL } from '../../../Helper/urls/doctor';
import { TABLE_DEFAULT_BLANK_FIELD, DAYS_TEXT_NUM, REQUEST_TYPE } from "../../../constant";
import { PageLoading } from "../../../Helper/loading/pageLoading";
import { withRouter } from "react-router-dom";

const { Option } = Select;

class DoctorProfilePage extends Component {
  constructor(props) {
    super(props);
    const { auth: {authenticated_user=null}, doctors, users } = this.props;
    const {
        basic_info: {
            first_name="",
            middle_name="",
            last_name="",
            profile_pic="",
            gender="",
            address="",
            speciality_id=""
          } = {},
    } = doctors[authenticated_user] || {};
    const {
        basic_info: {
            email="",
            mobile_number="",
            prefix="",
          } = {},
        category= ""
    } = users[authenticated_user] || {};
    this.state = {
        loading: false,
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        name: `${first_name} ${middle_name ? `${middle_name} ` : ""}${last_name ? last_name : ""}`,
        email: email,
        gender: gender,
        speciality_id: speciality_id,
        address: address,
        mobile_number: mobile_number,
        category: category,
        prefix: prefix,
        profile_pic: '',
        profile_pic_url: profile_pic,
        edit_name: false,
        edit_gender: false,
        edit_specialities: false,
        edit_city:false,
        fetchingSpeciality:false
    };
    this.handleSpecialitySearch = throttle(this.handleSpecialitySearch.bind(this), 2000);

  }

  componentDidMount() {

  }

  formatMessage = data => this.props.intl.formatMessage(data);

  updateProfileData = async (updateData) => {
    try {
        this.setState({ loading: true });
        const { auth: {authenticated_user=null}, doctors, users, updateDoctorBasicInfo } = this.props;
        const { id } = authenticated_user;
        let response = await updateDoctorBasicInfo(authenticated_user,updateData);
        const { status , payload : { message:respMessage }} = response;
        if(status){
            this.setState({
                loading: false
            });
            message.success(respMessage);
        }else{
            this.setState({
                loading: false
            });
            message.warn(respMessage);
        }
    } catch (error) {
      this.setState({
        loading: false
      });
      console.log(error);
      message.warn("Somthing wen't wrong, please try again later");
    }
  };

  handleBack = e => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };
  renderName = () => {
      const { edit_name, name } =this.state;
      if(edit_name){
        return (
            <Input value={name} onPressEnter={this.updateName} onChange={this.onChangeName}></Input>
        );
      }else{
            return (
                <>
                    <span>{name}</span>
                    <span style={{marginLeft:"5px"}}>
                        <EditOutlined onClick={this.editName} title={"Edit Name"}/>
                    </span>
                </>
            );
      }
  }
  onChangeCity = address => {

    this.setState({ address: address });

};
  renderCity = () => {
      const { edit_city, address, city } = this.state;
      if(edit_city){
        return (
            <PlacesAutocomplete
                    value={this.state.address}
                    onChange={this.onChangeCity}
                    onSelect={this.handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <Input
                                {...getInputProps({
                                    // placeholder: this.formatMessage(messages.searchCity),
                                    className: 'form-inputs-google',
                                })}
                                onPressEnter={this.updateCity}
                            />
                            <div className="google-places-autocomplete__suggestions-container" style={{position:"absolute"}}>
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                    const className = "google-places-autocomplete__suggestion";
                                    // inline style for demonstration purpose
                                    return (
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,

                                            })}
                                        >
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </PlacesAutocomplete>
        );
      }else{
          return (
            <>
                <span>{address ? address : TABLE_DEFAULT_BLANK_FIELD}</span>
                <span style={{marginLeft:"5px"}}>
                    <EditOutlined onClick={this.editCity} title={"Edit City"}/>
                </span>
            </>
          );
      }
  }
  setSpeciality = value => {
    this.setState({ speciality_id: value,edit_specialities:false });
    this.updateProfileData({'speciality_id':value});
  };
  setGender = value => {
    this.setState({ gender: value,edit_gender:false });
    this.updateProfileData({'gender':value});
  };
  async handleSpecialitySearch(data = "") {
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
    } catch (err) {
      console.log("err", err);
      message.warn("Something wen't wrong. Please try again later");
      this.setState({ fetchingSpeciality: false });
    }
  };
  getSpecialityOption = () => {
    const { specialities = {} } = this.props;

    return Object.keys(specialities).map(id => {
      const { basic_info: { name } = {} } = specialities[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
  };


    renderSpecialities = () => {
    const { edit_specialities, address, speciality_id } = this.state;
    const { specialities } = this.props;
    const {basic_info: {name : specialityName} = {}} = specialities[speciality_id] || {};


    if(edit_specialities){
    return (
        <Select
        onFocus={this.handleSpecialitySearch}
        onSearch={this.handleSpecialitySearch}
        notFoundContent={this.state.fetchingSpeciality ? <Spin size="small" /> : 'No match found'}
        className="form-inputs"
        placeholder="Select Speciality"
        showSearch
        value={speciality_id.toString()}
        onChange={this.setSpeciality}
        // onFocus={() => handleMedicineSearch("")}
        autoComplete="off"
        // onFocus={() => handleMedicineSearch("")}
        optionFilterProp="children"
        style={{width:"250px"}} 

        filterOption={(input, option) =>
            option.props.children
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
        // getPopupContainer={getParentNode}

        >
        {this.getSpecialityOption()}
        </Select>
    );
    }else{
        return (
        <>
            <span>{speciality_id ? specialityName : TABLE_DEFAULT_BLANK_FIELD}</span>
            <span style={{marginLeft:"5px"}}>
                <EditOutlined onClick={this.editSpecialities} title={"Edit Specialities"}/>
            </span>
        </>
        );
    }
    }

    renderGender= () => {
        const { edit_gender, gender } = this.state;
    
    
        if(edit_gender){
          return (
            <Select
              className="form-inputs"
              placeholder="Select Gender"
              value={gender.toUpperCase()}
              onChange={this.setGender}
              autoComplete="off"   
              style={{width:"100px"}} 
            >
                <Option key={0} value={'m'}>
                    Male
                </Option>
                <Option key={1} value={'f'}>
                    Female
                </Option>
            </Select>
          );
        }else{
            return (
              <>
                  <span>{gender ? gender.toUpperCase() : TABLE_DEFAULT_BLANK_FIELD}</span>
                  <span style={{marginLeft:"5px"}}>
                      <EditOutlined onClick={this.editGender} title={"Edit Gender"}/>
                  </span>
              </>
            );
        }
    }

  editName = () => {
      this.setState({edit_name:true});
  }
  editCity = () => {
    this.setState({edit_city:true});
  }
  editGender = () => {
    this.setState({edit_gender:true});
  }
  editSpecialities = () => {
    this.setState({edit_specialities:true});
  }
  onChangeName = (e) => {
    this.setState({name:e.target.value});
  }
  updateName = () => {
      const { 
          name
      } = this.state;
      this.updateProfileData({'name':name});
      this.setState({edit_name:false});
  }
    updateCity = () => {
        const { 
            city
        } = this.state;
        this.updateProfileData({'city':city});
        this.setState({edit_city:false});
    }

    getDoctorDetailsHeader = () => {
        // const { id, doctors, users } = this.props;
        const { formatMessage, handleBack } = this;

        return (
        <div className="wp100 mb20 fs28 fw700 flex justify-start align-center">
            <ArrowLeftOutlined onClick={handleBack} className="mr10" />
            <div>{formatMessage(messages.doctor_details_header_text)}</div>
        </div>
        );
    };
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
  
    uploadDp = async ({ file }) => {
        let data = new FormData();
        data.append("files", file, file.name);
        doRequest({
            method: REQUEST_TYPE.POST,
            data: data,
            url: getUploadURL()
        }).then(response => {
            if (response.status) {
                let { files = [] } = response.payload.data;
                this.setState({ profile_pic_url: files[0] });
                this.updateProfileData({'profile_pic':files[0]});
            } else {
                message.error(this.formatMessage(messages.uploadDp))
            }
        });
    };
    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
    }
    handleChange = info => {

        this.getBase64(info.file.originFileObj, profile_pic =>
            this.setState({
                profile_pic,
                loading: false,
            })
        );
    };
    getDoctorBasicDetails = () => {
        const { auth: {authenticated_user=null}, doctors, users, specialities } = this.props;
        const current_doctor = doctors[authenticated_user];
        const { profile_pic_url, edit_name } = this.state;
        // const { id, doctors, users, specialities } = this.props;
        const { formatMessage, handleProfilePicModalOpen } = this;
        const {
        basic_info: {
            gender,
            address,
            speciality_id
        } = {},
        city,
        } = doctors[authenticated_user] || {};
        const {
        basic_info: {  email, mobile_number, prefix } = {},
        onboarded,
        onboarding_status,
        activated_on
        } = users[authenticated_user] || {};
        const {basic_info: {name : specialityName} = {}} = specialities[speciality_id] || {};

        return (
        <div className="mt20 mb20 wp100 flex direction-column">
            <div className="fs20 fw700 mb14">
            {formatMessage(messages.basic_details_text)}
            </div>
            <div className="wp100 p20 flex direction-row justify-space-between align-center border-box">
                <div className="w200">
                    {profile_pic_url ? (
                    <Avatar style={{border:"5px solid lightgrey"}} gap={"4"} src={profile_pic_url} size={164} icon={<UserOutlined/>} />
                    ) : (
                    <Avatar size={164} icon={<UserOutlined />} />
                    )}
                </div>
                <Upload
                    name="file"
                    showUploadList={false}
                    customRequest={this.uploadDp}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                >
                    <Button shape="circle" size={"large"} style={{ top: "50px", right: "40px" }} title={"Upload Profile picture"}>
                        <CameraFilled />
                    </Button>
                </Upload>
            <div className="wp100 ml16 flex direction-row align-center flex-wrap">
                {/*name*/}
                <div className="wp20 mt16 mb16 mr16">
                <div className="fs16 fw700">
                    {formatMessage(messages.name_text)}
                </div>
                <div className="fs14 fw500">
                    {this.renderName()}
                </div>
                </div>

                {/*gender*/}
                <div className="wp20 hp20 mt16 mb16 mr16">
                <div className="fs16 fw700">
                    {formatMessage(messages.gender_text)}
                </div>
                <div className="fs14 fw500">
                    {this.renderGender()}
                </div>
                </div>

                {/*speciality*/}
                <div className="wp40 hp20 mt16 mb16 mr16">
                <div className="fs16 fw700">
                    {formatMessage(messages.speciality_text)}
                </div>
                <div className="fs14 fw500">
                    {this.renderSpecialities()}
                </div>
                </div>

                {/*email*/}
                <div className="wp20 hp20 mt16 mb16 mr16">
                <div className="fs16 fw700">
                    {formatMessage(messages.email_text)}
                </div>
                <div className="fs14 fw500 word-wrap">
                    {email ? email : TABLE_DEFAULT_BLANK_FIELD}
                </div>
                </div>

                {/*mobile_number*/}
                <div className="wp20 mt16 mb16 mr16">
                <div className="fs16 fw700">
                    {formatMessage(messages.mobile_number_text)}
                </div>
                <div className="fs14 fw500">
                    {mobile_number ? `+${prefix}-${mobile_number}` : TABLE_DEFAULT_BLANK_FIELD}
                </div>
                </div>

                

                {/*onboarding_status*/}
                {!onboarded && (
                <div className="wp40 mt16 mb16 mr16">
                    <div className="fs16 fw700">
                    {formatMessage(messages.onboarding_status_text)}
                    </div>
                    <div className="fs14 fw500">
                    {onboarding_status
                        ? onboarding_status
                        : TABLE_DEFAULT_BLANK_FIELD}
                    </div>
                </div>
                )}

                {/*address*/}
                <div className="wp40 mt16 mb16 mr16">
                <div className="fs16 fw700">
                    {formatMessage(messages.address_text)}
                </div>
                <div className="fs14 fw500">
                    {this.renderCity()}
                </div>
                </div>

                {/* verified */}
                <div className="wp40 mt16 mb16 mr16">
                <div className="fs16 fw700">
                    {formatMessage(messages.verified_text)}
                </div>
                <div className="fs14 fw500">
                    {activated_on ? (
                    <div className="flex direction-row align-center">
                        <CheckCircleTwoTone
                        className="mr10"
                        twoToneColor={`#43b02a`}
                        />
                        <span>{`Verified`}</span>
                    </div>
                    ) : (
                    <div className="flex direction-row align-center">
                        <ExclamationCircleTwoTone
                        className="mr10"
                        twoToneColor={`#f1c40f`}
                        />
                        <span>{`Not Verified`}</span>
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
        );
    };

  handlePictureModal = id => e => {
    e.preventDefault();
    this.setState({ modalVisible: true, selectedDocumentId: id });
  };

  getDoctorRegistrationDetails = () => {
    const {
      id,
      doctors,
      doctor_registrations,
      upload_documents,
      councils = {}
    } = this.props;
    const { formatMessage, handlePictureModal } = this;

    const { doctor_registration_ids = [] } = doctors[id] || {};

    return doctor_registration_ids.map((registration_id, index) => {
      const {
        basic_info: {
          number,
          registration_council_id,
          year
        } = {},
        expiry_date,
        upload_document_ids
      } = doctor_registrations[registration_id] || {};

      const { basic_info: { name: registrationCouncilName } = {} } =
        councils[registration_council_id] || {};

      return (
        <div className="wp100 p20 flex direction-column">
          {doctor_registration_ids.length > 1 && (
            <div className="fs16 fw700 mb20">{`${formatMessage(
              messages.registration_text
            )} ${index + 1} :`}</div>
          )}
          <div className="wp100 flex direction-row align-center flex-wrap">
            {/*registration_number*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.registration_number_text)}
              </div>
              <div className="fs14 fw500">
                {number ? number : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*council*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.registration_council_text)}
              </div>
              <div className="fs14 fw500">
                {registration_council_id
                  ? registrationCouncilName
                  : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*year*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.registration_year_text)}
              </div>
              <div className="fs14 fw500">
                {year ? year : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*registration_expiry_date*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.registration_expiry_date_text)}
              </div>
              <div className="fs14 fw500">
                {expiry_date
                  ? moment(expiry_date).format("LL")
                  : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*upload_documents*/}
            <div className="wp100 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.upload_document_text)}
              </div>

              <div className="flex align-center flex-wrap">
                {upload_document_ids.map(id => {
                  const { basic_info: { document } = {} } =
                    upload_documents[id] || {};

                  const documentType = document.substring(document.length - 3) || null;
                  if (documentType) {
                    if (documentType !== "jpg" && documentType !== "png") {
                      return (
                        <a
                          key={`q-${id}`}
                          className="w100 h100 mr6 mt6 mb6 pointer"
                          href={document}
                          target="_blank"
                          // onClick={handleDocumentDownload(id)}
                        >
                          <div className="w100 h100 br5 flex direction-column align-center justify-center br-black black-85">
                            <FileTextOutlined />
                            {documentType.toUpperCase()}
                          </div>
                        </a>
                      );
                    } else {
                      return (
                        <div
                          key={`q-${id}`}
                          className="w100 h100 mr6 mt6 mb6 pointer"
                          onClick={handlePictureModal(id)}
                        >
                          <img
                            src={document}
                            className="w100 h100 br5"
                            alt={`registration document ${id}`}
                          />
                        </div>
                      );
                    }
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  handleDocumentDownload = id => e => {
    e.preventDefault();
  };

  getDoctorQualificationDetails = () => {
    const {
      id,
      doctors,
      doctor_qualifications,
      upload_documents,
      degrees = {},
      colleges = {}
    } = this.props;
    const { formatMessage, handlePictureModal } = this;

    const { doctor_qualification_ids = [] } = doctors[id] || {};

    return doctor_qualification_ids.map((qualification_id, index) => {
      const {
        basic_info: { degree_id, college_id, year } = {},
        upload_document_ids = []
      } = doctor_qualifications[qualification_id] || {};

      const { basic_info: { name: collegeName } = {} } =
        colleges[college_id] || {};
      const { basic_info: { name: degreeName } = {} } =
        degrees[degree_id] || {};

      return (
        <div
          className="wp100 p20 flex direction-column"
          key={`q-block-${index}`}
        >
          {doctor_qualification_ids.length > 1 && (
            <div className="fs16 fw700 mb20">{`${formatMessage(
              messages.qualification_text
            )} ${index + 1} :`}</div>
          )}
          <div className="wp100 flex direction-row align-center flex-wrap">
            {/*degree_name*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.degree_text)}
              </div>
              <div className="fs14 fw500">
                {degree_id ? degreeName : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*college*/}
            <div className="wp40 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.college_text)}
              </div>
              <div className="fs14 fw500">
                {college_id ? collegeName : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*year*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.year_text)}
              </div>
              <div className="fs14 fw500">
                {year ? year : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*upload_documents*/}
            <div className="wp100 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.upload_document_text)}
              </div>

              {/*qualification_documents*/}
              <div className="flex align-center flex-wrap">
                {upload_document_ids.map(id => {
                  const { basic_info: { document } = {} } =
                    upload_documents[id] || {};

                  const documentType = document.substring(document.length - 3) || null;
                  if (documentType) {
                    if (documentType !== "jpg" && documentType !== "png") {
                      return (
                        <a
                          key={`q-${id}`}
                          className="w100 h100 mr6 mt6 mb6 pointer"
                          href={document}
                          target="_blank"
                          // onClick={handleDocumentDownload(id)}
                        >
                          <div className="w100 h100 br5 flex align-center justify-center">
                            {documentType.toUpperCase()}
                          </div>
                        </a>
                      );
                    } else {
                      return (
                        <div
                          key={`q-${id}`}
                          className="w100 h100 mr6 mt6 mb6 pointer"
                          onClick={handlePictureModal(id)}
                        >
                          <img
                            src={document}
                            className="w100 h100 br5"
                            alt={`qualification document ${id}`}
                          />
                        </div>
                      );
                    }
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  getFullDayText = day => {
    if(day.length === 1) {
      return DAYS_TEXT_NUM[day].toLocaleUpperCase();
    }
    // return DAYS_TEXT[day].toLocaleUpperCase();
  };

  getDoctorClinicDetails = () => {
    const { id, doctors, doctor_clinics } = this.props;
    const { formatMessage, getFullDayText } = this;

    const { doctor_clinic_ids = [] } = doctors[id] || {};

    return doctor_clinic_ids.map((clinic_id, index) => {
      const {
        basic_info: { name } = {},
        location,
        details: { time_slots = [] } = {}
      } = doctor_clinics[clinic_id] || {};

      return (
        <div
          className="wp100 p20 flex direction-column"
          key={`c-block-${index}`}
        >
          {doctor_clinic_ids.length > 1 && (
            <div className="fs16 fw700 mb20">{`${formatMessage(
              messages.clinic_text
            )} ${index + 1} :`}</div>
          )}
          <div className="wp100 flex direction-row align-center flex-wrap">
            {/*name*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.name_text)}
              </div>
              <div className="fs14 fw500">
                {name ? name : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*location*/}
            <div className="wp40 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.location_text)}
              </div>
              <div className="fs14 fw500">
                {location ? location : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*open_between*/}
            <div className="wp40 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.timings_text)}
              </div>
              {Object.keys(time_slots).map((day, index) => {
                // todo: add DAY[day] later from constants

                return (
                  <Fragment>
                    {time_slots[day].length > 0 && <div className="wp100 flex">
                      <div className="fs14 fw700 mt16 mb10 mr16">{getFullDayText(day)}</div>
                      <div
                        className="wp100 mt16 mb10 mr16 flex"
                        key={`ts-${index}`}
                      >
                        {time_slots[day].map((time_slot, i) => {
                          const { startTime: start_time, endTime: end_time } =
                            time_slot || {};

                          return (
                            <div className="fs14 fw500 wp100" key={`ts/${index}/${i}`}>
                              {start_time
                                ? `${moment(start_time).format(
                                    "LT"
                                  )} - ${moment(end_time).format("LT")}`
                                : "CLOSED"}
                            </div>
                          );
                        })}
                      </div>
                    </div>}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      );
    });
  };

  getFooter = () => {
    const { id, doctors, users } = this.props;
    const { formatMessage, handleVerify } = this;

    const {
      doctor_clinic_ids = [],
      doctor_qualification_ids = [],
      doctor_registration_ids = [],
    basic_info :{user_id} = {}
    } = doctors[id] || {};

    const {activated_on} = users[user_id] || {};

    const disabled =
      doctor_clinic_ids.length === 0 ||
      doctor_qualification_ids.length === 0 ||
      doctor_registration_ids.length === 0 || activated_on !== null;

    return (
      <div className="mt20 wi flex justify-end">
        <Button
          disabled={disabled}
          type="primary"
          className="mb10 mr10"
          onClick={handleVerify}
        >
          {formatMessage(messages.submit_button_text)}
        </Button>
      </div>
    );
  };

  handleVerify = async e => {
    e.preventDefault();
    const { verifyDoctor, id } = this.props;
    try {
      const response = await verifyDoctor(id);
      const { status, payload: { message: respMessage = "" } = {} } =
        response || {};
      if (status === true) {
        message.success(respMessage);
      } else {
        message.warn(respMessage);
      }
    } catch (error) {
      console.log("handleVerify UI error --> ", error);
    }
  };

  handlePictureModalClose = e => {
    e.preventDefault();
    this.setState({ modalVisible: false });
  };

  getModalDetails = () => {
    const { upload_documents } = this.props;
    const { modalVisible, selectedDocumentId } = this.state;
    const { formatMessage, handlePictureModalClose } = this;

    const { basic_info: { document } = {} } =
      upload_documents[selectedDocumentId] || {};

    return (
      <Modal
        visible={modalVisible}
        title={`${formatMessage(
          messages.upload_document_particular_text
        )} ${selectedDocumentId}`}
        closable
        mask
        maskClosable
        onCancel={handlePictureModalClose}
        width={`60%`}
        footer={null}
      >
        <img src={document} alt="qualification document" className="wp100" />
      </Modal>
    );
  };

  handleProfilePicModalOpen = e => {
    e.preventDefault();
    this.setState({ profilePicModalVisible: true });
  };

  handleProfilePicModalClose = e => {
    e.preventDefault();
    this.setState({ profilePicModalVisible: false });
  };

  getProfilePicModal = () => {
    const { doctors, id } = this.props;
    const { profilePicModalVisible } = this.state;
    const { formatMessage, handleProfilePicModalClose } = this;

    const { basic_info: { profile_pic } = {} } = doctors[id] || {};

    return (
      <Modal
        visible={profilePicModalVisible}
        title={`${formatMessage(messages.profile_pic_text)}`}
        closable
        mask
        maskClosable
        onCancel={handleProfilePicModalClose}
        width={`50%`}
        footer={null}
      >
        <img src={profile_pic} alt="qualification document" className="wp100" />
      </Modal>
    );
  };

  render() {
    
    const { auth: {authenticated_user=null}, doctors } = this.props;
    const current_doctor = doctors[authenticated_user];
    const { loading } = this.state;
    const {
      formatMessage,
      getDoctorDetailsHeader,
      getDoctorBasicDetails,
      getDoctorRegistrationDetails,
      getDoctorQualificationDetails,
      getDoctorClinicDetails,
    //   getFooter,
    //   getModalDetails,
    //   getProfilePicModal
    } = this;

    const {
      doctor_clinic_ids = [],
      doctor_qualification_ids = [],
      doctor_registration_ids = []
    } = doctors[authenticated_user] || {};


    if (loading) {
      return <PageLoading />;
    }

    return (
      <Fragment>
        <div className="wp100 p20 flex direction-column">
          {/*header*/}
          {getDoctorDetailsHeader()}

          {/*basic details*/}
          {getDoctorBasicDetails()}

          {/*qualifications*/}
          <div className="mt20 mb20 wp100 flex direction-column">
            <div className="fs20 fw700 mb14">
              {formatMessage(messages.qualification_details_text)}
            </div>
            {doctor_qualification_ids.length > 0 ? (
              <div className="border-box">
                {getDoctorQualificationDetails()}
              </div>
            ) : (
              <div className="bg-grey wp100 h200 br5 flex align-center justify-center">
                {formatMessage(messages.no_qualification_text)}
              </div>
            )}
          </div>

          {/*registration*/}
          <div className="mt20 mb20 wp100 flex direction-column">
            <div className="fs20 fw700 mb14">
              {formatMessage(messages.registration_details_text)}
            </div>
            {doctor_registration_ids.length > 0 ? (
              <div className="border-box">{getDoctorRegistrationDetails()}</div>
            ) : (
              <div className="bg-grey wp100 h200 br5 flex align-center justify-center">
                {formatMessage(messages.no_registration_text)}
              </div>
            )}
          </div>

          {/*clinics*/}
          <div className="mt20 mb20 wp100 flex direction-column">
            <div className="fs20 fw700 mb14">
              {formatMessage(messages.clinic_details_text)}
            </div>
            {doctor_clinic_ids.length > 0 ? (
              <div className="border-box">{getDoctorClinicDetails()}</div>
            ) : (
              <div className="bg-grey wp100 h200 br5 flex align-center justify-center">
                {formatMessage(messages.no_clinic_text)}
              </div>
            )}
          </div>

          {/*footer*/}
          {/* {getFooter()} */}
        </div>

        {/* {getModalDetails()} */}

        {/* {getProfilePicModal()} */}
      </Fragment>
    );
  }
}

export default withRouter(injectIntl(DoctorProfilePage));
