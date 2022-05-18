import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";

import CompanyIcon from "../../../Assets/images/logo3x.png";
import Button from "antd/es/button";
import messages from "./messages";
import { PATH } from "../../../constant";

const ERROR_CODE = 404;

// export const BorderBox = (props) => {
//     const {children, w} = props;

//     return (
//         <div className={"br5 bw1 p10 flex align-center justify-center"} style={{width: w}}>
//             {children}
//         </div>
//     );
// };

const getHeader = ({ intl: { formatMessage } = {} }) => (
  <div className={"ml10 mt10 flex align-center"}>
    <img alt="adherelive-logo" src={CompanyIcon} className="company-logo" />
    <span className={"ml4 fs22 fw600"}>
      {formatMessage(messages.companyName)}
    </span>
  </div>
);

const handleRedirect = (props) => (e) => {
  e.preventDefault();
  props.history.push(PATH.LANDING_PAGE);
};

const BlankState = (props) => {
  const { intl: { formatMessage } = {} } = props;
  return (
    <Fragment>
      {/* HEADER */}
      {getHeader(props)}
      <div className={"wp100 flex justify-center mt100"}>
        <div
          className={
            "br5 p20 flex direction-column align-center wp40 box-shadow-1"
          }
        >
          <div className={"fs60 fw700 mb20"}>{ERROR_CODE}</div>

          <div className={"tac mb20"}>{formatMessage(messages.message404)}</div>

          {/* <div onClick={handleRedirect(props)}> redirect </div> */}
          <Button
            type={"primary"}
            icon={"arrow-left"}
            onClick={handleRedirect(props)}
            className={"flex align-center"}
          >
            {formatMessage(messages.goBack)}
          </Button>
          {/* <ArrowLeftOutlined onClick={handleRedirect(props)}/> */}
        </div>
      </div>
    </Fragment>
  );
};

export default withRouter(injectIntl(BlankState));
