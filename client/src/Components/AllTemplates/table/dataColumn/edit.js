import edit_image from "../../../../Assets/images/edit.svg";
import React, { Component } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import { CopyOutlined } from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";
import confirm from "antd/es/modal/confirm";
import messages from "../messages";

class editTemplateColumn extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  handleEditPatientDrawer = (e) => {
    e.preventDefault();
    const { id, duplicateCareplanTemplate } = this.props || {};

    //   const {openEditPatientDrawer,patientData,carePlanData} = this.props;
    //   openEditPatientDrawer({patientData,carePlanData});
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  handleDuplicateConfirm = (e) => {
    e.preventDefault();
    const { handleCreateDuplicate } = this;

    confirm({
      title: `${this.formatMessage(messages.createDuplicateMessage)}`,
      content: "",
      onOk: async () => {
        handleCreateDuplicate();
      },
      onCancel() {},
    });
  };

  handleCreateDuplicate = async () => {
    try {
      const { id, duplicateCareplanTemplate } = this.props || {};

      const response = await duplicateCareplanTemplate(id);
      const {
        payload: { data = {}, message: resp_message = "" } = {},
        status,
        statusCode,
      } = response;
      if (status) {
        message.success(resp_message);
      } else {
        message.warn(resp_message);
      }
    } catch (error) {
      console.log("error ===>", error);
      message.warn(error);
    }
  };

  render() {
    const { handleDuplicateConfirm } = this;
    const { handleOpenEditDrawer, id, templateData } = this.props;
    const { basic_info: { user_id } = {} } = templateData || {};
    return (
      <div className="flex justify-end align-center">
        <div
          className={`fs18 fw600 flex direction-column align-center justify-center ${
            user_id ? "mr50" : ""
          }`}
        >
          <Tooltip
            title={this.formatMessage(messages.duplicate_text)}
            onClick={handleDuplicateConfirm}
          >
            <CopyOutlined type="default" className="tab-color" />
          </Tooltip>
        </div>

        {user_id ? (
          <Tooltip title={this.formatMessage(messages.edit_text)}>
            <img
              src={edit_image}
              className="edit-patient-icon flex direction-column align-center justify-center"
              onClick={handleOpenEditDrawer({ id })}
            />
          </Tooltip>
        ) : null}
      </div>
    );
  }
}

export default injectIntl(editTemplateColumn);
