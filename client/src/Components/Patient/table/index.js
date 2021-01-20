import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table, Icon } from "antd";
import generateRow from "./dataRow";
import getColumn from "./header";

class PatientTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onRowClick = (key) => (event) => {
    event.preventDefault();
    const { openPatientDetailsDrawer } = this.props;
    openPatientDetailsDrawer({ patient_id: key });
  };

  onRow = (record, rowIndex) => {
    const { onRowClick } = this;
    const { key } = record;
    return {
      onClick: onRowClick(key),
    };
  };

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
    const {
      chat_ids,
      patients,
      doctors,
      providers,
      treatments,
      conditions,
      severity,
      chats,
      care_plans,
      users,
      authenticated_user,
      addToWatchlist,
      removePatientFromWatchlist,
      openEditPatientDrawer
    } = this.props;

    const {onRowClick} = this;
  
    return Object.keys(patients).map((id) => {
      return generateRow({
        id,
        patients,
        doctors,
        providers,
        treatments,
        conditions,
        severity,
        chats,
        chat_ids,
        care_plans,
        users,
        authenticated_user,
        addToWatchlist,
        onRowClick,
        removePatientFromWatchlist,
        openEditPatientDrawer
      });
    });
  };

  render() {
    const { onRow, onSelectChange, getLoadingComponent, getDataSource } = this;

    const rowSelection = {
      onChange: onSelectChange,
    };


    const {
      loading,
      intl: { formatMessage } = {},
    } = this.props;

    return (
      <Table
        
        rowClassName={() => "pointer"}
        loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
        })}
        dataSource={getDataSource()}
        scroll={{ x: 1600 }}
        pagination={{
          position: "bottom",
        }}
        
      />
    );
  }
}

export default injectIntl(PatientTable);
