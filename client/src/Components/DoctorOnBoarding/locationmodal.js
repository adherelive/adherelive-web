import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone } from "@ant-design/icons";
import uuid from 'react-uuid';
import { Tabs, Button, Steps, Col, Select, Input, Upload, Modal, TimePicker, Icon, message } from "antd";
import SideMenu from "./sidebar";
import { REQUEST_TYPE, PATH } from '../../constant';
import throttle from "lodash-es/throttle";
import { withRouter } from "react-router-dom";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';




class ClinicRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            pincode: '',
            addressManual: '',
            landmark: ''
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.setState({ address: '', pincode: '', addressManual: '' })
    }

    setManualAddress = e => {
        this.setState({ addressManual: e.target.value });
    };

    setManualPincode = e => {
        this.setState({ pincode: e.target.value });
    };

    setManualLandMark = e => {
        this.setState({ landmark: e.target.value });
    };

    

    handleSave = () => {
        let { address = '', pincode = '', addressManual = '', landmark = '' } = this.state;
        let { handleOk } = this.props;
        let manual = addressManual + (pincode ? `,${pincode}` : '') + (landmark ? `,${landmark}` : '');

        let locationToSave = address ? address.description : manual;
        // this.GooglePlacesRef.setAddressText("");
        handleOk(locationToSave);
        this.myRef.current && this.clearInput();
        this.setState({
            address: '',
            pincode: '',
            addressManual: '',
            landmark: ''
        });


    }

    handleChange = address => {
        this.setState({ address });
    };

    handleClose = () => {

        const { handleCancel } = this.props;

        handleCancel();
        this.myRef.current && this.clearInput();
        this.setState({
            address: '',
            pincode: '',
            addressManual: '',
            landmark: ''
        });

    }

    clearInput = () => {
       this.myRef.current.value = "";
    }


    render() {
        console.log("STATEEEEEEEEEEE OF MODAL", this.state);
        const { address = '', addressManual = '', pincode = '', landmark = '' } = this.state;

        const { visible, handleCancel, handleOk, location } = this.props;
        return (
            <Modal
                visible={visible}
                title={'Location'}
                onCancel={this.handleClose}
                onOk={this.handleSave}
                footer={[
                    <Button key="back" onClick={this.handleClose}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleSave}>
                        Submit
                    </Button>,
                ]}
            >
                <div className='location-container'>
                    <div className='form-category-headings'>Google</div>
                    <GooglePlacesAutocomplete
                        inputClassName={'form-inputs-google'}
                        // ref={(instance) => { this.GooglePlacesRef = instance }}
                        renderInput={(props) => (
                            <Input
                            ref={this.myRef}
                                className="form-input-google"
                                value={address ? address.description : location ? location : ''}
                                // Custom properties
                                {...props}
                            />
                        )}
                        // renderSuggestions={(active, suggestions, onSelectSuggestion) => (
                        //     <div >
                        //       {
                        //         suggestions.map((suggestion) => (
                        //           <div
                        //             onClick={(event) => onSelectSuggestion(suggestion, event)}
                        //           >
                        //             {suggestion.description}
                        //           </div>
                        //         ))
                        //       }
                        //     </div>
                        //   )}
                        //    inputStyle={{height:50,width:261,border:1,borderColor:'#d7d7d7'}}


                        placeholder={'Search Address...'}
                        onSelect={this.handleChange}
                    />



                    <div className='form-category-headings'>Or add manually</div>
                    <div className='form-headings'>Address</div>
                    <Input
                        placeholder="Address"
                        disabled={address ? true : false}
                        value={addressManual}
                        className={"form-inputs"}
                        onChange={this.setManualAddress}
                    />
                    <div className='form-headings'>Pincode</div>
                    <Input
                        placeholder="Pincode"
                        disabled={address ? true : false}
                        value={pincode}
                        className={"form-inputs"}
                        onChange={this.setManualPincode}
                    />
                    <div className='form-headings'>Landmark</div>
                    <Input
                        placeholder="Landmark"
                        disabled={address ? true : false}
                        value={landmark}
                        className={"form-inputs"}
                        onChange={this.setManualLandMark}
                    />

                </div>
            </Modal>
        );
    }
}
export default injectIntl(ClinicRegister);
