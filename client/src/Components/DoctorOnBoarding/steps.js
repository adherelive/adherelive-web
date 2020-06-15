import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone, DeleteOutlined } from "@ant-design/icons";
import uuid from 'react-uuid';
import { Tabs, Button, Col, Select, Input, InputNumber, Upload, Modal, TimePicker, Icon, message } from "antd";
import SideMenu from "./sidebar";
import { REQUEST_TYPE, PATH } from '../../constant';
import { getUploadURL } from '../../Helper/urls/user';
import { getUploadQualificationDocumentUrl } from '../../Helper/urls/doctor';
import { doRequest } from '../../Helper/network';
import plus from '../../Assets/images/plus.png';
import { withRouter } from "react-router-dom";


class Steps extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {

        const { current = 0 } = this.props;
        return (

            <div className='custom-steps-container'>
                <div className='step-line-container h60'><div className='step-line' /></div>
                <div className='step-data-container '><div className='step-active-text'>Profile</div><div className='step-active-div'><div className='step-active-text'>1</div></div></div>
                <div className='step-line-container h80'><div className='step-line' /></div>
                <div className='step-data-container'><div className={current >= 1 ? 'step-active-text' : 'step-inactive-text'}>Qualifications</div><div className={current >= 1 ? 'step-active-div' : 'step-inactive-div'}><div className={current >= 1 ? 'step-active-text' : 'step-inactive-text'}>2</div></div></div>
                <div className='step-line-container h80'><div className='step-line' /></div>
                <div className='step-data-container'><div className={current >= 2 ? 'step-active-text' : 'step-inactive-text'}>Clinics</div><div className={current >= 2 ? 'step-active-div' : 'step-inactive-div'}><div className={current >= 2 ? 'step-active-text' : 'step-inactive-text'}>3</div></div></div>
                <div className='step-line-container h100'><div className='step-line' /></div>
            </div>

        );
    }
}
export default withRouter(injectIntl(Steps));