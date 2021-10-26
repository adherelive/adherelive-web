import React, { Fragment, Component } from "react";
import Modal from "antd/es/modal";
import { PaperClipOutlined } from "@ant-design/icons";
import messages from "./messages";
import Tooltip from "antd/es/tooltip";
import { injectIntl } from "react-intl";
import Button from "antd/es/button";

import { EyeTwoTone } from "@ant-design/icons";

class ReportDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewModalVisible: false,
      viewModalSrc: "",
    };
  }

  componentDidMount() {}

  getImageView = ({ src = "", id, name }) => {
    return (
      <div className={"qualification-avatar-uploader "}>
        <img src={src} className="wp100 hp100 br4" alt="report" />
        <div className="overlay"></div>
        <div className="absolute tp45 l0 wp100 flex justify-center align-space-evenly doc-container">
          <EyeTwoTone
            className="w20"
            className={"del doc-opt"}
            onClick={this.handleDocumentViewOpen(src)}
            twoToneColor="#fff"
          />
        </div>
      </div>
    );
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

  render() {
    const { visible, onClose, formatMessage, documentData } = this.props || {};
    const { getImageView, handleDocumentViewClose } = this;
    const { viewModalVisible = false, viewModalSrc = "" } = this.state;

    return (
      <Modal
        visible={visible}
        className={"upload-appointment-docs-modal"}
        title={formatMessage(messages.report_documents_text)}
        closable
        mask
        maskClosable
        onCancel={onClose}
        wrapClassName={"chat-media-modal-dialog"}
        width={`50%`}
        footer={null}
      >
        <div className="flex flex-wrap wp100">
          {Object.keys(documentData).map((id) => {
            const { basic_info: { name, document: src } = {} } =
              documentData[id] || {};

            const extension = name
              .substring(name.length - 5, name.length)
              .split(".")[1];
            console.log("93291872 extension --> ", { name, extension });

            const isImage =
              extension === "png" ||
              extension === "jpg" ||
              extension === "svg" ||
              extension === "jpeg" ||
              false;
            return (
              <Fragment key={`report-document-${id}`}>
                <Tooltip title={name} placement={"top"}>
                  {isImage ? (
                    getImageView({ src, id, name })
                  ) : (
                    <a
                      href={src}
                      target={"_blank"}
                      className="mr10 mb10 w100 h100 br5 bw-faint-grey flex align-center justify-center"
                    >
                      <PaperClipOutlined className="black-85 fs20" />
                    </a>
                  )}
                </Tooltip>
              </Fragment>
            );
          })}
        </div>
        <div>
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
        </div>
      </Modal>
    );
  }
}

export default injectIntl(ReportDocuments);
