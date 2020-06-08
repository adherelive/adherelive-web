import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table, Icon } from "antd";
import generateRow from "./dataRow";
import getColumn from "./header";
import { getAppointmentsForPatientUrl } from "../../../Helper/url/appointments";

class PatientTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // onRow = (record, rowIndex) => {
  //   const { onRowClick } = this;
  //   const { key } = record;
  //   return {
  //     onClick: onRowClick(key)
  //   };
  // };

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
    const { appointments, appointment_ids = [] } = this.props;

    console.log("192837 this.props ----> ", appointments, appointment_ids);

    return appointment_ids.map(id => {
      return generateRow({
        id,
        appointments
      });
    });
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
        // onRow={onRow}
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

export default injectIntl(PatientTable);
