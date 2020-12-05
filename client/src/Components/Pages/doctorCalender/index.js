import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";
import { Calendar,Badge,message } from "antd";
import moment from "moment";


class doctorCalender extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        // console.log("PROPSSSSSSSSSS",this.props);
        const {getCalenderDataCountForDay , getCalenderDataForDay} = this.props;
    }

    async hangleGetEventsForDay(value)  {
        try{
            const {getCalenderDataCountForDay} = this.props;
            // console.log("dateeeeeeee", moment().toISOString(value));
            let ISOdate =  moment().toISOString(value);

            const response  =  await getCalenderDataCountForDay(ISOdate);
            const { status, payload: { data, message } = {} } = response;
            if(status){
                console.log("REsponse =========>",response);
            }

        }catch(error){
            console.log("Error ---->",error);
            message.warn("Something went wront. Please try again later.")
        }
    }


    getListData = (value) => {
    let listData;
    // getCalenderDataForDay
    this.hangleGetEventsForDay(value);
    switch (value.date()) {
        // case 8:
        // listData = [
        //     { type: 'warning', content: 'This is warning event.'},
        //     { type: 'success', content: 'This is usual event.' },
        // ];
        // break;
        // case 10:
        // listData = [
        //     { type: 'warning', content: 'This is warning event.' },
        //     { type: 'success', content: 'This is usual event.' },
        //     { type: 'error', content: 'This is error event.' },
        // ];
        // break;
        // case 15:
        // listData = [
        //     { type: 'warning', content: 'This is warning event' },
        //     { type: 'success', content: 'This is very long usual event。。....' },
        //     { type: 'error', content: 'This is error event 1.' },
        //     { type: 'error', content: 'This is error event 2.' },
        //     { type: 'error', content: 'This is error event 3.' },
        //     { type: 'error', content: 'This is error event 4.' },
        // ];
        // break;
        default:
             listData = [
            { type: 'success', content: 'This is very long usual event。。....' }
        ];
    }
    return listData || [];
    }

    dateCellRender = (value) =>  {
    // console.log("34243242342 dateCellRender",value);    
    const listData = this.getListData(value);
    return (
        <ul className="events">
        {listData.map(item => (
            <li key={item.content}>
            <Badge 
            status={item.type} 
            text={item.content} 
            />
            </li>
        ))}
        </ul>
    );
    }

    getMonthData = (value) => {
    if (value.month() === 8) {
        return 1394;
    }
    }

    monthCellRender = (value) =>  {
    const num = this.getMonthData(value);
    return num ? (
        <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
        </div>
    ) : null;
    }


    render() {
        return (
            <Fragment>
                <div className="wp100 flex direction-column">
                {/* <Calendar
                    
                    // dateCellRender={dateCellRender}
                    // monthCellRender={monthCellRender}
                    // onPanelChange={onPanelChange}
                    // onSelect={onSelect}
                    
                /> */}
                <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} />
                </div>
            </Fragment>
        );
    }
}

export default injectIntl(doctorCalender);