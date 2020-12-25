import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table, Icon } from "antd";
import generateRow from "./datarow";
// import { PERMISSIONS } from '../../../constant'
import getColumn from "./header";

class ConsultationFeeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

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

  getDataSource = () => {
    const {
        doctorPaymentProducts,
        deleteDoctorProduct
    } = this.props;

    // const {onRowClick} = this;
    let options = [];

    for( let each in doctorPaymentProducts){
        options.push(
            generateRow({
              ...doctorPaymentProducts[each],
              deleteDoctorProduct
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
        getDataSource } = this;

    const rowSelection = {
      onChange: onSelectChange,
    };


    const {
      loading,
      pagination_bottom,
      authPermissions = [],
      intl: { formatMessage } = {},
    } = this.props;

    return (
      <Table
        
        // onRow={authPermissions.includes(PERMISSIONS.VIEW_PATIENT) ? onRow : null}
        rowClassName={() => "pointer"}
        // loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
          
        })}
        dataSource={getDataSource()}
        scroll={{ x: 900 }}
        pagination={{
          position: "bottom",
          pageSize:6
        }}
        
      />
    );
  }
}

export default injectIntl(ConsultationFeeTable);
