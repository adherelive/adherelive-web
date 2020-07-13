import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import messages from "./message";
import drawChart from "../../Helper/drawChart";
import { CHART_TITLE, GRAPH_COLORS, NO_ADHERENCE, NO_ACTION, NO_APPOINTMENT, NO_MEDICATION, ACTIVE_PATIENT, CRITICAL_PATIENT } from "../../constant";
import Tabs from "antd/es/tabs";
import { Table, Divider, Tag, Button, Menu, Dropdown, Spin, message } from "antd";
import Patients from "../../Containers/Patient/table";
import PatientDetailsDrawer from "../../Containers/Drawer/patientDetails";
import AddAppointmentDrawer from "../../Containers/Drawer/addAppointment";
import AddPatientDrawer from "../Drawer/addPatient";
import AddPatient from '../../Assets/images/add-user.png';
import Loading from "../Common/Loading";
import { withRouter } from "react-router-dom";
import { addPatient } from "../../modules/doctors";
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
        console.log("12312 getMenu");
        return (
            <Menu>
                <Menu.Item onClick={this.showAddPatientDrawer}>
                    <div>Patients</div>
                </Menu.Item>
                <Menu.Item onClick={this.showEditGraphModal}>
                    <div>Graphs</div>
                </Menu.Item>
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
        addPatient(data, id).then(response => {
            const { status = false, payload: { data: { patient_id = 1, carePlanTemplateId = 0 } = {} } = {} } = response;
            let showTemplateDrawer = carePlanTemplateId ? true : false;
            if (status) {
                getInitialData().then(() => {


                    this.props.history.push({
                        pathname: `/patients/${patient_id}`,
                        state: { showTemplateDrawer }
                    });

                })
            } else {
                message.error('Something went wrong');
            }
        });
    }

    editDisplayGraphs = (data) => {

        this.setState({ graphsToShow: data, visibleModal: false })
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
            severity } = this.props;
        const { formatMessage, renderChartTabs } = this;

        const { visible, graphsToShow,visibleModal } = this.state;
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
                        <Dropdown
                            className={'mr10'}
                            overlay={this.getMenu()}
                            trigger={["click"]}
                            placement="bottomRight"
                        >
                            <Button type="primary">Add</Button>
                        </Dropdown>
                    </div>

                    {/* <div className="mt10 flex align-center"> */}
                    <section className='horizontal-scroll-wrapper'>
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

                <AddPatientDrawer treatments={treatments} conditions={conditions} severity={severity} close={this.hideAddPatientDrawer} visible={visible} submit={this.addPatient} />
               {visibleModal &&( <GraphsModal visible={visibleModal} handleCancel={this.hideEditGraphModal} handleOk={this.editDisplayGraphs} selectedGraphs={graphsToShow} />)}
            </Fragment>
        );
    }
}

export default withRouter(injectIntl(Dashboard));
