import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";

import Table from "antd/es/table";
import Icon from "antd/es/icon";

import generateRow from "./dataRow";
import getColumn from "./header";

import messages from "./messages";
import { USER_CATEGORY } from "../../../constant";

class DoctorTable extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { getAllDoctors } = this.props;
    getAllDoctors();
  }

  componentDidUpdate(prevProps) {
    const { doctor_ids: prev_doctor_ids = [] } = prevProps;
    const { getAllDoctors, doctor_ids = [] } = this.props;

    // const fetchDoctors = doctor_ids.length && prev_doctor_ids.length && (doctor_ids.length !== prev_doctor_ids.length);

    if (
      doctor_ids.length &&
      prev_doctor_ids.length &&
      doctor_ids.length !== prev_doctor_ids.length
    ) {
      getAllDoctors();
    }
  }

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
    const { users, doctors, doctor_ids, specialities } = this.props;
    const { intl: { formatMessage } = {} } = this.props;

    return doctor_ids.map((id) => {
      return generateRow({
        id,
        users,
        doctors,
        specialities,
        formatMessage,
      });
    });
  };

  onRowClick = (key) => (event) => {
    event.preventDefault();
    const { history } = this.props;
    history.push(`/doctors/${key}`);
  };

  onRow = (record) => {
    const { onRowClick } = this;
    const { key } = record;
    return {
      onClick: onRowClick(key),
    };
  };

  getTableTitle = () => {
    const { intl: { formatMessage } = {} } = this.props;
    const { auth: { authenticated_category = "" } = {} } = this.props;
    return authenticated_category === USER_CATEGORY.PROVIDER ? (
      <div className="fs22 fw600 m0">{formatMessage(messages.profiles)}</div>
    ) : null;
  };

  render() {
    const { onRow, getLoadingComponent, getDataSource, getTableTitle } = this;

    const {
      loading,
      //pagination_bottom,
      intl: { formatMessage } = {},
    } = this.props;

    const doctorLocale = {
      emptyText: formatMessage(messages.emptyDoctorTable),
    };

    return (
      <Table
        onRow={onRow}
        className="wp100 mt40"
        rowClassName={() => "pointer"}
        loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
        })}
        dataSource={getDataSource()}
        scroll={{ x: 1600 }}
        title={getTableTitle}
        pagination={{
          position: "top",
        }}
        locale={doctorLocale}
      />
    );
  }
}

export default withRouter(injectIntl(DoctorTable));
