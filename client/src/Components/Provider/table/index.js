import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Table from "antd/es/table";
import Icon from "antd/es/icon";
import message from "antd/es/message";


import generateRow from "./dataRow";
import getColumn from "./header";

class DoctorTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doctor_ids_state:[]
        }
    }

    componentDidMount() {
        const { doctor_ids } = this.props;
        const {doctor_ids_state = [] } = this.state;

        this.handleGetDoctorsForProvider();

        if (doctor_ids.length !== doctor_ids_state) {
            this.handleGetDoctorsForProvider();
        }
    }

    componentDidUpdate(prevProps,prevState){
        const { doctor_ids : prev_doctor_ids} = prevProps; 
        const { doctor_ids } = this.props;

        if (doctor_ids.length === prev_doctor_ids) {
            this.handleGetDoctorsForProvider()
        }
    }

    async handleGetDoctorsForProvider (){
        try {
            const { getAllDoctorsForProvider } = this.props;
            
            const response = await getAllDoctorsForProvider();
            const { status, payload: { data = {} }  = {}} = response;

           if(status){
            const {data:{doctor_ids : doctor_ids_state = []} = {} } = data || {};
            this.setState({doctor_ids_state});
           }else{
            const { doctor_ids : doctor_ids_state} = this.props;
            this.setState({doctor_ids_state});
           }

           
          } catch (err) {
            console.log("err", err);
            message.warn("Something wen't wrong. Please try again later");
          }
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRows: selectedRowKeys });
    };

    getLoadingComponent = () => {
        const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
        return {
            indicator: antIcon
        };
    };

    getDataSource = () => {
        const { users, doctors, doctor_ids, specialities } = this.props;

      
        return doctor_ids.map(id => {
            return generateRow({
                id,
                users,
                doctors,
                specialities
            });
        });
    };

    onRowClick = key => event => {
        const { history } = this.props;
        history.push(`/doctors/${key}`);
    };

    onRow = (record) => {
        const { onRowClick } = this;
        const { key } = record;
        return {
            onClick: onRowClick(key)
        };
    };

    render() {
        const { onRow, getLoadingComponent, getDataSource } = this;
        const {
            loading,
            pagination_bottom,
            intl: { formatMessage } = {}
        } = this.props;

        console.log("provider doctor table props ===>",this.props);

        return (
            <Table
                // onRow={onRow}
                className="wp100"
                rowClassName={() => "pointer"}
                loading={loading === true ? getLoadingComponent() : false}
                columns={getColumn({
                    formatMessage,
                    className: "pointer"
                })}
                dataSource={getDataSource()}
                scroll={{ x: 1600 }}
                pagination={{ position: pagination_bottom ? "bottom" : "top" }}
            // pagination={{
            //     position: "bottom"
            // }}
            />
        );
    }
}

export default injectIntl(DoctorTable);