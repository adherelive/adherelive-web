import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table, Icon } from "antd";
import generateRow from "./dataRow";
import getColumn from "./header";
import messages from "./messages";

import Input from "antd/es/input";
import Button from "antd/es/button";
import SearchOutlined from "@ant-design/icons/SearchOutlined";
import Highlighter from "react-highlight-words";
import { TABLE_COLUMN } from "./helper";
import { DIAGNOSIS_TYPE } from "../../../constant";

class PatientTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      searchedColumn: "",
    };
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

  formatMessage = (data) => this.props.intl.formatMessage(data);

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
      openEditPatientDrawer,
    } = this.props;

    const { onRowClick } = this;

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
        openEditPatientDrawer,
      });
    });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: "100%", marginBottom: 8, display: "block" }}
        />

        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          {this.formatMessage(messages.searchText)}
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          {this.formatMessage(messages.resetText)}
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex === TABLE_COLUMN.TREATMENT.dataIndex) {
        const { carePlanData = {} } = record[dataIndex] || {};
        const { treatment = "" } = carePlanData;

        return treatment
          ? treatment.toString().toLowerCase().includes(value.toLowerCase())
          : "";
      } else if (dataIndex === TABLE_COLUMN.DIAGNOSIS.dataIndex) {
        const { patientData = {} } = record[dataIndex] || {};
        const { carePlanData = {} } = patientData;
        const { details: { diagnosis = {} } = {} } = carePlanData;
        const { type = "1", description = "" } = diagnosis || {};

        const diagnosisType = DIAGNOSIS_TYPE[type];
        const diagnosisTypeValue = diagnosisType["value"] || "";

        const recordText = `${diagnosisTypeValue} ${description}`;
        return recordText
          ? recordText.toString().toLowerCase().includes(value.toLowerCase())
          : "";
      }
    },
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
  });

  render() {
    const { onRow, onSelectChange, getLoadingComponent, getDataSource } = this;

    const rowSelection = {
      onChange: onSelectChange,
    };

    const { loading, intl: { formatMessage } = {} } = this.props;

    const patientLocale = {
      emptyText: formatMessage(messages.emptyPatientTable),
    };

    return (
      <Table
        rowClassName={() => "pointer"}
        loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
          getColumnSearchProps: this.getColumnSearchProps,
        })}
        dataSource={getDataSource()}
        scroll={{ x: 1600 }}
        pagination={{
          position: "bottom",
        }}
        locale={patientLocale}
      />
    );
  }
}

export default injectIntl(PatientTable);
