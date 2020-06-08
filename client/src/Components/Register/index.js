import React, {Component, Fragment} from "react";
import {injectIntl} from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone } from "@ant-design/icons";
import uuid from 'react-uuid';
import {Tabs, Button,Steps,Col,Select,Input,Upload, Modal } from "antd";
import SideMenu from "./sidebar";

const { Step } = Steps;

const { Option } = Select;
const SUMMARY = "Summary";
const WATCHLIST = "Watch list";

const UploadSteps = ({ current, className }) => {
    const { Step } = Steps;
    return (
        <Steps className={`ml64 mr64 wa ${className}`}  current={current} direction="vertical">
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
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
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
            education:{},
            educationKeys:[],
            step:0
        };
    }

    componentDidMount() {
    
        let key=uuid();
        
        let education={};
        education[key]= {degree:"",college:"",year:"",photo:[]};
        let educationKeys = [key];
        this.setState({education,educationKeys});
    }

    getBase64=(img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }

      getBase64file=(file)=> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
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

      addEducation=()=>{
        let key=uuid();
        let{education={},educationKeys=[]}=this.state;
        let newEducation=education;
        let newEducationKeys=educationKeys;
        newEducation[key] = {degree:"",college:"",year:"",photo:[]};
        newEducationKeys.push(key);
        console.log("NEWWWWWWWWWW AFTER ADDDDD",key,newEducation[key],newEducationKeys);
        this.setState({education:newEducation,educationKeys:newEducationKeys});
      }

      handleCancel = () => this.setState({ previewVisible: false });

      deleteEducation=(key)=>()=>{
          let{education={},educationKeys=[]}=this.state;
          let newEducation=education;
          let newEducationKeys=educationKeys;
          delete newEducation[key];
          newEducationKeys.splice(newEducationKeys.indexOf(key),1);
          this.setState({education:newEducation,educationKeys:newEducationKeys});
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

      handleChangeList = key=> ({fileList}) =>{
          console.log('FILE LISTTTTTTTT',fileList,key);

          let{education={}}=this.state;
          let newEducation=education;
          newEducation[key].photo=fileList;
        this.setState({ education:newEducation });
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

    setDegree = (key,e)=>{
        let{education={}}=this.state;
        let newEducation=education;
        newEducation[key].degree=e.target.value;
        this.setState({education:newEducation});
    }
    setCollege = (key,e)=>{
        let{education={}}=this.state;
        let newEducation=education;
        newEducation[key].college = e.target.value;
        this.setState({education:newEducation});
    }
    setYear = (key,e)=>{
        let{education={}}=this.state;
        let newEducation=education;
        newEducation[key].year = e.target.value;
        this.setState({education:newEducation});
    }

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

    handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await this.getBase64file(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
          previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
      };


      onUploadComplete = ({ files = [] }) => {
        const { handleComplete} = this.props;
       
        const { docs } = this.state;
        this.setState({ docs: [...docs, ...files] }, () => {
          const { docs, fileList } = this.state;
          if (docs.length === fileList.length) {
            this.setState({
              fileList: [],
              docs: []
            });
            handleComplete(docs);
          }
        });
      };

      customRequest = ({ file, filename, onError, onProgress, onSuccess }) => {
        const { onUploadComplete } = this;
    
        let data = new FormData();
        data.append("files", file, file.name);
    
        doRequest({
          onUploadProgress: onUploadProgress,
          method: REQUEST_TYPE.POST,
          data: data,
          url: Common.getUploadURL()
        }).then(response => {
          onUploadComplete(response.payload.data);
        });
    
        return {
          abort() {}
        };
      };

   
    renderEducation=()=>{
        console.log("Render Education is ==============> 23829823 ===========>  ", this.state);
        let{education={},educationKeys=[],fileList=[]}=this.state;
        console.log(" 23829823  ------------------>  ", JSON.stringify(education, null, 4));
        console.log(" 23829823 Keys  ------------------>  ", educationKeys);

        const uploadButton = (
            <div>
              Upload
            </div>
          );
        return(
            <div className='flex direction-column'>
           {educationKeys.map(key=>{
            let{photo=[]}=education[key];
                return(
                    
                    <div key={key}>
                       {educationKeys.indexOf(key)>0 ? (
                       <div className='wp100 flex justify-end'>
                       <DeleteTwoTone
                                className={"pointer align-self-end"}
                                onClick={this.deleteEducation(key)}
                                twoToneColor="#cc0000"
                            />
                       </div>
                            ):null}
              <div className='form-headings'>Degree</div>
                    <Input
                       placeholder="Degree"
                       className={"form-inputs"}
                       onChange={e=>this.setDegree(key,e)}
                    />
              <div className='form-headings'>College</div>
                 <Input
                    placeholder="College"
                    className={"form-inputs"}
                    onChange={e=>this.setCollege(key,e)}
                 />
              <div className='form-headings'>Year</div>
                 <Input
                    placeholder="Year"
                    className={"form-inputs"}
                    onChange={e=>this.setYear(key,e)}
                 />
                  <div className='form-headings'>Photo</div>
                  <div className='qualification-photo-uploads'>
                  <Upload
                //   action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  multiple={true}
                     listType="picture-card"
                     className="avatar-uploader"
                     showUploadList={false}
                     fileList={photo}
                     customRequest={customRequest}
                     onChange={this.handleChangeList(key,fileList)}
                       >
                  {uploadButton}
                </Upload>
                </div>
                </div>
                );
            })
        }
            </div>
        );

    }

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
            
            <div className='form-category-headings'>Education</div>
            <div className='pointer align-self-end wp60 fs16 medium tar' onClick={this.addEducation}>Add Education</div>
            {this.renderEducation()}
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
        // console.log("19273 here --> dashboard",this.state);
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
                  <div className={step>0?'footer-text-active':'footer-text-inactive'} onClick={step!=0?this.onBackClick:null}>Back</div> 
                  <div className={step<2?'footer-text-active':'footer-text-inactive'} onClick={step<2?this.onNextClick:null}>Next</div></div>  
                    </div>
            </Fragment>
        );
    }
}

export default injectIntl(Register);
