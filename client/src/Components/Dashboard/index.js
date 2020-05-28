import React, {Component, Fragment} from "react";
import { injectIntl } from "react-intl";
import messages from "./message";
import * as Chart from "chart.js";
import drawChart from "../../Helper/drawChart";
import { formatMessage } from "react-intl/src/format";
import { CHART_TITLE, GRAPH_COLORS } from "../../constant";
import { Tabs, Button } from "antd";
import Patients from "../../Containers/Patient/table";
import PatientDetailsDrawer from "../../Containers/Drawer/patientDetails";
import AddAppointmentDrawer from "../../Containers/Drawer/addAppointment";

const { TabPane } = Tabs;

const SUMMARY = "Summary";
const WATCHLIST = "Watch list";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { graphs } = this.props;
    setTimeout(() => {
      drawChart(graphs);
    }, 500);
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  renderChartTabs = () => {
    const { graphs } = this.props;
    const { formatMessage } = this;
    const { missed_report = [] } = graphs || {};

    const chartBlocks = missed_report.map(report => {
      const { id, data } = report || {};
      const { total, critical } = data || {};
      const { className } = GRAPH_COLORS[id] || {};
      return (
        <Fragment>
          <div className="w350 h300 br5 chart-box-shadow mb10 flex direction-column align-center relative">
            <div className="wp100">
              <div className="ml10 mt20 fs20 fw600">{CHART_TITLE[id]}</div>
            </div>
            <div className="w180 h180 mt20">
              <canvas id={`myChart-${id}`} width="150" height="150"></canvas>
            </div>
            <div className="wp90 flex align-center justify-space-between mt20">
              <div className="flex align-center">
                <div
                  className={`ml10 mr10 br50 w10 h10 ${className["dark"]}`}
                ></div>
                <div>{formatMessage(messages.critical_text)}</div>
              </div>
              <div className="flex align-center">
                <div
                  className={`mr10 br50 w10 h10 ${className["light"]}`}
                ></div>
                <div className="mr10">
                  {formatMessage(messages.non_critical_text)}
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
    const { graphs } = this.props;
    const { formatMessage, renderChartTabs } = this;

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

          <div className="mt10 flex justify-space-between align-center">
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
        {/* <AddAppointmentDrawer /> */}
      </Fragment>
    );
  }
}

export default injectIntl(Dashboard);
