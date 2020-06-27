import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Menu, Tooltip, message } from "antd";
import {PATH, USER_CATEGORY} from "../../constant";

import Logo from "../../Assets/images/logo3x.png";
import dashboardIcon from "../../Assets/images/dashboard.svg";
import { withRouter } from "react-router-dom";

import {UserOutlined} from "@ant-design/icons";

const { Item: MenuItem } = Menu || {};

const LOGO = "logo";
const DASHBOARD = "dashboard";
const PROFILE = "profile";
const LOG_OUT = "log_out";

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: ""
    };
  }

  handleLogout = async () => {
    const {logOut} = this.props;
    try {
      const response = await logOut();
      const {status} = response || {};
      if(status === true) {
        message.success("signed out successfully");
      } else {
        message.warn("something went wrong. Please try again later");
      }
    } catch(error) {
      console.log("SIDEBAR LOGOUT ERROR ---> ", error);
    }
  }

  handleItemSelect = ({ selectedKeys }) => {
    const { history, authenticated_category } = this.props;
    console.log("19231231237813 authenticated_category --> ", authenticated_category);
    const {handleLogout} = this;
    console.log(selectedKeys);
    switch (selectedKeys[0]) {
      case LOGO:
      case DASHBOARD:
        if(authenticated_category === USER_CATEGORY.ADMIN) {
          console.log("91823718937812 here 2");
          history.push(PATH.ADMIN.DOCTORS.ROOT);
        } else {
          history.push(PATH.LANDING_PAGE);
        }
        break;
      case LOG_OUT:
        handleLogout();
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
    const{authenticated_user:{profile_pic=''}={}}=this.props;
    return (
      <Menu
        selectedKeys={[selectedKeys]}
        className="side-bar-menu p0 bg-dark-grey"
        onSelect={handleItemSelect}
      >
        <MenuItem
          className="flex direction-column justify-center align-center p0"
          key={LOGO}
        >
          <img className="w45" src={Logo} alt="Adherence logo" />
        </MenuItem>

        <MenuItem
          className="flex direction-column justify-center align-center p0"
          key={DASHBOARD}
        >
          <Tooltip placement="right" title={"Dashboard"}>
            <img alt={"Dashboard Icon"} src={dashboardIcon} />
          </Tooltip>
        </MenuItem>

        <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={LOG_OUT}
        >
          <Tooltip placement="right" title={"Log Out"}>
          {  profile_pic?(<img src={profile_pic} className='sidebar-dp'/>):
            (<UserOutlined className="sidebar-bottom-custom text-white"/>)}
          </Tooltip>
        </MenuItem>
      </Menu>
    );
  }
}

export default withRouter(injectIntl(SideMenu));
