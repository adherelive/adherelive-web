import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Drawer from "antd/es/drawer";
import Input from "antd/es/input";
import Upload from "antd/es/upload";
import message from "antd/es/message";
import Modal from "antd/es/modal";
import Button from "antd/es/button";
import Footer from "../footer";
import confirm from "antd/es/modal/confirm";
import Icon from "antd/es/icon";
import moment from "moment";
import DatePicker from "antd/es/date-picker";

import {
  DeleteTwoTone,
  PlusOutlined,
  EyeTwoTone,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import messages from "./message";

class addReportDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewModalVisible: false,
      viewModalSrc: "",
      uploading: false,
      documents: [],
      name: "",
      test_date: "",
      submitting: false,
    };
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  componentDidMount() {}

  getUploadButton = () => {
    const { uploading } = this.state;
    return uploading ? <LoadingOutlined /> : <PlusOutlined />;
  };

  setName = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ name: value });
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

  handleDelete = (delete_src) => (e) => {
    e.preventDefault();
    const { documents } = this.state;
    let indexToDelete = -1;
    for (let eachIndex in documents) {
      const { src = "" } = documents[eachIndex];
      if (src === delete_src) {
        indexToDelete = eachIndex;
        break;
      }
    }

    if (indexToDelete > -1) {
      documents.splice(indexToDelete, 1);
      this.setState({ documents });
      message.success(this.formatMessage(messages.deleteSuccess));
    }
  };

  getImageView = ({ src = "", id, name }) => {
    return (
      <div className={"qualification-avatar-uploader "}>
        <img src={src} className="wp100 hp100 br4" alt="report" />
        <div className="overlay"></div>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container">
          <DeleteTwoTone
            className={"del doc-opt"}
            // className="w20 "
            onClick={this.handleDelete(src)}
            twoToneColor="#fff"
          />{" "}
          <EyeTwoTone
            className="w20"
            className={"del doc-opt"}
            onClick={this.handleDocumentViewOpen(src)}
            twoToneColor="#fff"
          />
          <a
            download={name}
            href={src}
            target={"_self"}
            className={"del doc-opt ml4"}
            style={{ color: "#fff" }}
          >
            <DownloadOutlined className="fs18" twoToneColor="#fff" />
          </a>
        </div>
      </div>
    );
  };

  getFileView = ({ src, extension, id, name }) => {
    return (
      <div className={"qualification-avatar-uploader "}>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
          {/* {extension.toUpperCase()} */}
          <Icon type="paper-clip" />
        </div>
        <div className="overlay"></div>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
          <DeleteTwoTone
            className={"del doc-opt"}
            onClick={this.handleDelete(src)}
            twoToneColor="#fff"
          />{" "}
          <a
            download={name}
            href={src}
            target={"_self"}
            className={"del doc-opt ml4 mb4"}
            style={{ color: "#fff" }}
          >
            <DownloadOutlined className="fs18 " twoToneColor="#fff" />
          </a>
        </div>
      </div>
    );
  };

  getUploadedDocuments = () => {
    const { getImageView, getFileView } = this;
    const { payload: { patient_id } = {} } = this.props;
    const { documents } = this.state;

    return documents.map((each, index) => {
      const { name = "", src } = each;
      const documentExtension = name.substring(name.length - 3, name.length);

      return (
        <div key={`report-upload-${index}`}>
          {documentExtension === "png" ||
          documentExtension === "jpg" ||
          documentExtension === "peg" ||
          documentExtension === "jpeg"
            ? getImageView({ src, index, name })
            : getFileView({ src, extension: documentExtension, index, name })}
        </div>
      );
    });
  };

  handleUploadChange = ({ file }) => {
    const { documents = [] } = this.state;

    let newDocuments = [];

    const fileReader = new FileReader();
    const fileUrl = URL.createObjectURL(file.originFileObj);

    const existing = documents.filter((document) => {
      const { name } = document || {};
      return name === file.name;
    });
    if (existing.length === 0) {
      newDocuments.push({
        name: file.name,
        src: fileUrl,
        file,
      });
    }

    this.setState({ documents: [...documents, ...newDocuments] });
  };

  setTestDate = (value) => {
    this.setState({ test_date: moment(value) });
  };

  renderAddReport = () => {
    const {
      getUploadButton,
      formatMessage,
      getUploadedDocuments,
      handleUploadChange,
      setTestDate,
    } = this;

    const { name = "", test_date } = this.state;
    return (
      <div className="form-block-ap ">
        <div className="form-headings-ap flex align-center justify-start">
          {formatMessage(messages.name)}
          <div className="star-red">*</div>
        </div>
        <Input
          className={"form-inputs-ap"}
          placeholder={this.formatMessage(messages.add_report_name)}
          value={name}
          onChange={this.setName}
          required={true}
        />

        <div className="form-headings-ap flex align-center justify-start">
          {formatMessage(messages.testDate)}
          <div className="star-red">*</div>
        </div>
        <div className="report-datepicker">
          <DatePicker
            size="default"
            className="mb10"
            onChange={setTestDate}
            value={test_date}
            style={{ width: "100%" }}
          />
        </div>

        <div className="form-headings-ap flex align-center justify-start">
          {formatMessage(messages.files)}

          <div className="star-red">*</div>
        </div>

        <div className="wp100 flex flex-wrap align-center">
          {getUploadedDocuments()}
          <div className="flex">
            <Upload
              multiple={true}
              style={{ width: 128, height: 128, margin: 6 }}
              showUploadList={false}
              listType="picture-card"
              onChange={handleUploadChange}
            >
              <div className="flex direction-column align-center">
                <span>{getUploadButton()}</span>
                <span>{formatMessage(messages.upload_text)}</span>
              </div>
            </Upload>
          </div>
        </div>
      </div>
    );
  };

  async submitData() {
    try {
      const { uploadReport, payload: { patient_id } = {} } = this.props;

      const { documents = {} } = this.state;
      let data = new FormData();
      let allResponseDocs = [];

      for (let each of documents) {
        const { file = {} } = each;
        const { originFileObj = {} } = file;
        data.set("files", originFileObj);

        this.setState({
          uploading: true,
          submitting: true,
        });
        const response = await uploadReport(patient_id, data);
        const {
          status = false,
          payload: {
            message: respMessage = "",
            data: { documents: response_documents = [] } = {},
          } = {},
        } = response;

        if (!status) {
          message.warn(this.formatMessage(messages.somethingWentWrong));
          this.setState({ uploading: false });
          return;
        } else {
          if (response_documents.length > 0) {
            allResponseDocs.push(response_documents[0]);
          }
        }
      }

      this.handleAddReport(allResponseDocs);
    } catch (error) {
      console.log("error", error);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ uploading: false, submitting: false });
    }
  }

  async handleAddReport(documents) {
    try {
      const { name, test_date } = this.state;
      const { payload: { patient_id } = {}, addReport, close } = this.props;

      const data = {
        name,
        patient_id,
        documents,
        test_date,
      };

      const response = await addReport(data);

      const { status = false, payload: { message: respMessage = "" } = {} } =
        response;

      if (status) {
        this.setState({
          viewModalVisible: false,
          viewModalSrc: "",
          uploading: false,
          documents: [],
          name: "",
          test_date: "",
          submitting: false,
        });
        close();
        message.success(respMessage);
      } else {
        this.setState({ submitting: false });
        message.warn(respMessage);
      }
    } catch (error) {
      console.log("error", error);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ uploading: false, submitting: false });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.submitData();
  };

  warnNote = () => {
    return (
      <div className="pt16">
        <p className="red">
          <span className="fw600">{"Note"}</span>
          {` : ${this.formatMessage(messages.exitWarn)}`}
        </p>
      </div>
    );
  };

  handleCloseWarning = () => {
    const { warnNote } = this;
    const { close } = this.props;

    confirm({
      title: `${this.formatMessage(messages.exitMessage)}`,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        this.setState({
          viewModalVisible: false,
          viewModalSrc: "",
          uploading: false,
          documents: [],
          name: "",
          test_date: "",
        });
        close();
      },
      onCancel() {},
    });
  };

  onClose = () => {
    const { close } = this.props;
    const { handleCloseWarning } = this;

    const { name, documents } = this.state;
    if (name || Object.keys(documents).length > 0) {
      handleCloseWarning();
    } else {
      this.setState({
        viewModalVisible: false,
        viewModalSrc: "",
        uploading: false,
        documents: [],
        name: "",
        test_date: "",
      });

      close();
    }
  };

  render() {
    const { visible } = this.props;
    const { name, documents, test_date, submitting = false } = this.state;

    const {
      onClose,
      formatMessage,
      handleDocumentViewClose,
      renderAddReport,
      handleSubmit,
    } = this;

    const { viewModalVisible, viewModalSrc } = this.state;

    if (visible !== true) {
      return null;
    }

    const disabledSubmit =
      !name || Object.keys(documents).length === 0 || !test_date;
    const submitButtonProps = {
      disabled: disabledSubmit,
    };

    return (
      <Fragment>
        <Drawer
          title={formatMessage(messages.addReport)}
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          visible={visible}
          onClose={onClose}
          visible={visible}
          width={"30%"}
        >
          {renderAddReport()}
          <Footer
            onSubmit={handleSubmit}
            onClose={onClose}
            submitButtonProps={submitButtonProps}
            submitText={formatMessage(messages.submit)}
            cancelComponent={null}
            submitting={submitting}
          />
        </Drawer>
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

export default injectIntl(addReportDrawer);
