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

class ClinicRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinics:{},
            clinicsKeys:[]
        };
    }

    componentDidMount() {
    
        let key1=uuid();
    

        let clinics={};
        clinics[key1]= {name:"",location:"",startTime:{},endTime:{}};
        let clinicsKeys = [key1];
        this.setState({clinics,clinicsKeys});
      
    }


  
    setClinicName = (key,e)=>{
        let{clinics={}}=this.state;
        let newClinics=clinics;
        newClinics[key].name = e.target.value;
        this.setState({clinics:newClinics});
    }

    setClinicLocation = (key,e)=>{
        let{clinics={}}=this.state;
        let newClinics=clinics;
        newClinics[key].location = e.target.value;
        this.setState({clinics:newClinics});
    }

    setClinicStartTime = key=>(time, timeString)=>{
        console.log('TIMEEEEEEEEEEEEEEEEEEE',key,time,timeString)
        let{clinics={}}=this.state;
        let newClinics=clinics;
        newClinics[key].startTime = time;
        this.setState({clinics:newClinics});
    }

    setClinicEndTime = key=>(time, timeString)=>{
        console.log('TIMEEEEEEEEEEEEEEEEEEEENDDDDD',key,time,timeString)
        let{clinics={}}=this.state;
        let newClinics=clinics;
        console.log('TIMEEEEEEEEEEEEEEEEEEEENDDDDD22222',clinics,newClinics[key]);
        newClinics[key].endTime = time;
        this.setState({clinics:newClinics});
    }

    addClinic=()=>{
        let key=uuid();
        let{clinics={},clinicsKeys=[]}=this.state;
        let newClinics=clinics;
        let newclinicsKeys=clinicsKeys;
        newClinics[key] = {name:"",location:"",startTime:"",endTime:''};
        newclinicsKeys.push(key);
        // console.log("NEWWWWWWWWWW AFTER ADDDDD",key,newClinics[key],newclinicsKeys);
        this.setState({clinics:newClinics,clinicsKeys:newclinicsKeys});
      }

    deleteClinic=(key)=>()=>{
        let{clinics={},clinicsKeys=[]}=this.state;
        let newClinics=clinics;
        let newclinicsKeys=clinicsKeys;
        delete newClinics[key];
        newclinicsKeys.splice(newclinicsKeys.indexOf(key),1);
        this.setState({clinics:newClinics,clinicsKeys:newclinicsKeys});
      }

    renderClinics=()=>{
        console.log("Render Education is ==============> 23829823 ===========>  ", this.state);
        let{clinics={},clinicsKeys=[]}=this.state;
        console.log(" 23829823  ------------------>  ", JSON.stringify(clinics, null, 4));
        console.log(" 23829823 Keys  ------------------>  ", clinicsKeys);

        const uploadButton = (
            <div>
              Upload
            </div>
          );
        return(
            <div className='flex direction-column'>
           {clinicsKeys.map(key=>{
                return(
                    
                    <div key={key}>
                       {clinicsKeys.indexOf(key)>0 ? (
                       <div className='wp100 flex justify-end'>
                       <DeleteTwoTone
                                className={"pointer align-self-end"}
                                onClick={this.deleteClinic(key)}
                                twoToneColor="#cc0000"
                            />
                       </div>
                            ):null}
              <div className='form-headings'>Name</div>
                    <Input
                       placeholder="Clinic name"
                       className={"form-inputs"}
                       onChange={e=>this.setClinicName(key,e)}
                    />
              <div className='form-headings'>Location</div>
                 <Input
                    placeholder="Location"
                    className={"form-inputs"}
                    onChange={e=>this.setClinicLocation(key,e)}
                 />
                 <div className='flex justify-space-between mb10'>
                 <div className='flex direction-column'>
              <div className='form-headings'>Start Time</div>
              <TimePicker onChange={this.setClinicStartTime(key)}/>
              </div>
              <div className='flex direction-column'>
              <div className='form-headings'>End Time</div>
              <TimePicker onChange={this.setClinicEndTime(key)}/>
              </div>
              </div>
                  </div>
                );
            })
        }
            </div>
        );

    }

    renderClinicForm=()=>{
            return(
                <div className='form-block'>
                 <div className='form-category-headings'>Clinic</div>
                <div className='pointer align-self-end wp60 fs16 medium tar' onClick={this.addClinic}>Add More</div>
                {this.renderClinics()}
                </div>
            );
        }


        onNextClick = () =>{
            console.log('ONCLICKKKKKK');
            // const validate=this.validateData();
            // if(validate){
                const{ clinics={}}=this.state;
                let newClinics=Object.values(clinics);
                    const data = { user_id:4,clinics:newClinics };
                    const{doctorClinicRegister}=this.props;
                    doctorClinicRegister(data);
            // }
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
                 {this.renderClinicForm()}
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
export default injectIntl(ClinicRegister);