import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Icon, Table } from "antd";
import generateRow from "./datarow";
// import { USER_PERMISSIONS } from '../../../constant'
import getColumn from "./header";
import messages from "./messages";

class ConsultationFeeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState) {}

  // onRowClick = (key) => (event) => {
  //   event.preventDefault();
  //   // const { openPatientDetailsDrawer } = this.props;
  //   // openPatientDetailsDrawer({ patient_id: key });
  // };

  //   onRow = (record, rowIndex) => {
  //     const { onRowClick } = this;
  //     const { key } = record;
  //     return {
  //       onClick: onRowClick(key),
  //     };
  //   };

  //   onSelectChange = (selectedRowKeys) => {
  //     this.setState({ selectedRows: selectedRowKeys });
  //   };

  getLoadingComponent = () => {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return {
      indicator: antIcon,
    };
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getDataSource = () => {
    const {
      doctors = {},
      doctorPaymentProducts,
      deleteDoctorProduct,
      editDoctorProduct = null,
      intl: { formatMessage } = {},
    } = this.props;

    // const {onRowClick} = this;
    let options = [];

    for (let each in doctorPaymentProducts) {
      options.push(
        generateRow({
          ...doctorPaymentProducts[each],
          deleteDoctorProduct,
          editDoctorProduct,
          formatMessage,
          doctors,
        })
      );
    }

    return options;
  };

  render() {
    const {
      // onRow,
      onSelectChange,
      // getLoadingComponent,
      getDataSource,
    } = this;

    const rowSelection = {
      onChange: onSelectChange,
    };

    const {
      loading,
      pagination_bottom,
      authPermissions = [],
      intl: { formatMessage } = {},
    } = this.props;

    const locale = {
      emptyText: this.formatMessage(messages.emptyConsultationTable),
    };

    return (
      <Table
        // onRow={authPermissions.includes(USER_PERMISSIONS.PATIENTS.VIEW) ? onRow : null}
        rowClassName={() => "pointer"}
        // loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
        })}
        dataSource={getDataSource()}
        scroll={{ x: "100%" }}
        pagination={{
          position: "top",
          // pageSize: 6
        }}
        locale={locale}
      />
    );
  }
}

export default injectIntl(ConsultationFeeTable);
