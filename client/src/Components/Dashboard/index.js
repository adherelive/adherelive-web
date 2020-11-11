import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import messages from "./message";
import { PERMISSIONS,TABLE_DEFAULT_BLANK_FIELD } from "../../constant";
import plus_white from '../../Assets/images/plus_white.png';
import Tabs from "antd/es/tabs";
import Patients from "../../Containers/Patient/table";
import Watchlist from "../../Containers/Patient/watchlist";
import PatientDetailsDrawer from "../../Containers/Drawer/patientDetails";
import ChatPopup from "../../Containers/ChatPopup";
import AddPatientDrawer from "../Drawer/addPatient";
import Loading from "../Common/Loading";
import { withRouter } from "react-router-dom";
import Donut from '../Common/graphs/donut';
import NotificationDrawer from '../../Containers/Drawer/notificationDrawer'
import GraphsModal from "./graphsModal";
import { getPatientConsultingVideoUrl } from '../../Helper/url/patients';
import { getPatientConsultingUrl } from '../../Helper/url/patients';
import config from "../../config";
import {Drawer, Icon, Select, Input, message, Button, Spin, Radio, DatePicker, Menu, Dropdown, Modal} from "antd";
import SearchPatient from "../../Containers/SearchPatient";
import MissedAppointmentsDrawer from "../Drawer/missedAppointmentsDrawer";
import MissedVitalsDrawer from "../Drawer/missedVitalsDrawer";
import MissedMedicationsDrawer from "../Drawer/missedMedicationsDrawer";

// helpers...
import {getRoomId} from "../../Helper/twilio";
const { Option } = Select;
const { TabPane } = Tabs;

const CHART_MISSED_MEDICATION = "Missed Medication";
const CHART_MISSED_APPOINTMENT = "Missed Appointment";
const CHART_MISSED_ACTION = "Missed Action";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visibleModal: false,
            graphsToShow: [],
            doctorUserId: 1,
            patient_ids:[],
            appointmentDrawerVisible:false,
            vitalDrawerVisisble:false,
            medicationDrawerVisible:false,          
        };
    }

    componentDidMount() {
        const {addToWatchlist} = this.props;
        const { searchMedicine, getGraphs, doctors = {}, authenticated_user, closePopUp, fetchChatAccessToken } = this.props;
        closePopUp();
        let doctorUserId = '';   //user_id of doctor
        for (let doc of Object.values(doctors)) {
            let { basic_info: { user_id, id = 1 } } = doc;
            if (parseInt(user_id) === parseInt(authenticated_user)) {
                doctorUserId = user_id;
            }
        }
        this.setState({ graphLoading: true, doctorUserId: 1 });
        getGraphs().then(response => {
            const { status, payload: { data: { user_preferences: { charts = [] } = {} } = {} } = {} } = response;
            if (status) {
                this.setState({ graphsToShow: [...charts], graphLoading: false });
            }
        });
        fetchChatAccessToken(authenticated_user);
        searchMedicine("");
      
    }



    getMenu = () => {

        const { authPermissions = [] } = this.props;
        return (
            <Menu>
                {authPermissions.includes(PERMISSIONS.ADD_PATIENT) && (<Menu.Item onClick={this.showAddPatientDrawer}>
                    <div>{this.formatMessage(messages.patients)}</div>
                </Menu.Item>)}
                {authPermissions.includes(PERMISSIONS.EDIT_GRAPH) && (<Menu.Item onClick={this.showEditGraphModal}>
                    <div>{this.formatMessage(messages.graphs)}</div>
                </Menu.Item>)}
            </Menu>
        );
    };

    formatMessage = data => this.props.intl.formatMessage(data);


    chartClicked = (name) => {
        if(name === CHART_MISSED_APPOINTMENT){
            this.setState({
                appointmentDrawerVisible:true
            })
        }else if (name === CHART_MISSED_ACTION){
            this.setState({
                vitalDrawerVisisble:true
            })
        }else if (name === CHART_MISSED_MEDICATION){
            console.log("MEDI CLICKED")
            this.setState({
                medicationDrawerVisible:true
            })
        }
    }

    closeAppointmentDrawer = () => {
        this.setState({
            appointmentDrawerVisible:false
        })
    }

    closeVitalDrawer = () => {
        this.setState({
            vitalDrawerVisisble:false
        })
    }

    closeMedicationDrawer = () => {
        this.setState({
            medicationDrawerVisible:false
        })
    }

    renderChartTabs = () => {
        const { graphs } = this.props;

        const { graphsToShow, graphLoading } = this.state;

        // initial loading phase
        if (graphLoading) {
            return (<div className='flex flex-grow-1 wp100 align-center justify-center'><Spin /></div>);
        }


        const chartBlocks = graphsToShow.map(id => {
            const { total, critical, name } = graphs[id] || {};
            return (
                <div onClick={ () => this.chartClicked(name)} >
                    <Donut key={id} id={id} data={[critical, total - critical]} total={total} title={name} formatMessage={this.formatMessage}
                 />
                </div>
            );

        });
        // no graph selected to show phase
        if (graphsToShow.length === 0) {
            return (
                <div className="flex justify-center align-center fs20 fw600 wp100 bg-grey br5">{this.formatMessage(messages.no_graph_text)}</div>
            );
        } else {
            return chartBlocks;
        }
    };

    showAddPatientDrawer = () => {
        this.setState({ visible: true });
    }
    showEditGraphModal = () => {
        this.setState({ visibleModal: true });
    }

    

    addPatient = (data) => {

        const { addPatient, authenticated_user, getInitialData } = this.props;

        const { basic_info: { id = 1 } = {} } = authenticated_user || {};
        addPatient(data).then(response => {
            let { status = false, statusCode = 0, payload: { data: { patient_ids = [], care_plan_ids = [], carePlanTemplateId = 0 } = {}, message: responseMessage = '' } = {} } = response;
            let showTemplateDrawer = carePlanTemplateId ? true : false;
            let currentCarePlanId = care_plan_ids[0];
            let patient_id = patient_ids ? patient_ids[0] : 0;
            if (status) {
                // getInitialData().then(() => {


                this.props.history.push({
                    pathname: `/patients/${patient_id}`,
                    state: { showTemplateDrawer, currentCarePlanId }
                });

                // })
            } else {
                if (statusCode === 422) {
                    message.error(this.formatMessage(messages.patientExistError));
                } else {
                    message.error(this.formatMessage(messages.somethingWentWrongError));
                }
            }
        });
    }

    editDisplayGraphs = (data) => {
        let dataToUpdate = {};
        dataToUpdate.chart_ids = data;
        let { updateGraphs } = this.props;
        updateGraphs(dataToUpdate).then(response => {
            const { status } = response;
            if (status) {
                this.setState({ graphsToShow: data, visibleModal: false })
            } else {
                message.error(this.formatMessage(messages.somethingWentWrongError))
            }
        })
    }

    hideAddPatientDrawer = () => {
        this.setState({ visible: false });
    }

    hideEditGraphModal = () => {
        this.setState({ visibleModal: false });
    }


    openVideoChatTab = () => {
        const {
            patients,
            twilio: { patientId: chatPatientId = 1 } } = this.props;
        const { doctorUserId } = this.state;
        let { basic_info: { user_id: patientUserId = '' } = {} } = patients[chatPatientId];
        const roomId = getRoomId(doctorUserId, patientUserId);

        window.open(`${config.WEB_URL}${getPatientConsultingVideoUrl(roomId)}`, '_blank');
    }

    maximizeChat = () => {
        const {
            patients,
            twilio: { patientId: chatPatientId = 1 } } = this.props;
        window.open(`${config.WEB_URL}${getPatientConsultingUrl(chatPatientId)}`, '_blank');
    }

    getVerifyModal = () => {
        const {showVerifyModal = false} = this.props;
        return (
            <div className="wp100 flex justify-center align-center">
                <Modal
                    className="mt62"
                    visible={showVerifyModal}
                    // title={' '}
                    closable
                    mask
                    maskClosable
                    onCancel={this.closeModal}
                    wrapClassName=""
                    width={`50%`}
                    footer={null}
                >
                    <div className="fs24 fw700 flex justify-center p10 mt20 mb20">{this.formatMessage(messages.welcome_onboard_text)}</div>
                    <div className="wp100 fs16 text-center mb20">{this.formatMessage(messages.pending_verify_content_text)}</div>
                </Modal>
            </div>
        );
    };

    closeModal = () => {
        const {showVerifyModal} = this.props;
        showVerifyModal(false);
    };

    render() {
      
        const {doctors = {}, authenticated_user } = this.props;
        let doctorID = null ;
        let docName = '';
        Object.keys(doctors).forEach( id => {
        const { basic_info: { user_id } = {} } = doctors[id] || {};


            if (user_id === authenticated_user) {
                doctorID = id;
            }
        });
        const {basic_info: { first_name : doc_first_name, middle_name : doc_middle_name, last_name :doc_last_name } = {} }  = doctors[doctorID]|| {};
        docName = doc_first_name ? `Dr. ${doc_first_name} ${doc_middle_name ? `${doc_middle_name} ` : ""}${doc_last_name}` : TABLE_DEFAULT_BLANK_FIELD;
        

        const {
             graphs,
            treatments,
            conditions,
            severity,
            patients,
            authPermissions = [],
            chats: { minimized = false, visible: popUpVisible = false },
            drawer: { visible: drawerVisible = false } = {},
            ui_features: {showVerifyModal = false} = {},
            twilio: { patientId: chatPatientId = 1 } } = this.props;

        const { formatMessage, renderChartTabs, getVerifyModal } = this;
        
        let { basic_info: { user_id: patientUserId = '', first_name = '', middle_name = '', last_name = '' } = {}, details: { profile_pic: patientDp = '' } = {} } = patients[chatPatientId] || {};


        const { visible, graphsToShow, visibleModal, doctorUserId } = this.state;

        const roomId = getRoomId(doctorUserId, patientUserId);
        console.log("198381239 roomId", roomId);
        if (Object.keys(graphs).length === 0) {
            return (
                <Loading className={"wp100 mt20"} />
            );
        }


 

        return (
            <Fragment>
                <div className="dashboard p20">
                    <div className="flex direction-row justify-space-between align-center">
                        {/* <div className="fs28 fw700">{formatMessage(messages.dashboard)}</div> */}
                        {docName !== '' 
                        ? 
                        (<div className="fs28 fw700">{formatMessage(messages.welcome)} &nbsp; {docName}</div>)
                        :
                        (<div className="fs28 fw700">{formatMessage(messages.dashboard)}</div>)
                        }
                        {(authPermissions.includes(PERMISSIONS.ADD_PATIENT) || authPermissions.includes(PERMISSIONS.EDIT_GRAPH)) &&
                            (

                             <div className="flex direction-row justify-space-between align-center w500 mr20">


                                    <SearchPatient/>


                                    <Dropdown
                                        className={'mr10 '}
                                        overlay={this.getMenu()}
                                        trigger={["click"]}
                                        placement="bottomRight"
                                    >
                                      
                                        <Button type="primary" className='ml10 add-button flex direction-column align-center justify-center hp100'>
                                            <div className="flex direction-row" >
                                                <div className="flex direction-column align-center justify-center hp100">
                                                    <img src={plus_white} className={"w20 h20 mr6 "} />
                                                </div>
                                                <div className="flex direction-column align-center justify-center hp100">
                                                    <span className="fs20" > Add</span>
                                                </div>
                                            </div>
                                            
                                        </Button>

                                    </Dropdown>
                           
                            
                            </div>
                            )}
                    </div>


                    {/* <div className="mt10 flex align-center"> */}
                    <section className='horizontal-scroll-wrapper pr10 mt10'>
                        {renderChartTabs()}
                    </section>

                    <div className="mt20 fs20 fw700">
                        {formatMessage(messages.patients)}
                    </div>

                    <Tabs tabPosition="top">
                        <TabPane
                            tab={<span className="fs16 fw600">{formatMessage(messages.summary)}</span>}
                            key="1"
                        >
                            <Patients />
                        </TabPane>

                        <TabPane
                            tab={<span className="fs16 fw600">{formatMessage(messages.watchList)}</span>}
                            key="2"
                        >
                            {/* <Patients /> */}
                            <Watchlist/>
                            {/*add watchlist table here*/}
                        </TabPane>
                    </Tabs>

                </div>
                <PatientDetailsDrawer />
                {popUpVisible && (<div className={drawerVisible && minimized ? 'chat-popup-minimized' : drawerVisible && !minimized ? 'chat-popup' : minimized ? 'chat-popup-minimized-closedDrawer' : 'chat-popup-closedDrawer'}>
                    <ChatPopup
                        roomId={roomId}
                        placeVideoCall={this.openVideoChatTab}
                        patientName={first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ''}${last_name ? `${last_name}` : ''}` : ''}
                        maximizeChat={this.maximizeChat}
                        patientDp={patientDp}
                    />
                </div>)}

                <AddPatientDrawer
                    searchCondition={this.props.searchCondition}
                    searchTreatment={this.props.searchTreatment}
                    searchSeverity={this.props.searchSeverity}
                    searchPatientFromNum={this.props.searchPatientFromNum}
                    treatments={treatments} conditions={conditions} severity={severity} close={this.hideAddPatientDrawer} visible={visible} submit={this.addPatient}
                    patients={patients} />

                {visibleModal && (<GraphsModal visible={visibleModal} handleCancel={this.hideEditGraphModal} handleOk={this.editDisplayGraphs} selectedGraphs={graphsToShow} />)}
                <NotificationDrawer  visible={visible}  />

                <MissedAppointmentsDrawer  close={this.closeAppointmentDrawer} visible={this.state.appointmentDrawerVisible} 
                 {...this.props}
                 />

                <MissedVitalsDrawer  close={this.closeVitalDrawer} visible={this.state.vitalDrawerVisisble}
                  {...this.props}
                />


                <MissedMedicationsDrawer  close={this.closeMedicationDrawer} visible={this.state.medicationDrawerVisible} 
                {...this.props}
                />


                {showVerifyModal && getVerifyModal()}
            </Fragment>
        );
    }
}

export default withRouter(injectIntl(Dashboard));
