import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone } from "@ant-design/icons";
import uuid from 'react-uuid';
import { Tabs, Button, Steps, Col, Select, Input, InputNumber, Upload, Modal, TimePicker, Icon, message } from "antd";
import SideMenu from "./sidebar";
import { REQUEST_TYPE, PATH } from '../../constant';
import UploadSteps from './steps';
import { getUploadURL } from '../../Helper/urls/user';
import { doRequest } from '../../Helper/network';
import plus from '../../Assets/images/plus.png';
import { withRouter } from "react-router-dom";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';



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
            prefix: '',
            profile_pic: '',
            profile_pic_url: '',
            loading: ''
        };
    }

    componentDidMount = async () => {

        this.fetchData();
    }

    fetchData = async () => {
        const { authenticated_user = {}, getDoctorProfileRegisterData } = this.props;

        const { basic_info: { id = 1 } = {} } = authenticated_user;

        await getDoctorProfileRegisterData(id);

        const { onBoarding = {} } = this.props;
        const { profileData: { name = "", email = "", mobile_number = '', category = '', city = '', prefix = '', profile_pic = '' } = {} } = onBoarding || {};
        this.setState({ name, email, mobile_number, category, city, prefix, profile_pic_url_saved: profile_pic });
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

    setCity = address => {
        this.setState({ city:address.definition });
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


        console.log('FILEEE IN CUSTOM REQUESTTTT', file);
        let data = new FormData();
        data.append("files", file, file.name);
        doRequest({
            method: REQUEST_TYPE.POST,
            data: data,
            url: getUploadURL()
        }).then(response => {
            console.log('RESPONSEEEEEEEEEEE!@!@!@!@!@!@!@!@', response);
            if (response.status) {
                let { files = [] } = response.payload.data;
                this.setState({ profile_pic_url: files[0] })
            } else {
                message.error('Something went wrong.')
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

    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
    }


    handleChange = info => {
        console.log('HANDLE CHANGE CALLED', info);
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

    validateEmail = email => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    validateData = () => {
        let { name = '', email = '', mobile_number = '', category = '', city = '', prefix = '', profile_pic_url = '', profile_pic_url_saved = '' } = this.state;

        if (!category) {
            message.error('Please select a Profile type.')
            return false;
        } else if (!profile_pic_url && !profile_pic_url_saved) {
            message.error('Please select a Profile picture.')
            return false;
        } else if (!name) {
            message.error('Please enter your name.')
            return false;
        } else if (!prefix) {
            message.error('Please select a prefix.')
            return false;
        } else if (mobile_number.length < 10) {
            message.error('Please enter valid mobile number.')
            return false;
        } else if (!this.validateEmail(email)) {
            message.error('Please enter a valid email address.')
            return false;
        } else if (!city) {
            message.error('Please enter a city.')
            return false;
        }
        return true;
    }

    onNextClick = () => {
        const { history, authenticated_user } = this.props;
        const { basic_info: { id = 1 } = {} } = authenticated_user || {};
        console.log('ONCLICKKKKKK', authenticated_user);
        const validate = this.validateData();
        if (validate) {
            const { name = '', email = '', mobile_number = '', category = '', city = '', prefix = '', profile_pic_url = '', profile_pic_url_saved = '' } = this.state;
            const data = { name, email, mobile_number, category, city, prefix, profile_pic: profile_pic_url ? profile_pic_url : profile_pic_url_saved };
            const { doctorProfileRegister } = this.props;
            doctorProfileRegister(data, id).then(response => {
                const { status } = response;
                if (status) {
                    history.replace(PATH.REGISTER_QUALIFICATIONS);
                } else {
                    message.error('Something went wrong');
                }
            });
        }
    }

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    renderProfileForm = () => {

        let { name = '', email = '', mobile_number = '', category = '', city = '', prefix = '', profile_pic_url_saved = '' } = this.state;
        const prefixSelector = (

            <Select className="flex align-center h50 w70"
                value={prefix}
                onChange={this.setPrefix}>
                {/* india */}
                <Option value="91"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+91</div></div></Option>
                {/* australia */}
                <Option value="61"><div className='flex align-center'><Icon type="flag" theme="filled" /> <div className='ml4'>+61</div></div></Option>
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
                <img src={plus} className={"w22 h22"} />
            </div>
        );
        const { profile_pic } = this.state;
        return (
            <div className='form-block'>
                <div className='form-headings'>Profile Type</div>
                <Select className='form-inputs' onChange={this.setCategory} value={category} disabled={true}>
                    {this.getCategoryOptions()}
                </Select>
                <div className='form-headings mb6'>Profile Picture</div>
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
                <div className='form-headings mt18'>Name</div>
                <Input
                    placeholder="Name"
                    value={name}
                    className={"form-inputs"}
                    onChange={this.setName}
                />

                <div className='form-headings'>Phone number</div>
                <Input
                    addonBefore={prefixSelector}
                    className={"form-inputs"}
                    placeholder="Phone number"
                    maxLength={10}
                    value={mobile_number}
                    onChange={this.setNumber}
                />

                <div className='form-headings'>Email</div>
                <Input
                    placeholder="Email"
                    value={email}
                    disabled={true}
                    className={"form-inputs"}
                    onChange={this.setEmail}
                />

                <div className='form-headings'>City</div>
                <GooglePlacesAutocomplete
                    inputClassName={'form-inputs-google'}
                    // ref={(instance) => { this.GooglePlacesRef = instance }}
                    renderInput={(props) => (
                        <Input
                            className="form-inputs"
                            value={city}
                            // Custom properties
                            {...props}
                        />
                    )}
                    //    inputStyle={{height:50,width:261,border:1,borderColor:'#d7d7d7'}}


                    placeholder={city?city:'Search Address...'}
                    initialValue={city?city:null}
                    onSelect={({ description }) => (
                        this.setState({ city: description })
                      )}
                />

            </div>
        );
    }

    render() {
        console.log("STATEEEEEEEEEEE", this.state);
        return (
            <Fragment>
                {/* <SideMenu {...this.props} /> */}
                <div className='registration-container'>
                    <div className='header'>Create your Profile</div>
                    <div className='registration-body'>
                        <div className='flex mt36'>
                            <UploadSteps  current={0} />
                        </div>
                        <div className='flex'>
                            {this.renderProfileForm()}
                        </div>
                    </div>
                    <div className='footer'>
                        <div className={'footer-text-inactive'} >
                            Back
                      </div>

                        <div className={'footer-text-active'} onClick={this.onNextClick}>Next</div></div>
                </div>
            </Fragment>
        );
    }
}
export default withRouter(injectIntl(Profileregister));