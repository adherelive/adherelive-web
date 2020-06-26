import React, {Component} from "react";
import {injectIntl} from "react-intl";

import Table from "antd/es/table";
import Icon from "antd/es/icon";

import generateRow from "./dataRow";
import getColumn from "./header";

class DoctorTable extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {getAllDoctors} = this.props;
        getAllDoctors();
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

        return doctor_ids.map(id => {
            return generateRow({
                id,
                users,
                doctors,
            });
        });
    };

    onRowClick = key => event => {
        const {history} = this.props;
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
        const { onRow, onSelectChange, getLoadingComponent, getDataSource } = this;

        const rowSelection = {
            onChange: onSelectChange
        };

        // console.log("192837 ", getDataSource());

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
                // pagination={{ position: pagination_bottom ? "bottom" : "top" }}
                // pagination={{
                //   position: "bottom"
                // }}
            />
        );
    }
}

export default injectIntl(DoctorTable);