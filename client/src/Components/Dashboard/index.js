import React, {Component, Fragment} from "react";
import {injectIntl} from "react-intl";
import messages from "./message";
import drawChart from "../../Helper/drawChart";
import {CHART_TITLE, GRAPH_COLORS} from "../../constant";
import Tabs from "antd/es/tabs";
import Patients from "../../Containers/Patient/table";
import PatientDetailsDrawer from "../../Containers/Drawer/patientDetails";
import AddAppointmentDrawer from "../../Containers/Drawer/addAppointment";
import AddPatientDrawer from "../Drawer/addPatient";
import AddPatient  from '../../Assets/images/add-user.png';
import Loading from "../Common/Loading";
import { withRouter } from "react-router-dom";
import { addPatient } from "../../modules/doctors";
import { message } from "antd";


const {TabPane} = Tabs;

const SUMMARY = "Summary";
const WATCHLIST = "Watch list";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false
        };
    }

    componentDidMount() {
        const {graphs, getInitialData, searchMedicine} = this.props;
        getInitialData();
        // searchMedicine("");
        console.log("DashBoard Did MOunt DOCTORRRRR ROUTERRR ----------------->   ")
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

    showAddPatientDrawer=()=>{
        this.setState({visible:true});
    }

     addPatient=(data)=>{

        const{addPatient,authenticated_user,getInitialData}=this.props;

        const { basic_info: { id = 1 } = {} } = authenticated_user || {};
        addPatient(data,id).then(response=>{
            const{status=false,payload:{data:{patient_id=1,carePlanTemplateId=0}={}}={}}=response;
            let showTemplateDrawer=carePlanTemplateId?true:false;
            if(status){
                getInitialData().then(()=>{
            
          
                this.props.history.push({pathname:`/patients/${patient_id}`,
            state:{showTemplateDrawer}});
        
                })
            }else{
                message.error('Something went wrong');
            }
        });
     }

    hideAddPatientDrawer=()=>{
        this.setState({visible:false});
    }
    render() {
        console.log("19273 here  DOCTORRRRR ROUTERRR  --> dashboard",this.props);
        const {graphs} = this.props;
        const {formatMessage, renderChartTabs} = this;

        const{visible}=this.state;
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
                        <img src={AddPatient} className='add-patient' onClick={this.showAddPatientDrawer}/>
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

                <AddPatientDrawer close={this.hideAddPatientDrawer} visible={visible} submit={this.addPatient} />
            </Fragment>
        );
    }
}

export default withRouter(injectIntl(Dashboard));
