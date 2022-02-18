import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table, Icon, Empty } from "antd";
import generateRow from "./datarow";
// import { USER_PERMISSIONS } from '../../../constant'
import getColumn from "./header";
import messages from "./messages";
import message from "antd/es/message";

class DoctorServiceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // this.handleGetDoctorPaymentProducts();
  }

  //   async handleGetDoctorPaymentProducts() {
  //     try {
  //       const { getDoctorPaymentProduct } = this.props;
  //       let response = {};
  //       const { doctor_id = null } = this.props;
  //       if (doctor_id) {
  //         response = await getDoctorPaymentProduct({ doctor_id: doctor_id });
  //       } else {
  //         response = await getDoctorPaymentProduct();
  //       }

  //       const {
  //         status,
  //         statusCode,
  //         payload: { data = {}, message: message_resp_msg = "" } = {},
  //       } = response || {};
  //       if (!status && statusCode !== 201) {
  //         message.warn(message_resp_msg);
  //       }
  //     } catch (error) {
  //       console.log("326423646237 error ====>", error);
  //     }
  //   }

  componentDidUpdate(prevProps, prevState) {}

  getLoadingComponent = () => {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return {
      indicator: antIcon,
    };
  };

  //   formatMessage = (data) => this.props.intl.formatMessage(data);

  getDataSource = () => {
    const {
      doctors = {},
      // doctorPaymentProducts={},
      deleteDoctorPaymentProduct,
      openConsultationFeeDrawer,
      intl: { formatMessage } = {},
      payment_products = {},
    } = this.props;
    const dummyProducts = {
      7: {
        basic_info: {
          id: 7,
          name: "Remote monitoring",
          type: "Physical",
          amount: 200,
        },
        creator_role_id: 10,
        creator_type: "doctor",
        for_user_role_id: 10,
        for_user_type: "doctor",
        product_user_type: "patient",
        details: null,
        razorpay_link: "",
      },
      14: {
        basic_info: {
          id: 14,
          name: "At clinic physical consultation",
          type: "Digital",
          amount: 300,
        },
        creator_role_id: 10,
        creator_type: "doctor",
        for_user_role_id: 10,
        for_user_type: "doctor",
        product_user_type: "patient",
        details: null,
        razorpay_link: "",
      },
    };

    console.log(doctors);

    // const {onRowClick} = this;
    let options = [];

    for (let each in dummyProducts) {
      const { creator_role_id = null, for_user_role_id = null } =
        dummyProducts[each] || {};
      if (creator_role_id !== null) {
        options.push(
          generateRow({
            ...dummyProducts[each],
            deleteDoctorProduct: deleteDoctorPaymentProduct,
            openConsultationFeeDrawer,
            formatMessage,
            doctors,
            editable: creator_role_id === for_user_role_id ? true : false,
          })
        );
      }
    }

    console.log(options);

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
      //   emptyText: this.formatMessage(messages.emptyConsultationTable),
      emptyText: "No consultation fee to display yet",
    };

    return (
      <Table
        // onRow={authPermissions.includes(USER_PERMISSIONS.PATIENTS.VIEW) ? onRow : null}
        rowClassName={() => "pointer"}
        // loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          //   formatMessage,
          className: "pointer",
        })}
        dataSource={getDataSource()}
        scroll={{ x: "100%" }}
        pagination={{
          position: "top",
          pageSize: 3,
        }}
        locale={locale}
      />
    );
  }
}

export default injectIntl(DoctorServiceTable);
