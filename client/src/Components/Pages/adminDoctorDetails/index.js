import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import Button from "antd/es/button";

import messages from "./messages";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../constant";
import { PageLoading } from "../../../Helper/loading/pageLoading";
import userDp from "../../../Assets/images/ico-placeholder-userdp.svg";

class AdminDoctorDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    const { getInitialData } = this;
    getInitialData();
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  getInitialData = async () => {
    try {
      this.setState({ loading: true });
      const { getDoctorDetails } = this.props;
      const response = await getDoctorDetails();
      const { status, payload: { message: responseMessage } = {} } =
        response || {};
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

  getDoctorDetailsHeader = () => {
    const { id, doctors, users } = this.props;
    const { formatMessage } = this;

    return (
      <div className="wp100 mb20 fs28 fw700 flex justify-start align-center">
        {formatMessage(messages.doctor_details_header_text)}
      </div>
    );
  };

  getDoctorBasicDetails = () => {
    const { id, doctors, users } = this.props;
    const { formatMessage } = this;

    const {
      basic_info: {
        first_name,
        middle_name,
        last_name,
        user_id,
        profile_pic,
        gender,
        age,
        city
      } = {}
    } = doctors[id] || {};
    const {
      basic_info: { user_name, email, mobile_number } = {},
      sign_in_type,
      onboarded,
      onboarding_status
    } = users[user_id] || {};

    return (
      <div className="mt20 mb20 wp100 flex direction-column">
        <div className="fs20 fw700 mb14">
          {formatMessage(messages.basic_details_text)}
        </div>
        <div className="wp100 p20 flex direction-row justify-space-between align-center border-box">
          <div className="wp40">
            {profile_pic ? (
              <div className="w200 h200">
                <img src={profile_pic} alt="default user photo" />
              </div>
            ) : (
              <div className="w200 h200 bg-dark-grey text-white flex align-center justify-center">
                <div>{formatMessage(messages.no_photo_text)}</div>
              </div>
            )}
          </div>
          <div className="wp100 flex direction-row align-center flex-wrap">
            {/*name*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.name_text)}
              </div>
              <div className="fs14 fw500">{`${first_name} ${
                middle_name ? `${middle_name} ` : ""
              }${last_name ? last_name : ""}`}</div>
            </div>

            {/*gender*/}
            <div className="wp20 hp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.gender_text)}
              </div>
              <div className="fs14 fw500">
                {gender ? gender.toUpperCase() : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*age*/}
            <div className="wp20 hp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.age_text)}
              </div>
              <div className="fs14 fw500">
                {age ? age : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*email*/}
            <div className="wp20 hp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.email_text)}
              </div>
              <div className="fs14 fw500">
                {email ? email : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*mobile_number*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.mobile_number_text)}
              </div>
              <div className="fs14 fw500">
                {mobile_number ? mobile_number : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*onboarding_status*/}
            {!onboarded && (
              <div className="wp20 mt16 mb16 mr16">
                <div className="fs16 fw700">
                  {formatMessage(messages.onboarding_status_text)}
                </div>
                <div className="fs14 fw500">{onboarding_status}</div>
              </div>
            )}

            {/*address*/}
            <div className="wp40 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.address_text)}
              </div>
              <div className="fs14 fw500">
                {city ? city : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  getDoctorQualificationDetails = () => {
    const {
      id,
      doctors,
      doctor_qualifications,
      doctor_qualification_ids
    } = this.props;
    const { formatMessage } = this;

    return (
      <div className="mt20 mb20 wp100 flex direction-column">
        <div className="fs20 fw700 mb14">
          {formatMessage(messages.qualification_details_text)}
        </div>
        <div className="wp100 p20 flex direction-row justify-space-between align-center border-box"></div>
      </div>
    );
  };

  getDoctorClinicDetails = () => {
    const {
      id,
      doctors,
      doctor_qualifications,
      doctor_qualification_ids
    } = this.props;
    const { formatMessage } = this;

    return (
      <div className="mt20 mb20 wp100 flex direction-column">
        <div className="fs20 fw700 mb14">
          {formatMessage(messages.clinic_details_text)}
        </div>
        <div className="wp100 p20 flex direction-row justify-space-between align-center border-box"></div>
      </div>
    );
  };

  getFooter = () => {
    const { formatMessage, handleVerify } = this;

    return (
      <div className="mt20 doctor-details-footer wi flex justify-end">
        <Button type="primary" className="mb10 mr10" onClick={handleVerify}>
          {formatMessage(messages.submit_button_text)}
        </Button>
      </div>
    );
  };

  handleVerify = async e => {
      console.log("12983712893721 here");
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

  render() {
    const { loading } = this.state;
    const {
      getDoctorDetailsHeader,
      getDoctorBasicDetails,
      getDoctorQualificationDetails,
      getDoctorClinicDetails,
      getFooter
    } = this;

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
          {getDoctorQualificationDetails()}

          {/*clinics*/}
          {getDoctorClinicDetails()}
        </div>

        {/*footer*/}
        {getFooter()}
      </Fragment>
    );
  }
}

export default injectIntl(AdminDoctorDetails);
