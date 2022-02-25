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
      uploaded_documents: [],
    };
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  // componentDidMount(){
  //     const {payload : {report_id},patient_id} = this.props;
  //   //   console.log("786578326427348234762427394823 --->",this.props);
  //     // this.getAllReportsData();

  // }

  componentDidUpdate() {}

  async getAllReportsData() {
    try {
      const {
        payload: { report_id },
        patient_id,
      } = this.props;
      const { getAllReports } = this.props;
      let uploaded_documents = [];
      const response = await getAllReports(patient_id);
      // console.log("786578326427348234762427394823 ---> getAllReportsData response",response);
      const { reports = {}, upload_documents = {} } = response;
      const { basic_info: { name = "" } = {}, report_document_ids = [] } =
        reports[report_id] || {};

      for (let each in upload_documents) {
        if (report_document_ids.includes(each)) {
          console.log("786578326427348234762427394823 --->EACH", each);

          let doc = upload_documents[each];
          if (doc) {
            uploaded_documents.push(doc);
          }
        }
      }

      this.setState({
        name,
        uploaded_documents,
      });
    } catch (error) {
      console.log("error", error);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ uploading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("786578326427348234762427394823 --->",this.props);
  }

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
      this.setState({ new_documents });
    }
  };

  getImageView = ({ src, id }) => {
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

  getFileView = ({ src, extension, id }) => {
    return (
      <div className={"qualification-avatar-uploader "}>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
          {extension.toUpperCase()}
        </div>
        <div className="overlay"></div>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
          <DeleteTwoTone
            className={"del doc-opt"}
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
            href={src}
            target={"_self"}
            className={"del doc-opt ml4"}
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
            ? getImageView({ src, index })
            : getFileView({ src, extension: documentExtension, index })}
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
    }

    this.setState({ new_documents: [...new_documents, ...newDocuments] });
  };

  renderAddReport = () => {
    const {
      getUploadButton,
      formatMessage,
      getUploadedDocuments,
      handleUploadChange,
    } = this;

    const { name } = this.state;
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

      const { new_documents = {} } = this.state;
      let data = new FormData();

      for (let each of new_documents) {
        const { file = {} } = each;
        const { originFileObj = {} } = file;
        data.append("files", originFileObj);
      }

      this.setState({ uploading: true });

      const response = await uploadReport(patient_id, data);

      const {
        status = false,
        payload: {
          message: respMessage = "",
          data: { new_documents: response_documents = {} } = {},
        } = {},
      } = response;

      if (status) {
        this.handleAddReport(response_documents);
      } else {
        message.warn(respMessage);
      }
    } catch (error) {
      console.log("error", error);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ uploading: false });
    }
  }

  async handleAddReport(new_documents) {
    try {
      const { name } = this.state;
      const { payload: { patient_id } = {}, addReport, close } = this.props;

      const data = {
        name,
        patient_id,
        new_documents,
      };

      const response = await addReport(data);

      const { status = false, payload: { message: respMessage = "" } = {} } =
        response;

      if (status) {
        this.setState({
          uploading: false,
          viewModalVisible: false,
          viewModalSrc: "",
          // TODO: Duplicate entry, commenting
          //uploading: false,
          new_documents: [],
          name: "",
        });
        close();
        message.success(respMessage);
      } else {
        message.warn(respMessage);
      }
    } catch (error) {
      console.log("error", error);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ uploading: false });
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
          {" : This will remove all the data to be uploaded"}
        </p>
      </div>
    );
  };

  handleCloseWarning = () => {
    const { warnNote } = this;
    const { close } = this.props;

    confirm({
      title: `Are you sure you want to cancel ? `,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        this.setState({
          viewModalVisible: false,
          viewModalSrc: "",
          uploading: false,
          new_documents: [],
          name: "",
        });
        close();
      },
      onCancel() {},
    });
  };

  onClose = () => {
    const { close } = this.props;
    const { handleCloseWarning } = this;

    const { name, new_documents } = this.state;
    if (name || Object.keys(new_documents).length > 0) {
      handleCloseWarning();
    } else {
      this.setState({
        viewModalVisible: false,
        viewModalSrc: "",
        uploading: false,
        new_documents: [],
        name: "",
      });

      close();
    }
  };

  render() {
    const { visible } = this.props;
    const { name, new_documents } = this.state;
    // console.log("786578326427348234762427394823 Render new_documents ----->",this.props);

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

    const disabledSubmit = !name || Object.keys(new_documents).length === 0;
    const submitButtonProps = {
      disabled: disabledSubmit,
    };

    return (
      <Fragment>
        <Drawer
          title={formatMessage(messages.editReport)}
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
