import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";

import Table from "antd/es/table";
import Icon from "antd/es/icon";

import generateRow from "./dataRow";
import getColumn from "./header";

import messages from "./messages";
import { USER_CATEGORY } from "../../../constant";

class ProviderTable extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { getAllProviders } = this.props;
    getAllProviders();
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
    const { users, providers, provider_ids, openEditProviderDrawer } =
      this.props;

    console.log("7865467890", { providers, provider_ids });

    return Object.keys(providers).map((id) => {
      return generateRow({
        id,
        users,
        providers,
        openEditProviderDrawer,
      });
    });
  };

  getTableTitle = () => {
    const { intl: { formatMessage } = {} } = this.props;
    const { auth: { authenticated_category = "" } = {} } = this.props;
    return authenticated_category === USER_CATEGORY.ADMIN ? (
      <div className="fs22 fw600 m0">{formatMessage(messages.providers)}</div>
    ) : null;
  };

  render() {
    const { getLoadingComponent, getDataSource, getTableTitle } = this;

    const {
      loading,
      pagination_bottom,
      intl: { formatMessage } = {},
    } = this.props;

    return (
      <Table
        // onRow={onRow}
        className="wp100 mt40 mb40"
        rowClassName={() => "pointer"}
        loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
        })}
        dataSource={getDataSource()}
        scroll={{ x: "100%" }}
        // title={getTableTitle}
        pagination={{
          position: "top",
          pageSize: 10,
        }}
      />
    );
  }
}

export default withRouter(injectIntl(ProviderTable));
