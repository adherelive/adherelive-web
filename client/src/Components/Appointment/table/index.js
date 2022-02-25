import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table, Icon } from "antd";
import generateRow from "./dataRow";
import getColumn from "./header";
// import { getAppointmentsForPatientUrl } from "../../../Helper/url/appointments";
import messages from "./messages";

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

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRows: selectedRowKeys });
  };

  getLoadingComponent = () => {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return {
      indicator: antIcon,
    };
  };

  getDataSource = () => {
    const { appointments, users, doctors, patients } = this.props;

    return Object.keys(appointments).map((id) => {
      return generateRow({
        id,
        appointments,
        users,
        doctors,
        patients,
      });
    });
  };

  formatMessage = (data) => this.intl.formatMessage(data);

  render() {
    const { onRow, onSelectChange, getLoadingComponent, getDataSource } = this;

    // const rowSelection = {
    //   onChange: onSelectChange
    // };

    const { loading, intl: { formatMessage } = {} } = this.props;

    const locale = {
      emptyText: this.formatMessage(messages.emptyAppointmentTable),
    };

    return (
      <Table
        // onRow={onRow}
        className="wp100"
        rowClassName={() => "pointer"}
        loading={loading === true ? getLoadingComponent() : false}
        locale={locale}
        columns={getColumn({
          formatMessage,
          className: "pointer",
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
