import React, { Fragment } from "react";
import { PaperClipOutlined } from "@ant-design/icons";

const REPORT_DOCUMENTS_TO_SHOW = 3;

const getDocumentComp = (documents, total) => {
  let comps = [];

  Object.keys(documents).forEach((id, index) => {
    if (index < REPORT_DOCUMENTS_TO_SHOW) {
      const { basic_info: { name, document: src } = {} } = documents[id] || {};

      const extension = name
        .substring(name.length - 5, name.length)
        .split(".")[1];

      const isImage =
        extension === "png" ||
        extension === "jpeg" ||
        extension === "jpg" ||
        extension === "svg" ||
        false;
      comps.push(
        <Fragment key={`small-report-document-${id}`}>
          {isImage ? (
            <div className="ml6">
              <img src={src} alt={name} className="w30 h30 br5" />
            </div>
          ) : (
            <div className="ml6 w30 h30 br5 bg-light-grey flex align-center justify-center">
              <PaperClipOutlined className="black-85 fs16" />
            </div>
          )}
        </Fragment>
      );
    }
  });

  if (total > REPORT_DOCUMENTS_TO_SHOW) {
    comps.push(
      <div className="ml6 w35 h35 br5 bw-faint-grey bg-lighter-blue brown-grey flex justify-center align-center">
        {`+${total - REPORT_DOCUMENTS_TO_SHOW}`}
      </div>
    );
  }

  return comps;
};

export default ({ documentData, openModal }) => {
  const totalDocuments = Object.keys(documentData).length;

  return (
    <div className="flex align-center" onClick={openModal(documentData)}>
      {getDocumentComp(documentData, totalDocuments)}
    </div>
  );
};
