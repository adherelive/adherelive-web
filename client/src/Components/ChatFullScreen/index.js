import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Avatar } from "antd";
import PatientList from './patientListSideBar';
import TwilioChat from '../../Containers/ChatFullScreen/twilioChat';
import CallIcon from '../../Assets/images/telephone.png';
import { getPatientConsultingVideoUrl } from '../../Helper/url/patients';
import {ROOM_ID_TEXT} from '../../constant';
import config from "../../config";

const Header = ({ placeVideoCall, patientName, patientDp = '' }) => {
    let pic = patientName ?
        <Avatar src={patientDp}>{patientName[0]}</Avatar> : <Avatar src={patientDp} icon="user" />
    return (
        <div className='chat-patientListheader-chatBoxPopUp'>
            <div className='flex direction-row align-center wp90'>
                {pic}
                <div className='doctor-name-chat-header mt2'>{patientName}</div>
            </div>
            <img src={CallIcon} className='callIcon-header mr10' onClick={placeVideoCall} />
        </div>
    );
}


class ChatFullScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorUserId: 1,
            roomId: '',
            patientUserId: 1,
            patientId: 1,
            placeCall: false
        };
    }

    componentDidMount() {

        let { match: {
            params: { patient_id }
        }, doctors = {}, patients = {}, authenticated_user = 1 } = this.props;


        let doctorUserId = '';   //user_id of doctor
        let { basic_info: { user_id: patientUserId = '' } = {} } = patients[patient_id];
        for (let doc of Object.values(doctors)) {
            let { basic_info: { user_id, id = 1 } } = doc;
            if (parseInt(user_id) === parseInt(authenticated_user)) {
                doctorUserId = user_id;
            }
        }

        let roomId = doctorUserId + ROOM_ID_TEXT + patientUserId;

        // console.log('754624646546245624562462456', doctorUserId, patient_id, roomId);
        this.setState({ doctorUserId, roomId, patientUserId: patientUserId, patientId: patient_id });
    }

    openVideoChatTab = () => {

        const { roomId = '' } = this.state;
        // setPatientForChat(patient_id);
        window.open(`${config.WEB_URL}${getPatientConsultingVideoUrl(roomId)}`, '_blank');
    }

    setPatientId = (patient_id) => () => {

        let { doctorUserId } = this.state;
        let { patients = {} } = this.props;
        let { basic_info: { user_id: patientUserId = '' } = {} } = patients[patient_id];
        let roomId = doctorUserId + ROOM_ID_TEXT + patientUserId;
        this.setState({ patientUserId: patientUserId, patientId: patient_id, roomId });
    }

    showVideoCall = () => {
        this.setState({ placeCall: true });
    }

    hideVideoCall = () => {
        this.setState({ placeCall: false });
    }

    componentDidUpdate(prevProps, prevState) {
        let { patientUserId } = this.state;

        let { patientUserId: prevPatientId } = this.state;
        if (patientUserId !== prevPatientId) {

            let { doctorUserId } = this.state;
            let roomId = doctorUserId + '-' + patientUserId;
            this.setState({ roomId });
        }
    }


    render() {
        let { roomId, patientId, doctorUserId } = this.state;
        let { patients = {} } = this.props;

        const { basic_info: { first_name = '', middle_name = '', last_name = '' } = {}, details: { profile_pic: patientDp = '' } = {} } = patients[patientId];
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
                        <TwilioChat roomId={roomId} placeVideoCall={this.openVideoChatTab} patientName={first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ''}${last_name ? `${last_name}` : ''}` : ''} patientDp={patientDp} />
                    </div>
                </Fragment>
            </div>
        );
    }
}

export default injectIntl(ChatFullScreen);
