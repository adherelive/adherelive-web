import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Menu, Tooltip } from "antd";
import { PATH } from "../../constant";
import { withRouter } from "react-router-dom";

// const { Item: MenuItem } = Menu || {};

const LOGO = "logo";
const DASHBOARD = "dashboard";

// const PROFILE = "profile";

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: "",
    };
  }

  handleItemSelect = ({ selectedKeys }) => {
    const { history } = this.props;
    switch (selectedKeys[0]) {
      case LOGO:
      case DASHBOARD:
        history.push(PATH.LANDING_PAGE);
        break;
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
        theme="dark"
      ></Menu>
    );
  }
}

export default withRouter(injectIntl(SideMenu));
