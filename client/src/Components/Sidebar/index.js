import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Menu, Tooltip } from "antd";
import { PATH } from "../../constant";

import Logo from "../../Assets/images/logo.svg";
import dashboardIcon from "../../Assets/images/dashboard.svg";
import { withRouter } from "react-router-dom";

const { Item: MenuItem } = Menu || {};

const DASHBOARD = "dashboard";
const PROFILE = "profile";

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: ""
    };
  }

  handleItemSelect = ({ selectedKeys }) => {
    const { history, logout } = this.props;
    console.log(selectedKeys);
    switch (selectedKeys[0]) {
      case DASHBOARD:
        history.push(PATH.LANDING_PAGE);
      default:
        history.push(PATH.LANDING_PAGE);
        break;
    }
    this.setState({ selectedKeys: selectedKeys[0] });
  };

  render() {
    const { selectedKeys } = this.state;
    const { handleItemSelect } = this;
    return (
      <Menu
        selectedKeys={[selectedKeys]}
        className="side-bar-menu p0"
        onSelect={handleItemSelect}
      >
        <MenuItem
          className="flex direction-column justify-center align-center p0"
          key={"1"}
        >
          <img src={Logo} alt="Adherence logo" />
        </MenuItem>

        <MenuItem
          className="flex direction-column justify-center align-center p0"
          key={DASHBOARD}
        >
          <Tooltip placement="right" title={"Dashboard"}>
            <img alt={"Dashboard Icon"} src={dashboardIcon} />
          </Tooltip>
        </MenuItem>
      </Menu>
    );
  }
}

export default withRouter(injectIntl(SideMenu));
