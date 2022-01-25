import React, { Component } from "react";
import { injectIntl } from "react-intl";
import TemplateTable from "../../../Containers/allTemplates/index";
import message from "antd/es/message";
import Button from "antd/es/button";
import TemplatePageCreateDrawer from "../../../Containers/Drawer/allTemplatesPageCreateTemplate";
import TemplatePageEditDrawer from "../../../Containers/Drawer/allTemplatesPageEditTemplate";
import messages from "./message";

class TemplatePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.handleGetAllTemplates();
    const { getVitalOccurence } = this.props;
    getVitalOccurence().then((res) => {
      const { status = false } = res;
      if (status) {
      }
    });
    this.handleGetMedicationDetails("0");
    this.handleGetAllData();
  }

  async handleGetAllTemplates() {
    const { getAllTemplatesForDoctor } = this.props;
    try {
      this.setState({ loading: true });
      const response = await getAllTemplatesForDoctor();
      const { status, payload: { data = {}, message: msg = "" } = {} } =
        response || {};
      if (!status) {
        message.warn(msg);
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      console.log("error ===>", error);
      message.warn(error);
    }
  }

  componentDidUpdate() {
    // console.log("3289467832482354723874792384 UPDATEEEEEEEEEEEEEEEEEE");
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  async handleGetMedicationDetails(patientId = "0") {
    try {
      const { getMedicationDetails } = this.props;
      const response = await getMedicationDetails(patientId);
      const {
        status,
        statusCode,
        payload: { data = {}, message: msg = "" } = {},
      } = response;

      if (!status) {
        message.error(msg);
      }
    } catch (error) {
      console.log("err ===>", error);
    }
  }

  handleOpenCreateDrawer = () => {
    const { openCreateCareplanTemplateDrawer } = this.props || {};
    openCreateCareplanTemplateDrawer({});
  };

  handleOpenEditDrawer =
    ({ id }) =>
    (e) => {
      e.preventDefault();
      const { openEditCareplanTemplateDrawer } = this.props;
      openEditCareplanTemplateDrawer({ id });
    };

  async handleGetAllData() {
    const { getAppointmentsDetails, searchMedicine } = this.props || {};
    try {
      const apptResponse = await getAppointmentsDetails();

      const {
        payload: { data: apptData = {}, message: apptMessage = "" } = {},
        status: apptStatus = "",
        statusCode: apptStatusCode = "",
      } = apptResponse || {};

      if (!apptStatus) {
        message.error(apptMessage);
      }

      searchMedicine(""); // to display medicine name of new med inside templateDrawer after editing med
    } catch (error) {
      console.log("error --->", error);
      message.warn(error);
    }
  }

  getHeader = () => {
    const { handleOpenCreateDrawer } = this;

    return (
      <div className="flex pt20  pb10 pl24 pr16">
        <div className="patient-profile-header flex-grow-0">
          <div className="fs28 fw700">
            {this.formatMessage(messages.templates)}
          </div>
        </div>
        <div className="flex-grow-1 tar">
          <Button type={"primary"} onClick={handleOpenCreateDrawer}>
            {this.formatMessage(messages.createText)}
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        <div>
          <div className="wp100 flex direction-column">
            {this.getHeader()}
            <div className="wp100 pl14 pr14 flex align-center justify-center mb36">
              <TemplateTable
                {...this.props}
                loading={loading}
                handleOpenEditDrawer={this.handleOpenEditDrawer}
              />
            </div>
          </div>
        </div>

        <TemplatePageCreateDrawer {...this.props} />
        <TemplatePageEditDrawer {...this.props} />
      </div>
    );
  }
}

export default injectIntl(TemplatePage);
