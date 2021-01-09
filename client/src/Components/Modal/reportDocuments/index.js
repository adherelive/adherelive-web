import React, { Fragment } from "react";
import Modal from "antd/es/modal";
import { PaperClipOutlined } from "@ant-design/icons";
import messages from "./messages";
import Tooltip from "antd/es/tooltip";

export default props => {
  const { visible, onClose, formatMessage, documentData } = props || {};

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
        {Object.keys(documentData).map(id => {
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
                  <a className="mr10 mb10" href={src} target={"_blank"}>
                    <img src={src} alt={name} className="w100 h100 br5" />
                  </a>
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
    </Modal>
  );
};
