import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Button, Input, Modal } from "antd";
import PlacesAutocomplete from "react-places-autocomplete";
import messages from "./messages";

class ClinicRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      pincode: "",
      addressManual: "",
      landmark: "",
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      address: "",
      pincode: "",
      addressManual: "",
      landmark: "",
    });
  }

  setManualAddress = (e) => {
    this.setState({ addressManual: e.target.value });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  setManualPincode = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "" || value === "-") {
      this.setState({ pincode: e.target.value });
    }
  };

  setManualLandMark = (e) => {
    this.setState({ landmark: e.target.value });
  };

  handleSave = () => {
    let {
      address = "",
      pincode = "",
      addressManual = "",
      landmark = "",
    } = this.state;
    let { handleOk } = this.props;
    let manual =
      addressManual +
      (landmark ? `,${landmark}` : "") +
      (pincode ? `,Pincode:${pincode}` : "");

    let locationToSave = address ? address : manual;
    handleOk(locationToSave);
    this.setState({
      address: "",
      pincode: "",
      addressManual: "",
      landmark: "",
    });
  };

  handleChange = (address) => {
    this.setState({ address });
  };

  handleClose = () => {
    const { handleCancel } = this.props;

    handleCancel();
    this.setState({
      address: "",
      pincode: "",
      addressManual: "",
      landmark: "",
    });
  };

  clearInput = () => {
    this.myRef.current.value = "";
  };

  handleChangeAddress = (address) => {
    this.setState({ address });
  };

  handleSelect = (address) => {
    this.setState({ address });
  };

  render() {
    const {
      address = "",
      addressManual = "",
      pincode = "",
      landmark = "",
    } = this.state;

    const { visible, location } = this.props;
    return (
      <Modal
        visible={visible}
        title={this.formatMessage(messages.location)}
        onCancel={this.handleClose}
        onOk={this.handleSave}
        footer={[
          <Button key="back" onClick={this.handleClose}>
            {this.formatMessage(messages.return)}
          </Button>,
          <Button key="submit" type="primary" onClick={this.handleSave}>
            {this.formatMessage(messages.submit)}
          </Button>,
        ]}
      >
        <div className="location-container">
          <div className="form-category-headings">
            {this.formatMessage(messages.google)}
          </div>
          <PlacesAutocomplete
            value={
              address
                ? address
                : !location.includes("Pincode")
                ? location
                : null
            }
            disabled={addressManual ? true : false}
            onChange={this.handleChangeAddress}
            onSelect={this.handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <Input
                  disabled={addressManual ? true : false}
                  {...getInputProps({
                    placeholder: this.formatMessage(messages.searchAddress),
                    className: "form-inputs-google",
                  })}
                />
                <div className="google-places-autocomplete__suggestions-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => {
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

          <div className="form-category-headings">
            {this.formatMessage(messages.addManually)}
          </div>
          <div className="form-headings">
            {this.formatMessage(messages.address)}
          </div>
          <Input
            placeholder="Ex: 112,Aurobindo Marg..."
            disabled={address ? true : false}
            value={
              addressManual
                ? addressManual
                : location.includes("Pincode:")
                ? location.split(",")[0]
                : ""
            }
            className={"form-inputs-location-modal"}
            onChange={this.setManualAddress}
          />
          <div className="form-headings">
            {this.formatMessage(messages.pincode)}
          </div>
          <Input
            placeholder="Ex: 110000"
            disabled={address ? true : false}
            value={
              pincode
                ? pincode
                : location.includes("Pincode:")
                ? location.split("Pincode:")[1]
                : ""
            }
            className={"form-inputs-location-modal"}
            onChange={this.setManualPincode}
          />
          <div className="form-headings">
            {this.formatMessage(messages.landmark)}
          </div>
          <Input
            placeholder="Ex: Near Vishvavidyalya Metro Station"
            disabled={address ? true : false}
            value={
              landmark
                ? landmark
                : location.includes("Pincode:")
                ? location.split(",")[1]
                : ""
            }
            className={"form-inputs-location-modal"}
            onChange={this.setManualLandMark}
          />
        </div>
      </Modal>
    );
  }
}

export default injectIntl(ClinicRegister);
