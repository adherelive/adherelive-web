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
import moment from "moment";
import Icon from "antd/es/icon";
import DatePicker from "antd/es/date-picker";

import {
  DeleteTwoTone,
  PlusOutlined,
  EyeTwoTone,
  DownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import messages from "./message";

class editReportDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewModalVisible: false,
      viewModalSrc: "",
      uploading: false,
      new_documents: [],
      name: "",
      test_date: "",
      exisiting_documents: [],
      enableModal: false,
      submitting: false,
    };
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    const { visible: prev_visible } = prevProps;
    const { visible } = this.props;
    if (visible && visible !== prev_visible) {
      this.getAllReportsData();
    }
  }

  getAllReportsData = () => {
    const { payload = {}, patient_id } = this.props;
    const { report_id = "", documentData = {}, reportData = {} } = payload;
    let exisiting_documents = [];

    const { test_date = "", basic_info: { name = "" } = {} } = reportData;

    for (let each in documentData) {
      let doc = documentData[each];
      exisiting_documents.push(doc);
    }

    this.setState({
      name,
      exisiting_documents,
      test_date: moment(test_date),
    });
  };

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

  handleExistingDelete = (delete_id) => (e) => {
    e.preventDefault();
    this.confirmExisitngDelete(delete_id);
  };

  exsitingDeleteWarnNote = () => {
    return (
      <div className="pt16">
        <p className="red">
          <span className="fw600">{"Note"}</span>
          {`: ${this.formatMessage(messages.deleteWarn)}`}
        </p>
      </div>
    );
  };

  confirmExisitngDelete = (delete_id) => {
    const { exsitingDeleteWarnNote } = this;

    confirm({
      title: `${this.formatMessage(messages.deleteMessage)}`,
      content: <div>{exsitingDeleteWarnNote()}</div>,
      onOk: async () => {
        const { deleteReport } = this.props;
        const { exisiting_documents } = this.state;

        deleteReport(delete_id).then((response) => {
          const {
            status,
            payload: { message: msg = "" },
          } = response;

          if (status) {
            const { exisiting_documents } = this.state;
            let indexToDelete = -1;
            for (let eachIndex in exisiting_documents) {
              const { basic_info: { id = "" } = {} } =
                exisiting_documents[eachIndex];
              if (id === delete_id) {
                indexToDelete = eachIndex;
                break;
              }
            }

            if (indexToDelete > -1) {
              exisiting_documents.splice(indexToDelete, 1);
              this.setState({ exisiting_documents });
              message.success(this.formatMessage(messages.deleteSuccess));
            }
          } else {
            message.warn(msg);
          }
        });
      },
      onCancel() {},
    });
  };

  handleDelete = (delete_src) => (e) => {
    e.preventDefault();
    const { new_documents } = this.state;
    let indexToDelete = -1;
    for (let eachIndex in new_documents) {
      const { src = "" } = new_documents[eachIndex];
      if (src === delete_src) {
        indexToDelete = eachIndex;
        break;
      }
    }

    if (indexToDelete > -1) {
      new_documents.splice(indexToDelete, 1);
      this.setState({
        new_documents,
      });
      message.success(this.formatMessage(messages.deleteSuccess));
    }
  };

  getImageView = ({ src, index, name, id = null }) => {
    return (
      <div className={"qualification-avatar-uploader "}>
        <img src={src} className="wp100 hp100 br4" alt="report" />
        <div className="overlay"></div>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container">
          {id ? (
            <DeleteTwoTone
              className={"del doc-opt"}
              // className="w20 "
              onClick={this.handleExistingDelete(id)}
              twoToneColor="#fff"
            />
          ) : (
            <DeleteTwoTone
              className={"del doc-opt"}
              // className="w20 "
              onClick={this.handleDelete(src)}
              twoToneColor="#fff"
            />
          )}
          <EyeTwoTone
            className="w20"
            className={"del doc-opt"}
            onClick={this.handleDocumentViewOpen(src)}
            twoToneColor="#fff"
          />
          <a
            download={name}
            href={src}
            target={"_blank"}
            className={"del doc-opt ml4"}
            style={{ color: "#fff" }}
          >
            <DownloadOutlined className="fs18" twoToneColor="#fff" />
          </a>
        </div>
      </div>
    );
  };

  getFileView = ({ src, extension, index, name, id = null }) => {
    return (
      <div className={"qualification-avatar-uploader "}>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
          {/* {extension.toUpperCase()} */}
          <Icon type="paper-clip" />
        </div>
        <div className="overlay"></div>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
          {id ? (
            <DeleteTwoTone
              className={"del doc-opt"}
              // className="w20 "
              onClick={this.handleExistingDelete(id)}
              twoToneColor="#fff"
            />
          ) : (
            <DeleteTwoTone
              className={"del doc-opt"}
              // className="w20 "
              onClick={this.handleDelete(src)}
              twoToneColor="#fff"
            />
          )}

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

  createMarkup = (content) => {
    return { __html: content };
  };

  getUploadedDocuments = () => {
    const { getImageView, getFileView } = this;
    const { payload: { patient_id } = {} } = this.props;
    const { new_documents } = this.state;

    return new_documents.map((each, index) => {
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

  getExistingDocuments = () => {
    const { getImageView, getFileView } = this;
    const { payload: { patient_id } = {} } = this.props;
    const { exisiting_documents } = this.state;

    return exisiting_documents.map((each, index) => {
      // const {basic_info :{document  = '',id='',name='' } = {} } =each;
      const { basic_info = {} } = each;
      const { id = "", document: src = "", name = "" } = basic_info;

      const documentExtension = name.substring(name.length - 3, name.length);

      return (
        <div>
          <div key={`report-upload-${index}`}>
            {documentExtension === "png" ||
            documentExtension === "jpg" ||
            documentExtension === "peg" ||
            documentExtension === "jpeg"
              ? getImageView({ src, index, name, id })
              : getFileView({
                  src,
                  extension: documentExtension,
                  index,
                  name,
                  id,
                })}
          </div>
        </div>
      );
    });
  };

  handleUploadChange = ({ file }) => {
    const { new_documents = [] } = this.state;
    console.log("287423 file ---> ", { file });

    let newDocuments = [];

    const fileReader = new FileReader();
    const fileUrl = URL.createObjectURL(file.originFileObj);

    const existing = new_documents.filter((document) => {
      const { name } = document || {};
      return name === file.name;
    });
    console.log("287423 Existing --->", existing);
    if (existing.length === 0) {
      newDocuments.push({
        name: file.name,
        src: fileUrl,
        file,
      });

      this.setState({ enableModal: true });
    }

    console.log("287423 new_documents", { newDocuments });
    this.setState({
      new_documents: [...new_documents, ...newDocuments],
    });
  };

  setTestDate = (value) => {
    this.setState({ test_date: moment(value).format("YYYY-MM-DD") });
  };

  renderAddReport = () => {
    const {
      getUploadButton,
      formatMessage,
      getUploadedDocuments,
      handleUploadChange,
      getExistingDocuments,
      setTestDate,
    } = this;

    const { name = "", test_date } = this.state;
    console.log("786578326427348234762427394823 Render", test_date);
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
            defaultValue={moment(test_date)}
            style={{ width: "100%" }}
          />
        </div>

        <div className="form-headings-ap flex align-center justify-start">
          {formatMessage(messages.files)}

          <div className="star-red">*</div>
        </div>

        <div className="wp100 flex flex-wrap align-center">
          {getExistingDocuments()}
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

      const { new_documents = [] } = this.state;
      let data = new FormData();

      if (new_documents.length === 0) {
        this.handleAddReport(new_documents);
        return;
      }

      let allResponseDocs = [];

      for (let each of new_documents) {
        const { file = {} } = each;
        const { originFileObj = {} } = file;
        data.set("files", originFileObj);

        this.setState({ uploading: true, submitting: true });
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

  async handleAddReport(new_documents) {
    try {
      const { name, exisiting_documents, test_date } = this.state;
      const { payload: { report_id } = {} } = this.props;
      const { payload: { patient_id } = {}, updateReport, close } = this.props;

      let documents = [];

      for (let each of exisiting_documents) {
        let obj = {};
        const { basic_info: { name = "", document = "" } = {} } = each;
        obj["name"] = name;
        obj["file"] = document;
        documents.push(obj);
      }

      for (let each of new_documents) {
        documents.push(each);
      }

      const data = {
        name,
        patient_id,
        documents: documents,
        test_date,
      };

      const response = await updateReport(report_id, data);

      const { status = false, payload: { message: respMessage = "" } = {} } =
        response;

      if (status) {
        this.setState({
          uploading: false,
          viewModalVisible: false,
          viewModalSrc: "",
          new_documents: [],
          name: "",
          test_date: "",
          exisiting_documents: [],
        });
        close();
        message.success(respMessage);
      } else {
        message.warn(respMessage);
      }

      this.setState({ submitting: false });
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
          new_documents: [],
          name: "",
          test_date: "",
          exisiting_documents: [],
        });
        close();
      },
      onCancel() {},
    });
  };

  onClose = () => {
    const { close } = this.props;
    const { handleCloseWarning } = this;

    const { name, new_documents, enableModal } = this.state;
    if ((name || Object.keys(new_documents).length > 0) && enableModal) {
      handleCloseWarning();
    } else {
      this.setState({
        viewModalVisible: false,
        viewModalSrc: "",
        uploading: false,
        new_documents: [],
        name: "",
        test_date: "",
        exisiting_documents: [],
      });

      close();
    }
  };

  render() {
    const { visible } = this.props;
    const {
      name = "",
      new_documents = [],
      exisiting_documents = [],
    } = this.state;

    const {
      onClose,
      formatMessage,
      handleDocumentViewClose,
      renderAddReport,
      handleSubmit,
    } = this;

    const {
      viewModalVisible,
      viewModalSrc,
      enableModal,
      submitting = false,
    } = this.state;
    console.log(
      "786578326427348234762427394823 enableModal  --->",
      viewModalVisible && enableModal
    );

    if (visible !== true) {
      return null;
    }

    const disabledSubmit =
      !name || (new_documents.length === 0 && exisiting_documents.length === 0);
    const submitButtonProps = {
      disabled: disabledSubmit,
    };

    return (
      <Fragment>
        <Drawer
          title={this.formatMessage(messages.editReport)}
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

export default injectIntl(editReportDrawer);
