import React, {Component, Fragment} from "react";
import {injectIntl} from "react-intl";
import messages from "./message";
import drawChart from "../../Helper/drawChart";
import {CHART_TITLE, GRAPH_COLORS} from "../../constant";
import Tabs from "antd/es/tabs";
import Patients from "../../Containers/Patient/table";
import PatientDetailsDrawer from "../../Containers/Drawer/patientDetails";

const {TabPane} = Tabs;

const SUMMARY = "Summary";
const WATCHLIST = "Watch list";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        const {graphs, getInitialData, searchMedicine} = this.props;
        getInitialData();
        searchMedicine("");
        setTimeout(() => {
            drawChart(graphs);
        }, 500);
    }

    formatMessage = data => this.props.intl.formatMessage(data);

    renderChartTabs = () => {
        const {graphs} = this.props;
        const {formatMessage} = this;
        const {missed_report = []} = graphs || {};

        const chartBlocks = missed_report.map(report => {
            const {id, data} = report || {};
            const {total, critical} = data || {};
            const {className} = GRAPH_COLORS[id] || {};
            return (
                <Fragment>
                    <div className="w205 br5 pb6 chart-box-shadow mb10 mr20 flex direction-column align-center relative">
                        <div className="wp100">
                            <div className="ml10 mt20 fs16 fw600">{CHART_TITLE[id]}</div>
                        </div>
                        <div className="w130 h130 mt20">
                            <canvas id={`myChart-${id}`} width="150" height="150"></canvas>
                        </div>
                        <div className="wp90 flex align-center justify-space-between mt20">
                            <div className="flex align-center fs10">
                                <div
                                    className={`ml10 mr6 br50 w10 h10 ${className["dark"]}`}
                                ></div>
                                <div>{CHART_TITLE[id] === "Adherence" ? formatMessage(messages.compliant_text) : formatMessage(messages.critical_text)}</div>
                            </div>
                            <div className="flex align-center fs10">
                                <div
                                    className={`mr6 br50 w10 h10 ${className["light"]}`}
                                ></div>
                                <div className="mr10">
                                    {CHART_TITLE[id] === "Adherence" ? formatMessage(messages.non_compliant_text) : formatMessage(messages.non_critical_text)}
                                </div>
                            </div>
                        </div>
                        <div className="chart-center fs30 fw600">{total}</div>
                    </div>
                </Fragment>
            );
        });
        return chartBlocks;
    };

    render() {
        console.log("19273 here --> dashboard");
        const {graphs} = this.props;
        const {formatMessage, renderChartTabs} = this;

        if (Object.keys(graphs).length === 0) {
            return null;
        }

        return (
            <Fragment>
                <div className="dashboard p20">
                    <div className="flex direction-row justify-space-between">
                        <div className="fs40 fw700">{formatMessage(messages.report)}</div>
                        {/*<div>{"search here"}</div>*/}
                        {/*<div><Button onClick={this.props.signOut}>LogOut</Button></div>*/}
                    </div>

                    <div className="mt10 flex align-center">
                        {renderChartTabs()}
                    </div>

                    <div className="mt20 fs20 fw700">
                        {formatMessage(messages.patients)}
                    </div>

                    <Tabs tabPosition="top">
                        <TabPane
                            tab={<span className="fs16 fw600">{SUMMARY}</span>}
                            key="1"
                        >
                            <Patients/>
                        </TabPane>
                        <TabPane
                            tab={<span className="fs16 fw600">{WATCHLIST}</span>}
                            key="2"
                        >
                            <Patients/>
                            {/*add watchlist table here*/}
                        </TabPane>
                    </Tabs>
                </div>
                <PatientDetailsDrawer />
            </Fragment>
        );
    }
}

export default injectIntl(Dashboard);
