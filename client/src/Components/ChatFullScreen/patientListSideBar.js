import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Avatar } from "antd";

const Header = ({ docName, docDp = '' }) => {
    let pic = docName ?
        <Avatar src={docDp}>{docName[0]}</Avatar> : <Avatar src={docDp} icon="user" />
    return (
        <div className='chat-patientListheader'>
            {pic}
            <div className='doctor-name-chat-header mt4'>{docName}</div>
        </div>
    );
}

const PatientCard = ({ setPatientId, patientId, patientName = '', patientDp = '' }) => {
    let pic = patientName ?
        <Avatar src={patientDp}>{patientName[0]}</Avatar> : <Avatar src={patientDp} icon="user" />
    return (
        <div className='chat-patient-card' onClick={setPatientId(patientId)}>
            {pic}
            <div className='patient-name-chat'>{patientName}</div>
        </div>
    );
}

class PatientListSideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctorName: '',
            docDp: ''
        };
    }

    componentDidMount() {

        let { doctors = {}, authenticated_user = 1 } = this.props;
        let doctorName = '';
        let doctorDp = '';
        for (let doc of Object.values(doctors)) {
            let { basic_info: { user_id, first_name = '', middle_name = '', last_name = '', profile_pic = '' } } = doc;
            if (parseInt(user_id) === parseInt(authenticated_user)) {
                doctorName = first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ''}${last_name ? `${last_name}` : ''}` : '';
                doctorDp = profile_pic;
            }
        }
        this.setState({ doctorName, doctorDp });
    }

    renderPatients = () => {
        const { patients = {}, setPatientId } = this.props;
        let allPatients = Object.values(patients).map((patient) => {
            const { basic_info: { id = 0, first_name = '', middle_name = '', last_name = '' } = {} } = patient;
            return (
                <div key={id} className='chat-patient-card-parent'>
                    <PatientCard setPatientId={setPatientId} patientId={id} patientName={first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ''}${last_name ? `${last_name}` : ''}` : ''} patientDp='' />
                </div>
            );
        })
        return allPatients;
    }

    render() {
        let { doctorName = '', doctorDp = '' } = this.state;

        return (
            <div className="patientList-component-container">
                <Header docName={doctorName} docDp={doctorDp} />
                {this.renderPatients()}
            </div>
        );
    }
}

export default injectIntl(PatientListSideBar);
