import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import PatientList from './patientListSideBar';
import TwilioChat from '../../Containers/ChatFullScreen/twilioChat';
import { getPatientConsultingVideoUrl } from '../../Helper/url/patients';
import config from "../../config";
import {getRoomId} from "../../Helper/twilio";


class ChatFullScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorUserId: 1,
            roomId: '',
            patientUserId: 1,
            patientId: 1,
            placeCall: false,
            replyMessadeId:null
        };
    }

    componentDidMount() {

        let { match: {
            params: { patient_id }
        }, doctors = {}, patients = {}, authenticated_user = 1 } = this.props;


        let doctorUserId = '';   //user_id of doctor
        let { basic_info: { user_id: patientUserId = '' } = {} } = patients[patient_id] || {};
        for (let doc of Object.values(doctors)) {
            let { basic_info: { user_id, id = 1 } } = doc;
            if (parseInt(user_id) === parseInt(authenticated_user)) {
                doctorUserId = user_id;
            }
        }

        const roomId = getRoomId(doctorUserId, patientUserId);

        this.setState({ doctorUserId, roomId, patientUserId: patientUserId, patientId: patient_id });
    }

<<<<<<< HEAD
    updateReplyMessageId = (newId=null) => {
        const {replyMessadeId : currentId} = this.state;

        if(currentId !== newId && newId === null && currentId !== null){ 
=======
    updateReplyMessadeId = (newId='') => {
        
        const {replyMessadeId : currentId} = this.state;

        if(currentId !== newId && newId === '' && currentId !== ''){ 
>>>>>>> 752c9b9deacacdde1dd0d63335ec8c67c81ef8af
            this.setState({
                replyMessadeId:newId
            });

<<<<<<< HEAD
        }else if(currentId !== newId && newId !== null && currentId === null ){  
=======
        }else if(currentId !== newId && newId !== '' && currentId === '' ){  
>>>>>>> 752c9b9deacacdde1dd0d63335ec8c67c81ef8af
            this.setState({
                replyMessadeId:newId
            });
        }
    }

  

    openVideoChatTab = () => {

        const { roomId = '' } = this.state;
        window.open(`${config.WEB_URL}${getPatientConsultingVideoUrl(roomId)}`, '_blank');
    }

    setPatientId = (patient_id) => () => {

        const { doctorUserId } = this.state;
        const { patients = {} } = this.props;
        const { basic_info: { user_id: patientUserId = '' } = {} } = patients[patient_id];
        const roomId = getRoomId(doctorUserId, patientUserId);
        this.setState({ patientUserId: patientUserId, patientId: patient_id, roomId });
    }

    showVideoCall = () => {
        this.setState({ placeCall: true });
    }

    hideVideoCall = () => {
        this.setState({ placeCall: false });
    }

    // componentDidUpdate(prevProps, prevState) {
    //     const { patientUserId } = this.state;
    //
    //     const { patientUserId: prevPatientId } = this.state;
    //     if (patientUserId !== prevPatientId) {
    //
    //         const { doctorUserId } = this.state;
    //         let roomId = doctorUserId + '-' + patientUserId;
    //         this.setState({ roomId });
    //     }
    // }


    render() {
        let { roomId, patientId, doctorUserId, replyMessadeId} = this.state;
        
        let { patients = {} } = this.props;

        const { basic_info: { first_name = '', middle_name = '', last_name = '' } = {}, details: { profile_pic: patientDp = '' } = {} } = patients[patientId] || {};
        return (
            <div className="chat-screen-container">
                {/* {placeCall
                    ?
                    (<TwilioVideo patientUserId={patientUserId} hideChat={this.hideVideoCall} roomId={roomId} />) :
                    ( */}
                <Fragment>
                    <div className='chat-patientList-container'>
                        <PatientList setPatientId={this.setPatientId} doctorUserId={doctorUserId} patientId={patientId} {...this.props} />
                    </div>
                    <div className='chat-messageBox-container'>
                        {/* <Header placeVideoCall={this.openVideoChatTab} patientName={first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ''}${last_name ? `${last_name}` : ''}` : ''} patientDp={} /> */}
<<<<<<< HEAD
                        <TwilioChat replyMessadeId={replyMessadeId}  updateReplyMessageId={this.updateReplyMessageId}  roomId={roomId} placeVideoCall={this.openVideoChatTab} patientName={first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ''}${last_name ? `${last_name}` : ''}` : ''} patientDp={patientDp} />
=======
                        <TwilioChat replyMessadeId={replyMessadeId}  updateReplyMessadeId={this.updateReplyMessadeId}  roomId={roomId} placeVideoCall={this.openVideoChatTab} patientName={first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ''}${last_name ? `${last_name}` : ''}` : ''} patientDp={patientDp} />
>>>>>>> 752c9b9deacacdde1dd0d63335ec8c67c81ef8af
                        
                    </div>
                </Fragment>
            </div>
        );
    }
}

export default injectIntl(ChatFullScreen);
