import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import {  message } from "antd";
import Loading from '../Common/Loading'

import { withRouter } from "react-router-dom";


class ValidationPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true
        };
    }

    async componentDidMount() {

        const { link = "" } = this.props.match.params;
        if (link) {
            const { verifyUser } = this.props;
            let response = await verifyUser(link);
            console.log("RESPONSE OF VERIFY USERRR12312312312312", response);
            //   .then(response=>{
            const { status, statusCode } = response;
            if (!status) {
                if (statusCode == 422) {

                    message.error('This verification link has expired!');
                    this.props.history.replace('/');
                } else {

                    message.error('Something went wrong, please try again.');
                    this.props.history.replace('/');
                }
            } else {
                message.success('Account verified successfully.');
            }
        }
    }






    render() {
        return (
            <div className='wp100 hp100 flex justify-center align-center'>
                <Loading />
            </div>
        );
    }
}

export default withRouter(injectIntl(ValidationPage));