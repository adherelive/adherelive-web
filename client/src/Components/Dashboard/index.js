import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import messages from "./message";
import { GRAPH_COLORS, PERMISSIONS, ROOM_ID_TEXT } from "../../constant";
import Tabs from "antd/es/tabs";
import { Button, Menu, Dropdown, Spin, message } from "antd";
import Patients from "../../Containers/Patient/table";
import PatientDetailsDrawer from "../../Containers/Drawer/patientDetails";
import ChatPopup from "../../Containers/ChatPopup";
import AddPatientDrawer from "../Drawer/addPatient";
import Loading from "../Common/Loading";
import { withRouter } from "react-router-dom";
import Donut from '../Common/graphs/donut'
import GraphsModal from "./graphsModal";
import { getPatientConsultingVideoUrl } from '../../Helper/url/patients';
import { getPatientConsultingUrl } from '../../Helper/url/patients';
import config from "../../config/config";



const { TabPane } = Tabs;

const SUMMARY = "Summary";
const WATCHLIST = "Watch list";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visibleModal: false,
            graphsToShow: [],
            doctorUserId: 1
        };
    }

    componentDidMount() {
        const { searchMedicine, getGraphs, doctors = {}, authenticated_user } = this.props;
        // getInitialData();
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

        searchMedicine("");
        // setTimeout(() => {
        //     drawChart(graphs);
        // }, 500);
    }

    getMenu = () => {

        const { authPermissions = [] } = this.props;
        return (
            <Menu>
                {authPermissions.includes(PERMISSIONS.ADD_PATIENT) && (<Menu.Item onClick={this.showAddPatientDrawer}>
                    <div>Patients</div>
                </Menu.Item>)}
                {authPermissions.includes(PERMISSIONS.EDIT_GRAPH) && (<Menu.Item onClick={this.showEditGraphModal}>
                    <div>Graphs</div>
                </Menu.Item>)}
            </Menu>
        );
    };

    formatMessage = data => this.props.intl.formatMessage(data);

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
                <Donut key={id} id={id} data={[critical, total - critical]} total={total} title={name} />
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
                    message.error('Patient already exist with same number!');
                } else {
                    message.error('Something went wrong');
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
                message.error('Something went wrong,please try again.')
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
        let roomId = doctorUserId + ROOM_ID_TEXT + patientUserId;
        window.open(`http://localhost:3000${getPatientConsultingVideoUrl(roomId)}`, '_blank');
    }

    maximizeChat = () => {
        const {
            patients,
            twilio: { patientId: chatPatientId = 1 } } = this.props;
        window.open(`http://localhost:3000${getPatientConsultingUrl(chatPatientId)}`, '_blank');
    }
    render() {
        const { graphs,
            treatments,
            conditions,
            severity,
            patients,
            authPermissions = [],
            chats: { minimized = false, visible: popUpVisible = false },
            drawer: { visible: drawerVisible = false } = {},
            twilio: { patientId: chatPatientId = 1 } } = this.props;
        const { formatMessage, renderChartTabs } = this;
        console.log('452345134625362456', config.WEB_URL);
        let { basic_info: { user_id: patientUserId = '', first_name = '', middle_name = '', last_name = '' } = {} } = patients[chatPatientId] || {};


        const { visible, graphsToShow, visibleModal, doctorUserId } = this.state;

        let roomId = doctorUserId + ROOM_ID_TEXT + patientUserId;
        if (Object.keys(graphs).length === 0) {
            return (
                <Loading className={"wp100 mt20"} />
            );
        }

        return (
            <Fragment>
                <div className="dashboard p20">
                    <div className="flex direction-row justify-space-between align-center">
                        <div className="fs28 fw700">{formatMessage(messages.report)}</div>
                        {(authPermissions.includes(PERMISSIONS.ADD_PATIENT) || authPermissions.includes(PERMISSIONS.EDIT_GRAPH)) &&
                            (<Dropdown
                                className={'mr10'}
                                overlay={this.getMenu()}
                                trigger={["click"]}
                                placement="bottomRight"
                            >
                                <Button type="primary" className='add-button'>Add</Button>
                            </Dropdown>)}
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
                            tab={<span className="fs16 fw600">{SUMMARY}</span>}
                            key="1"
                        >
                            <Patients />
                        </TabPane>
                        <TabPane
                            tab={<span className="fs16 fw600">{WATCHLIST}</span>}
                            key="2"
                        >
                            <Patients />
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
                    />
                </div>)}

                <AddPatientDrawer
                    searchCondition={this.props.searchCondition}
                    searchTreatment={this.props.searchTreatment}
                    searchSeverity={this.props.searchSeverity}
                    treatments={treatments} conditions={conditions} severity={severity} close={this.hideAddPatientDrawer} visible={visible} submit={this.addPatient} />
                {visibleModal && (<GraphsModal visible={visibleModal} handleCancel={this.hideEditGraphModal} handleOk={this.editDisplayGraphs} selectedGraphs={graphsToShow} />)}
            </Fragment>
        );
    }
}

export default withRouter(injectIntl(Dashboard));
