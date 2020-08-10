import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Avatar } from "antd";
import PatientList from './patientListSideBar';
import TwilioChat from '../../Containers/ChatFullScreen/twilioChat';
import TwilioVideo from '../../Containers/ChatFullScreen/twilioVideo';
import CallIcon from '../../Assets/images/telephone.png';
import { getPatientConsultingVideoUrl } from '../../Helper/url/patients';

const Header = ({ placeVideoCall, patientName, patientDp = '' }) => {
    let pic = patientName ?
        <Avatar src={patientDp}>{patientName[0]}</Avatar> : <Avatar src={patientDp} icon="user" />
    return (
        <div className='chat-patientListheader-chatBox'>
            <div className='flex direction-row align-center wp90'>
                {pic}
                <div className='doctor-name-chat-header mt4'>{patientName}</div>
            </div>
            <img src={CallIcon} className='callIcon-header mr10' onClick={placeVideoCall} />
        </div>
    );
}


class ChatFullScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorId: 1,
            roomId: '',
            patientId: 1,
            placeCall: false
        };
    }

    componentDidMount() {

        let { match: {
            params: { patient_id }
        }, doctors = {}, authenticated_user = 1 } = this.props;


        let doctorId = '';
        for (let doc of Object.values(doctors)) {
            let { basic_info: { user_id, id = 1 } } = doc;
            if (parseInt(user_id) === parseInt(authenticated_user)) {
                doctorId = id;
            }
        }

        let roomId = doctorId + '-adhere-' + patient_id;

        // console.log('754624646546245624562462456', doctorId, patient_id, roomId);
        this.setState({ doctorId, roomId, patientId: patient_id });
    }

    openVideoChatTab = () => {

        const { roomId = '' } = this.state;
        // setPatientForChat(patient_id);
        window.open(`http://localhost:3000${getPatientConsultingVideoUrl(roomId)}`, '_blank');
    }

    setPatientId = (patient_id) => () => {

        let { doctorId } = this.state;
        let roomId = doctorId + '-adhere-' + patient_id;
        this.setState({ patientId: patient_id, roomId });
    }

    showVideoCall = () => {
        this.setState({ placeCall: true });
    }

    hideVideoCall = () => {
        this.setState({ placeCall: false });
    }

    componentDidUpdate(prevProps, prevState) {
        let { patientId } = this.state;

        let { patientId: prevPatientId } = this.state;
        if (patientId !== prevPatientId) {

            let { doctorId } = this.state;
            let roomId = doctorId + '-adhere-' + patientId;
            this.setState({ roomId });
        }
    }


    render() {
        console.log('754624646546245624562462456', this.state);

        let { roomId, patientId, doctorId, placeCall } = this.state;
        let { patients = {} } = this.props;

        const { basic_info: { first_name = '', middle_name = '', last_name = '' } = {} } = patients[patientId];
        return (
            <div className="chat-screen-container">
                {/* {placeCall
                    ?
                    (<TwilioVideo patientId={patientId} hideChat={this.hideVideoCall} roomId={roomId} />) :
                    ( */}
                <Fragment>
                    <div className='chat-patientList-container'>
                        <PatientList setPatientId={this.setPatientId} doctorId={doctorId} {...this.props} />
                    </div>
                    <div className='chat-messageBox-container'>
                        <Header placeVideoCall={this.openVideoChatTab} patientName={first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ''}${last_name ? `${last_name}` : ''}` : ''} patientDp='' />
                        <TwilioChat roomId={roomId} />
                    </div>
                </Fragment>
            </div>
        );
    }
}

export default injectIntl(ChatFullScreen);
