import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Modal from "antd/es/modal";
import message from "antd/es/message";
import Upload from "antd/es/upload";
import Button from "antd/es/button";
import messages from "./messages";
import {
  DeleteTwoTone,
  PlusOutlined,
  EyeTwoTone,
  DownloadOutlined,
  // CloudDownloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import confirm from "antd/es/modal/confirm";

class AppointmentUploadModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewModalVisible: false,
      viewModalSrc: "",
      uploading: false,
    };
  }

  formatMessage = (message) => this.props.intl.formatMessage(message);

  customRequestUploadDocuments =
    (id) =>
    async ({ file, filename, onError, onProgress, onSuccess }) => {
      const { uploadAppointmentDocs } = this.props;

      let data = new FormData();
      data.append("files", file);

      this.setState({ uploading: true });

      const response = await uploadAppointmentDocs(data);

      const { status = false, payload: { message: respMessage = "" } = {} } =
        response;

      if (status) {
        this.setState({ uploading: false });
        message.success(respMessage);
      } else {
        message.warn(respMessage);
      }
    };

  handleDelete = (id, src) => (e) => {
    e.preventDefault();
    const { warnNote } = this;

    confirm({
      title: `${this.formatMessage(messages.warnNote)}`,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        try {
          const { deleteAppointmentDocs } = this.props;
          const response = await deleteAppointmentDocs(id);
          const { status, payload: { data, message: respMessage } = {} } =
            response;
          if (status) {
            message.success(respMessage);
          } else {
            message.warn(respMessage);
          }
        } catch (err) {
          console.log("err ", err);
          message.warn(this.formatMessage(messages.somethingWentWrong));
        }
      },
      onCancel() {},
    });
  };

  warnNote = () => {
    return (
      <div className="pt16">
        <p>
          <span className="fw600">{"Note"}</span>
          {` :${this.formatMessage(messages.irreversibleWarn)} `}
        </p>
      </div>
    );
  };

  getImageView = ({ src, id }) => {
    return (
      <div className={"qualification-avatar-uploader "}>
        <img src={src} className="wp100 hp100 br4" alt="appointment-report" />
        <div className="overlay"></div>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container">
          <DeleteTwoTone
            className={"del doc-opt"}
            // className="w20 "
            onClick={this.handleDelete(id, src)}
            twoToneColor="#fff"
          />{" "}
          <EyeTwoTone
            className="w20"
            className={"del doc-opt"}
            onClick={this.handleDocumentViewOpen(id, src)}
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
        {/* <div className="wp100 mw100 flex direction-column align-center justify-center"> */}
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
          {extension.toUpperCase()}
        </div>
        <div className="overlay"></div>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container ">
          <DeleteTwoTone
            className={"del doc-opt"}
            // className="w20 "
            onClick={this.handleDelete(id, src)}
            twoToneColor="#fff"
          />{" "}
          <EyeTwoTone
            className="w20"
            className={"del doc-opt"}
            onClick={this.handleDocumentViewOpen(id, src)}
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

  handleDocumentViewOpen = (id, src) => () => {
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

  getUploadedDocuments = () => {
    const { appointments, upload_documents } = this.props;
    const { getImageView, getFileView } = this;
    const { appointment_document_ids } = appointments || {};

    return appointment_document_ids.map((id) => {
      const { basic_info: { document } = {} } = upload_documents[id] || {};

      const documentExtension = document.substring(
        document.length - 3,
        document.length
      );

      return (
        <div key={`appointment-upload-${id}`}>
          {documentExtension === "png" ||
          documentExtension === "jpg" ||
          documentExtension === "peg" ||
          documentExtension === "jpeg"
            ? getImageView({ src: document, id })
            : getFileView({ src: document, extension: documentExtension, id })}
        </div>
      );
    });
  };

  getUploadButton = () => {
    const { uploading } = this.state;
    return uploading ? <LoadingOutlined /> : <PlusOutlined />;
  };

  render() {
    const { appointmentId, visible, onCancel } = this.props;
    const {
      formatMessage,
      customRequestUploadDocuments,
      getUploadedDocuments,
      handleDocumentViewClose,
      getUploadButton,
    } = this;

    const { viewModalVisible = false, viewModalSrc = "" } = this.state;
    return (
      <div>
        <Modal
          className={"upload-appointment-docs-modal"}
          visible={visible}
          title={formatMessage(messages.upload_appointment_document_title)}
          closable
          mask
          maskClosable
          onCancel={onCancel}
          wrapClassName={"chat-media-modal-dialog"}
          width={`50%`}
          footer={null}
        >
          <div className="wp100 flex flex-wrap align-center">
            {getUploadedDocuments()}
            <div className="flex">
              <Upload
                multiple={true}
                style={{ width: 128, height: 128, margin: 6 }}
                showUploadList={false}
                customRequest={customRequestUploadDocuments(appointmentId)}
                listType="picture-card"
              >
                <div className="flex direction-column align-center">
                  {/*<PlusOutlined />*/}
                  <span>{getUploadButton()}</span>
                  <span>{formatMessage(messages.upload_text)}</span>
                </div>
              </Upload>
            </div>
          </div>
        </Modal>

        <Modal
          visible={viewModalVisible}
          // title={`${formatMessage(messages.profile_pic_text)}`}
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
      </div>
    );
  }
}

export default injectIntl(AppointmentUploadModal);
