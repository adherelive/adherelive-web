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
        this.setState({ address: '', pincode: '', addressManual: '', landmark: '' })
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

        let locationToSave = address ? address : manual;
        handleOk(locationToSave);
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

    handleChangeAddress = address => {
        this.setState({ address });
    };

    handleSelect = address => {

        this.setState({ address });
    };


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
                    <PlacesAutocomplete
                        value={address ? address : location}
                        disabled={addressManual ? true : false}
                        onChange={this.handleChangeAddress}
                        onSelect={this.handleSelect}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <Input

                                    disabled={addressManual ? true : false}
                                    {...getInputProps({
                                        placeholder: 'Search Address',
                                        className: 'form-inputs-google',
                                    })}
                                />
                                <div className="google-places-autocomplete__suggestions-container">
                                    {loading && <div>Loading...</div>}
                                    {suggestions.map(suggestion => {
                                        const className = "google-places-autocomplete__suggestion";
                                        // inline style for demonstration purpose
                                        return (
                                            <div
                                                {...getSuggestionItemProps(suggestion, {
                                                    className,

                                                })}
                                            >
                                                <span>{suggestion.description}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </PlacesAutocomplete>




                    <div className='form-category-headings'>Or add manually</div>
                    <div className='form-headings'>Address</div>
                    <Input
                        placeholder="Ex: 112,Aurobindo Marg..."
                        disabled={address ? true : false}
                        value={addressManual}
                        className={"form-inputs"}
                        onChange={this.setManualAddress}
                    />
                    <div className='form-headings'>Pincode</div>
                    <Input
                        placeholder="Ex: 110000"
                        disabled={address ? true : false}
                        value={pincode}
                        className={"form-inputs"}
                        onChange={this.setManualPincode}
                    />
                    <div className='form-headings'>Landmark</div>
                    <Input
                        placeholder="Ex: Near Vishvavidyalya Metro Station"
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
