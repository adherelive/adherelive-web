import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import confirm from "antd/es/modal/confirm";
import Switch from "antd/es/switch";

import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
  ArrowLeftOutlined,
  FileTextOutlined,
  EditOutlined,
} from "@ant-design/icons";

import { Input } from "antd";

import moment from "moment";
import messages from "./messages";
import {
  TABLE_DEFAULT_BLANK_FIELD,
  DAYS_TEXT_NUM,
  ACCOUNT_STATUS,
} from "../../../constant";
import { PageLoading } from "../../../Helper/loading/pageLoading";
import { withRouter } from "react-router-dom";
import Tooltip from "antd/es/tooltip";

import Menu from "antd/es/menu";
import Dropdown from "antd/es/dropdown";
import Tag from "antd/es/tag";

class AdminDoctorDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      razorpayModalVisible: false,
      razorpayId: "",
      razorpayAccountName: "",
      account_details: {},
      active: true,
      user_id: null,
    };
  }

  componentDidMount() {
    const { doctors, id, users } = this.props;
    const { getInitialData } = this;

    const { doctor_qualification_ids } = doctors[id] || {};
    // if (!doctor_qualification_ids) {
    getInitialData();
    // }
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getInitialData = async () => {
    try {
      this.setState({ loading: true });
      const { getDoctorDetails, getDoctorAccountDetails, id } = this.props;
      const response = await getDoctorDetails();
      const {
        status,
        payload: {
          data: { doctors = {}, users = {} } = {},
          message: { message: responseMessage } = {},
        } = {},
      } = response || {};

      if (status === true) {
        const { basic_info: { user_id = "" } = {} } = doctors[id] || {};
        const { deleted_at = "" } = users[user_id] || {};

        this.setState({
          user_id,
        });

        if (deleted_at) {
          this.setState({
            active: false,
          });
        }

        const response = await getDoctorAccountDetails();
        const {
          status,
          payload: {
            data: { account_details } = {},
            message: respMessage,
          } = {},
        } = response || {};

        if (status === true) {
          this.setState({
            loading: false,
            account_details,
          });
        } else {
          this.setState({
            loading: false,
          });
          message.warn(respMessage);
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
      message.warn("Somthing wen't wrong, please try again later");
    }
  };

  handleBack = (e) => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  getDoctorDetailsHeader = () => {
    const { formatMessage, handleBack, getFooter } = this;

    return (
      <div className="wp100 mb20 fs28 fw700 flex justify-space-between align-center">
        <div className="flex flex-start align-center">
          <ArrowLeftOutlined onClick={handleBack} className="mr10" />
          <div>{formatMessage(messages.profile_details)}</div>
        </div>

        {getFooter()}
      </div>
    );
  };

  openAddRazorpayIdModal = (e) => {
    e.preventDefault();
    this.setState({ razorpayModalVisible: true });
  };

  handleRazorpayModalClose = (e) => {
    e.preventDefault();
    this.setState({
      razorpayModalVisible: false,
      razorpayId: "",
    });
  };

  setRazorpayId = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ razorpayId: value });
  };

  setRazorpayAccountName = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ razorpayAccountName: value });
  };

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

  async handleRazorpayIdSubmit() {
    try {
      const { addRazorpayId, id } = this.props;
      const { razorpayId = "", razorpayAccountName = "" } = this.state;
      if (razorpayId) {
        const response = await addRazorpayId(id, {
          account_id: razorpayId,
          account_name: razorpayAccountName,
        });
        const { status, payload: { data: { account_details } = {} } = {} } =
          response || {};
        if (status) {
          this.setState({ account_details });
          message.success(
            this.formatMessage(messages.addValidRazorpayIdSuccess)
          );
        } else {
          message.warn(this.formatMessage(messages.somethingWentWrong));
        }

        this.setState({
          razorpayModalVisible: false,
          razorpayId: "",
        });
      } else {
        message.warn(this.formatMessage(messages.addValidRazorpayIdError));
      }
    } catch (err) {
      console.log("err", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  getRazorpayModal = () => {
    const { doctors, id } = this.props;
    const { razorpayModalVisible } = this.state;
    const {
      formatMessage,
      // handleProfilePicModalClose
    } = this;

    // const { basic_info: { profile_pic } = {} } = doctors[id] || {};

    return (
      <Modal
        visible={razorpayModalVisible}
        title={this.formatMessage(messages.add_razorpay_details_text)}
        closable
        mask
        maskClosable
        onCancel={this.handleRazorpayModalClose}
        width={`50%`}
        footer={[
          <Button
            key="submit"
            type="primary"
            onClick={() => this.handleRazorpayIdSubmit()}
          >
            {this.formatMessage(messages.submit)}
          </Button>,
        ]}
      >
        <div className="form-headings flex align-center justify-start">
          {this.formatMessage(messages.razorpay_account_id_text)}
        </div>

        <Input
          className={"form-inputs-ap"}
          value={this.state.razorpayId}
          onChange={this.setRazorpayId}
        />

        <div className="form-headings flex align-center justify-start">
          {this.formatMessage(messages.razorpay_account_name_text)}
        </div>

        <Input
          className={"form-inputs-ap"}
          value={this.state.razorpayAccountName}
          onChange={this.setRazorpayAccountName}
        />
      </Modal>
    );
  };

  getDoctorBasicDetails = () => {
    const { id, doctors, users, specialities } = this.props;
    const { formatMessage, handleProfilePicModalOpen, handleCloseWarning } =
      this;

    const {
      basic_info: {
        first_name,
        middle_name,
        last_name,
        user_id,
        profile_pic,
        gender,
        city,
        speciality_id,
      } = {},
    } = doctors[id] || {};
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
        {/*<div className="fs20 fw700 mb14 flex direction-row align-center justify-space-between">*/}
        <div className="fs20 fw700 mb14 ">
          {formatMessage(messages.basic_details_text)}
        </div>

        {/*<div>*/}
        {/*  <Button*/}
        {/*  type="primary"*/}
        {/*  className="mb10 mr10"*/}
        {/*  onClick={this.openAddRazorpayIdModal}*/}
        {/*   >{this.formatMessage(messages.razorpayIdInput)}</Button>*/}
        {/*</div>*/}

        {/*</div>*/}
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

            {/*speciality*/}
            <div className="wp20 hp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.speciality_text)}
              </div>
              <div className="fs14 fw500">
                {speciality_id ? specialityName : TABLE_DEFAULT_BLANK_FIELD}
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
                {city ? city : TABLE_DEFAULT_BLANK_FIELD}
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

            {/*account status*/}
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
          </div>
        </div>
      </div>
    );
  };

  handlePictureModal = (id) => (e) => {
    e.preventDefault();
    this.setState({ modalVisible: true, selectedDocumentId: id });
  };

  getDoctorRegistrationDetails = () => {
    const {
      id,
      doctors,
      doctor_registrations,
      upload_documents,
      councils = {},
    } = this.props;
    const { formatMessage, handlePictureModal } = this;

    const { doctor_registration_ids = [] } = doctors[id] || {};

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
                {upload_document_ids.map((id) => {
                  const { basic_info: { document } = {} } =
                    upload_documents[id] || {};

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

  handleDocumentDownload = (id) => (e) => {
    e.preventDefault();
  };

  getDoctorQualificationDetails = () => {
    const {
      id,
      doctors,
      doctor_qualifications,
      upload_documents,
      degrees = {},
      colleges = {},
    } = this.props;
    const { formatMessage, handlePictureModal } = this;

    const { doctor_qualification_ids = [] } = doctors[id] || {};

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
                {collegeName ? collegeName : TABLE_DEFAULT_BLANK_FIELD}
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
                {upload_document_ids.map((id) => {
                  const { basic_info: { document } = {} } =
                    upload_documents[id] || {};

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

  getFullDayText = (day) => {
    if (day.length === 1) {
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
        details: { time_slots = [] } = {},
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
                    {time_slots[day].length > 0 && (
                      <div className="wp100 flex">
                        <div className="fs14 fw700 mt16 mb10 mr16">
                          {getFullDayText(day)}
                        </div>
                        <div
                          className="wp100 mt16 mb10 mr16 flex"
                          key={`ts-${index}`}
                        >
                          {time_slots[day].map((time_slot, i) => {
                            const { startTime: start_time, endTime: end_time } =
                              time_slot || {};

                            return (
                              <div
                                className="fs14 fw500 wp100"
                                key={`ts/${index}/${i}`}
                              >
                                {start_time
                                  ? `${moment(start_time).format(
                                      "LT"
                                    )} - ${moment(end_time).format("LT")}`
                                  : "CLOSED"}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      );
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
      console.log("doctorActivate UI error --> ", error);
    }
  };

  getFooter = () => {
    const { id, doctors, users, doctor_qualifications, doctor_registrations } =
      this.props;
    const { formatMessage, handleVerify, handleCloseWarning, handleActivate } =
      this;
    const { active = true } = this.state;

    const {
      doctor_qualification_ids = [],
      doctor_registration_ids = [],
      basic_info: { user_id } = {},
    } = doctors[id] || {};

    const { activated_on } = users[user_id] || {};
    const disabled =
      // doctor_clinic_ids.length === 0 ||
      doctor_qualification_ids.length === 0 ||
      doctor_registration_ids.length === 0 ||
      activated_on !== null;
    let no_qualification_docs = 0;
    let no_registration_docs = 0;
    if (doctor_qualification_ids.length) {
      for (const i in doctor_qualification_ids) {
        let { upload_document_ids } =
          doctor_qualifications[doctor_qualification_ids[i]];
        if (upload_document_ids.length == 0) {
          no_qualification_docs = 1;
        }
      }
    }
    if (doctor_registration_ids.length) {
      for (const i in doctor_registration_ids) {
        let { upload_document_ids } =
          doctor_registrations[doctor_registration_ids[i]];
        if (upload_document_ids.length == 0) {
          no_registration_docs = 1;
        }
      }
    }
    return (
      <div>
        <div className="flex justify-end align-center">
          <div className="flex align-center justify=space-between">
            <Button
              disabled={disabled}
              type="primary"
              data-q={no_qualification_docs}
              data-r={no_registration_docs}
              className="mb10 mr10"
              onClick={handleVerify}
            >
              {formatMessage(messages.submit_button_text)}
            </Button>
          </div>
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
      </div>
    );
  };

  handleVerify = async (e) => {
    e.preventDefault();
    if (parseInt(e.target.dataset.q)) {
      message.warn(this.formatMessage(messages.noUploadQualificationDocuments));
      return;
    }
    if (parseInt(e.target.dataset.r)) {
      message.warn(this.formatMessage(messages.noUploadRegsitrationDocuments));
      return;
    }

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

  handleProfilePicModalOpen = (e) => {
    e.preventDefault();
    this.setState({ profilePicModalVisible: true });
  };

  handleProfilePicModalClose = (e) => {
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

  getDoctorAccountDetails = () => {
    const { account_details } = this.state;
    const { formatMessage } = this;

    return Object.keys(account_details).map((id) => {
      const {
        basic_info: {
          customer_name,
          account_number,
          upi_id,
          ifsc_code,
          account_type,
          account_mobile_number,
          prefix,
          in_use,
          razorpay_account_id,
          razorpay_account_name,
        } = {},
      } = account_details[id] || {};

      return (
        <div className="wp100 p20 flex direction-column">
          <div className="wp100 flex direction-row align-center flex-wrap">
            {/*bank_customer_name*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.bank_customer_name)}
              </div>
              <div className="fs14 fw500">
                {customer_name ? customer_name : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*account_number*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.bank_account_number_text)}
              </div>
              <div className="fs14 fw500">
                {account_number ? account_number : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*ifsc_code*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.ifsc_code_text)}
              </div>
              <div className="fs14 fw500">
                {ifsc_code ? ifsc_code : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*account_type*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.account_type_text)}
              </div>
              <div className="fs14 fw500">
                {account_type ? account_type : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*account_mobile_number*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.account_mobile_number_text)}
              </div>
              <div className="fs14 fw500">
                {account_mobile_number
                  ? `+${prefix}-${account_mobile_number}`
                  : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*upi_id*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.upi_id_text)}
              </div>
              <div className="fs14 fw500">
                {upi_id ? upi_id : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*razorpay_account_id*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.razorpay_account_id_text)}
              </div>
              <div className="fs14 fw500">
                {razorpay_account_id
                  ? razorpay_account_id
                  : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>

            {/*razorpay_account_name*/}
            <div className="wp20 mt16 mb16 mr16">
              <div className="fs16 fw700">
                {formatMessage(messages.razorpay_account_name_text)}
              </div>
              <div className="fs14 fw500">
                {razorpay_account_name
                  ? razorpay_account_name
                  : TABLE_DEFAULT_BLANK_FIELD}
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  render() {
    console.log("274354213749129837832674 ====>", this.props);
    const { id, doctors } = this.props;
    const { loading, account_details = {} } = this.state;
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
      getRazorpayModal,
      getDoctorAccountDetails,
      openAddRazorpayIdModal,
    } = this;

    const {
      doctor_clinic_ids = [],
      doctor_qualification_ids = [],
      doctor_registration_ids = [],
    } = doctors[id] || {};

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

          {/* account details */}
          <div className="mt20 mb20 wp100 flex direction-column">
            <div className="flex align-center mb14">
              <div className="fs20 fw700">
                {formatMessage(messages.account_details_text)}
              </div>
              {Object.keys(account_details).length > 0 && (
                <Tooltip
                  placement={"right"}
                  title={formatMessage(messages.add_razorpay_details_text)}
                >
                  <EditOutlined
                    className="dark-sky-blue fs18 ml10 pointer"
                    onClick={openAddRazorpayIdModal}
                  />
                </Tooltip>
              )}
            </div>
            {Object.keys(account_details).length > 0 ? (
              <div className="border-box">{getDoctorAccountDetails()}</div>
            ) : (
              <div className="bg-grey wp100 h200 br5 flex align-center justify-center">
                {formatMessage(messages.no_account_details)}
              </div>
            )}
          </div>

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
          <div className="mt20 mb36 wp100 flex direction-column">
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
          {/*{getFooter()}*/}
        </div>

        {getModalDetails()}

        {getProfilePicModal()}

        {getRazorpayModal()}
      </Fragment>
    );
  }
}

export default withRouter(injectIntl(AdminDoctorDetails));
