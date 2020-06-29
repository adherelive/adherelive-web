import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import Button from "antd/es/button";
import Modal from "antd/es/modal";

import moment from "moment";
import messages from "./messages";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../constant";
import { PageLoading } from "../../../Helper/loading/pageLoading";
import userDp from "../../../Assets/images/ico-placeholder-userdp.svg";

class AdminDoctorDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    const { doctors, id } = this.props;
    const { getInitialData } = this;

    const { doctor_qualification_ids } = doctors[id] || {};
    if (!doctor_qualification_ids) {
      getInitialData();
    }
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
    const { formatMessage, handleProfilePicModalOpen } = this;

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
          <div className="w200">
            {profile_pic ? (
              <div
                className="w200 h200 pointer"
                onClick={handleProfilePicModalOpen}
              >
                <img
                  src={profile_pic}
                  alt="default user photo"
                  className="w200 h200 br5"
                />
              </div>
            ) : (
              <div className="w200 h200 bg-dark-grey text-white flex align-center justify-center">
                <div>{formatMessage(messages.no_photo_text)}</div>
              </div>
            )}
          </div>
          <div className="wp100 ml16 flex direction-row align-center flex-wrap">
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

            {/*mobile_number*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.mobile_number_text)}
              </div>
              <div className="fs14 fw500">
                {mobile_number ? mobile_number : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*email*/}
            <div className="wp40 hp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.email_text)}
              </div>
              <div className="fs14 fw500 word-wrap">
                {email ? email : TABLE_DEFAULT_BLANK_FIELD}
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

  handlePictureModal = id => e => {
    e.preventDefault();
    this.setState({ modalVisible: true, selectedDocumentId: id });
  };

  getDoctorRegistrationDetails = () => {
    const { id, doctors, doctor_registrations } = this.props;
    const { formatMessage } = this;

    const { doctor_registration_ids = [] } = doctors[id] || {};

    return doctor_registration_ids.map((registration_id, index) => {
      const {
        basic_info: { number, start_date, end_date, council, year } = {}
      } = doctor_registrations[registration_id] || {};

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
                {council ? council : TABLE_DEFAULT_BLANK_FIELD}
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

            {/*registration_start_date*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.registration_start_date_text)}
              </div>
              <div className="fs14 fw500">
                {start_date
                  ? moment(start_date).format("LLL")
                  : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*registration_expiry_date*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.registration_expiry_date_text)}
              </div>
              <div className="fs14 fw500">
                {end_date
                  ? moment(end_date).format("LLL")
                  : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  getDoctorQualificationDetails = () => {
    const { id, doctors, doctor_qualifications, upload_documents } = this.props;
    const { formatMessage, handlePictureModal } = this;

    const { doctor_qualification_ids = [] } = doctors[id] || {};

    return doctor_qualification_ids.map((qualification_id, index) => {
      const {
        basic_info: { degree, college, year } = {},
        upload_document_ids = []
      } = doctor_qualifications[qualification_id] || {};

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
                {degree ? degree : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*college*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.college_text)}
              </div>
              <div className="fs14 fw500">
                {college ? college : TABLE_DEFAULT_BLANK_FIELD}
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
                })}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  getDoctorClinicDetails = () => {
    const { id, doctors, doctor_clinics } = this.props;
    const { formatMessage } = this;

    const { doctor_clinic_ids = [] } = doctors[id] || {};

    return doctor_clinic_ids.map((clinic_id, index) => {
      const {
        basic_info: { name } = {},
        location,
        details: { time_slots = [] } = {}
      } = doctor_clinics[clinic_id] || {};

      return (
        // <div className="wp100 p20 flex direction-row justify-space-between align-center border-box">
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
            {time_slots.map((time_slot, index) => {
              const { start_time, end_time } = time_slot || {};
              return (
                <div className="wp40 mt16 mb16 mr16" key={`ts-${index}`}>
                  <div className="fs16 fw700">
                    {formatMessage(messages.open_between_text)}
                  </div>
                  <div className="fs14 fw500">
                    {start_time
                      ? `${moment(start_time).format("LT")} to ${moment(
                          end_time
                        ).format("LT")}`
                      : TABLE_DEFAULT_BLANK_FIELD}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    });
  };

  getFooter = () => {
    const { formatMessage, handleVerify } = this;

    return (
      <div className="mt20 wi flex justify-end">
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
    const { loading } = this.state;
    const {
      formatMessage,
      getDoctorDetailsHeader,
      getDoctorBasicDetails,
      getDoctorRegistrationDetails,
      getDoctorQualificationDetails,
      getDoctorClinicDetails,
      getFooter,
      getModalDetails,
      getProfilePicModal
    } = this;

    console.log("1982317923 loading --> ", loading);

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

          {/*registration*/}
          <div className="mt20 mb20 wp100 flex direction-column">
            <div className="fs20 fw700 mb14">
              {formatMessage(messages.registration_details_text)}
            </div>
            <div className="border-box">{getDoctorRegistrationDetails()}</div>
          </div>

          {/*qualifications*/}
          <div className="mt20 mb20 wp100 flex direction-column">
            <div className="fs20 fw700 mb14">
              {formatMessage(messages.qualification_details_text)}
            </div>
            <div className="border-box">{getDoctorQualificationDetails()}</div>
          </div>

          {/*clinics*/}
          <div className="mt20 mb20 wp100 flex direction-column">
            <div className="fs20 fw700 mb14">
              {formatMessage(messages.clinic_details_text)}
            </div>
            <div className="border-box">{getDoctorClinicDetails()}</div>
          </div>

          {/*footer*/}
          {getFooter()}
        </div>

        {getModalDetails()}

        {getProfilePicModal()}
      </Fragment>
    );
  }
}

export default injectIntl(AdminDoctorDetails);
