import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import { Avatar, Upload, Input, Select, Spin, DatePicker, Icon } from "antd";
import throttle from "lodash-es/throttle";
import { doRequest } from '../../../Helper/network';
import LocationModal from '../../../Components/DoctorOnBoarding/locationmodal';
import TimingModal from '../../../Components/DoctorOnBoarding/timingModal';
import plus from '../../../Assets/images/plus.png';
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
  CameraFilled,
  DeleteTwoTone
} from "@ant-design/icons";
import moment from "moment";
import messages from "./messages";
import { getUploadURL, updateDoctorURL, getUploadQualificationDocumentUrl, getUploadRegistrationDocumentUrl } from '../../../Helper/urls/doctor';
import { TABLE_DEFAULT_BLANK_FIELD, DAYS_TEXT_NUM, REQUEST_TYPE, MALE, GENDER, FEMALE, OTHER, FULL_DAYS, FULL_DAYS_NUMBER } from "../../../constant";
import { PageLoading } from "../../../Helper/loading/pageLoading";
import { withRouter } from "react-router-dom";

const { Option } = Select;

class DoctorProfilePage extends Component {
  constructor(props) {
    super(props);
    const { 
        auth: {authenticated_user=null,authPermissions=[]},
        users,
        doctors,
        qualification_ids,
        clinic_ids,
        doctor_ids,
        doctor_clinics,
        doctor_qualifications,
        upload_documents,
        doctor_registrations,
        degrees,
        colleges,
        councils,
        specialities
    } = props;
    let doctor_user_id = 0;
    for (let doctor of Object.values(doctors)) {
        let { basic_info: { user_id = 0, id = 0 } = {} } = doctor;

        if (user_id === authenticated_user) {
            doctor_user_id = id;
        }
    }

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
          doctor_qualification_ids=[],
          doctor_registration_ids=[],
          doctor_clinic_ids=[]
    } = doctors[doctor_user_id] || {};
    const {
        basic_info: {
            email="",
            mobile_number="",
            prefix="",
          } = {},
        category= ""
    } = users[authenticated_user] || {};

    let edit_qualification_year = {};
    let edit_qualification_college = {};
    let edit_qualification_degree = {};

    doctor_qualification_ids.forEach(element => {
        edit_qualification_year[element]=false;
        edit_qualification_college[element]=false;
        edit_qualification_degree[element]=false;
        edit_registration_council[element]=false;
    });

    let edit_registration_council = {};
    let edit_registration_number = {};
    let edit_registration_year = {};
    let edit_registration_expiry = {};

    doctor_registration_ids.forEach(element => {
        edit_registration_council[element]=false;
        edit_registration_number[element]=false;
        edit_registration_year[element]=false;
        edit_registration_expiry[element]=false;
    });

    let edit_clinic_name = {};
    let edit_clinic_location = {};
    let edit_clinic_timings = {};
    let modal_timing_visible = {};
    let doctor_clinic_location = {};
    doctor_clinic_ids.forEach(element => {
        edit_clinic_name[element]=false;
        edit_clinic_location[element]=false;
        edit_clinic_timings[element]=false;
        modal_timing_visible[element]=false;
    });
    let verified_doctor=false;

    if(authPermissions.length){
         verified_doctor=true;
    }
    this.state = {
        verified_doctor:verified_doctor,
        loading: false,
        updateLoading: false,
        doctors: doctors,
        doctor_clinics: doctor_clinics,
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
        fetchingSpeciality:false,
        fetchingColleges: false,
        fetchingCouncils: false,
        doctor_user_id : doctor_user_id,
        profilePicModalVisible: false,
        doctor_qualification_ids: doctor_qualification_ids,
        edit_qualification_year: edit_qualification_year,
        edit_qualification_college: edit_qualification_college,
        edit_qualification_degree: edit_qualification_degree,
        edit_registration_council: edit_registration_council,
        edit_registration_year: edit_registration_year,
        edit_registration_number: edit_registration_number,
        edit_registration_expiry: edit_registration_expiry,
        edit_clinic_name: edit_clinic_name,
        edit_clinic_location: edit_clinic_location,
        edit_clinic_timings: edit_clinic_timings,
        modal_timing_visible: modal_timing_visible,
        doctor_clinic_location: doctor_clinic_location
    };
    this.handleSpecialitySearch = throttle(this.handleSpecialitySearch.bind(this), 2000);
  }

  componentDidMount() {
    const { doctors } = this.state;
    const { doctor_user_id } =this.state;
    const { getInitialData } = this;
    const { doctor_qualification_ids,doctor_registration_ids } = doctors[doctor_user_id] || {};
    if (!doctor_qualification_ids || !doctor_registration_ids) {
      getInitialData();
    }
  }

  getInitialData = async () => {
    try {
      this.setState({ loading: true });
      const { getDoctorDetails } = this.props;
      const response = await getDoctorDetails();
      const {
        status,
        payload: { message: { message: responseMessage } = {} } = {}
      } = response || {};

      if (status === true) {
        this.setState({
          loading: false
        });
      } else {
        this.setState({
          loading: false
        });
        message.warn(responseMessage);
      }
    } catch (error) {
      this.setState({
        loading: false
      });
      message.warn("Somthing wen't wrong, please try again later");
    }
  };
  formatMessage = data => this.props.intl.formatMessage(data);

  updateProfileData = async (updateData) => {
    try {
        this.setState({ edit_clinic_timings: true });
        const { auth: {authenticated_user=null}, doctors, users, updateDoctorBasicInfo } = this.props;
        const { id } = authenticated_user;
        let response = await updateDoctorBasicInfo(authenticated_user,updateData);
        const { status , payload : { message:respMessage }} = response;
        if(status){
            this.setState({
                edit_clinic_timings: false
            });
            message.success(respMessage);
            this.getInitialData();
        }else{
            this.setState({
                edit_clinic_timings: false
            });
            message.error(respMessage);
        }
    } catch (error) {
      this.setState({
        edit_clinic_timings: false
      });
      console.log(error);
      message.warn("Somthing wen't wrong, please try again later");
    }
  };
  getYearOptions = () => {
    let currYear = moment().format("YYYY");
    let curryearNum = parseInt(currYear);
    let years = [];
    for (let year = curryearNum - 100; year <= curryearNum+20; year++) {
      years.push(<Option key={year} value={year} name={year}>
        {year}
      </Option>)
    }
    return years;
  }
  setQualificationYear = qualification_id => (value) => {
    const { doctor_user_id, edit_qualification_year } = this.state;
    let newQualificationYear = edit_qualification_year;
    let updateData = {
        qualification_details : [
            {
                year:value,
                doctor_id: doctor_user_id,
                id: qualification_id
            }
        ]
    };
    this.updateProfileData(updateData);
    newQualificationYear[qualification_id]=false;
    this.setState({edit_qualification_year:newQualificationYear});
  }
  setRegistrationExpiryDate = registration_id => (date, dateString) => {
    if(date){
        const { doctor_user_id, edit_registration_expiry } = this.state;
        let newRegistrationExpiryDate = edit_registration_expiry;
        let updateData = {
            registration_details : [
                {
                    expiryDate:date,
                    doctor_id: doctor_user_id,
                    id: registration_id
                }
            ]
        };
        this.updateProfileData(updateData);
        newRegistrationExpiryDate[registration_id]=false;
        this.setState({edit_registration_expiry:newRegistrationExpiryDate});
    }
    
  }
  setRegistrationYear = registration_id => (value) => {
    const { doctor_user_id, edit_registration_year } = this.state;
    let newRegistrationYear = edit_registration_year;
    let updateData = {
        registration_details : [
            {
                year:value,
                doctor_id: doctor_user_id,
                id: registration_id
            }
        ]
    };
    this.updateProfileData(updateData);
    newRegistrationYear[registration_id]=false;
    this.setState({edit_registration_year:newRegistrationYear});
  }
  setCollege = (qualification_id) => value => {
    const { doctor_user_id, edit_qualification_college } = this.state;
    let newQualificationCollege = edit_qualification_college;
    let updateData = {
        qualification_details : [
            {
                college_id:value,
                doctor_id: doctor_user_id,
                id: qualification_id
            }
        ]
    };
    this.updateProfileData(updateData);
    newQualificationCollege[qualification_id]=false;
    this.setState({edit_qualification_college:newQualificationCollege});
  }
  setDegree = (qualification_id) => value => {
    const { doctor_user_id, edit_qualification_degree } = this.state;
    let newQualificationDegree = edit_qualification_degree;
    let updateData = {
        qualification_details : [
            {
                degree_id:value,
                doctor_id: doctor_user_id,
                id: qualification_id
            }
        ]
    };
    this.updateProfileData(updateData);
    newQualificationDegree[qualification_id]=false;
    this.setState({edit_qualification_degree:newQualificationDegree});
  }

  setRegCouncil = (registration_id) => value => {
    const { doctor_user_id, edit_registration_council } = this.state;
    let newRegistrationCouncil = edit_registration_council;
    let updateData = {
        registration_details : [
            {
                registration_council_id:value,
                doctor_id: doctor_user_id,
                id: registration_id
            }
        ]
    };
    this.updateProfileData(updateData);
    newRegistrationCouncil[registration_id]=false;
    this.setState({edit_registration_council:newRegistrationCouncil});
  }

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
    renderRegistrationNumber = (registration_id) => {
        const { edit_registration_number, verified_doctor, doctor_user_id } =this.state;
        const { doctor_registrations, doctors } = this.props;
        const {
            basic_info: {
                number
            }
        } = doctor_registrations[registration_id];
        const {
            doctor_registration_ids
        } = doctors[doctor_user_id];
        if(edit_registration_number[registration_id]){
        return (
            <Input defaultValue={number} onPressEnter={this.updateRegistrationNumber} data-id={registration_id}></Input>
        );
        }else{
            return (
                <>
                    <span>{number}</span>
                    {!verified_doctor?
                    <span style={{marginLeft:"5px"}}>
                        <EditOutlined onClick={ () => this.editRegistrationNumber(registration_id)} title={"Edit Registration Number"}/>
                    </span>:null
                    }
                </>
            );
        }
    }

    renderClinicName = (clinic_id) => {
        const { edit_clinic_name, verified_doctor } =this.state;
        const { doctor_clinics, doctors } = this.props;
        const {
            basic_info: {
                name
            }
        } = doctor_clinics[clinic_id];
        if(edit_clinic_name[clinic_id]){
        return (
            <Input defaultValue={name} onPressEnter={this.updateClinicName} data-id={clinic_id}></Input>
        );
        }else{
            return (
                <>
                    <span>{name}</span>
                    {!verified_doctor?
                    <span style={{marginLeft:"5px"}}>
                        <EditOutlined onClick={ () => this.editClinicName(clinic_id)} title={"Edit Clinic Name"}/>
                    </span>:null
                    }
                </>
            );
        }
    }
    handleCancelTiming = (clinic_id) => {
        const { modal_timing_visible } = this.state;
        let newModalVisibleTimings = modal_timing_visible;
        newModalVisibleTimings[clinic_id] = false;
        this.setState({ modal_timing_visible: newModalVisibleTimings });
    }
    handleOkTiming = clinic_id => (timing, selectedDays) => {

        const { edit_clinic_timings, modal_timing_visible, doctor_user_id } =this.state;
        let time_slots = {
            [FULL_DAYS_NUMBER.MON]: timing[FULL_DAYS.MON],
            [FULL_DAYS_NUMBER.TUE]: timing[FULL_DAYS.TUE],
            [FULL_DAYS_NUMBER.WED]: timing[FULL_DAYS.WED],
            [FULL_DAYS_NUMBER.THU]: timing[FULL_DAYS.THU],
            [FULL_DAYS_NUMBER.FRI]: timing[FULL_DAYS.FRI],
            [FULL_DAYS_NUMBER.SAT]: timing[FULL_DAYS.SAT],
            [FULL_DAYS_NUMBER.SUN]: timing[FULL_DAYS.SUN],
        }
        const updateData = {
            clinic_details:[
                {
                    time_slots:time_slots,
                    doctor_id: doctor_user_id,
                    id: clinic_id
                }
            ]
        }
        this.updateProfileData(updateData);
        let editClinicTimings=edit_clinic_timings;
        let newModalTimings=modal_timing_visible;
        newModalTimings[clinic_id]=false;
        editClinicTimings[clinic_id]=false;
        this.setState({modal_timing_visible:newModalTimings,edit_clinic_timings:editClinicTimings});

    };
    setModalTimingVisible = clinic_id => () => {
        const { modal_timing_visible } = this.state;
        let newModalVisibleTimings = modal_timing_visible;
        newModalVisibleTimings[clinic_id] = true;
        this.setState({ modal_timing_visible: newModalVisibleTimings });
    }
    renderClinicTimings = (time_slots,clinic_id) => {
        const { edit_clinic_timings, verified_doctor } =this.state;
        const { doctor_clinics, doctors } = this.props;
        const {
            basic_info: {
                name
            }
        } = doctor_clinics[clinic_id];
        if(!edit_clinic_timings[clinic_id]){
            return (Object.keys(time_slots).map((day, index) => {
                // todo: add DAY[day] later from constants
                return (
                  <Fragment>
                    {time_slots[day].length > 0 && <div className="wp100 flex">
                      <div className="fs14 fw700 mt16 mb10 mr16">{this.getFullDayText(day)}</div>
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
              }))
        }else{
            let isClinicOpen = false;
            Object.keys(time_slots).map((day) => {
                if (time_slots[day].length) {
                    isClinicOpen = true;
                }
            });
            return (
                Object.keys(time_slots).length && isClinicOpen? (
                    <div className={`form-input-timing active-grey `} >
                        <div className={'active-grey'}>
                            <div className='flex justify-end wp100'>
                                <Icon type="edit" style={{ color: '#4a90e2' }} theme="filled" onClick={this.setModalTimingVisible(clinic_id)} />
                            </div>
                            {this.renderTimings(time_slots)}
                        </div>
                    </div>) :
                    (
                        <div className={`form-input-timing default-grey pointer`} onClick={this.setModalTimingVisible(clinic_id)}>
                            <div className={'default-grey'}>
                                {this.formatMessage(messages.timings)}</div>
                            {<Icon type="clock-circle" />}
                        </div>
                    )
            );
        }
    }

    renderTimings = (timings) => {
        return (
            (Object.keys(timings).map((day) => {
                return (
                    <div className='wp100 flex flex-start'>
                        <div className='fs14 medium wp30'>{`${this.getFullDayText(day)} :`}</div>
                        <div className='wp80 flex-start'>{
                            timings[day].length && timings[day][0].startTime != '' && timings[day][0].endTime != '' ? timings[day].map((time, index) => {
                                return (
                                    <div className='flex justify-start'>
                                        <div>{`${time.startTime ? moment(time.startTime).format('hh:mm a') : ''}-`}</div>
                                        <div>{time.endTime ? `${moment(time.endTime).format('hh:mm a')}${index < timings[day].length - 1 ? ', ' : ' '} ` : ''}</div>
                                    </div>)
                            }) : this.formatMessage(messages.closed)}</div>
                    </div>
                )
            }))
        );

    }

    renderClinicLocation = (clinic_id) => {
        
        const { edit_clinic_location, verified_doctor,doctor_clinic_location } =this.state;
        const { doctor_clinics } = this.props;
        const {
            location
        } = doctor_clinics[clinic_id];
        let render_location = location;
        if(doctor_clinic_location[clinic_id]){
            render_location = doctor_clinic_location[clinic_id];
        }
        if(edit_clinic_location[clinic_id]){
        return (
            <PlacesAutocomplete
                    value={render_location}
                    onChange={this.onChangeClinicLocation(clinic_id)}
                    onSelect={this.handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <Input
                                {...getInputProps({
                                    // placeholder: this.formatMessage(messages.searchCity),
                                    className: 'form-inputs-google',
                                })}
                                onPressEnter={this.updateClinicLocation}
                                data-id={clinic_id}
                                style={{width:"400px",height:"auto",margin:"0",marginBottom:"10px"}}

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
                    <span>{render_location}</span>
                    {!verified_doctor?
                    <span style={{marginLeft:"5px"}}>
                        <EditOutlined onClick={ () => this.editClinicLocation(clinic_id)} title={"Edit Clinic Location"}/>
                    </span>:null
                    }
                </>
            );
        }
    }
    
    renderQualificationYear = (qualification_id) => {
        const { edit_qualification_year, verified_doctor } =this.state;
        const { doctor_qualifications = {} } = this.props;

        if(edit_qualification_year[qualification_id]){
          return (
                <Select size={"small"} style={{width:"100px",height:"auto",margin:"0"}} className="form-inputs" placeholder="Select Year" value={doctor_qualifications[qualification_id].basic_info.year ? doctor_qualifications[qualification_id].basic_info.year : null} onChange={this.setQualificationYear(qualification_id)}>
                    {this.getYearOptions()}
                </Select>
          );
        }else{
              return (
                  <>
                      <span>{doctor_qualifications[qualification_id].basic_info.year}</span>
                      {!verified_doctor?
                          <span style={{marginLeft:"5px"}}>
                            <EditOutlined onClick={()=> this.editQualificationYear(qualification_id)} title={"Edit Year"}/>
                        </span>
                        :
                        null
                      }
                  </>
              );
        }
    }

    renderRegistrationYear = (registration_id) => {
        const { edit_registration_year, verified_doctor } =this.state;
        const { doctor_registrations = {} } = this.props;

        if(edit_registration_year[registration_id]){
          return (
                <Select size={"small"} style={{width:"100px",height:"auto",margin:"0"}} className="form-inputs" placeholder="Select Year" value={doctor_registrations[registration_id].basic_info.year ? doctor_registrations[registration_id].basic_info.year : null} onChange={this.setRegistrationYear(registration_id)}>
                    {this.getYearOptions()}
                </Select>
          );
        }else{
              return (
                  <>
                      <span>{doctor_registrations[registration_id].basic_info.year}</span>
                      {!verified_doctor?
                      <span style={{marginLeft:"5px"}}>
                          <EditOutlined onClick={()=> this.editRegistrationYear(registration_id)} title={"Edit Year"}/>
                      </span>:null
                      }
                  </>
              );
        }
    }

    renderRegistrationExpiryDate = (registration_id) => {
        const { edit_registration_expiry, verified_doctor } =this.state;
        const { doctor_registrations = {} } = this.props;
        const expiryDate = moment(doctor_registrations[registration_id].expiry_date).format('MMMM DD, YYYY');
        if(edit_registration_expiry[registration_id]){
          return (
            <DatePicker  style={{margin:"0",height:"auto"}} size={"small"} defaultValue={moment(doctor_registrations[registration_id].expiry_date)} onChange={this.setRegistrationExpiryDate(registration_id)} placeholder='Select Expiry Date' />
          );
        }else{
              return (
                  <>
                      <span>{expiryDate}</span>
                      {!verified_doctor?
                      <span style={{marginLeft:"5px"}}>
                          <EditOutlined onClick={()=> this.editRegistrationExpiryDate(registration_id)} title={"Edit Expiry Date"}/>
                      </span>:null
                      }
                  </>
              );
        }
    }

    renderQualificationCollege = (qualification_id) => {
        const { edit_qualification_college, verified_doctor } =this.state;
        const { doctor_qualifications = {}, colleges = {} } = this.props;
        const {
            basic_info:{
                college_id
            }
        } = doctor_qualifications[qualification_id];
        if(edit_qualification_college[qualification_id]){
          return (
            <Select
                size={"small"}
                style={{margin:"0",height:"auto"}}
                onSearch={this.handleCollegeSearch}
                className="form-inputs"
                placeholder={"Select College"}
                showSearch
                value={college_id.toString()}
                onChange={this.setCollege(qualification_id)}
                // onFocus={() => handleMedicineSearch("")}
                autoComplete="off"
                // onFocus={() => handleMedicineSearch("")}
                filterOption={(input, option) =>
                option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
            // getPopupContainer={getParentNode}

            >
                {this.getCollegesOption()}
          </Select>
          );
        }else{
              return (
                  <>
                      <span>{college_id? colleges[college_id].basic_info.name: TABLE_DEFAULT_BLANK_FIELD}</span>
                      {!verified_doctor?
                        <span style={{marginLeft:"5px"}}>
                            <EditOutlined onClick={()=> this.editQualificationCollege(qualification_id)} title={"Edit College"}/>
                        </span>
                        :
                        null
                      }
                  </>
              );
        }
    }
    renderQualificationDegree = (qualification_id) => {
        const { edit_qualification_degree, verified_doctor } =this.state;
        const { doctor_qualifications = {}, degrees = {} } = this.props;
        const {
            basic_info:{
                degree_id
            }
        } = doctor_qualifications[qualification_id];
        if(edit_qualification_degree[qualification_id]){
          return (
            <Select
                size={"small"}
                onSearch={this.handleDegreeSearch}
                className="form-inputs"
                placeholder={"Select Degree"}
                showSearch
                value={degree_id.toString()}
                onChange={this.setDegree(qualification_id)}
                // onFocus={() => handleMedicineSearch("")}
                autoComplete="off"
                // onFocus={() => handleMedicineSearch("")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{width:"250px",height:"auto",margin:"0"}}
              // getPopupContainer={getParentNode}

              >
                {this.getDegreesOption()}
              </Select>
          );
        }else{
              return (
                  <>
                      <span>{degree_id? degrees[degree_id].basic_info.name: TABLE_DEFAULT_BLANK_FIELD}</span>
                      {!verified_doctor ?
                        <span style={{marginLeft:"5px"}}>
                            <EditOutlined onClick={()=> this.editQualificationDegree(qualification_id)} title={"Edit Degree"}/>
                        </span>
                        :
                        null
                      }
                  </>
              );
        }
    }
    renderRegistrationCouncil = (registration_id) => {
        const { edit_registration_council, verified_doctor } =this.state;
        const { doctor_registrations = {}, councils = {} } = this.props;
        const {
            basic_info:{
                registration_council_id
            }
        } = doctor_registrations[registration_id];
        if(edit_registration_council[registration_id]){
          return (
            <Select
                size={"small"}
                onSearch={this.handleCouncilSearch}
                notFoundContent={this.state.fetchingCouncils ? <Spin size="small" /> : 'No match found'}
                className="form-inputs"
                placeholder="Select Council"
                showSearch
                value={registration_council_id.toString()}
                onChange={this.setRegCouncil(registration_id)}
                // onFocus={() => handleMedicineSearch("")}
                autoComplete="off"
                // onFocus={() => handleMedicineSearch("")}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                style={{width:"150px",height:"auto",margin:"0"}}
              // getPopupContainer={getParentNode}

              >
                {this.getCouncilOption()}
              </Select>
          );
        }else{
              return (
                  <>
                      <span>{registration_council_id? councils[registration_council_id].basic_info.name: TABLE_DEFAULT_BLANK_FIELD}</span>
                      {!verified_doctor?
                      <span style={{marginLeft:"5px"}}>
                          <EditOutlined onClick={()=> this.editRegistrationCouncil(registration_id)} title={"Edit Council"}/>
                      </span>:null
                      }
                  </>
              );
        }
    }
  onChangeCity = address => {

    this.setState({ address: address });

};
onChangeClinicLocation = clinic_id => (value) => {
    
    const { doctor_clinic_location } = this.state;
    let newClinicLocation = doctor_clinic_location;
    delete newClinicLocation[clinic_id];
    newClinicLocation[clinic_id] = value;
    this.setState({doctor_clinic_location:newClinicLocation});

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
                                style={{width:"400px",height:"auto",margin:"0",marginBottom:"10px"}}
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
  async handleCollegeSearch(data) {
    try {
      if (data) {
        const { searchCollege } = this.props;
        this.setState({ fetchingColleges: true });
        const response = await searchCollege(data);
        const { status } = response;
        if (status) {
          // const { colleges = {} } = responseData;
          // const collegeList = {};
          this.setState({ fetchingColleges: false });
          // Object.keys(colleges).forEach(id => {
          //   collegeList[id] = colleges[id];
          // });
          // this.setState({ colleges: collegeList, fetchingColleges: false });
        } else {
          this.setState({ fetchingColleges: false });
        }
      } else {
        this.setState({ fetchingColleges: false });
      }
    } catch (err) {
      console.log("err", err);
      message.error(this.formatMessage(messages.somethingWentWrong))
      this.setState({ fetchingColleges: false });
    }
  };
  async handleDegreeSearch(data) {
    try {
      if (data) {
        const { searchDegree } = this.props;
        this.setState({ fetchingDegrees: true });
        const response = await searchDegree(data);
        const { status } = response;
        if (status) {
          // const { degrees = {} } = responseData;
          // const degreeList = {};
          // Object.keys(degrees).forEach(id => {
          //   degreeList[id] = degrees[id];
          // });
          // this.setState({ degrees: degreeList, fetchingDegrees: false });
          this.setState({ fetchingDegrees: false });
        } else {
          this.setState({ fetchingDegrees: false });
        }
      } else {
        this.setState({ fetchingDegrees: false });
      }
    } catch (err) {
      console.log("err", err);
      message.error(this.formatMessage(messages.somethingWentWrong))
      this.setState({ fetchingDegrees: false });
    }
  };
  async handleCouncilSearch(data) {
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
    } catch (err) {
      console.log("err", err);
      message.error(this.formatMessage(messages.somethingWentWrong))
      this.setState({ fetchingCouncils: false });
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
  getCollegesOption = () => {
    const { colleges = {} } = this.props;

    return Object.keys(colleges).map(id => {
      const { basic_info: { name } = {} } = colleges[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
  };
  getDegreesOption = () => {
    const { degrees = {} } = this.props;

    return Object.keys(degrees).map(id => {
      const { basic_info: { name, type } = {} } = degrees[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
  };
  getCouncilOption = () => {
    const { councils = {} } = this.props;

    return Object.keys(councils).map(id => {
      const { basic_info: { name } = {} } = councils[id] || {};
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
        size={"small"}
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
        style={{width:"250px",height:"auto",margin:"0"}} 

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
              value={GENDER[gender].label}
              onChange={this.setGender}
              autoComplete="off"   
              style={{width:"100px",height:"auto",margin:"0"}} 
              size={"small"}
            >
                <Option key={0} value={'m'}>
                    {GENDER[MALE].label}
                </Option>
                <Option key={1} value={'f'}>
                    {GENDER[FEMALE].label}
                </Option>
                <Option key={2} value={'o'}>
                    {GENDER[OTHER].label}
                </Option>
            </Select>
          );
        }else{
            return (
              <>
                  <span>{gender ? GENDER[gender].label : TABLE_DEFAULT_BLANK_FIELD}</span>
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
  editRegistrationNumber = (registration_id) => {
    const { edit_registration_number } =this.state;
    let newRegistrationNumber = edit_registration_number;
    newRegistrationNumber[registration_id]=true;
    this.setState({edit_registration_number:newRegistrationNumber});
  }
  editClinicName = (clinic_id) => {
    const { edit_clinic_name } =this.state;
    let newClinicName = edit_clinic_name;
    newClinicName[clinic_id]=true;
    this.setState({edit_clinic_name:newClinicName});
  }
  editClinicTimings = (clinic_id) => {
    const { edit_clinic_timings } =this.state;
    let newClinicTimings = edit_clinic_timings;
    newClinicTimings[clinic_id]=true;
    this.setState({edit_clinic_timings:newClinicTimings});
  }
  editClinicLocation = (clinic_id) => {
    const { edit_clinic_location } =this.state;
    let newClinicLocation = edit_clinic_location;
    newClinicLocation[clinic_id]=true;
    this.setState({edit_clinic_location:newClinicLocation});
  }
  editQualificationYear = (qualification_id) => {
    let newQualificationYear = this.state.edit_qualification_year;
    newQualificationYear[qualification_id]=true;
    this.setState({edit_qualification_year:newQualificationYear});
  }
  editRegistrationYear = (registration_id) => {
    let newRegistrationYear = this.state.edit_registration_year;
    newRegistrationYear[registration_id]=true;
    this.setState({edit_registration_year:newRegistrationYear});
  }
  editRegistrationExpiryDate = (registration_id) => {
    let newRegistrationExpiryDate = this.state.edit_registration_expiry;
    newRegistrationExpiryDate[registration_id]=true;
    this.setState({edit_registration_expiry:newRegistrationExpiryDate});
  }
  editQualificationCollege = (qualification_id) => {
    let newQualificationCollege = this.state.edit_qualification_college;
    newQualificationCollege[qualification_id]=true;
    this.setState({edit_qualification_college:newQualificationCollege});
  }
  editQualificationDegree = (qualification_id) => {
    let newQualificationDegree = this.state.edit_qualification_degree;
    newQualificationDegree[qualification_id]=true;
    this.setState({edit_qualification_degree:newQualificationDegree});
  }
  editRegistrationCouncil = (registration_id) => {
    let newRegistrationCouncil= this.state.edit_registration_council;
    newRegistrationCouncil[registration_id]=true;
    this.setState({edit_qualification_degree:newRegistrationCouncil});
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
    updateRegistrationNumber = (e) => {
        const { doctor_user_id, edit_registration_number } = this.state;
        let newRegistrationCouncil = edit_registration_number;
        let registration_id = e.target.dataset.id;
        let updateData = {
            registration_details : [
                {
                    number:e.target.value,
                    doctor_id: doctor_user_id,
                    id: registration_id
                }
            ]
        };
        this.updateProfileData(updateData);
        newRegistrationCouncil[registration_id]=false;
        this.setState({edit_registration_number:newRegistrationCouncil});
    }
    updateClinicName = (e) => {
        const { doctor_user_id, edit_clinic_name } = this.state;
        let newClinicName = edit_clinic_name;
        let clinic_id = e.target.dataset.id;
        let updateData = {
            clinic_details : [
                {
                    name:e.target.value,
                    doctor_id: doctor_user_id,
                    id: clinic_id
                }
            ]
        };
        this.updateProfileData(updateData);
        newClinicName[clinic_id]=false;
        this.setState({edit_clinic_name:newClinicName});
    }
    updateClinicLocation = (e) => {
        const { doctor_user_id, edit_clinic_location } = this.state;
        let newClinicLocation = edit_clinic_location;
        let clinic_id = e.target.dataset.id;
        let updateData = {
            clinic_details : [
                {
                    location:e.target.value,
                    doctor_id: doctor_user_id,
                    id: clinic_id
                }
            ]
        };
        this.updateProfileData(updateData);
        newClinicLocation[clinic_id]=false;
        this.setState({edit_clinic_location:newClinicLocation});
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
        const { file } = info;
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            return;
        }
        this.getBase64(info.file.originFileObj, profile_pic =>
            this.setState({
                profile_pic,
                loading: false,
            })
        );
    };
    handleChangeLocation =() => {

    }
    getDoctorBasicDetails = () => {
        const { auth: {authenticated_user=null}, doctors, users, specialities } = this.props;
        const current_doctor = doctors[authenticated_user];
        const { profile_pic_url, edit_name, doctor_user_id } = this.state;
        const { formatMessage, handleProfilePicModalOpen } = this;
        const {
        basic_info: {
            gender,
            address,
            speciality_id
        } = {},
        city,
        } = doctors[doctor_user_id] || {};
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
                    <Avatar onClick={handleProfilePicModalOpen} style={{border:"5px solid lightgrey",cursor:"pointer"}} gap={"4"} src={profile_pic_url} size={164} icon={<UserOutlined/>} />
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
    const uploadButton = (
        <div>
            <img src={plus} className={"w22 h22"} />
        </div>
    );
    const {
      doctors,
      doctor_registrations,
      upload_documents,
      councils = {}
    } = this.props;
    const { doctor_user_id, verified_doctor } = this.state;
    const { formatMessage, handlePictureModal } = this;

    const { doctor_registration_ids = [] } = doctors[doctor_user_id] || {};

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
              {this.renderRegistrationNumber(registration_id)}
              </div>
            </div>

            {/*council*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.registration_council_text)}
              </div>
              <div className="fs14 fw500">
                {this.renderRegistrationCouncil(registration_id)}
              </div>
            </div>

            {/*year*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.registration_year_text)}
              </div>
              <div className="fs14 fw500">
                {this.renderRegistrationYear(registration_id)}
              </div>
            </div>

            {/*registration_expiry_date*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.registration_expiry_date_text)}
              </div>
              <div className="fs14 fw500">
                {this.renderRegistrationExpiryDate(registration_id)}
              </div>
            </div>

            {/*upload_documents*/}
            <div className="wp100 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.upload_document_text)}
              </div>

              <div className="flex align-center flex-wrap">
              {upload_document_ids.map(id => {
                    const { basic_info: { document,parent_id } = {} } =
                    upload_documents[id] || {};
                    if(verified_doctor){
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
                    }else{
                        return (
                            <div key={document} className={"qualification-avatar-uploader"}>
                            <img src={document} className='wp100 hp100 br4' />
                            <div className="overlay"></div>
                            <div className="button"> <DeleteTwoTone
                                className={"del"}
                                onClick={this.handleRemoveListRegistration(parent_id, document)}
                                twoToneColor="#fff"
                            /> </div>
                            </div>
                        );
                    }
                    
                })}
                { !verified_doctor && upload_document_ids.length < 3 && (<Upload
                    multiple={true}
                    // beforeUpload={this.handleBeforeUpload(key)}
                    showUploadList={false}
                    customRequest={this.customRequestRegistration(registration_id)}
                    listType="picture-card"
                    className={"doctor-profile-uploader"}
                    // onPreview={this.handlePreview}
                    style={{ width: 128, height: 128, margin: 6,display: "contents" }}
                    >
                    {uploadButton}
                    </Upload>)
                }
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

  handleRemoveList = (qualificationId, pic) => () => {

    let { deleteDoctorQualificationImage } = this.props;
    deleteDoctorQualificationImage(qualificationId, pic).then(response => {
      let { status = false } = response;
      if (status) {
        const { payload: { message:successMessage} } = response;
        message.success(successMessage);
        this.getInitialData();
      } else {
        message.error(this.formatMessage(messages.somethingWentWrong))
      }
    })

  };
  handleRemoveListRegistration = (registrationId, pic) => () => {

    let { deleteDoctorRegistrationImage } = this.props;

    deleteDoctorRegistrationImage(registrationId, pic).then(response => {
        let { status = false } = response;
        if (status) {
          const { payload: { message:successMessage} } = response;
          message.success(successMessage);
          this.getInitialData();
        } else {
          message.error(this.formatMessage(messages.somethingWentWrong))
        }
    })

  };
  customRequest = (qualification_id) => async ({ file, filename, onError, onProgress, onSuccess }) => {


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
        const { doctor_user_id } = this.state;
        let updateData = {
            qualification_details : [
                {
                    photos:uploadResponse.payload.data.files,
                    doctor_id: doctor_user_id,
                    id: qualification_id
                }
            ]
        };
        this.updateProfileData(updateData);
    } else {
      message.error(this.formatMessage(messages.somethingWentWrong))
    }



    return {
      abort() { }
    };
  };
  customRequestRegistration = (registration_id) => async ({ file, filename, onError, onProgress, onSuccess }) => {


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
        const { doctor_user_id } = this.state;
        let updateData = {
            registration_details : [
                {
                    photos:uploadResponse.payload.data.files,
                    doctor_id: doctor_user_id,
                    id: registration_id
                }
            ]
        };
        this.updateProfileData(updateData);
    } else {
      message.error(this.formatMessage(messages.somethingWentWrong))
    }



    return {
      abort() { }
    };
  };
  getDoctorQualificationDetails = () => {
    const uploadButton = (
        <div>
            <img src={plus} className={"w22 h22"} />
        </div>
    );
    const {
      doctors,
      doctor_qualifications,
      upload_documents,
      degrees = {},
      colleges = {}
    } = this.props;
    const { doctor_user_id, verified_doctor } =this.state;
    const { formatMessage, handlePictureModal } = this;

    const { doctor_qualification_ids = [] } = doctors[doctor_user_id] || {};

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
            <div className="wp30 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.degree_text)}
              </div>
              <div className="fs14 fw500">
                {this.renderQualificationDegree(qualification_id)}
              </div>
            </div>

            {/*college*/}
            <div className="wp40 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.college_text)}
              </div>
              <div className="fs14 fw500">
                {this.renderQualificationCollege(qualification_id)}
              </div>
            </div>

            {/*year*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.year_text)}
              </div>
              <div className="fs14 fw500">
                {this.renderQualificationYear(qualification_id)}
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
                    const { basic_info: { document,parent_id } = {} } =
                    upload_documents[id] || {};
                    if(!verified_doctor){
                        return (
                            <div key={document} className={"qualification-avatar-uploader"}>
                            <img src={document} className='wp100 hp100 br4' />
                            <div className="overlay"></div>
                            <div className="button"> <DeleteTwoTone
                                className={"del"}
                                onClick={this.handleRemoveList(parent_id, document)}
                                twoToneColor="#fff"
                            /> </div>
                            </div>
                        );
                    }else{
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
                    }
                })}
                {!verified_doctor && upload_document_ids.length < 3 && (<Upload
                    multiple={true}
                    // beforeUpload={this.handleBeforeUpload(key)}
                    showUploadList={false}
                    customRequest={this.customRequest(qualification_id)}
                    listType="picture-card"
                    className={"doctor-profile-uploader"}
                    // onPreview={this.handlePreview}
                    style={{ width: 128, height: 128, margin: 6,display: "contents" }}
                    >
                    {uploadButton}
                    </Upload>)
                }
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
    
    const numberToDay = {
        "1": FULL_DAYS.MON,
        "2": FULL_DAYS.TUE,
        "3": FULL_DAYS.WED,
        "4": FULL_DAYS.THU,
        "5": FULL_DAYS.FRI,
        "6": FULL_DAYS.SAT,
        "7": FULL_DAYS.SUN
    }
    const { id, doctors, doctor_clinics } = this.props;
    const { formatMessage, getFullDayText } = this;
    const { doctor_user_id, verified_doctor, edit_clinic_timings, modal_timing_visible } = this.state;
    const { doctor_clinic_ids = [] } = doctors[doctor_user_id] || {};

    return doctor_clinic_ids.map((clinic_id, index) => {
      const {
        basic_info: { name } = {},
        location,
        details: { time_slots = [] } = {}
      } = doctor_clinics[clinic_id] || {};
      let timeForModal = {};
      let daySelected = {
        [FULL_DAYS.MON]: false,
        [FULL_DAYS.TUE]: false,
        [FULL_DAYS.WED]: false,
        [FULL_DAYS.THU]: false,
        [FULL_DAYS.FRI]: false,
        [FULL_DAYS.SAT]: false,
        [FULL_DAYS.SUN]: false,
        
      }
      for(const time in time_slots){
          for(const i in time_slots[time]){
              if(time_slots[time][i]){
                time_slots[time][i].startTime=moment(time_slots[time][i].startTime);
                time_slots[time][i].endTime=moment(time_slots[time][i].endTime);
              }
          }
          if(time_slots[time].length){
              daySelected[numberToDay[time]]=true;
          }
          timeForModal[numberToDay[time]]=time_slots[time];
      }
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
                {this.renderClinicName(clinic_id)}
              </div>
            </div>

            {/*location*/}
            <div className="wp40 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.location_text)}
              </div>
              <div className="fs14 fw500">
                {this.renderClinicLocation(clinic_id)}
              </div>
            </div>

            {/*open_between*/}
            <div className="wp40 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.timings_text)}
                {!verified_doctor && !edit_clinic_timings[clinic_id]?
                    <span style={{marginLeft:"5px"}}>
                        <EditOutlined onClick={ () => this.editClinicTimings(clinic_id)} title={"Edit Clinic Timings"}/>
                    </span>:null
                }
              </div>
              {this.renderClinicTimings(time_slots,clinic_id)}
              {modal_timing_visible[clinic_id] && <TimingModal data-id={clinic_id} visible={modal_timing_visible[clinic_id]} handleCancel={()=>this.handleCancelTiming(clinic_id)} handleOk={this.handleOkTiming(clinic_id)}
                    timings={timeForModal}
                    daySelected={daySelected}
                />}
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
    const { doctors } = this.props;
    const { doctor_user_id } =this.state;
    const { profilePicModalVisible } = this.state;
    const { formatMessage, handleProfilePicModalClose } = this;

    const { basic_info: { profile_pic } = {} } = doctors[doctor_user_id] || {};

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
    const { doctor_user_id } = this.state;
    const { auth: {authenticated_user=null}, doctors } = this.props;
    const current_doctor = doctors[authenticated_user];
    const { loading, updateLoading } = this.state;
    const {
      formatMessage,
      getDoctorDetailsHeader,
      getDoctorBasicDetails,
      getDoctorRegistrationDetails,
      getDoctorQualificationDetails,
      getDoctorClinicDetails,
    //   getFooter,
      getModalDetails,
      getProfilePicModal
    } = this;

    const {
      doctor_clinic_ids = [],
      doctor_qualification_ids = [],
      doctor_registration_ids = []
    } = doctors[doctor_user_id] || {};

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

        {getModalDetails()}

        {getProfilePicModal()}
      </Fragment>
    );
  }
}

export default withRouter(injectIntl(DoctorProfilePage));
