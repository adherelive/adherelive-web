import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import messages from "./message";
import { GRAPH_COLORS, PERMISSIONS } from "../../constant";
import Tabs from "antd/es/tabs";
import { Button, Menu, Dropdown, Spin, message } from "antd";
import Patients from "../../Containers/Patient/table";
import PatientDetailsDrawer from "../../Containers/Drawer/patientDetails";
import AddPatientDrawer from "../Drawer/addPatient";
import Loading from "../Common/Loading";
import { withRouter } from "react-router-dom";
import Donut from '../Common/graphs/donut'
import GraphsModal from "./graphsModal";



const { TabPane } = Tabs;

const SUMMARY = "Summary";
const WATCHLIST = "Watch list";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            visibleModal: false,
            graphsToShow: []
        };
    }

    componentDidMount() {
        const { graphs, getInitialData, searchMedicine, getGraphs } = this.props;
        getInitialData();
        getGraphs().then(response => {
            console.log('19273 reponse OF GET GRAPHSSS', response)
            const { status, payload: { data: { user_preferences: { charts = [] } = {} } = {} } = {} } = response;
            console.log('19273 reponse OF GET GRAPHSSS111', status, charts)
            if (status) {
                this.setState({ graphsToShow: [...charts] });
            }
        });
        searchMedicine("");
        console.log("DashBoard Did MOunt DOCTORRRRR ROUTERRR ----------------->   ")
        // setTimeout(() => {
        //     drawChart(graphs);
        // }, 500);
    }

    getMenu = () => {

        const { authPermissions = [] } = this.props;
        console.log("12312 getMenu");
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

        const { graphsToShow } = this.state;
        const { formatMessage } = this;
        const { missed_report = [] } = graphs || {};

        // console.log("3897127312893 missed_report --> ", missed_report);

        const chartBlocks = graphsToShow.map(id => {
            // const { id, data } = report || {};
            const { total, critical, name } = graphs[id] || {};
            const { className } = GRAPH_COLORS[id] || {};
            // if (graphsToShow.includes(id)) {
            return (

                <Donut id={id} data={[critical, total - critical]} total={total} title={name} />
            );
            // } else {
            //     return (null);
            // }
        });
        if (graphsToShow.length == 0) {
            return <div className='flex flex-grow-1 wp100 align-center justify-center'><Spin /></div>
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
            console.log('currentCarePlanId after adding patient', currentCarePlanId);
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
    render() {
        const { graphs,
            treatments,
            conditions,
            severity,
            authPermissions = [] } = this.props;
        const { formatMessage, renderChartTabs } = this;

        const { visible, graphsToShow, visibleModal } = this.state;
        console.log("19273 here  DOCTORRRRR ROUTERRR  --> dashboard", graphsToShow, this.state);
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
                                <Button type="primary">Add</Button>
                            </Dropdown>)}
                    </div>

                    {/* <div className="mt10 flex align-center"> */}
                    <section className='horizontal-scroll-wrapper mt10'>
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
