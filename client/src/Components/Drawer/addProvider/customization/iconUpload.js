import React, { Component, Fragment } from "react";
import Form from "antd/es/form";
import Upload from "antd/es/upload";
import Icon from "antd/es/icon";

import { DeleteTwoTone, EyeTwoTone } from "@ant-design/icons";
import LoadingStatus from "../../../Common/Loading";
import messages from "../message";
import Modal from "antd/es/modal";
import Button from "antd/es/button";

const { Item: FormItem } = Form;

const FIELD_NAME = "icon";

class Field extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: null,
      viewModalVisible: false,
      viewModalSrc: "",
    };
  }

  componentDidMount() {
    this.getInitial();
  }

  handleDocumentViewClose = () => {
    this.setState({
      viewModalVisible: false,
      viewModalSrc: "",
    });
  };

  handleDocumentViewOpen = (src) => () => {
    this.setState({
      viewModalVisible: true,
      viewModalSrc: src,
    });
  };

  getInitial = () => {
    const {
      provider_id,
      providers = {},
      form: { setFieldsValue } = {},
    } = this.props;
    const { details: { icon = null } = {} } = providers[provider_id] || {};

    if (provider_id) {
      this.setState({ imageUrl: icon });
      setFieldsValue({ [FIELD_NAME]: icon });
    }
  };

  formatMessage = (message, data = {}) =>
    this.props.intl.formatMessage(message, data);

  fieldsError = (FIELD_NAME) => {
    const { form: { isFieldTouched, getFieldError } = {} } = this.props;
    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);
    return error;
  };

  handleUpload = async ({ file }) => {
    const { uploadDocument, form: { setFieldsValue } = {} } = this.props;
    const data = new FormData();
    data.set("files", file);

    try {
      this.setState({ loading: true });
      const response = await uploadDocument(data);
      const { status, payload: { data: { files } = {} } = {} } = response || {};
      if (status === true) {
        this.setState({ loading: false });
        setFieldsValue({ [FIELD_NAME]: files[0] });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  handleUploadChange = ({ file }) => {
    const fileUrl = URL.createObjectURL(file.originFileObj);
    this.setState({ imageUrl: fileUrl });
  };

  handleIconRemove = (file) => {
    const { form: { setFieldsValue } = {} } = this.props;
    this.setState({ imageUrl: null });
    setFieldsValue({ [FIELD_NAME]: null });
  };

  getFormContent = () => {
    const { loading } = this.state;
    const { handleUpload, handleUploadChange, formatMessage } = this;
    return (
      <Upload
        style={{ width: 128, height: 128, margin: 6 }}
        showUploadList={false}
        listType="picture-card"
        customRequest={handleUpload}
        onChange={handleUploadChange}
      >
        <div className="flex direction-column align-center">
          {loading ? (
            <LoadingStatus />
          ) : (
            <Icon type="upload" style={{ width: 20, height: 20 }} />
          )}
          <span>{formatMessage(messages.iconUploadText)}</span>
        </div>
      </Upload>
    );
  };

  getLogo = () => {
    const { imageUrl } = this.state;
    const { handleIconRemove } = this;
    return (
      <div className={"qualification-avatar-uploader "}>
        <img src={imageUrl} alt={"provider-icon"} className="wp100 hp100 br4" />
        <div className="overlay"></div>
        <div className="button absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container">
          {" "}
          <DeleteTwoTone
            className={"del doc-opt"}
            onClick={handleIconRemove}
            twoToneColor="#fff"
          />{" "}
          <EyeTwoTone
            className="w20"
            className={"del doc-opt ml16"}
            onClick={this.handleDocumentViewOpen(imageUrl)}
            twoToneColor="#fff"
          />
        </div>
      </div>
    );
  };

  render() {
    const { form } = this.props;
    const {
      imageUrl,
      viewModalVisible = false,
      viewModalSrc = "",
    } = this.state;
    const { formatMessage, fieldsError, getLogo, getFormContent } = this;

    const { getFieldDecorator, getFieldValue } = form || {};

    console.log("03712839217 getFieldValue", getFieldValue(FIELD_NAME));
    return (
      <Fragment>
        <FormItem
          validateStatus={fieldsError[FIELD_NAME] ? "error" : ""}
          help={fieldsError[FIELD_NAME] || ""}
          label={formatMessage(messages.iconUpload)}
          className="mb0I"
        >
          {getFieldDecorator(
            FIELD_NAME,
            {}
          )(imageUrl ? getLogo() : getFormContent())}
        </FormItem>
        <Modal
          visible={viewModalVisible}
          closable
          mask
          maskClosable
          onCancel={this.handleDocumentViewClose}
          width={`50%`}
          footer={[
            <Button key="back" onClick={this.handleDocumentViewClose}>
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

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
