import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Tabs, Button, Steps, Col, Select, Input, InputNumber, Upload, Modal, TimePicker, Icon, message } from "antd";
import SideMenu from "./sidebar";
import { REQUEST_TYPE, PATH,USER_CATEGORY } from '../../constant';
import UploadSteps from './steps';
import { getUploadURL } from '../../Helper/urls/user';
import { doRequest } from '../../Helper/network';
import plus from '../../Assets/images/plus.png';
import { withRouter } from "react-router-dom";
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import india from '../../Assets/images/india.png';
import australia from '../../Assets/images/australia.png';
import us from '../../Assets/images/flag.png';
import uk from '../../Assets/images/uk.png';
import russia from '../../Assets/images/russia.png';
import germany from '../../Assets/images/germany.png';
import southAfrica from '../../Assets/images/south-africa.png';
import pakistan from '../../Assets/images/pakistan.png';
import bangladesh from '../../Assets/images/bangladesh.png';
import japan from '../../Assets/images/japan.png';
import china from '../../Assets/images/china.png';
import switzerland from '../../Assets/images/switzerland.png';
import france from '../../Assets/images/france.png';
import messages from "./messages";



const { Option } = Select;


class Profileregister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            mobile_number: '',
            category: '',
            city: '',
            prefix: '91',
            profile_pic: '',
            profile_pic_url: '',
            signature_pic : '',
            signature_pic_url : '',
            signature_pic_url_saved : '',
            loading: ''
        };
    }

    componentDidMount = async () => {

        this.fetchData();
    }

    fetchData = async () => {
        const { authenticated_user = '',authenticated_category = '', users, getDoctorQualificationRegisterData } = this.props;

        const { basic_info: { id = 1 } = {} } = authenticated_user;

        const url = window.location.href.split("/");

        let doctor_id=url.length > 4 ? url[url.length - 1] : "";

      
        const { doctors } = this.props;

        const doctor_user_category = USER_CATEGORY.DOCTOR; 

        const { basic_info: { email = '', mobile_number = '', prefix: newPrefix = '' } = {}, category = '' } = users[authenticated_user] || {};

        await getDoctorQualificationRegisterData();

        this.setState({category : doctor_user_category});
        if(authenticated_category === USER_CATEGORY.DOCTOR){
            this.setState({ email, mobile_number, category : doctor_user_category, prefix: newPrefix ? newPrefix : '91' });
            for (let doctor of Object.values(doctors)) {
                const { basic_info: { user_id = 0, first_name = '', middle_name = '', last_name = '', profile_pic = '',signature_pic='', address = '' } } = doctor;
                if (parseInt(user_id) === parseInt(authenticated_user)) {
                    let name = first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ""}${last_name ? `${last_name} ` : ""}` : '';
                    this.setState({ name, city: address, profile_pic_url_saved: profile_pic, profile_pic, signature_pic_url_saved : signature_pic , signature_pic});
                }
    
            }
        }else if(authenticated_category === USER_CATEGORY.PROVIDER && doctor_id !== '' ){
            const { basic_info: { user_id = 0, first_name = '', middle_name = '', last_name = '', profile_pic = '',signature_pic='', city = '' } = {} } = doctors[doctor_id] || {};

            const { basic_info: { email = '', mobile_number = '', prefix: newPrefix = '' } = {}, category = '' } = users[user_id] || {};

            this.setState({ email, mobile_number, category : doctor_user_category, prefix: newPrefix ? newPrefix : '91' });
   
           
                let name = first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ""}${last_name ? `${last_name} ` : ""}` : '';
                this.setState({ name, city, profile_pic_url_saved: profile_pic, profile_pic, signature_pic_url_saved : signature_pic , signature_pic});
            
    
            

        }
        
        // const { profileData: { name = "", email = "", mobile_number = '', category = '', city = '', prefix = '', profile_pic = '' } = {} } = onBoarding || {};

    }

    setName = e => {
        // this.setState({ name: e.target.value });
        const { value } = e.target;
        const reg = /^[a-zA-Z][a-zA-Z\s]*$/;
        if (reg.test(value) || value === '') {
            this.setState({ name: e.target.value });
        }
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



    formatMessage = data => this.props.intl.formatMessage(data);

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
        let data = new FormData();
        data.append("files", file, file.name);
        doRequest({
            method: REQUEST_TYPE.POST,
            data: data,
            url: getUploadURL()
        }).then(response => {
            if (response.status) {
                let { files = [] } = response.payload.data;
                this.setState({ profile_pic_url: files[0] })
            } else {
                message.error(this.formatMessage(messages.somethingWentWrong))
            }
        });
        // file.status='done';
        // return file;
        // const { profile_pic } = this.state;
        // setTimeout(() => {

        //     profile_pic.status='done'

        // },100);


        return {
            abort() { }
        };
    };


    uploadSignature = file => {
        let data = new FormData();
        data.append("files", file, file.name);
        doRequest({
            method: REQUEST_TYPE.POST,
            data: data,
            url: getUploadURL()
        }).then(response => {
            if (response.status) {
                let { files = [] } = response.payload.data;
                this.setState({ signature_pic_url: files[0] })
            } else {
                message.error(this.formatMessage(messages.somethingWentWrong))
            }
        });
        
        return {
            abort() { }
        };
    }



    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error(this.formatMessage(messages.imageTypeError));
        }
        return isJpgOrPng;
    }


    handleChange = info => {
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
            })
        );
    };


    handleSignatureUploadChange = info => {
        this.getBase64(info.file.originFileObj, signature_pic =>
            this.setState({
                signature_pic,
                loading: false,
            })
        );
    }

    validateEmail = email => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validateData = () => {
        let { name = '', email = '', mobile_number = '', category = '', city = '', prefix = '', profile_pic_url = '', profile_pic_url_saved = '' , signature_pic_url = '', signature_pic_url_saved = '' } = this.state;

        if (!category) {
            message.error(this.formatMessage(messages.profileTypeError))
            return false;
        } else if (!profile_pic_url && !profile_pic_url_saved) {
            message.error(this.formatMessage(messages.profilePicError))
            return false;
        }else if (!signature_pic_url && !signature_pic_url_saved) {
            message.error(this.formatMessage(messages.signaturePicError))
            return false;
        }else if (!name) {
            message.error(this.formatMessage(messages.nameError))
            return false;
        } else if (!prefix) {
            message.error(this.formatMessage(messages.prefixError))
            return false;
        } else if (mobile_number && mobile_number.length < 6 || !mobile_number) {
            message.error(this.formatMessage(messages.mobNoError))
            return false;
        } else if (!email || !this.validateEmail(email)) {
            message.error(this.formatMessage(messages.emailError))
            return false;
        } else if (!city) {
            message.error(this.formatMessage(messages.cityError))
            return false;
        }
        return true;
    }

    onNextClick = () => {
        const { history, authenticated_user = 1, users } = this.props;
        // const { basic_info: { id = "" } = {} } = users[authenticated_user] || {};
        const validate = this.validateData();
        if (validate) {
            const { doctorProfileRegister ,authenticated_category = '',} = this.props;
            const { name = '', email = '', mobile_number = '', category = '', city = '', prefix = '', profile_pic_url = '', profile_pic_url_saved = '' , signature_pic_url ='',signature_pic_url_saved ='' } = this.state;
            const data = { name, email, mobile_number, category, city, prefix, profile_pic: profile_pic_url ? profile_pic_url : profile_pic_url_saved , signature_pic :  signature_pic_url ? signature_pic_url : signature_pic_url_saved };
            if (authenticated_category === USER_CATEGORY.PROVIDER ){
                data["is_provider"] = true
            } 
            doctorProfileRegister(data).then(response => {
                console.log(" 32453454RESPONSE FOR DOC PROFILE REGISTER ===>",response);
                const { status, statusCode, payload: { data: { doctors : response_doctors = {} } = {} } = {} } = response;
                if (status) {
                    message.success(this.formatMessage(messages.doctorAddSuccess));

                    const {basic_info : {id : doctor_id = null} = {}} = Object.values(response_doctors)[0] || {};
                    if(authenticated_category === USER_CATEGORY.PROVIDER){
                        this.handleSendPasswordMail(doctor_id);
                        history.replace(`${PATH.REGISTER_QUALIFICATIONS}/${doctor_id}`);
                    }
                    else{
                        history.replace(PATH.REGISTER_QUALIFICATIONS);
                    }
                } else {
                    message.error(this.formatMessage(messages.somethingWentWrong));
                }
            });
        }
    }

    async handleSendPasswordMail(doctor_id){
        try {
            // if (data) {     
            const {sendPasswordMail }  = this.props;
            const response = await sendPasswordMail({doctor_id});
            const { status } = response;
            
          } catch (err) {
            console.log("err", err);
            message.warn("Something wen't wrong. Please try again later");
            this.setState({ fetchingSpeciality: false });
          }
        
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    handleChangeCity = address => {

        this.setState({ city: address });

    };

    handleSelect = address => {

        this.setState({ city: address });
    };
    setNumber = e => {
        const { value } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.setState({ mobile_number: e.target.value });
        }
    };

    // '.' at the end or only '-' in the input box.
    onBlur = () => {
        const { value, onBlur, onChange } = this.props;
        let valueTemp = value;
        if (value.charAt(value.length - 1) === '.' || value === '-') {
            valueTemp = value.slice(0, -1);
        }
        onChange(valueTemp.replace(/0*(\d+)/, '$1'));
        if (onBlur) {
            onBlur();
        }
    };

    renderProfileForm = () => {
        let { name = '', email = '', mobile_number = '', category = '', prefix = '', profile_pic_url_saved = '' , signature_pic_url_saved ='' } = this.state;
        const { authenticated_user = '',authenticated_category = '', users, getDoctorQualificationRegisterData } = this.props;
        
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
        const uploadButton = (
            <div>
                <img src={plus} className={"w22 h22"} />
            </div>
        );
        const { profile_pic , signature_pic } = this.state;
        return (
            <div className='form-block'>
                <div className='form-headings'>{this.formatMessage(messages.profileType)}</div>
                <Select className='form-inputs' onChange={this.setCategory} value={category} disabled={true}>
                    {this.getCategoryOptions()}
                </Select>
                <div className='form-headings mb6'>{this.formatMessage(messages.profilePicture)}</div>
                <Upload
                    name="avatar"
                    listType="picture-card"
                    showUploadList={false}
                    action={this.uploadDp}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleChange}
                >
                    {profile_pic ? <img src={profile_pic} alt="avatar" style={{ width: '100%' }} /> : profile_pic_url_saved ? <img src={profile_pic_url_saved} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>


                <div className='form-headings mb6'>{this.formatMessage(messages.signaturePicture)}</div>
                <Upload
                    name="signature_pic"
                    listType="picture-card"
                    showUploadList={false}
                    action={this.uploadSignature}
                    beforeUpload={this.beforeUpload}
                    onChange={this.handleSignatureUploadChange}
                >

                    {signature_pic ? <img src={signature_pic} alt="signature picture" style={{ width: '100%' }} /> : signature_pic_url_saved ? <img src={signature_pic_url_saved} alt="signature picture" style={{ width: '100%' }} /> : uploadButton}
                </Upload>

                <div className='form-headings mt18'>{this.formatMessage(messages.name)}</div>
                <Input
                    placeholder={this.formatMessage(messages.name)}
                    value={name}
                    maxLength={200}
                    className={"form-inputs"}
                    onChange={this.setName}
                />

                <div className='form-headings'>{this.formatMessage(messages.phoneNo)}</div>
                <Input
                    addonBefore={prefixSelector}
                    className={"form-inputs"}
                    placeholder={this.formatMessage(messages.phoneNo)}
                    maxLength={10}
                    value={mobile_number}
                    onChange={this.setNumber}
                />

                <div className='form-headings'>{this.formatMessage(messages.email)}</div>
                <Input
                    placeholder={this.formatMessage(messages.email)}
                    value={email}
                    disabled={authenticated_category === USER_CATEGORY.DOCTOR ?  true : false}
                    className={"form-inputs"}
                    onChange={this.setEmail}
                />

                <div className='form-headings'>{this.formatMessage(messages.city)}</div>
                <PlacesAutocomplete
                    value={this.state.city}
                    onChange={this.handleChangeCity}
                    onSelect={this.handleSelect}
                >
                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                        <div>
                            <Input
                                {...getInputProps({
                                    placeholder: this.formatMessage(messages.searchCity),
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
            </div>
        );
    }

    render() {
        const { authenticated_user = '',authenticated_category = '', users, getDoctorQualificationRegisterData } = this.props;

        return (
            <Fragment>
                {/* <SideMenu {...this.props} /> */}
                <div className='registration-container'>
                    {
                        authenticated_category === USER_CATEGORY.PROVIDER ? 
                        <div className='header'>{this.formatMessage(messages.createDoctorProfile)}</div>
                        :
                        <div className='header'>{this.formatMessage(messages.createProfile)}</div>

                    }
                    <div className='registration-body'>
                        <div className='flex mt36'>
                            <UploadSteps current={0} />
                        </div>
                        <div className='flex mb100'>
                            {this.renderProfileForm()}
                        </div>
                    </div>
                    <div className='footer'>
                        <div className={'footer-text-inactive'} >
                            {this.formatMessage(messages.back)}
                        </div>

                        <div className={'footer-text-active'} onClick={this.onNextClick}>{this.formatMessage(messages.next)}</div></div>
                </div>
            </Fragment>
        );
    }
}
export default withRouter(injectIntl(Profileregister));