import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
// import uuid from 'react-uuid';
import { Avatar, Upload, Input, Select, Spin, DatePicker } from "antd";
import throttle from "lodash-es/throttle";
import { doRequest } from "../../../Helper/network";
// import LocationModal from '../../../Components/DoctorOnBoarding/locationmodal';
import TimingModal from "../../../Components/DoctorOnBoarding/timingModal";
import plus from "../../../Assets/images/plus.png";
import PlacesAutocomplete from "react-places-autocomplete";

import Menu from "antd/es/menu";
import Dropdown from "antd/es/dropdown";

import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  ArrowLeftOutlined,
  UserOutlined,
  EditOutlined,
  CameraFilled,
  DeleteTwoTone,
  CheckOutlined,
  CloseOutlined,
  PlusCircleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import moment from "moment";
import messages from "./messages";
import {
  getUploadURL,
  getUploadQualificationDocumentUrl,
} from "../../../Helper/urls/doctor";
import {
  PATH,
  USER_CATEGORY,
  TABLE_DEFAULT_BLANK_FIELD,
  DAYS_TEXT_NUM,
  REQUEST_TYPE,
  MALE,
  GENDER,
  FEMALE,
  OTHER,
  FULL_DAYS,
  FULL_DAYS_NUMBER,
  HTTP_CODE_SERVER_ERROR,
  ACCOUNT_STATUS,
} from "../../../constant";
import { PageLoading } from "../../../Helper/loading/pageLoading";
import { withRouter } from "react-router-dom";
import confirm from "antd/es/modal/confirm";
import Tag from "antd/es/tag";

const { Option } = Select;

class DoctorProfilePage extends Component {
  constructor(props) {
    super(props);
    const {
      auth: {
        authenticated_user = null,
        authPermissions = [],
        authenticated_category = "",
      },
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
      specialities,
      id: doctorId,
    } = props;
    let doctor_user_id = doctorId;
    for (let doctor of Object.values(doctors)) {
      let { basic_info: { user_id = 0, id = 0 } = {} } = doctor;
      if (user_id === authenticated_user) {
        doctor_user_id = id;
      }
    }

    const {
      basic_info: {
        first_name = "",
        middle_name = "",
        last_name = "",
        profile_pic = "",
        gender = "",
        city = "",
        speciality_id = "",
      } = {},
      doctor_qualification_ids = [],
      doctor_registration_ids = [],
      doctor_clinic_ids = [],
      city: city_temp = "",
    } = doctors[doctor_user_id] || {};

    const {
      basic_info: { email = "", mobile_number = "", prefix = "" } = {},
      category = "",
    } = users[authenticated_user] || {};

    let final_city = "";
    if (city !== "") {
      final_city = city;
    } else {
      final_city = city_temp;
    }

    let edit_qualification_year = {};
    let edit_qualification_college = {};
    let edit_qualification_degree = {};

    doctor_qualification_ids.forEach((element) => {
      edit_qualification_year[element] = false;
      edit_qualification_college[element] = false;
      edit_qualification_degree[element] = false;
    });

    let edit_registration_council = {};
    let edit_registration_number = {};
    let edit_registration_year = {};
    let edit_registration_expiry = {};

    doctor_registration_ids.forEach((element) => {
      edit_registration_council[element] = false;
      edit_registration_number[element] = false;
      edit_registration_year[element] = false;
      edit_registration_expiry[element] = false;
    });

    let edit_clinic_name = {};
    let edit_clinic_location = {};
    let edit_clinic_timings = {};
    let modal_timing_visible = {};
    let doctor_clinic_location = {};
    doctor_clinic_ids.forEach((element) => {
      edit_clinic_name[element] = false;
      edit_clinic_location[element] = false;
      edit_clinic_timings[element] = false;
      modal_timing_visible[element] = false;
    });
    let verified_doctor = false;

    if (
      authPermissions.length ||
      authenticated_category === USER_CATEGORY.PROVIDER
    ) {
      verified_doctor = true;
    }

    let userName = `${first_name} ${middle_name ? `${middle_name} ` : ""}${
      last_name ? last_name : ""
    }`;
    this.state = {
      isProviderEditable: true,
      verified_doctor: verified_doctor,
      loading: false,
      updateLoading: false,
      doctors: doctors,
      doctor_clinics: doctor_clinics,
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      name: userName.trim(),
      email: email,
      gender: gender,
      speciality_id: speciality_id,
      city: final_city,
      mobile_number: mobile_number,
      category: category,
      prefix: prefix,
      profile_pic: "",
      profile_pic_url: profile_pic,
      edit_name: false,
      edit_gender: false,
      edit_specialities: false,
      edit_city: false,
      fetchingSpeciality: false,
      fetchingColleges: false,
      fetchingCouncils: false,
      doctor_user_id: doctor_user_id,
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
      doctor_clinic_location: doctor_clinic_location,
      registration_numbers: {},
      clinic_names: {},
      active: true,
      user_id: null,
      viewModalVisible: false,
      viewModalSrc: "",
      searchSpecialityText: "",
    };

    // this.handleSpecialitySearch = throttle(
    //   this.handleSpecialitySearch.bind(this),
    //   2000
    // );

    this.handleCollegeSearch = throttle(
      this.handleCollegeSearch.bind(this),
      2000
    );
  }

  componentDidMount() {
    const { doctors = {} } = this.state;
    const { doctor_user_id = "" } = this.state;
    const { getInitialData } = this;
    const { auth: { authenticated_category = "" } = {} } = this.props;
    const {
      doctor_qualification_ids,
      doctor_registration_ids,
      doctor_clinic_ids,
    } = doctors[doctor_user_id] || {};
    getInitialData();

    // if (!doctor_qualification_ids || !doctor_registration_ids || !doctor_clinic_ids) {
    //   getInitialData();
    // }
  }

  getInitialData = async () => {
    try {
      this.setState({ loading: true });
      const { getDoctorDetails } = this.props;
      const {
        auth: { authenticated_category = "" },
      } = this.props;

      const response = await getDoctorDetails();

      const {
        status,
        payload: { data = {}, message: { message: responseMessage } = {} } = {},
      } = response || {};

      if (status === true) {
        if (authenticated_category === USER_CATEGORY.PROVIDER) {
          const { isProviderEditable = true } = this.state;

          const { id: doctorId } = this.props;
          let doctor_user_id = doctorId;

          const {
            colleges = {},
            degrees = {},
            doctor_clinics = {},
            doctor_qualifications = {},
            docotr_registrations = {},
            doctors = {},
            registration_councils = {},
            specialities = {},
            upload_documents = {},
            users = {},
          } = data || {};

          if (authenticated_category === USER_CATEGORY.PROVIDER) {
            const { id: doctor_id = "" } = this.props;

            for (let doctor of Object.values(doctors)) {
              let { basic_info: { user_id = 0, id = 0 } = {} } = doctor;
              if (parseInt(id) === parseInt(doctor_id)) {
                this.setState({ user_id });
                const { deleted_at = "" } = users[user_id] || {};
                if (deleted_at) {
                  this.setState({
                    active: false,
                  });
                }
              }
            }
          }

          const {
            basic_info: {
              first_name = "",
              middle_name = "",
              last_name = "",
              profile_pic = "",
              gender = "",
              city = "",
              speciality_id = "",
              user_id = "",
            } = {},
            doctor_qualification_ids = [],
            doctor_registration_ids = [],
            doctor_clinic_ids = [],
            city: city_temp = "",
          } = doctors[doctor_user_id] || {};

          let final_city = "";
          if (city !== "") {
            final_city = city;
          } else {
            final_city = city_temp;
          }

          this.setState({
            loading: false,
            colleges,
            degrees,
            doctor_clinics,
            doctor_qualifications,
            docotr_registrations,
            doctors,
            registration_councils,
            specialities,
            upload_documents,
            users,
            first_name,
            middle_name,
            last_name,
            profile_pic,
            gender,
            city: final_city,
            speciality_id,
            doctor_qualification_ids,
            doctor_registration_ids,
            doctor_clinic_ids,
            user_id,
          });
        } else {
          this.setState({
            loading: false,
          });
        }
      } else {
        this.setState({
          loading: false,
        });
        message.warn(responseMessage);
      }
    } catch (error) {
      this.setState({
        loading: false,
      });
      console.log("72833257423646238748236482634823", { error });
      message.warn("Something went wrong, please try again later");
    }
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  warnNote = () => {
    return (
      <div className="pt16">
        <p className="red">
          <span className="fw600">{"Note"}</span>
          {` :${this.formatMessage(messages.warnNote)}`}
        </p>
      </div>
    );
  };

  handleCloseWarning = () => {
    const { warnNote } = this;

    confirm({
      title: `${this.formatMessage(messages.confirmMessage)}`,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        const { deactivateDoctor, id } = this.props;
        try {
          const response = await deactivateDoctor(id);
          const { status, payload: { message: respMessage = "" } = {} } =
            response || {};
          if (status === true) {
            message.success(respMessage);
            this.setState({ active: false });
          } else {
            message.warn(respMessage);
          }
        } catch (error) {
          console.log("doctorDeactivate UI error --> ", error);
        }
      },
      onCancel() {},
    });
  };

  handleActivate = async (e) => {
    e.preventDefault();
    const { activateDoctor, id } = this.props;
    const { user_id = null } = this.state;
    try {
      const response = await activateDoctor(user_id);
      const { status, payload: { message: respMessage = "" } = {} } =
        response || {};

      if (status === true) {
        message.success(respMessage);
        this.setState({ active: true });
      } else {
        message.warn(respMessage);
      }
    } catch (error) {
      console.log("863478235632849703482 doctorActivate UI error --> ", error);
    }
  };

  updateProfileData = async (updateData) => {
    try {
      this.setState({ updateLoading: true });
      const {
        auth: { authenticated_category = "", authenticated_user = null },
        doctors,
        users,
        updateDoctorBasicInfo,
      } = this.props;
      const { id } = authenticated_user;
      let response = {};

      if (authenticated_category === USER_CATEGORY.PROVIDER) {
        const { id: doctor_id = "" } = this.props;
        const { doctors = {}, doctor_user_id = "" } = this.state;
        const { basic_info: { user_id: d_user_id = "" } = {} } =
          doctors[doctor_user_id] || {};
        updateData["doctor_id"] = doctor_id;
        response = await updateDoctorBasicInfo(d_user_id, updateData);
      } else {
        response = await updateDoctorBasicInfo(authenticated_user, updateData);
      }

      const {
        status,
        payload: { message: respMessage },
        statusCode,
      } = response;
      if (status) {
        this.setState({
          updateLoading: false,
        });
        message.success(respMessage);
        this.getInitialData();
        return true;
      } else {
        this.setState({
          updateLoading: false,
        });
        if (statusCode == HTTP_CODE_SERVER_ERROR) {
          const {
            payload: {
              message: { message: serverMessage },
            },
          } = response;
          message.error(serverMessage);
        } else {
          message.error(respMessage);
        }
      }
    } catch (error) {
      this.setState({
        updateLoading: false,
      });
      console.log(error);
      message.warn("Something went wrong, please try again later");
    }
    return false;
  };

  editName = () => {
    this.setState({ edit_name: true });
  };
  onChangeName = (e) => {
    this.setState({ name: e.target.value });
  };
  updateName = () => {
    const { name, doctor_user_id } = this.state;
    const { doctors } = this.props;
    const {
      basic_info: { first_name = "", middle_name = "", last_name = "" },
    } = doctors[doctor_user_id];
    const oldName = `${first_name} ${middle_name ? `${middle_name} ` : ""}${
      last_name ? last_name : ""
    }`;
    if (name == oldName.trim()) {
      this.setState({ edit_name: false });
      return;
    }
    if (name == "") {
      this.setState({ name: oldName });
      this.setState({ edit_name: false });
      message.warn(this.formatMessage(messages.nameError));
      return;
    }
    this.updateProfileData({ name: name }).then((res) => {
      if (res) {
        this.setState({ edit_name: false });
      } else {
        this.setState({ name: oldName.trim() });
      }
    });
  };
  undoNameChanges = () => {
    const { doctor_user_id = "" } = this.state;
    const { doctors } = this.props;
    const {
      basic_info: { first_name = "", middle_name = "", last_name = "" },
    } = doctors[doctor_user_id];
    const oldName = `${first_name} ${middle_name ? `${middle_name} ` : ""}${
      last_name ? last_name : ""
    }`;
    this.setState({ name: oldName.trim() });
    this.setState({ edit_name: false });
  };

  editCity = () => {
    this.setState({ edit_city: true });
  };
  onChangeCity = (city) => {
    this.setState({ city: city });
  };
  updateCity = () => {
    const { city = "", doctor_user_id = "" } = this.state;
    const { doctors } = this.props;
    const {
      basic_info: { city: oldCity },
    } = doctors[doctor_user_id];
    if (city == oldCity) {
      this.setState({ edit_city: false });
      return;
    }
    if (city == "") {
      this.setState({ city: oldCity });
      this.setState({ edit_city: false });
      message.warn(this.formatMessage(messages.cityError));
      return;
    }
    this.updateProfileData({ city: city }).then((res) => {
      if (res) {
        this.setState({ edit_city: false });
      } else {
        this.setState({ city: oldCity });
      }
    });
  };
  undoCityChanges = () => {
    const { doctor_user_id = "" } = this.state;
    const { doctors } = this.props;
    const {
      basic_info: { city: oldCity },
    } = doctors[doctor_user_id];
    this.setState({ city: oldCity });
    this.setState({ edit_city: false });
  };

  editGender = () => {
    this.setState({ edit_gender: true });
  };
  updateGender = (value) => {
    this.setState({ gender: value, edit_gender: false });
    this.updateProfileData({ gender: value });
  };
  genderBlur = () => {
    this.setState({ edit_gender: false });
  };

  editSpecialities = () => {
    this.setState({ edit_specialities: true });
  };
  specialityBlur = () => {
    this.setState({ edit_specialities: false });
  };
  updateSpeciality = (value) => {
    this.setState({ speciality_id: value, edit_specialities: false });
    this.updateProfileData({ speciality_id: value });
  };

  editQualificationDegree = (qualification_id) => {
    let newQualificationDegree = this.state.edit_qualification_degree;
    newQualificationDegree[qualification_id] = true;
    this.setState({ edit_qualification_degree: newQualificationDegree });
  };
  onBlurQualificationDegree = (qualification_id) => {
    let newQualificationDegree = this.state.edit_qualification_degree;
    newQualificationDegree[qualification_id] = false;
    this.setState({ edit_qualification_degree: newQualificationDegree });
  };
  updateDegree = (qualification_id) => (value) => {
    const { doctor_user_id, edit_qualification_degree } = this.state;
    let newQualificationDegree = edit_qualification_degree;
    let updateData = {
      qualification_details: [
        {
          degree_id: value,
          doctor_id: doctor_user_id,
          id: qualification_id,
        },
      ],
    };
    this.updateProfileData(updateData);
    newQualificationDegree[qualification_id] = false;
    this.setState({ edit_qualification_degree: newQualificationDegree });
  };

  async handleDegreeSearch(data) {
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
    } catch (err) {
      console.log("err", err);
      message.error(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingDegrees: false });
    }
  }

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

  editQualificationCollege = (qualification_id) => {
    let newQualificationCollege = this.state.edit_qualification_college;
    newQualificationCollege[qualification_id] = true;
    this.setState({ edit_qualification_college: newQualificationCollege });
  };
  onBlurQualificationCollege = (qualification_id) => {
    let newQualificationCollege = this.state.edit_qualification_college;
    newQualificationCollege[qualification_id] = false;
    this.setState({ edit_qualification_college: newQualificationCollege });
  };
  updateCollege = (qualification_id) => (value) => {
    const { doctor_user_id = "", edit_qualification_college = "" } = this.state;
    let newQualificationCollege = edit_qualification_college;
    let updateData = {
      qualification_details: [
        {
          college_id: value,
          doctor_id: doctor_user_id,
          id: qualification_id,
        },
      ],
    };
    this.updateProfileData(updateData);
    newQualificationCollege[qualification_id] = false;
    this.setState({ edit_qualification_college: newQualificationCollege });
  };

  async handleCollegeSearch(data) {
    try {
      if (data) {
        const { searchCollege } = this.props;
        this.setState({ fetchingColleges: true });
        const response = await searchCollege(data);
        const { status } = response;
        if (status) {
          this.setState({ fetchingColleges: false });
        } else {
          this.setState({ fetchingColleges: false });
        }
      } else {
        this.setState({ fetchingColleges: false });
      }
    } catch (err) {
      console.log("err", err);
      message.error(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingColleges: false });
    }
  }

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

  editQualificationYear = (qualification_id) => {
    let newQualificationYear = this.state.edit_qualification_year;
    newQualificationYear[qualification_id] = true;
    this.setState({ edit_qualification_year: newQualificationYear });
  };
  onBlurQualificationYear = (qualification_id) => {
    let newQualificationYear = this.state.edit_qualification_year;
    newQualificationYear[qualification_id] = false;
    this.setState({ edit_qualification_year: newQualificationYear });
  };
  getYearOptions = () => {
    let currYear = moment().format("YYYY");
    let curryearNum = parseInt(currYear);
    let years = [];
    for (let year = curryearNum - 100; year <= curryearNum + 20; year++) {
      years.push(
        <Option key={year} value={year} name={year}>
          {year}
        </Option>
      );
    }
    return years;
  };
  updateQualificationYear = (qualification_id) => (value) => {
    const { doctor_user_id = "", edit_qualification_year = "" } = this.state;
    const { doctor_qualifications } = this.props;
    let newQualificationYear = edit_qualification_year;
    let updateData = {
      qualification_details: [
        {
          year: value,
          doctor_id: doctor_user_id,
          id: qualification_id,
        },
      ],
    };
    const res = this.updateProfileData(updateData);
    if (res) {
      newQualificationYear[qualification_id] = false;
      this.setState({ edit_qualification_year: newQualificationYear });
    }
  };

  editRegistrationNumber = (registration_id) => {
    const { edit_registration_number = "" } = this.state;
    let newRegistrationNumber = edit_registration_number;
    newRegistrationNumber[registration_id] = true;
    this.setState({ edit_registration_number: newRegistrationNumber });
  };
  onBlurRegistrationNumber = (registration_id) => {
    const { edit_registration_number = "" } = this.state;
    let newRegistrationNumber = edit_registration_number;
    newRegistrationNumber[registration_id] = false;
    this.setState({ edit_registration_number: newRegistrationNumber });
  };
  changeRegistrationNumber = (event) => {
    let registration_id = event.target.dataset.id;
    const { registration_numbers = "" } = this.state;
    let newRegistrationNumber = registration_numbers;
    newRegistrationNumber[registration_id] = event.target.value;
    this.setState({ registration_numbers: newRegistrationNumber });
  };
  updateRegistrationNumber = (e) => {
    const {
      doctor_user_id = "",
      edit_registration_number = "",
      registration_numbers = "",
    } = this.state;
    const { doctor_registrations } = this.props;
    let newEditRegistrationNumber = edit_registration_number;
    let newRegistrationNumber = registration_numbers;
    let registration_id = e.target.dataset.id;
    const {
      basic_info: { number = "" },
    } = doctor_registrations[registration_id];
    if (e.target.value == number) {
      newEditRegistrationNumber[registration_id] = false;
      this.setState({ edit_registration_number: newEditRegistrationNumber });
      return;
    }
    if (e.target.value == "") {
      newEditRegistrationNumber[registration_id] = false;
      newRegistrationNumber[registration_id] = number;
      this.setState({
        edit_registration_number: newEditRegistrationNumber,
        registration_numbers: newRegistrationNumber,
      });
      message.warn(this.formatMessage(messages.registrationNumberError));
      return;
    }
    let updateData = {
      registration_details: [
        {
          number: e.target.value,
          doctor_id: doctor_user_id,
          id: registration_id,
        },
      ],
    };
    this.updateProfileData(updateData).then((res) => {
      if (res) {
        newEditRegistrationNumber[registration_id] = false;
        this.setState({ edit_registration_number: newEditRegistrationNumber });
      }
    });
  };
  undoRegistrationNumberChanges = (registration_id) => {
    const {
      doctor_user_id = "",
      registration_numbers = "",
      edit_registration_number = "",
    } = this.state;
    const { doctor_registrations } = this.props;
    const {
      basic_info: { number },
    } = doctor_registrations[registration_id];
    let newRegistrationNumber = registration_numbers;
    newRegistrationNumber[registration_id] = number;
    let newEditRegistrationNumber = edit_registration_number;
    newEditRegistrationNumber[registration_id] = false;
    this.setState({
      edit_registration_number: newEditRegistrationNumber,
      registration_numbers: newRegistrationNumber,
    });
  };

  editRegistrationCouncil = (registration_id) => {
    let newRegistrationCouncil = this.state.edit_registration_council;
    newRegistrationCouncil[registration_id] = true;
    this.setState({ edit_registration_council: newRegistrationCouncil });
  };
  onBlurRegistrationCouncil = (registration_id) => {
    let newRegistrationCouncil = this.state.edit_registration_council;
    newRegistrationCouncil[registration_id] = false;
    this.setState({ edit_registration_council: newRegistrationCouncil });
  };
  updateRegistrationCouncil = (registration_id) => (value) => {
    const { doctor_user_id = "", edit_registration_council = "" } = this.state;
    let newRegistrationCouncil = edit_registration_council;
    let updateData = {
      registration_details: [
        {
          registration_council_id: value,
          doctor_id: doctor_user_id,
          id: registration_id,
        },
      ],
    };
    this.updateProfileData(updateData);
    newRegistrationCouncil[registration_id] = false;
    this.setState({ edit_registration_council: newRegistrationCouncil });
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

  editRegistrationYear = (registration_id) => {
    let newRegistrationYear = this.state.edit_registration_year;
    newRegistrationYear[registration_id] = true;
    this.setState({ edit_registration_year: newRegistrationYear });
  };
  updateRegistrationYear = (registration_id) => (value) => {
    const { doctor_user_id = "", edit_registration_year = "" } = this.state;
    let newRegistrationYear = edit_registration_year;
    let updateData = {
      registration_details: [
        {
          year: value,
          doctor_id: doctor_user_id,
          id: registration_id,
        },
      ],
    };
    this.updateProfileData(updateData);
    newRegistrationYear[registration_id] = false;
    this.setState({ edit_registration_year: newRegistrationYear });
  };
  onBlurRegistrationYear = (registration_id) => {
    let newRegistrationYear = this.state.edit_registration_year;
    newRegistrationYear[registration_id] = false;
    this.setState({ edit_registration_year: newRegistrationYear });
  };

  editRegistrationExpiryDate = (registration_id) => {
    let newRegistrationExpiryDate = this.state.edit_registration_expiry;
    newRegistrationExpiryDate[registration_id] = true;
    this.setState({ edit_registration_expiry: newRegistrationExpiryDate });
  };
  onBlurRegistrationExpiryDate = (registration_id) => {
    let newRegistrationExpiryDate = this.state.edit_registration_expiry;
    newRegistrationExpiryDate[registration_id] = false;
    this.setState({ edit_registration_expiry: newRegistrationExpiryDate });
  };
  updateRegistrationExpiryDate = (registration_id) => (date, dateString) => {
    if (date) {
      const { doctor_user_id = "", edit_registration_expiry = "" } = this.state;
      let newRegistrationExpiryDate = edit_registration_expiry;
      let updateData = {
        registration_details: [
          {
            expiryDate: date,
            doctor_id: doctor_user_id,
            id: registration_id,
          },
        ],
      };
      this.updateProfileData(updateData);
      newRegistrationExpiryDate[registration_id] = false;
      this.setState({ edit_registration_expiry: newRegistrationExpiryDate });
    }
  };

  editClinicName = (clinic_id) => {
    const { edit_clinic_name = "" } = this.state;
    let newClinicName = edit_clinic_name;
    newClinicName[clinic_id] = true;
    this.setState({ edit_clinic_name: newClinicName });
  };
  updateClinicName = (e) => {
    const {
      doctor_user_id = "",
      edit_clinic_name = "",
      clinic_names = "",
    } = this.state;
    const { doctor_clinics = [] } = this.props;
    let newClinicName = clinic_names;
    let newEditClinic = edit_clinic_name;
    let clinic_id = e.target.dataset.id;
    const {
      basic_info: { name: oldName },
    } = doctor_clinics[clinic_id];
    let updateData = {
      clinic_details: [
        {
          name: e.target.value,
          doctor_id: doctor_user_id,
          id: clinic_id,
        },
      ],
    };
    if (e.target.value == oldName) {
      newEditClinic[clinic_id] = false;
      this.setState({ edit_clinic_name: newEditClinic });
      return;
    }
    if (e.target.value == "") {
      newEditClinic[clinic_id] = false;
      newClinicName[clinic_id] = oldName;
      this.setState({
        edit_clinic_name: newEditClinic,
        clinic_names: newClinicName,
      });
      message.warn(this.formatMessage(messages.clincNameError));
      return;
    }
    this.updateProfileData(updateData).then((res) => {
      if (res) {
        newEditClinic[clinic_id] = false;
        this.setState({ edit_clinic_name: newEditClinic });
      }
    });
  };
  undoClinicNameChanges = (clinic_id) => {
    const {
      doctor_user_id = "",
      edit_clinic_name = "",
      clinic_names = "",
    } = this.state;
    const { doctor_clinics } = this.props;
    let newClinicName = clinic_names;
    let newEditClinic = edit_clinic_name;
    const {
      basic_info: { name: oldName },
    } = doctor_clinics[clinic_id];
    newEditClinic[clinic_id] = false;
    newClinicName[clinic_id] = oldName;
    this.setState({
      edit_clinic_name: newEditClinic,
      clinic_names: newClinicName,
    });
  };
  onChangeClinicName = (event) => {
    let clinic_id = event.target.dataset.id;
    const { clinic_names } = this.state;
    let newClinicName = clinic_names;
    newClinicName[clinic_id] = event.target.value;
    this.setState({ clinic_names: newClinicName });
  };

  editClinicLocation = (clinic_id) => {
    const { edit_clinic_location } = this.state;
    let newClinicLocation = edit_clinic_location;
    newClinicLocation[clinic_id] = true;
    this.setState({ edit_clinic_location: newClinicLocation });
  };
  updateClinicLocation = (e) => {
    const { doctor_user_id, edit_clinic_location, doctor_clinic_location } =
      this.state;
    const { doctor_clinics } = this.props;
    let newEditClinicLocation = edit_clinic_location;
    let newClinicLocation = doctor_clinic_location;
    let clinic_id = e.target.dataset.id;
    let updateData = {
      clinic_details: [
        {
          location: e.target.value,
          doctor_id: doctor_user_id,
          id: clinic_id,
        },
      ],
    };
    const { location: oldLocation } = doctor_clinics[clinic_id];
    if (e.target.value == oldLocation) {
      newEditClinicLocation[clinic_id] = false;
      this.setState({ edit_clinic_location: newEditClinicLocation });
      return;
    }
    if (e.target.value == "") {
      newEditClinicLocation[clinic_id] = false;
      newClinicLocation[clinic_id] = oldLocation;
      this.setState({
        edit_clinic_location: newEditClinicLocation,
        doctor_clinic_location: newClinicLocation,
      });
      message.warn(this.formatMessage(messages.clincLocationError));
      return;
    }
    this.updateProfileData(updateData).then((res) => {
      if (res) {
        newEditClinicLocation[clinic_id] = false;
        this.setState({ edit_clinic_location: newEditClinicLocation });
      } else {
      }
    });
  };
  undoLocationChanges = (clinic_id) => {
    const { doctor_user_id, edit_clinic_location, doctor_clinic_location } =
      this.state;
    const { doctor_clinics } = this.props;
    let newEditClinicLocation = edit_clinic_location;
    let newClinicLocation = doctor_clinic_location;
    const { location: oldLocation } = doctor_clinics[clinic_id];
    newEditClinicLocation[clinic_id] = false;
    newClinicLocation[clinic_id] = oldLocation;
    this.setState({
      edit_clinic_location: newEditClinicLocation,
      doctor_clinic_location: newClinicLocation,
    });
  };

  handleBack = (e) => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };
  renderName = () => {
    const { first_name = "", middle_name = "", last_name = "" } = this.state;
    let userName = `${first_name} ${middle_name ? `${middle_name} ` : ""}${
      last_name ? last_name : ""
    }`;

    const { edit_name, name } = this.state;
    if (!name) {
      this.setState({ name: userName.trim() });
    }

    if (edit_name) {
      return (
        <div style={{ position: "relative" }}>
          <Input
            autoFocus
            onBlur={this.updateName}
            value={name}
            onPressEnter={this.updateName}
            onChange={this.onChangeName}
          ></Input>
          <div style={{ position: "absolute", right: 0 }}>
            <CheckOutlined className={"update-button-ok"} />
            <CloseOutlined
              className={"update-button-cancel"}
              onMouseDown={this.undoNameChanges}
            />
          </div>
        </div>
      );
    } else {
      return (
        <Fragment>
          <span>{name}</span>
          <span style={{ marginLeft: "5px" }}>
            <EditOutlined onClick={this.editName} title={"Edit Name"} />
          </span>
        </Fragment>
      );
    }
  };
  renderRegistrationNumber = (registration_id) => {
    const {
      edit_registration_number,
      verified_doctor,
      doctor_user_id,
      registration_numbers,
    } = this.state;
    const { doctor_registrations, doctors } = this.props;
    let regNumber = registration_numbers[registration_id];
    const {
      basic_info: { number },
    } = doctor_registrations[registration_id];
    if (regNumber == undefined) {
      regNumber = number;
    }

    if (edit_registration_number[registration_id]) {
      return (
        <div style={{ position: "relative" }}>
          <Input
            value={regNumber}
            data-id={registration_id}
            onChange={this.changeRegistrationNumber}
            onPressEnter={this.updateRegistrationNumber}
            data-id={registration_id}
            onBlur={this.updateRegistrationNumber}
            autoFocus
          ></Input>
          <div style={{ position: "absolute", right: 0 }}>
            <CheckOutlined className={"update-button-ok"} />
            <CloseOutlined
              className={"update-button-cancel"}
              onMouseDown={() =>
                this.undoRegistrationNumberChanges(registration_id)
              }
            />
          </div>
        </div>
      );
    } else {
      return (
        <Fragment>
          <span>{regNumber}</span>
          {!verified_doctor ? (
            <span style={{ marginLeft: "5px" }}>
              <EditOutlined
                onClick={() => this.editRegistrationNumber(registration_id)}
                title={"Edit Registration Number"}
              />
            </span>
          ) : null}
        </Fragment>
      );
    }
  };

  renderClinicName = (clinic_id) => {
    const { edit_clinic_name, verified_doctor, clinic_names } = this.state;
    const { doctor_clinics, doctors } = this.props;
    let clinicName = clinic_names[clinic_id];
    const {
      basic_info: { name },
    } = doctor_clinics[clinic_id];
    if (clinicName == undefined) {
      clinicName = name;
    }
    if (edit_clinic_name[clinic_id]) {
      return (
        <div style={{ position: "relative" }}>
          <Input
            value={clinicName}
            onChange={this.onChangeClinicName}
            onPressEnter={this.updateClinicName}
            data-id={clinic_id}
            onBlur={this.updateClinicName}
            autoFocus
          ></Input>
          <div style={{ position: "absolute", right: 0 }}>
            <CheckOutlined className={"update-button-ok"} />
            <CloseOutlined
              className={"update-button-cancel"}
              onMouseDown={() => this.undoClinicNameChanges(clinic_id)}
            />
          </div>
        </div>
      );
    } else {
      return (
        <Fragment>
          <span>{name}</span>
          {!verified_doctor ? (
            <span style={{ marginLeft: "5px" }}>
              <EditOutlined
                onClick={() => this.editClinicName(clinic_id)}
                title={"Edit Clinic Name"}
              />
            </span>
          ) : null}
        </Fragment>
      );
    }
  };
  handleCancelTiming = (clinic_id) => {
    const { edit_clinic_timings } = this.state;
    let newModalVisibleTimings = edit_clinic_timings;
    newModalVisibleTimings[clinic_id] = false;
    this.setState({ edit_clinic_timings: newModalVisibleTimings });
  };
  handleOkTiming = (clinic_id) => (timing, selectedDays) => {
    const { edit_clinic_timings, modal_timing_visible, doctor_user_id } =
      this.state;
    let time_slots = {
      [FULL_DAYS_NUMBER.MON]: timing[FULL_DAYS.MON],
      [FULL_DAYS_NUMBER.TUE]: timing[FULL_DAYS.TUE],
      [FULL_DAYS_NUMBER.WED]: timing[FULL_DAYS.WED],
      [FULL_DAYS_NUMBER.THU]: timing[FULL_DAYS.THU],
      [FULL_DAYS_NUMBER.FRI]: timing[FULL_DAYS.FRI],
      [FULL_DAYS_NUMBER.SAT]: timing[FULL_DAYS.SAT],
      [FULL_DAYS_NUMBER.SUN]: timing[FULL_DAYS.SUN],
    };
    const updateData = {
      clinic_details: [
        {
          time_slots: time_slots,
          doctor_id: doctor_user_id,
          id: clinic_id,
        },
      ],
    };
    this.updateProfileData(updateData);
    let editClinicTimings = edit_clinic_timings;
    let newModalTimings = modal_timing_visible;
    newModalTimings[clinic_id] = false;
    editClinicTimings[clinic_id] = false;
    this.setState({
      modal_timing_visible: newModalTimings,
      edit_clinic_timings: editClinicTimings,
    });
  };
  setModalTimingVisible = (clinic_id) => () => {
    const { modal_timing_visible } = this.state;
    let newModalVisibleTimings = modal_timing_visible;
    newModalVisibleTimings[clinic_id] = true;
    this.setState({ modal_timing_visible: newModalVisibleTimings });
  };
  renderClinicTimings = (time_slots, clinic_id) => {
    const { edit_clinic_timings, verified_doctor } = this.state;
    const { doctor_clinics, doctors } = this.props;
    const {
      basic_info: { name },
    } = doctor_clinics[clinic_id];

    return Object.keys(time_slots).map((day, index) => {
      // todo: add DAY[day] later from constants
      return (
        <Fragment>
          {time_slots[day].length > 0 &&
            time_slots[day][0].startTime != "" &&
            time_slots[day][0].endTime != "" && (
              <div className="wp100 flex">
                <div className="fs14 fw700 mt16 mb10 mr16">
                  {this.getFullDayText(day)}
                </div>
                <div className="wp100 mt16 mb10 mr16 flex" key={`ts-${index}`}>
                  {time_slots[day].map((time_slot, i) => {
                    const { startTime: start_time, endTime: end_time } =
                      time_slot || {};

                    return (
                      <div
                        className="fs14 fw500 wp100"
                        key={`ts/${index}/${i}`}
                      >
                        {start_time
                          ? `${moment(start_time).format("LT")} - ${moment(
                              end_time
                            ).format("LT")}`
                          : "CLOSED"}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </Fragment>
      );
    });
  };

  renderTimings = (timings) => {
    return Object.keys(timings).map((day) => {
      return (
        <div className="wp100 flex flex-start">
          <div className="fs14 medium wp30">{`${this.getFullDayText(
            day
          )} :`}</div>
          <div className="wp80 flex-start">
            {timings[day].length &&
            timings[day][0].startTime != "" &&
            timings[day][0].endTime != ""
              ? timings[day].map((time, index) => {
                  return (
                    <div className="flex justify-start">
                      <div>{`${
                        time.startTime
                          ? moment(time.startTime).format("hh:mm a")
                          : ""
                      }-`}</div>
                      <div>
                        {time.endTime
                          ? `${moment(time.endTime).format("hh:mm a")}${
                              index < timings[day].length - 1 ? ", " : " "
                            } `
                          : ""}
                      </div>
                    </div>
                  );
                })
              : this.formatMessage(messages.closed)}
          </div>
        </div>
      );
    });
  };

  renderClinicLocation = (clinic_id) => {
    const { edit_clinic_location, verified_doctor, doctor_clinic_location } =
      this.state;
    const { doctor_clinics } = this.props;
    const { location } = doctor_clinics[clinic_id];
    let render_location = doctor_clinic_location[clinic_id];
    if (render_location == undefined) {
      render_location = location;
    }
    if (edit_clinic_location[clinic_id]) {
      return (
        <div style={{ position: "relative" }}>
          <PlacesAutocomplete
            value={render_location}
            onChange={this.onChangeClinicLocation(clinic_id)}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <Input
                  {...getInputProps({
                    // placeholder: this.formatMessage(messages.searchCity),
                    className: "form-inputs-google",
                  })}
                  onPressEnter={this.updateClinicLocation}
                  data-id={clinic_id}
                  style={{ width: "390px", height: "auto", margin: "0" }}
                  onBlur={this.updateClinicLocation}
                  autoFocus
                />
                <div
                  className="google-places-autocomplete__suggestions-container"
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    marginTop: "4px",
                  }}
                >
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = "google-places-autocomplete__suggestion";
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
                {!loading && suggestions.length == 0 && (
                  <div style={{ float: "right" }}>
                    <CheckOutlined className={"update-button-ok"} />
                    <CloseOutlined
                      className={"update-button-cancel"}
                      onMouseDown={() => this.undoLocationChanges(clinic_id)}
                    />
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>
        </div>
      );
    } else {
      return (
        <Fragment>
          <span>{render_location}</span>
          {!verified_doctor ? (
            <span style={{ marginLeft: "5px" }}>
              <EditOutlined
                onClick={() => this.editClinicLocation(clinic_id)}
                title={"Edit Clinic Location"}
              />
            </span>
          ) : null}
        </Fragment>
      );
    }
  };

  renderQualificationYear = (qualification_id) => {
    const { edit_qualification_year, verified_doctor } = this.state;
    const { doctor_qualifications = {} } = this.props;

    if (edit_qualification_year[qualification_id]) {
      return (
        <Select
          onBlur={() => this.onBlurQualificationYear(qualification_id)}
          size={"small"}
          style={{ width: "100px", height: "auto", margin: "0" }}
          className="form-inputs"
          placeholder="Select Year"
          value={
            doctor_qualifications[qualification_id].basic_info.year
              ? doctor_qualifications[qualification_id].basic_info.year
              : null
          }
          onChange={this.updateQualificationYear(qualification_id)}
          autoFocus
        >
          {this.getYearOptions()}
        </Select>
      );
    } else {
      return (
        <Fragment>
          <span>{doctor_qualifications[qualification_id].basic_info.year}</span>
          {!verified_doctor ? (
            <span style={{ marginLeft: "5px" }}>
              <EditOutlined
                onClick={() => this.editQualificationYear(qualification_id)}
                title={"Edit Year"}
              />
            </span>
          ) : null}
        </Fragment>
      );
    }
  };

  renderRegistrationYear = (registration_id) => {
    const { edit_registration_year, verified_doctor } = this.state;
    const { doctor_registrations = {} } = this.props;

    if (edit_registration_year[registration_id]) {
      return (
        <Select
          size={"small"}
          style={{ width: "100px", height: "auto", margin: "0" }}
          className="form-inputs"
          placeholder="Select Year"
          value={
            doctor_registrations[registration_id].basic_info.year
              ? doctor_registrations[registration_id].basic_info.year
              : null
          }
          onChange={this.updateRegistrationYear(registration_id)}
          onBlur={() => this.onBlurRegistrationYear(registration_id)}
          autoFocus
        >
          {this.getYearOptions()}
        </Select>
      );
    } else {
      return (
        <Fragment>
          <span>{doctor_registrations[registration_id].basic_info.year}</span>
          {!verified_doctor ? (
            <span style={{ marginLeft: "5px" }}>
              <EditOutlined
                onClick={() => this.editRegistrationYear(registration_id)}
                title={"Edit Year"}
              />
            </span>
          ) : null}
        </Fragment>
      );
    }
  };

  renderRegistrationExpiryDate = (registration_id) => {
    const { edit_registration_expiry, verified_doctor } = this.state;
    const { doctor_registrations = {} } = this.props;
    const expiryDate = moment(
      doctor_registrations[registration_id].expiry_date
    ).format("MMMM DD, YYYY");
    if (edit_registration_expiry[registration_id]) {
      return (
        <DatePicker
          style={{ margin: "0", height: "auto" }}
          size={"small"}
          defaultValue={moment(
            doctor_registrations[registration_id].expiry_date
          )}
          onChange={this.updateRegistrationExpiryDate(registration_id)}
          placeholder="Select Expiry Date"
          open={true}
          autoFocus
        />
      );
    } else {
      return (
        <Fragment>
          <span>{expiryDate}</span>
          {!verified_doctor ? (
            <span style={{ marginLeft: "5px" }}>
              <EditOutlined
                onClick={() => this.editRegistrationExpiryDate(registration_id)}
                title={"Edit Expiry Date"}
              />
            </span>
          ) : null}
        </Fragment>
      );
    }
  };

  renderQualificationCollege = (qualification_id) => {
    const { edit_qualification_college, verified_doctor } = this.state;
    const { doctor_qualifications = {}, colleges = {} } = this.props;
    const {
      basic_info: { college_id },
    } = doctor_qualifications[qualification_id];
    const { basic_info: { name: collegeName } = {} } =
      colleges[college_id] || {};
    if (edit_qualification_college[qualification_id]) {
      return (
        <Select
          size={"small"}
          style={{ margin: "0", height: "auto" }}
          onSearch={this.handleCollegeSearch}
          className="form-inputs"
          placeholder={"Select College"}
          showSearch
          value={college_id.toString()}
          onChange={this.updateCollege(qualification_id)}
          autoComplete="off"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          onBlur={() => this.onBlurQualificationCollege(qualification_id)}
          autoFocus
          className="mwp75"
        >
          {this.getCollegesOption()}
        </Select>
      );
    } else {
      return (
        <Fragment>
          <span>{collegeName ? collegeName : TABLE_DEFAULT_BLANK_FIELD}</span>
          {!verified_doctor ? (
            <span style={{ marginLeft: "5px" }}>
              <EditOutlined
                onClick={() => this.editQualificationCollege(qualification_id)}
                title={"Edit College"}
              />
            </span>
          ) : null}
        </Fragment>
      );
    }
  };
  renderQualificationDegree = (qualification_id) => {
    const { edit_qualification_degree, verified_doctor } = this.state;
    const { doctor_qualifications = {}, degrees = {} } = this.props;
    const {
      basic_info: { degree_id },
    } = doctor_qualifications[qualification_id];
    if (edit_qualification_degree[qualification_id]) {
      return (
        <Select
          size={"small"}
          onSearch={this.handleDegreeSearch}
          className="form-inputs"
          placeholder={"Select Degree"}
          showSearch
          value={degree_id.toString()}
          onChange={this.updateDegree(qualification_id)}
          autoComplete="off"
          onBlur={() => this.onBlurQualificationDegree(qualification_id)}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          style={{ width: "250px", height: "auto", margin: "0" }}
          autoFocus
        >
          {this.getDegreesOption()}
        </Select>
      );
    } else {
      return (
        <Fragment>
          <span>
            {degree_id
              ? degrees[degree_id].basic_info.name
              : TABLE_DEFAULT_BLANK_FIELD}
          </span>
          {!verified_doctor ? (
            <span style={{ marginLeft: "5px" }}>
              <EditOutlined
                onClick={() => this.editQualificationDegree(qualification_id)}
                title={"Edit Degree"}
              />
            </span>
          ) : null}
        </Fragment>
      );
    }
  };
  renderRegistrationCouncil = (registration_id) => {
    const { edit_registration_council, verified_doctor } = this.state;
    const { doctor_registrations = {}, councils = {} } = this.props;
    const {
      basic_info: { registration_council_id },
    } = doctor_registrations[registration_id];
    if (edit_registration_council[registration_id]) {
      return (
        <Select
          size={"small"}
          onSearch={this.handleCouncilSearch}
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
          onChange={this.updateRegistrationCouncil(registration_id)}
          autoComplete="off"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
          style={{ width: "150px", height: "auto", margin: "0" }}
          autoFocus
          onBlur={() => this.onBlurRegistrationCouncil(registration_id)}
        >
          {this.getCouncilOption()}
        </Select>
      );
    } else {
      return (
        <Fragment>
          <span>
            {registration_council_id
              ? councils[registration_council_id].basic_info.name
              : TABLE_DEFAULT_BLANK_FIELD}
          </span>
          {!verified_doctor ? (
            <span style={{ marginLeft: "5px" }}>
              <EditOutlined
                onClick={() => this.editRegistrationCouncil(registration_id)}
                title={"Edit Council"}
              />
            </span>
          ) : null}
        </Fragment>
      );
    }
  };
  onChangeClinicLocation = (clinic_id) => (value) => {
    const { doctor_clinic_location } = this.state;
    let newClinicLocation = doctor_clinic_location;
    delete newClinicLocation[clinic_id];
    newClinicLocation[clinic_id] = value;
    this.setState({ doctor_clinic_location: newClinicLocation });
  };
  renderCity = () => {
    const { edit_city, city } = this.state;
    if (edit_city) {
      return (
        <div style={{ position: "relative" }}>
          <PlacesAutocomplete value={city} onChange={this.onChangeCity}>
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <Input
                  {...getInputProps({
                    className: "form-inputs-google",
                  })}
                  onPressEnter={this.updateCity}
                  style={{ width: "390px", height: "auto", margin: "0" }}
                  onBlur={this.updateCity}
                  autoFocus
                />
                <div
                  className="google-places-autocomplete__suggestions-container"
                  style={{
                    position: "absolute",
                    backgroundColor: "white",
                    marginTop: "4px",
                  }}
                >
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
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
                {!loading && suggestions.length == 0 && (
                  <div style={{ float: "right" }}>
                    <CheckOutlined className={"update-button-ok"} />
                    <CloseOutlined
                      className={"update-button-cancel"}
                      onMouseDown={this.undoCityChanges}
                    />
                  </div>
                )}
              </div>
            )}
          </PlacesAutocomplete>
        </div>
      );
    } else {
      return (
        <Fragment>
          <span>{city ? city : TABLE_DEFAULT_BLANK_FIELD}</span>
          <span style={{ marginLeft: "5px" }}>
            <EditOutlined onClick={this.editCity} title={"Edit City"} />
          </span>
        </Fragment>
      );
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

      this.setState({ searchSpecialityText: data });
    } catch (err) {
      console.log("err", err);
      message.warn("Something went wrong, please try again later");
      this.setState({ fetchingSpeciality: false });
    }
  };

  handleCouncilSearch = async (data) => {
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
      message.error(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingCouncils: false });
    }
  };
  getSpecialityOption = () => {
    const { specialities = {} } = this.props;
    const { searchSpecialityText = "" } = this.state;

    let options = [];

    options.push(
      Object.keys(specialities).map((id) => {
        const { basic_info: { name } = {} } = specialities[id] || {};
        return (
          <Option key={id} value={id}>
            {name}
          </Option>
        );
      })
    );

    options.push(
      <Option key={searchSpecialityText} value={searchSpecialityText}>
        {`${this.formatMessage(
          messages.addSpeciality
        )}${" "}"${searchSpecialityText}"`}
      </Option>
    );

    return options;
  };

  renderSpecialities = () => {
    const { edit_specialities, speciality_id } = this.state;
    const { specialities } = this.props;
    const { basic_info: { name: specialityName } = {} } =
      specialities[speciality_id] || {};

    if (edit_specialities) {
      return (
        <Select
          size={"small"}
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
          value={speciality_id ? speciality_id.toString() : ""}
          onChange={this.updateSpeciality}
          onBlur={this.specialityBlur}
          autoComplete="off"
          optionFilterProp="children"
          style={{ width: "250px", height: "auto", margin: "0" }}
          autoFocus
          // filterOption={(input, option) =>
          //   option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
          //   0
          // }
        >
          {this.getSpecialityOption()}
        </Select>
      );
    } else {
      return (
        <Fragment>
          <span>
            {speciality_id ? specialityName : TABLE_DEFAULT_BLANK_FIELD}
          </span>
          <span style={{ marginLeft: "5px" }}>
            <EditOutlined
              onClick={this.editSpecialities}
              title={"Edit Specialities"}
            />
          </span>
        </Fragment>
      );
    }
  };

  renderGender = () => {
    const { edit_gender = "", gender = "" } = this.state;

    if (edit_gender) {
      return (
        <Select
          className="form-inputs"
          placeholder="Select Gender"
          value={gender ? GENDER[gender].label : ""}
          onChange={this.updateGender}
          onBlur={this.genderBlur}
          autoComplete="off"
          style={{ width: "100px", height: "auto", margin: "0" }}
          size={"small"}
          autoFocus
        >
          <Option key={0} value={"m"}>
            {GENDER[MALE].label}
          </Option>
          <Option key={1} value={"f"}>
            {GENDER[FEMALE].label}
          </Option>
          <Option key={2} value={"o"}>
            {GENDER[OTHER].label}
          </Option>
        </Select>
      );
    } else {
      return (
        <Fragment>
          <span>
            {gender ? GENDER[gender].label : TABLE_DEFAULT_BLANK_FIELD}
          </span>
          <span style={{ marginLeft: "5px" }}>
            <EditOutlined onClick={this.editGender} title={"Edit Gender"} />
          </span>
        </Fragment>
      );
    }
  };

  editClinicTimings = (clinic_id) => {
    const { edit_clinic_timings = "" } = this.state;
    let newClinicTimings = edit_clinic_timings;
    newClinicTimings[clinic_id] = true;
    this.setState({ edit_clinic_timings: newClinicTimings });
  };
  getDoctorDetailsHeader = () => {
    const { formatMessage, handleBack, getFooter } = this;
    const {
      auth: { authenticated_category = "", authenticated_user = null },
      doctors,
      users,
      id,
    } = this.props;

    const { basic_info: { user_id } = {} } = doctors[id] || {};
    const { activated_on = null } = users[user_id] || {};
    console.log("1819238 ", { activated_on });

    return (
      <div>
        <div className="wp100 mb20 fs28 fw700 flex justify-space-between align-center">
          <div className="flex flex-start align-center">
            <ArrowLeftOutlined onClick={handleBack} className="mr10" />
            <div>{formatMessage(messages.profile_details)}</div>
          </div>

          {/*<div>*/}
          {authenticated_category === USER_CATEGORY.PROVIDER ? (
            <div className="flex flex-end align-center">
              {getFooter()}
              {activated_on !== null && (
                <Dropdown
                  overlay={this.getMenu()}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button
                    type="primary"
                    className="mr10 mb10 add-button "
                    icon={"plus"}
                  >
                    <span className="fs16">
                      {this.formatMessage(messages.add)}
                    </span>
                  </Button>
                </Dropdown>
              )}
            </div>
          ) : null}
          {/*</div>*/}
        </div>
      </div>
    );
  };
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  uploadDp = async ({ file }) => {
    let data = new FormData();
    data.append("files", file, file.name);
    doRequest({
      method: REQUEST_TYPE.POST,
      data: data,
      url: getUploadURL(),
    }).then((response) => {
      const { payload: { message: resp_message = "" } = {} } = response;

      if (response.status) {
        let { files = [] } = response.payload.data;
        this.setState({ profile_pic_url: files[0] });
        this.updateProfileData({ profile_pic: files[0] });
      } else {
        message.error(this.formatMessage(messages.uploadDp));
      }
    });
  };
  beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    return isJpgOrPng;
  };
  handleChange = (info) => {
    const { file } = info;
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      return;
    }
    this.getBase64(info.file.originFileObj, (profile_pic) =>
      this.setState({
        profile_pic,
        loading: false,
      })
    );
  };
  handleChangeLocation = () => {};
  getDoctorBasicDetails = () => {
    const {
      auth: { authenticated_category = "", authenticated_user = null },
      doctors,
      users,
      specialities,
    } = this.props;
    const current_doctor = doctors[authenticated_user];
    let {
      profile_pic_url = "",
      edit_name = "",
      doctor_user_id = "",
    } = this.state;
    const { formatMessage, handleProfilePicModalOpen } = this;
    const { basic_info: { user_id, gender, city, speciality_id } = {} } =
      doctors[doctor_user_id] || {};

    if (authenticated_category === USER_CATEGORY.PROVIDER) {
      let { profile_pic = "", profile_pic_url = "" } = this.state;
      let p_pic = profile_pic !== "" ? profile_pic : profile_pic_url;

      if (p_pic && profile_pic === "" && p_pic.length) {
        this.setState({ profile_pic: p_pic });
      }

      if (p_pic && profile_pic_url === "" && p_pic.length) {
        this.setState({ profile_pic_url: p_pic });
      }

      profile_pic_url = p_pic;
    }

    const {
      basic_info: { email, mobile_number, prefix } = {},
      onboarded,
      onboarding_status,
      activated_on,
      deleted_at = null,
    } = users[user_id] || {};
    const { basic_info: { name: specialityName } = {} } =
      specialities[speciality_id] || {};

    return (
      <div className="mt20 mb20 wp100 flex direction-column">
        <div className="fs20 fw700 mb14">
          {formatMessage(messages.basic_details_text)}
        </div>
        <div className="wp100 p20 flex direction-row justify-space-between align-center border-box">
          <div className="w200">
            {profile_pic_url ? (
              <Avatar
                onClick={handleProfilePicModalOpen}
                style={{ border: "5px solid lightgrey", cursor: "pointer" }}
                gap={"4"}
                src={profile_pic_url}
                size={164}
                icon={<UserOutlined />}
              />
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
            <Button
              shape="circle"
              size={"large"}
              style={{ top: "50px", right: "40px" }}
              title={"Upload Profile picture"}
            >
              <CameraFilled />
            </Button>
          </Upload>
          <div className="wp100 ml16 flex direction-row align-center flex-wrap">
            {/*name*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.name_text)}
              </div>
              <div className="fs14 fw500">{this.renderName()}</div>
            </div>

            {/*gender*/}
            <div className="wp20 hp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.gender_text)}
              </div>
              <div className="fs14 fw500">{this.renderGender()}</div>
            </div>

            {/*speciality*/}
            <div className="wp40 hp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.speciality_text)}
              </div>
              <div className="fs14 fw500">{this.renderSpecialities()}</div>
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
                {mobile_number
                  ? `+${prefix}-${mobile_number}`
                  : TABLE_DEFAULT_BLANK_FIELD}
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
              <div className="fs14 fw500">{this.renderCity()}</div>
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

            {/*account status*/}
            {authenticated_category === USER_CATEGORY.PROVIDER && (
              <div className="wp20 hp20 mt16 mb16 mr16">
                <div className="fs16 fw700">
                  {formatMessage(messages.account_status_text)}
                </div>
                <div className="fs14 fw500">
                  {deleted_at ? (
                    <Tag color={"red"}>{ACCOUNT_STATUS.INACTIVE}</Tag>
                  ) : (
                    <Tag color={"green"}>{ACCOUNT_STATUS.ACTIVE}</Tag>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  handlePictureModal = (id) => (e) => {
    e.preventDefault();
    this.setState({ modalVisible: true, selectedDocumentId: id });
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
      councils = {},
    } = this.props;
    const { doctor_user_id = "", verified_doctor = "" } = this.state;
    const { formatMessage, handlePictureModal } = this;

    const { doctor_registration_ids = [] } = doctors[doctor_user_id] || {};

    return doctor_registration_ids.map((registration_id, index) => {
      const {
        basic_info: { number, registration_council_id, year } = {},
        expiry_date,
        upload_document_ids,
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
                {upload_document_ids.map((id) => {
                  const { basic_info: { document, parent_id } = {} } =
                    upload_documents[id] || {};
                  // if (verified_doctor) {
                  // const documentType =
                  //   document.substring(document.length - 3) || null;

                  const arr = document.split("?")[0];
                  let documentType;
                  if (arr.length) {
                    documentType = arr.substr(arr.length - 3);
                  }
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
                          key={document}
                          className={"qualification-avatar-uploader"}
                        >
                          <img src={document} className="wp100 hp100 br4" />
                          <div className="overlay"></div>
                          <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
                            {" "}
                            <DeleteTwoTone
                              className={"del doc-opt"}
                              onClick={this.handleRemoveListRegistration(
                                parent_id,
                                document
                              )}
                              twoToneColor="#fff"
                            />{" "}
                            <EyeTwoTone
                              className="w20"
                              className={"del doc-opt pointer"}
                              onClick={this.handleDocumentViewOpen(document)}
                              twoToneColor="#fff"
                            />
                          </div>
                        </div>
                      );
                    }
                  }
                  // } else {
                  // return (

                  // );
                  // }
                })}
                {verified_doctor && upload_document_ids.length < 3 && (
                  <Upload
                    multiple={true}
                    // beforeUpload={this.handleBeforeUpload(key)}
                    showUploadList={false}
                    customRequest={this.customRequestRegistration(
                      registration_id
                    )}
                    listType="picture-card"
                    className={"doctor-profile-uploader"}
                    // onPreview={this.handlePreview}
                    style={{
                      width: 128,
                      height: 128,
                      margin: 6,
                      display: "contents",
                    }}
                  >
                    {uploadButton}
                  </Upload>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  handleDocumentDownload = (id) => (e) => {
    e.preventDefault();
  };

  handleRemoveList = (qualificationId, pic) => () => {
    let { deleteDoctorQualificationImage } = this.props;
    deleteDoctorQualificationImage(qualificationId, pic).then((response) => {
      let { status = false } = response;
      if (status) {
        const {
          payload: { message: successMessage },
        } = response;
        message.success(successMessage);
        this.getInitialData();
      } else {
        message.error(this.formatMessage(messages.somethingWentWrong));
      }
    });
  };
  handleRemoveListRegistration = (registrationId, pic) => () => {
    let { deleteDoctorRegistrationImage } = this.props;

    deleteDoctorRegistrationImage(registrationId, pic).then((response) => {
      let { status = false } = response;
      if (status) {
        const {
          payload: { message: successMessage },
        } = response;
        message.success(successMessage);
        this.getInitialData();
      } else {
        message.error(this.formatMessage(messages.somethingWentWrong));
      }
    });
  };
  customRequest =
    (qualification_id) =>
    async ({ file, filename, onError, onProgress, onSuccess }) => {
      let data = new FormData();
      data.append("files", file, file.name);
      // data.append("qualification", JSON.stringify(qualificationData));

      let uploadResponse = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: getUploadQualificationDocumentUrl(),
      });

      let { status = false } = uploadResponse;
      const { payload: { message: resp_message = "" } = {} } = uploadResponse;

      if (status) {
        const { doctor_user_id = "" } = this.state;
        let updateData = {
          qualification_details: [
            {
              photos: uploadResponse.payload.data.files,
              doctor_id: doctor_user_id,
              id: qualification_id,
            },
          ],
        };
        this.updateProfileData(updateData);
      } else {
        message.error(resp_message);
      }

      return {
        abort() {},
      };
    };
  customRequestRegistration =
    (registration_id) =>
    async ({ file, filename, onError, onProgress, onSuccess }) => {
      let data = new FormData();
      data.append("files", file, file.name);
      // data.append("qualification", JSON.stringify(qualificationData));

      let uploadResponse = await doRequest({
        method: REQUEST_TYPE.POST,
        data: data,
        url: getUploadQualificationDocumentUrl(),
      });

      let { status = false } = uploadResponse;
      const { payload: { message: resp_message = "" } = {} } = uploadResponse;

      if (status) {
        const { doctor_user_id = "" } = this.state;
        let updateData = {
          registration_details: [
            {
              photos: uploadResponse.payload.data.files,
              doctor_id: doctor_user_id,
              id: registration_id,
            },
          ],
        };
        this.updateProfileData(updateData);
      } else {
        message.error(resp_message);
      }

      return {
        abort() {},
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
      colleges = {},
    } = this.props;
    const { doctor_user_id = "", verified_doctor = "" } = this.state;
    const { formatMessage, handlePictureModal } = this;

    const { doctor_qualification_ids = [] } = doctors[doctor_user_id] || {};

    return doctor_qualification_ids.map((qualification_id, index) => {
      const {
        basic_info: { degree_id, college_id, year } = {},
        upload_document_ids = [],
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
                {upload_document_ids.map((id) => {
                  const { basic_info: { document, parent_id } = {} } =
                    upload_documents[id] || {};
                  // if (!verified_doctor) {
                  // return (

                  // );
                  // } else {
                  // const documentType =
                  //   document.substring(document.length - 3) || null;
                  const arr = document.split("?")[0];
                  let documentType;
                  if (arr.length) {
                    documentType = arr.substr(arr.length - 3);
                  }
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
                        // <div
                        //   key={`q-${id}`}
                        //   className="w100 h100 mr6 mt6 mb6 pointer"
                        //   onClick={handlePictureModal(id)}
                        // >
                        //   <img
                        //     src={document}
                        //     className="w100 h100 br5"
                        //     alt={`qualification document ${id}`}
                        //   />
                        // </div>

                        <div
                          key={document}
                          className={"qualification-avatar-uploader"}
                        >
                          <img src={document} className="wp100 hp100 br4" />
                          <div className="overlay"></div>
                          <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
                            {" "}
                            <DeleteTwoTone
                              className={"del doc-opt"}
                              onClick={this.handleRemoveList(
                                parent_id,
                                document
                              )}
                              twoToneColor="#fff"
                            />{" "}
                            <EyeTwoTone
                              className="w20"
                              className={"del doc-opt pointer"}
                              onClick={this.handleDocumentViewOpen(document)}
                              twoToneColor="#fff"
                            />
                          </div>
                        </div>
                      );
                    }
                  }
                  // }
                })}
                {verified_doctor && upload_document_ids.length < 3 && (
                  <Upload
                    multiple={true}
                    // beforeUpload={this.handleBeforeUpload(key)}
                    showUploadList={false}
                    customRequest={this.customRequest(qualification_id)}
                    listType="picture-card"
                    className={"doctor-profile-uploader"}
                    // onPreview={this.handlePreview}
                    style={{
                      width: 128,
                      height: 128,
                      margin: 6,
                      display: "contents",
                    }}
                  >
                    {uploadButton}
                  </Upload>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  getFullDayText = (day) => {
    if (day.length === 1) {
      return DAYS_TEXT_NUM[day].toLocaleUpperCase();
    }
    // return DAYS_TEXT[day].toLocaleUpperCase();
  };

  getDoctorClinicDetails = () => {
    const numberToDay = {
      1: FULL_DAYS.SUN,
      2: FULL_DAYS.MON,
      3: FULL_DAYS.TUE,
      4: FULL_DAYS.WED,
      5: FULL_DAYS.THU,
      6: FULL_DAYS.FRI,
      7: FULL_DAYS.SAT,
    };
    const { id, doctors, doctor_clinics } = this.props;
    const { formatMessage, getFullDayText } = this;
    const {
      doctor_user_id = "",
      verified_doctor = "",
      edit_clinic_timings = "",
    } = this.state;
    const { doctor_clinic_ids = [] } = doctors[doctor_user_id] || {};

    return doctor_clinic_ids.map((clinic_id, index) => {
      const {
        basic_info: { name } = {},
        location,
        details: { time_slots = [] } = {},
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
      };
      if (edit_clinic_timings[clinic_id]) {
        for (const time in time_slots) {
          for (const i in time_slots[time]) {
            if (
              time_slots[time][i] &&
              time_slots[time][i].startTime != "" &&
              time_slots[time][i].endTime != ""
            ) {
              time_slots[time][i].startTime = moment(
                time_slots[time][i].startTime
              );
              time_slots[time][i].endTime = moment(time_slots[time][i].endTime);
            }
          }
          if (
            time_slots[time].length &&
            time_slots[time][0].startTime != "" &&
            time_slots[time][0].endTime != ""
          ) {
            daySelected[numberToDay[time]] = true;
          }
          timeForModal[numberToDay[time]] = time_slots[time];
        }
        for (const time in timeForModal) {
          if (!timeForModal[time].length) {
            timeForModal[time].push({
              startTime: "",
              endTime: "",
            });
          }
        }
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
                {!verified_doctor && !edit_clinic_timings[clinic_id] ? (
                  <span style={{ marginLeft: "5px" }}>
                    <EditOutlined
                      onClick={() => this.editClinicTimings(clinic_id)}
                      title={"Edit Clinic Timings"}
                    />
                  </span>
                ) : null}
              </div>
              {this.renderClinicTimings(time_slots, clinic_id)}
              {edit_clinic_timings[clinic_id] && (
                <TimingModal
                  data-id={clinic_id}
                  visible={edit_clinic_timings[clinic_id]}
                  handleCancel={() => this.handleCancelTiming(clinic_id)}
                  handleOk={this.handleOkTiming(clinic_id)}
                  timings={timeForModal}
                  daySelected={daySelected}
                />
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  getFooter = () => {
    const { id, doctors, users } = this.props;

    const { formatMessage, handleVerify, handleCloseWarning, handleActivate } =
      this;

    const {
      doctor_qualification_ids = [],
      doctor_registration_ids = [],
      basic_info: { user_id } = {},
    } = doctors[id] || {};

    let { activated_on } = users[user_id] || {};

    const { id: doctor_id = "" } = this.props;
    const { doctor_user_id = "" } = this.state;
    const { basic_info: { user_id: d_user_id = "" } = {} } =
      doctors[doctor_user_id] || {};

    const isVerifyVisible =
      // doctor_qualification_ids.length === 0 &&
      // doctor_registration_ids.length === 0 &&
      activated_on !== null;

    const { active = true } = this.state;

    return (
      <div className="flex justify-end align-center">
        {!isVerifyVisible && (
          <div className="flex align-center justify=space-between">
            <Button
              // disabled={disabled}
              type="primary"
              className="mb10 mr10"
              onClick={handleVerify}
            >
              {formatMessage(messages.submit_button_text)}
            </Button>
          </div>
        )}

        <div className="flex column align-center justify-center">
          {active ? (
            <Button
              type="default"
              className="mb10 mr10 h42"
              onClick={handleCloseWarning}
            >
              {formatMessage(messages.deactivateText)}
            </Button>
          ) : (
            <Button
              type="default"
              className="mb10 mr10 h42"
              onClick={handleActivate}
            >
              {formatMessage(messages.activateText)}
            </Button>
          )}
        </div>
      </div>
    );
  };

  handleVerify = async (e) => {
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

  handlePictureModalClose = (e) => {
    e.preventDefault();
    this.setState({ modalVisible: false });
  };

  getModalDetails = () => {
    const { upload_documents } = this.props;
    const { modalVisible = "", selectedDocumentId = "" } = this.state;
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

  handleProfilePicModalOpen = (e) => {
    e.preventDefault();
    this.setState({ profilePicModalVisible: true });
  };

  handleProfilePicModalClose = (e) => {
    e.preventDefault();
    this.setState({ profilePicModalVisible: false });
  };

  getProfilePicModal = () => {
    const { doctors } = this.props;
    const { doctor_user_id = "" } = this.state;
    const { profilePicModalVisible = "" } = this.state;
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
  addQualificationDetails = (e) => {
    e.preventDefault();
    const { history } = this.props;
    const { doctor_user_id: doctor_id = "" } = this.state;

    const {
      auth: { authenticated_category = "", authenticated_user = null },
      doctors,
    } = this.props;

    if (
      authenticated_category === USER_CATEGORY.DOCTOR ||
      authenticated_category === USER_CATEGORY.HSP
    ) {
      history.replace(
        `${PATH.REGISTER_FROM_MY_PROFILE}${PATH.REGISTER_QUALIFICATIONS}`
      );
      return;
    }

    history.replace(
      `${PATH.REGISTER_FROM_PROFILE}${PATH.REGISTER_QUALIFICATIONS}/${doctor_id}`
    );
  };

  addClinicDetails = (e) => {
    e.preventDefault();
    const { history } = this.props;
    const { doctor_user_id: doctor_id = "" } = this.state;
    const {
      auth: { authenticated_category = "", authenticated_user = null },
      doctors,
    } = this.props;

    if (
      authenticated_category === USER_CATEGORY.DOCTOR ||
      authenticated_category === USER_CATEGORY.HSP
    ) {
      history.replace(
        `${PATH.REGISTER_FROM_MY_PROFILE}${PATH.REGISTER_CLINICS}`
      );
      return;
    }

    history.replace(
      `${PATH.REGISTER_FROM_PROFILE}${PATH.REGISTER_CLINICS}/${doctor_id}`
    );
  };

  getMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={this.navigateToConsultationFee}>
          <div className="tac">
            {this.formatMessage(messages.add_payment_product)}
          </div>
        </Menu.Item>
      </Menu>
    );
  };

  navigateToConsultationFee = () => {
    const { history } = this.props;
    const { id } = this.props;
    history.push(`/doctors/${id}/payment-products`);
  };

  render() {
    const {
      doctor_user_id = "",
      // verified_doctor = false
    } = this.state;
    const {
      auth: { authenticated_category = "", authenticated_user = null },
      doctors,
    } = this.props;
    const current_doctor = doctors[authenticated_user];
    const { loading = "", updateLoading = "" } = this.state;
    const {
      formatMessage,
      getDoctorDetailsHeader,
      getDoctorBasicDetails,
      getDoctorRegistrationDetails,
      getDoctorQualificationDetails,
      getDoctorClinicDetails,
      getFooter,
      getModalDetails,
      getProfilePicModal,
    } = this;

    const {
      doctor_clinic_ids = [],
      doctor_qualification_ids = [],
      doctor_registration_ids = [],
    } = doctors[doctor_user_id] || {};

    const { viewModalVisible, viewModalSrc } = this.state;

    const { handleDocumentViewClose } = this;
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
              {doctor_qualification_ids.length > 0 ? (
                <PlusCircleOutlined
                  className="ml20 pointer tab-color"
                  title="Add More"
                  onClick={this.addQualificationDetails}
                />
              ) : null}
            </div>
            {doctor_qualification_ids.length > 0 ? (
              <div className="border-box">
                {getDoctorQualificationDetails()}
              </div>
            ) : (
              <div className="bg-grey wp100 h200 br5 flex align-center justify-center">
                {authenticated_category === USER_CATEGORY.PROVIDER ? (
                  <Button onClick={this.addQualificationDetails}>
                    {this.formatMessage(
                      messages.addRegistrationQualificationDetails
                    )}
                  </Button>
                ) : (
                  formatMessage(messages.no_qualification_text)
                )}
              </div>
            )}
          </div>

          {/*registration*/}
          <div className="mt20 mb20 wp100 flex direction-column">
            <div className="fs20 fw700 mb14">
              {formatMessage(messages.registration_details_text)}
              {doctor_registration_ids.length > 0 &&
              doctor_qualification_ids.length > 0 ? (
                <PlusCircleOutlined
                  className="ml20 pointer tab-color"
                  title="Add More"
                  onClick={this.addQualificationDetails}
                />
              ) : null}
            </div>
            {doctor_registration_ids.length > 0 ? (
              <div className="border-box">{getDoctorRegistrationDetails()}</div>
            ) : authenticated_category === USER_CATEGORY.PROVIDER ? (
              doctor_qualification_ids.length > 0 ? (
                <div className="bg-grey wp100 h200 br5 flex align-center justify-center">
                  <Button onClick={this.addQualificationDetails}>
                    {this.formatMessage(messages.addRegistrationDetails)}
                  </Button>
                </div>
              ) : (
                <div className="bg-grey wp100 h200 br5 flex align-center justify-center">
                  {formatMessage(messages.qualification_update_first)}
                </div>
              )
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
              {/*{doctor_clinic_ids.length > 0  */}
              {/*?*/}
              <PlusCircleOutlined
                className="ml20 pointer tab-color"
                title="Add More"
                onClick={this.addClinicDetails}
              />
              {/*:*/}
              {/*null*/}
              {/*}*/}
            </div>
            {doctor_clinic_ids.length > 0 ? (
              <div className="border-box">{getDoctorClinicDetails()}</div>
            ) : (
              <div className="bg-grey wp100 h200 br5 flex align-center justify-center">
                {authenticated_category === USER_CATEGORY.PROVIDER ? (
                  <Button onClick={this.addClinicDetails}>
                    {this.formatMessage(messages.addClinicalDetails)}
                  </Button>
                ) : (
                  formatMessage(messages.no_clinic_text)
                )}
              </div>
            )}
          </div>

          {/*footer*/}
          {/*{authenticated_category === USER_CATEGORY.PROVIDER ||*/}
          {/*authenticated_category === USER_CATEGORY.ADMIN*/}
          {/*  ? getFooter()*/}
          {/*  : null}*/}
        </div>

        {getModalDetails()}

        {getProfilePicModal()}

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

export default withRouter(injectIntl(DoctorProfilePage));
