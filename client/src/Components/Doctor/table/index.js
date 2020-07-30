import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Table from "antd/es/table";
import Icon from "antd/es/icon";

import generateRow from "./dataRow";
import getColumn from "./header";

class DoctorTable extends Component {
    // constructor(props) {
    //     super(props);
    // }

    componentDidMount() {
        const { getAllDoctors, doctor_ids } = this.props;
        if (doctor_ids.length === 0) {
            getAllDoctors();
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
        const { users, doctors, doctor_ids, user_ids } = this.props;

        console.log("37129379137 users, doctors, doctor_ids, user_ids  -> ", users, doctors, doctor_ids, user_ids);

        return doctor_ids.map(id => {
            return generateRow({
                id,
                users,
                doctors,
            });
        });
    };

    onRowClick = key => event => {
        const { history } = this.props;
        history.push(`/doctors/${key}`);
    };

    onRow = (record, rowIndex) => {
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

        return (
            <Table
                onRow={onRow}
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