import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table, Icon, Empty } from "antd";
import generateRow from "./datarow";
// import { USER_PERMISSIONS } from '../../../constant'
import getColumn from "./header";
import messages from "./messages"; 
import message from "antd/es/message";

class ConsultationFeeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.handleGetDoctorPaymentProducts();
  }
  
  async handleGetDoctorPaymentProducts(){
    try{
      const {getDoctorPaymentProduct} = this.props;
      let response ={};
      const {doctor_id=null}=this.props;
      if(doctor_id){
         response = await getDoctorPaymentProduct({ doctor_id: doctor_id });
      }else{
        response = await getDoctorPaymentProduct();
      }

      const {status , statusCode , payload : {data={} , message : message_resp_msg =''}={}} = response || {};
      if(!status  && statusCode !== 201){
        message.warn(message_resp_msg);
      }
    }catch(error){
      console.log("326423646237 error ====>",error);
    }
  }

  componentDidUpdate(prevProps,prevState){}



  getLoadingComponent = () => {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return {
      indicator: antIcon
    };
  };

  formatMessage = data =>  this.props.intl.formatMessage(data);

  getDataSource = () => {
    const {
      doctors ={},
      // doctorPaymentProducts={},
      deleteDoctorPaymentProduct,
      openConsultationFeeDrawer,
      intl: { formatMessage } = {},
      payment_products={}
    } = this.props;

    // const {onRowClick} = this;
    let options = [];

    for (let each in payment_products) {
      const {creator_role_id = null, for_user_role_id = null} = payment_products[each] || {};
      if(creator_role_id !== null){
        options.push(
          generateRow({
            ...payment_products[each],
            deleteDoctorProduct:deleteDoctorPaymentProduct,
            openConsultationFeeDrawer,
            formatMessage,
            doctors,
            editable: creator_role_id === for_user_role_id? true: false
          })
        );
      }
    
    }

    return options;
  };

  render() {
    const {
      // onRow,
      onSelectChange,
      // getLoadingComponent,
      getDataSource
    } = this;

    const rowSelection = {
      onChange: onSelectChange
    };

    const {
      loading,
      pagination_bottom,
      authPermissions = [],
      intl: { formatMessage } = {}
    } = this.props;

    const locale = {
      emptyText: this.formatMessage(messages.emptyConsultationTable)
    };
    
    return (
      <Table
        // onRow={authPermissions.includes(USER_PERMISSIONS.PATIENTS.VIEW) ? onRow : null}
        rowClassName={() => "pointer"}
        // loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer"
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
