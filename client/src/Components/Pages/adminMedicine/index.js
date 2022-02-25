import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import messages from "./messages";
import Button from "antd/es/button";
import Tabs from "antd/es/tabs";
import AddMedicineDrawer from "../../../Containers/Drawer/addMedicine";
import MedicineTable from "../../../Containers/Medicines/table";
import config from "../../../config";
import message from "antd/es/message";

const { TabPane } = Tabs;

const ALL_TABS = {
  PUBLIC: "1",
  CREATOR: "2",
};

class AdminMedicine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalPublicMedicinesCount: 0,
      totalPrivateMedicinesCount: 0,
      currentTab: ALL_TABS.PUBLIC,
    };
  }

  componentDidMount() {
    this.handleGetAllPublicMedicines();
    this.handleGetAllPrivateMedicines();
  }

  componentDidUpdate(prevProps, prevState) {}

  async handleGetAllPublicMedicines() {
    try {
      const offset = 0;
      const { getPublicMedicines } = this.props;
      const response = await getPublicMedicines({ offset });
      const {
        payload: {
          data: { total_count = 0 } = {},
          response: resp_msg = "",
        } = {},
      } = response || {};
      this.setState({ totalPublicMedicinesCount: total_count });
    } catch (error) {
      console.log("89368754234 error ===>", error);
    }
  }

  async handleGetAllPrivateMedicines() {
    try {
      const offset = 0;
      const { getPrivateMedicines } = this.props;
      const response = await getPrivateMedicines({ offset });
      const {
        payload: {
          data: { total_count = 0 } = {},
          response: resp_msg = "",
        } = {},
      } = response || {};
      this.setState({ totalPrivateMedicinesCount: total_count });
    } catch (error) {
      console.log("89368754234 error ===>", error);
    }
  }

  changeTab = (tab) => {
    this.setState({ currentTab: tab });
  };

  formatMessage = (message, ...rest) =>
    this.props.intl.formatMessage(message, rest);

  handleAddMedicine = (e) => {
    e.preventDefault();
    const { openAddMedicineDrawer } = this.props;
    openAddMedicineDrawer();
  };

  getHeader = () => {
    const { formatMessage, handleAddMedicine } = this;
    return (
      <div className="wp100 flex justify-space-between mb20">
        <div className="fs30 fw700">
          {formatMessage(messages.medicine_header)}
        </div>
        {/* add button */}
        <Button type="primary" onClick={handleAddMedicine} icon={"plus"}>
          {formatMessage(messages.add_text)}
        </Button>
      </div>
    );
  };

  getTabContent = () => {
    const { formatMessage, changeTab } = this;
    const {
      totalPublicMedicinesCount,
      totalPrivateMedicinesCount,
      currentTab,
    } = this.state;

    return (
      <Fragment>
        <Tabs
          defaultActiveKey={ALL_TABS.PUBLIC}
          activeKey={currentTab}
          onTabClick={changeTab}
        >
          <TabPane
            tab={formatMessage(messages.public_text)}
            key={ALL_TABS.PUBLIC}
          >
            <MedicineTable
              currentTab={ALL_TABS.PUBLIC}
              totalPublicMedicinesCount={totalPublicMedicinesCount}
              changeTab={changeTab}
            />
          </TabPane>
          <TabPane
            tab={formatMessage(messages.creator_text)}
            key={ALL_TABS.CREATOR}
          >
            <MedicineTable
              currentTab={ALL_TABS.CREATOR}
              totalPrivateMedicinesCount={totalPrivateMedicinesCount}
              changeTab={changeTab}
            />
          </TabPane>
        </Tabs>
      </Fragment>
    );
  };

  // closeMedicineDrawer = () => {
  //   const {closeDrawer} = this.props;
  //     closeDrawer();
  // };

  render() {
    const { visible } = this.props;
    const { getHeader, getTabContent, closeMedicineDrawer } = this;

    return (
      <div className="p18">
        {/******** HEADER ********/}

        {getHeader()}

        {/******** TABS ********/}
        {getTabContent()}

        <AddMedicineDrawer visible={visible} />
      </div>
    );
  }
}

export default injectIntl(AdminMedicine);
