import React, {Component, Fragment} from "react";
import {injectIntl} from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone } from "@ant-design/icons";
import uuid from 'react-uuid';
import {Tabs, Button,Steps,Col,Select,Input,Upload, Modal,TimePicker,Icon,message } from "antd";
import SideMenu from "./sidebar";
import {REQUEST_TYPE} from '../../constant';
import {getUploadURL} from '../../Helper/urls/user';
import {doRequest} from '../../Helper/network';
import plus from '../../Assets/images/plus.png';



const { Option } = Select;

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

class Profileregister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            email:"",
            mobile_number:'',
            category:'',
            city:'',
            prefix:'',
            profile_pic:'',
            profile_pic_url:'',
            loading:''
        };
    }


    setName = e => {
        this.setState({ name: e.target.value });
    };

    setCategory = value => {
        this.setState({ category: value });
    };

    setPrefix = value => {
        this.setState({ prefix: value });
    };

    setEmail = e => {
        this.setState({ email: e.target.value });
    };

    setNumber = e => {
        this.setState({ mobile_number: e.target.value });
    };

    setCity = e => {
        this.setState({ city: e.target.value });
    };

    getCategoryOptions = () => {
        const genderes = [
            { name: "Doctor", value: "doctor" },
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
    uploadDp = file => {
        

        console.log('FILEEE IN CUSTOM REQUESTTTT',file);
        let data = new FormData();
        data.append("files", file, file.name);
        doRequest({
        
          method: REQUEST_TYPE.POST,
          data: data,
          url: getUploadURL()
        }).then(response => {
            console.log('RESPONSEEEEEEEEEEE!@!@!@!@!@!@!@!@',response,'             ',response.payload.data.files[0]);
            let{files=[]}=response.payload.data;
            this.setState({profile_pic_url:files[0]})
        });
        // file.status='done';
        // return file;
        // const { profile_pic } = this.state;
        // setTimeout(() => {
            
        //     profile_pic.status='done'
            
        // },100);
       
    
        return {
          abort() {}
        };
      };

    beforeUpload=(file) =>{
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      }

    
    handleChange = info => {
        console.log('HANDLE CHANGE CALLED',info);
        // if (info.file.status === 'uploading') {
        //   this.setState({ loading: true });
        //   return;
        // }
        // if (info.file.status === 'done') {
          // Get this url from response in real world.
        //   let {file={}}=info;
         
          this.getBase64(info.file.originFileObj, profile_pic =>
            this.setState({
              profile_pic,
              loading: false,
            }),
          );
        };

    validateEmail = email=> {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }
    validateData=()=>{
        let{  name='',email='',mobile_number='',category='',city='',prefix='',profile_pic_url=''}=this.state;
       
        if(!category){
            message.error('Please select a Profile type.')
            return false;
        }else if(!profile_pic_url){
            message.error('Please select a Profile picture.')
            return false;
        }else  if(!name){
            message.error('Please enter your name.')
            return false;
        }else if(!prefix){
            message.error('Please select a prefix.')
            return false;
        }else if(mobile_number.length<10){
            message.error('Please enter valid mobile number.')
            return false;
        }else if(!this.validateEmail(email)){
            message.error('Please enter a valid email address.')
            return false;
        }else if(!city){
            message.error('Please enter a city.')
            return false;
        }
        return true;
    }    

    onNextClick = () =>{
        console.log('ONCLICKKKKKK');
        const validate=this.validateData();
        if(validate){
            const{  name='',email='',mobile_number='',category='',city='',prefix='',profile_pic_url=''}=this.state;
                const data = { user_id:4, name,email,mobile_number,category,city,prefix,profile_pic:profile_pic_url};
                const{doctorProfileRegister}=this.props;
                doctorProfileRegister(data);
        }
        }

        getBase64=(img, callback)=> {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(img);
          }

    renderProfileForm=()=>{
        const prefixSelector  =(
          
            <Select className="flex align-center h50 w70"
            onChange={this.setPrefix}>
                {/* australia */}
                <Option value="61"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+61</div></div></Option>
                {/* india */}
                <Option value="91"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+91</div></div></Option>
                {/* us */}
                <Option value="1"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+1</div></div></Option>
                {/* uk */}
                <Option value="44"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+44</div></div></Option>
                {/* china */}
                <Option value="86"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+86</div></div></Option>
                {/* japan */}
                <Option value="81"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+81</div></div></Option>
                {/* germany */}
                <Option value="49"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+49</div></div></Option>
                {/* france */}
                <Option value="33"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+33</div></div></Option>
                {/* switzerland */}
                <Option value="41"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+41</div></div></Option>
                
                {/* russia */}
                <Option value="7"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+7</div></div></Option>
                {/* south africa */}
                <Option value="27"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+27</div></div></Option>
                {/* pakistan */}
                <Option value="92"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+92</div></div></Option>
                {/* bangladesh */}
                <Option value="880"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+880</div></div></Option>
            </Select>
        );
        const uploadButton = (
            <div>
              <img src= {plus} className={"w22 h22"}/>
            </div>
          );
          const { profile_pic } = this.state;
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
                 action={this.uploadDp}
                 beforeUpload={this.beforeUpload}
                 onChange={this.handleChange}
                  >
        {profile_pic ? <img src={profile_pic} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
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
                            maxLength={10}
                            className={"form-inputs"}
                            onChange={this.setNumber}
                        />

             <div className='form-headings'>Email</div>
                 <Input
                    placeholder="Email"
                    className={"form-inputs"}
                    onChange={this.setEmail}
                 />

            <div className='form-headings'>City</div>
                <Input
                    placeholder="City"
                    className={"form-inputs"}
                    onChange={this.setCity}
                 />

            </div>
        );
    }

    render(){
        console.log("STATEEEEEEEEEEE",this.state);
              return (
            <Fragment>
                <SideMenu {...this.props} />
                <div className='registration-container'>
                <div className='header'>Create your Profile</div>
                <div className= 'registration-body'>
             <div className='flex'>
                        <UploadSteps className="mt24" current={0} />
                    </div>
                  <div className='flex'>
                 {this.renderProfileForm()}
                  </div>
                    </div>
                  <div className='footer'>
                  <div className={'footer-text-inactive'} >
                      {/* Back */}
                      </div> 
                  <div className={'footer-text-active'} onClick={this.onNextClick}>Next</div></div>  
                    </div>
            </Fragment>
        );
    }
}
export default injectIntl(Profileregister);