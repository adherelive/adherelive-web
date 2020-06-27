import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon,DatePicker,Select,Input,message,Button } from "antd";
import ChatComponent from "../../../Containers/Chat";
import { GENDER, PATIENT_BOX_CONTENT, MISSED_MEDICATION, MISSED_ACTIONS } from "../../../constant";
import messages from "./message";
import moment from "moment";

import CloseIcon from "../../../Assets/images/close.svg";
import ChatIcon from "../../../Assets/images/chat.svg";
import ShareIcon from "../../../Assets/images/redirect3x.png";
import india from '../../../Assets/images/india.png';
import australia from '../../../Assets/images/australia.png';
import us from '../../../Assets/images/flag.png';
import uk from '../../../Assets/images/uk.png';
import russia from '../../../Assets/images/russia.png';
import germany from '../../../Assets/images/germany.png';
import southAfrica from '../../../Assets/images/south-africa.png';
import pakistan from '../../../Assets/images/pakistan.png';
import bangladesh from '../../../Assets/images/bangladesh.png';
import japan from '../../../Assets/images/japan.png';
import china from '../../../Assets/images/china.png';
import switzerland from '../../../Assets/images/switzerland.png';
import france from '../../../Assets/images/france.png';
const{Option}=Select;

const MALE='m';
const FEMALE='f';
const OTHER='o';

class PatientDetailsDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile_number: '',
            name: '',
            gender: '',
            date_of_birth: '',
            treatment: '',
            severity: '',
            condition: '',
            prefix:"91"
        };
    }

    componentDidMount() {


    }


    getGenderOptions = () => {
        const genderes = [
          { name: "Female", value: "f" },
          { name: "Male", value: "m" },
          { name: "Other", value: "o" }
        ];
        let options = [];
    
        for (let id = 0; id < genderes.length; ++id) {
          const { name, value } = genderes[id];
          options.push(
            <Option key={id} value={value} name={name}>
              {name}
            </Option>
          );
        }
        return options;
      };

      setName = e => {
        this.setState({ name: e.target.value });
    };


    setPrefix = value => {
        this.setState({ prefix: value });
    };

    setTreatment = e => {
        this.setState({ treatment: e.target.value });
    };

    setNumber = e => {
        const { value } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.setState({ mobile_number: e.target.value });
        }
      };

    setSeverity = e => {
        this.setState({ severity: e.target.value });
    };

    setCondition = e => {
        this.setState({ condition: e.target.value });
    };

    setGender = value=>() => {
        this.setState({ gender: value });
      };

    setDOB =(date, dateString)=> {

        this.setState({ date_of_birth: date });
      }



    renderAddPatient = () => {

        const {  mobile_number= '', name= '',gender= '',date_of_birth= {},treatment= '',severity= '',condition= '',prefix='' } = this.state;
        const prefixSelector = (

            <Select className="flex align-center h50 w80"
                value={prefix}
                onChange={this.setPrefix}>
                {/* india */}
                <Option value="91"><div className='flex align-center'><img src={india} className='w16 h16' /> <div className='ml4'>+91</div></div></Option>
                {/* australia */}
                <Option value="61"><div className='flex align-center'><img src={australia} className='w16 h16' /> <div className='ml4'>+61</div></div></Option>
                {/* us */}
                <Option value="1"><div className='flex align-center'><img src={us} className='w16 h16' /> <div className='ml4'>+1</div></div></Option>
                {/* uk */}
                <Option value="44"><div className='flex align-center'><img src={uk} className='w16 h16' /> <div className='ml4'>+44</div></div></Option>
                {/* china */}
                <Option value="86"><div className='flex align-center'><img src={china} className='w16 h16' /> <div className='ml4'>+86</div></div></Option>
                {/* japan */}
                <Option value="81"><div className='flex align-center'><img src={japan} className='w16 h16' /> <div className='ml4'>+81</div></div></Option>
                {/* germany */}
                <Option value="49"><div className='flex align-center'><img src={germany} className='w16 h16' /> <div className='ml4'>+49</div></div></Option>
                {/* france */}
                <Option value="33"><div className='flex align-center'><img src={france} className='w16 h16' /> <div className='ml4'>+33</div></div></Option>
                {/* switzerland */}
                <Option value="41"><div className='flex align-center'><img src={switzerland} className='w16 h16' /> <div className='ml4'>+41</div></div></Option>

                {/* russia */}
                <Option value="7"><div className='flex align-center'><img src={russia} className='w16 h16' /> <div className='ml4'>+7</div></div></Option>
                {/* south africa */}
                <Option value="27"><div className='flex align-center'><img src={southAfrica} className='w16 h16' /> <div className='ml4'>+27</div></div></Option>
                {/* pakistan */}
                <Option value="92"><div className='flex align-center'><img src={pakistan} className='w16 h16' /> <div className='ml4'>+92</div></div></Option>
                {/* bangladesh */}
                <Option value="880"><div className='flex align-center'><img src={bangladesh} className='w16 h16' /> <div className='ml4'>+880</div></div></Option>
            </Select>
        );
       
        return (
            <div className='form-block-ap'>
                <div className='form-headings flex align-center justify-start'>Phone number<div className="star-red">*</div></div>
                <Input
                    addonBefore={prefixSelector}
                    className={"form-inputs-ap"}
                    placeholder="Phone number"
                    maxLength={10}
                    value={mobile_number}
                    onChange={this.setNumber}
                />
                <div className='form-headings-ap mt18'>Name</div>
                <Input
                    placeholder="Name"
                    value={name}
                    className={"form-inputs-ap"}
                    onChange={this.setName}
                />
                <div className='form-headings-ap'>Gender</div>
                 <div className='wp100 mt6 mb18 flex justify-space-between'>
                     <div className={gender===MALE?'gender-selected':'gender-unselected'} onClick={this.setGender(MALE)}>M</div>
                     
                     <div className={gender===FEMALE?'gender-selected':'gender-unselected'} onClick={this.setGender(FEMALE)}>F</div>
                     
                     <div className={gender===OTHER?'gender-selected':'gender-unselected'} onClick={this.setGender(OTHER)}>O</div>
                 </div>

                <div className='form-headings-ap flex align-center justify-start'>DOB<div className="star-red">*</div></div>
                <DatePicker className='form-inputs-ap' onChange={this.setDOB} placeholder='Select DOB'/>

                <div className='form-category-headings-ap'>Care Plan</div>

                <div className='form-headings-ap flex align-center justify-start'>Treatment<div className="star-red">*</div></div>
                <Input
                    className={"form-inputs-ap"}
                    placeholder="Treatment"
                    value={treatment}
                    onChange={this.setTreatment}
                />
                <div className='form-headings-ap mt18 flex align-center justify-start'>Severity<div className="star-red">*</div></div>
                <Input
                    placeholder="Severity"
                    value={severity}
                    className={"form-inputs-ap"}
                    onChange={this.setSeverity}
                />
                    <div className='form-headings-ap mt18 flex align-center justify-start'>Condition<div className="star-red">*</div></div>
                <Input
                    placeholder="Condition"
                    value={condition}
                    className={"form-inputs-ap"}
                    onChange={this.setCondition}
                />
            </div>
        );

    }


   validateData=()=>{
    const{   mobile_number= '',name= '',gender= '',date_of_birth= '',treatment= '',severity= '',condition= '',prefix=''}=this.state;
    if (!prefix) {
        message.error('Please select a prefix.')
        return false;
    } else if (mobile_number.length < 10|| !mobile_number) {
        message.error('Please enter valid mobile number.')
        return false;
    } else if (!date_of_birth) {
        message.error('Please select  Date of Birth .')
        return false;
    }
    else if (!treatment) {
        message.error('Please enter a treatment.')
        return false;
    }
    else if (!severity) {
        message.error('Please enter a severity.')
        return false;
    }
    else if (!condition) {
        message.error('Please enter a condition.')
        return false;
    }
    return true;
   }

    onSubmit = ()=>{
        const{   mobile_number= '',name= '',gender= '',date_of_birth= '',treatment= '',severity= '',condition= '',prefix=''}=this.state;
   const validate=this.validateData();
   const{submit}=this.props;
   if(validate){
    submit({ mobile_number,name,gender,date_of_birth,treatment,severity,condition,prefix})
   }
    }



    formatMessage = data => this.props.intl.formatMessage(data);

    onClose = () => {
        const { close } = this.props;
        close();
    };

    render() {
        console.log("STATEEEEEEE",this.state);
        const { visible } = this.props;
        const { onClose,renderAddPatient } = this;

        if (visible !== true) {
            return null;
        }
        return (
            <Fragment>
                <Drawer
                  title="Add Patient"
                    placement="right"
                    // closable={false}
                    onClose={onClose}
                    visible={visible} // todo: change as per state, -- WIP --
                    width={400}
                >
               {renderAddPatient()}
               <div className='add-patient-footer'>
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.onSubmit} type="primary">
              Submit
            </Button>
          </div>
                </Drawer>

            </Fragment>
        );
    }
}

export default injectIntl(PatientDetailsDrawer);
