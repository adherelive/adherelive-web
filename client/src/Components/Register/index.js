import React, {Component, Fragment} from "react";
import {injectIntl} from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";

import {Tabs, Button,Steps,Col,Select,Input,Upload, Modal } from "antd";
import SideMenu from "./sidebar";

const { Step } = Steps;

const { Option } = Select;
const SUMMARY = "Summary";
const WATCHLIST = "Watch list";

const UploadSteps = ({ current, className }) => {
    const { Step } = Steps;
    return (
        <Steps className={`ml64 mr64 wa ${className}`} current={current} direction="vertical">
            <Step title={"Profile"} />
            <Step title={"Qualifications"} />
            <Step title={"Clinics"} />
        </Steps>
    );
};

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            email:"",
            phone_no:'',
            category:'',
            city:'',
            prefix:'',
            imageUrl:'',
            gender:'',
            speciality:'',
            registrationNumber:'',
            registrationCouncil:'',
            registrationYear:'',
            loading:false,
            step:0
        };
    }

    componentDidMount() {
    
    }

    getBase64=(img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }

      beforeUpload=(file) =>{
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
        //   message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
        //   message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      }


    handleChange = info => {
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );
        }
      };

     
    setName = e => {
        this.setState({ name: e.target.value });
    };

    setSpeciality = e => {
        this.setState({ speciality: e.target.value });
    };

    setRegNo = e => {
        this.setState({ registrationNumber: e.target.value });
    };

    setRegCouncil = e => {
        this.setState({ registrationCouncil: e.target.value });
    };

    setRegYear = e => {
        this.setState({ registrationYear: e.target.value });
    };

    setNumber = e => {
        this.setState({ phone_no: e.target.value });
    };

    setCategory = value => {
        this.setState({ category: value });
    };

    setGender = value => {
        this.setState({ gender: value });
    };

    setCity = e => {
        this.setState({ city: e.target.value });
    };

    setPrefix = value => {
        this.setState({ prefix: value });
    };

    onBackClick = ()=>{
        let{step=0}=this.state;
        step--;
        this.setState({step})
    }
    onNextClick = ()=>{
        let{step=0}=this.state;
        step++;
        this.setState({step})
    }
   
   
    getCategoryOptions = () => {
        const genderes = [
            { name: "Doctor", value: "dactor" },
            { name: "Patient", value: "patient" }
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

    renderProfileForm=()=>{
        const prefixSelector  =(
          
            <Select className="flex align-center h50"
            onChange={this.setPrefix}>
                {/* india */}
                <Option value="91">+91</Option>
                {/* us */}
                <Option value="1">+1</Option>
                {/* uk */}
                <Option value="44">+44</Option>
                {/* china */}
                <Option value="86">+86</Option>
                {/* japan */}
                <Option value="81">+81</Option>
                {/* germany */}
                <Option value="49">+49</Option>
                {/* france */}
                <Option value="33">+33</Option>
                {/* switzerland */}
                <Option value="41">+41</Option>
                {/* australia */}
                <Option value="61">+61</Option>
                {/* russia */}
                <Option value="7">+7</Option>
                {/* south africa */}
                <Option value="27">+27</Option>
                {/* pakistan */}
                <Option value="9, 2">+92</Option>
                {/* bangladesh */}
                <Option value="880">+880</Option>
            </Select>
        );
        const uploadButton = (
            <div>
              Upload
            </div>
          );
          const { imageUrl } = this.state;
        return(
            <div className='form-block'>
             <div className='form-headings'>Profile Type</div>
                <Select className='form-inputs' onChange={this.setCategory}>
                            {this.getCategoryOptions()}
                        </Select>
             <div className='form-headings'>Profile Picture</div>
                <Upload
                     name="avatar"
                     listType="picture-card"
                     className="avatar-uploader"
                     showUploadList={false}
                     action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                     beforeUpload={this.beforeUpload}
                     onChange={this.handleChange}
                       >
                  {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
             <div className='form-headings'>Name</div>
               <Input
                    placeholder="Name"
                    className={"form-inputs"}
                    onChange={this.setName}
                 />

                        <div className='form-headings'>Phone number</div>
                        <Input
                            addonBefore={prefixSelector}
                            placeholder="Phone number"
                            className={"form-inputs"}
                            onChange={this.setNumber}
                        />

             <div className='form-headings'>Email</div>
                 <Input
                    placeholder="email"
                    className={"form-inputs"}
                    onChange={this.email}
                 />

            <div className='form-headings'>City</div>
                <Input
                    placeholder="city"
                    className={"form-inputs"}
                    onChange={this.setCity}
                 />

            </div>
        );
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

    renderQualificationForm=()=>{
        return(
            <div className='form-block'>
                 <div className='form-headings'>Speciality</div>
               <Input
                    placeholder="Speciality"
                    className={"form-inputs"}
                    onChange={this.setSpeciality}
                 />
             <div className='form-headings'>Gender</div>
             <Select className=".form-inputs" onChange={this.setGender}>
                            {this.getGenderOptions()}
                        </Select>
            

             <div className='form-category-headings'>Registration details</div>
             <div className='form-headings'>Registration number</div>
                 <Input
                    placeholder="Registration number"
                    className={"form-inputs"}
                    onChange={this.setRegNo}
                 />

             <div className='form-headings'>Registration council</div>
                 <Input
                    placeholder="Registration council"
                    className={"form-inputs"}
                    onChange={this.setRegCouncil}
                 />

            <div className='form-headings'>Registration year</div>
                 <Input
                    placeholder="Registration year"
                    className={"form-inputs"}
                    onChange={this.setRegYear}
                 />

            </div>
        );
    }

    renderClinicForm=()=>{
        return(
            <div className='form-block'>

            <div className='form-headings'>Speciality</div>
               <Input
                    placeholder="Speciality"
                    className={"form-inputs"}
                    onChange={this.setSpeciality}
                 />
             <div className='form-headings'>Gender</div>
             <Select className=".form-inputs" onChange={this.setGender}>
                            {this.getGenderOptions()}
                        </Select>
             

             <div className='form-headings'>Email</div>
                 <Input
                    placeholder="email"
                    className={"form-inputs"}
                    onChange={this.email}
                 />

            <div className='form-headings'>City</div>
                <Input
                    placeholder="city"
                    className={"form-inputs"}
                    onChange={this.setCity}
                 />

            </div>
        );
    }

    
    // // formatMessage = data => this.props.intl.formatMessage(data);

    

    render() {
        console.log("19273 here --> dashboard",this.state);
        const {graphs} = this.props;
        // const {formatMessage, renderChartTabs} = this;
         const{step}=this.state;

        return (
            <Fragment>
                <SideMenu {...this.props} />
                <div className='registration-container'>
                <div className='header'>Create your Profile</div>
                <div className= 'registration-body'>
             <div className='flex'>
                        <UploadSteps className="mt24" current={step} />
                    </div>
                  <div className='flex'>
                 {step==0?this.renderProfileForm():step==1?this.renderQualificationForm():this.renderClinicForm()}
                  </div>
                    </div>
                  <div className='footer'>
                  <div className={step>0?'footer-text-active':'footer-text-inactive'} onClick={step!=0?this.onBackClick:null}>BACK</div> 
                  <div className={step<2?'footer-text-active':'footer-text-inactive'} onClick={step<2?this.onNextClick:null}>NEXT</div></div>  
                    </div>
            </Fragment>
        );
    }
}

export default injectIntl(Register);
