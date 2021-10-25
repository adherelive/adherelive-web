import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import generateRow from "./dataRow";
import getColumn from "./header";
import Table from "antd/es/table";

import ReportDocumentModal from "../../Modal/reportDocuments";
import messages from "./message";

class ReportTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      report_ids: [],
      documentData: {},
    };
  }

  componentDidMount() {
    this.getReports();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { report_ids } = this.props;
    const { report_ids: prev_report_ids } = prevProps;

    if (report_ids !== prev_report_ids) {
      this.setState({ report_ids });
    }
  }

  formatMessage = (message) => this.props.intl.formatMessage(message);

  getReports = async () => {
    try {
      const { fetchPatientReports } = this.props;
      const { loading } = this.state;
      const response = await fetchPatientReports();
      const { status, payload: { data: { report_ids = [] } = {} } = {} } =
        response || {};
      if (status === true) {
        this.setState({ report_ids, loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  openEditDrawer = (payload) => () => {
    const { openEditReport } = this.props;
    openEditReport(payload);
  };

  openModal = (documentData) => () => {
    this.setState({ documentData, modalVisible: true });
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  getDataSource = () => {
    const { reports, patients, doctors, upload_documents } = this.props;
    const { report_ids } = this.state;
    const { formatMessage, openModal, openEditDrawer } = this;

    return report_ids.map((id) => {
      return generateRow({
        formatMessage,
        id,
        reports,
        patients,
        doctors,
        upload_documents,
        openEditDrawer,
        openModal,
      });
    });
  };

  // openResponseDrawer = (id) => (e) => {
  //     e.preventDefault();
  //     const {vitalResponseDrawer} = this.props;
  //     vitalResponseDrawer({id, loading: true});
  // };

  // openEditDrawer = (id) => (e) => {
  //     e.preventDefault();
  //     const {editVitalDrawer, isOtherCarePlan} = this.props;
  //     if(!isOtherCarePlan) {
  //         editVitalDrawer({id, loading: true});
  //     }
  // };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  render() {
    const { intl: { formatMessage } = {} } = this.props;
    const { modalVisible, documentData } = this.state;
    const { getDataSource, closeModal } = this;

    const reportLocale = {
      emptyText: this.formatMessage(messages.emptyReports),
    };

    return (
      <Fragment>
        <Table
          rowClassName={() => "pointer"}
          // loading={loading === true ? getLoadingComponent() : false}
          columns={getColumn({
            formatMessage,
            className: "pointer",
          })}
          dataSource={getDataSource()}
          scroll={{ x: "100%" }}
          pagination={{
            position: "bottom",
          }}
          locale={reportLocale}
        />
        <ReportDocumentModal
          visible={modalVisible}
          documentData={documentData}
          onClose={closeModal}
          formatMessage={formatMessage}
        />
      </Fragment>
    );
  }
}

export default injectIntl(ReportTable);
