import React, {Component, Fragment} from "react";
import {injectIntl} from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone } from "@ant-design/icons";
import uuid from 'react-uuid';
import {Tabs, Button,Steps,Col,Select,Input,Upload, Modal,TimePicker,Icon,message } from "antd";
import SideMenu from "./sidebar";
import {REQUEST_TYPE,PATH} from '../../constant';
import throttle from "lodash-es/throttle";
import { withRouter } from "react-router-dom";
import  PlacesAutocomplete ,{
    geocodeByAddress,
    getLatLng
  } from "react-places-autocomplete";




class ClinicRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address:'',
            pincode:'',
            addressManual:''
        };
    }

    componentDidMount() {
      
    }

    setManualAddress=  e => {
        this.setState({ addressManual: e.target.value });
    };

    setManualPincode=  e => {
        this.setState({ pincode: e.target.value });
    };

    handleSave = ()=>{
        let{address='',pincode='',addressManual=''}=this.state;
        let {handleOk}=this.props;
        let locationToSave=address?address:addressManual+','+pincode;
        handleOk(locationToSave);
    }

    handleChange = address => {
        this.setState({ address });
      };

    
     
      handleSelect = address => {
        geocodeByAddress(address)
          .then(results => getLatLng(results[0]))
          .then(latLng => console.log('Success', latLng))
          .catch(error => console.error('Error', error));
      };


    render(){
        console.log("STATEEEEEEEEEEE OF MODAL",this.state);
        const { } = this.state;
      
          const {visible,handleCancel,handleOk} = this.props;
              return (
                <Modal
                visible={visible}
                title={'Location'}
                onCancel={handleCancel}
                onOk={this.handleSave}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                      Return
                    </Button>,
                    <Button key="submit" type="primary"  onClick={this.handleSave}>
                      Submit
                    </Button>,
                  ]}
            >
           <div className='location-container'>
               <div className='form-category-headings'>Google</div>
               <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
             <Input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'form-inputs',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
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
                placeholder="Address"
                value={this.state.addressManual}
                className={"form-inputs"}
                onChange={this.setManualAddress}
              />
              <div className='form-headings'>Pincode</div>
              <Input
                placeholder="Pincode"
                value={this.state.pincode}
                className={"form-inputs"}
                onChange={this.setManualPincode}
              />
             
           </div>
           </Modal>
        );
    }
}
export default withRouter(injectIntl(ClinicRegister));