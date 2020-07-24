import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Menu, Tooltip, message, Avatar } from "antd";
import { PATH, USER_CATEGORY,PERMISSIONS } from "../../constant";

import Logo from "../../Assets/images/logo3x.png";
import dashboardIcon from "../../Assets/images/dashboard.svg";
import { withRouter } from "react-router-dom";

import { UserOutlined } from "@ant-design/icons";

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
    const { logOut } = this.props;
    try {
      const response = await logOut();
      const { status } = response || {};
      if (status === true) {
        message.success("signed out successfully");
      } else {
        message.warn("something went wrong. Please try again later");
      }
    } catch (error) {
      console.log("SIDEBAR LOGOUT ERROR ---> ", error);
    }
  }

  handleItemSelect = ({ key }) => {
    const { history, authenticated_category, authPermissions = [] } = this.props;
    console.log("19231231237813 authenticated_category --> ", this.props);
    const { handleLogout } = this;
    console.log("28931893197382379 ", key);
    switch (key) {
      case LOGO:
      case DASHBOARD:
        if (authenticated_category === USER_CATEGORY.ADMIN) {
          console.log("91823718937812 here 2");
          if (authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT)) {
            history.push(PATH.ADMIN.DOCTORS.ROOT);
          }
        } else {
          if (authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT)) {
            history.push(PATH.LANDING_PAGE);
          }
        }
        break;
      case LOG_OUT:
        handleLogout();
        break;
      default:
        history.push(PATH.LANDING_PAGE);
        break;
    }
    this.setState({ selectedKeys: key });
  };

  render() {
    const { selectedKeys } = this.state;
    const { handleItemSelect } = this;
    const { authenticated_user = 0, users = {}, doctors = {} } = this.props;
    let dp = '';
    let initials = '';

    for (let doctor of Object.values(doctors)) {
      let { basic_info: { user_id = 0, profile_pic = '', first_name = ' ', last_name = ' ' } = {} } = doctor;

      if (user_id === authenticated_user) {
        dp = profile_pic;
        initials = `${first_name[0]}${last_name[0]}`
      }

    }
    let { basic_info: { user_name = '' } = {} } = users[authenticated_user] || {};
    if (user_name) {
      initials = user_name
        .split(" ")
        .map(n => n && n.length > 0 && n[0] ? n[0].toUpperCase() : "")
        .join("");
    }

    console.log("DATA IN SIDEBARRRRR", dp, initials);
    return (
      <Menu
        // selectedKeys={[selectedKeys]}
        className="side-bar-menu p0 bg-dark-grey"
        onClick={handleItemSelect}
        selectable={false}
      >
        <MenuItem
          className="flex direction-column justify-center align-center p0"
          key={LOGO}
        >
          <img className="w35" src={Logo} alt="Adherence logo" />
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
            {/* {  profile_pic?(<img src={profile_pic} className='sidebar-dp'/>):
            (<UserOutlined className="sidebar-bottom-custom text-white"/>)} */}
            {initials ?
              <Avatar src={dp}>{initials}</Avatar> : <Avatar icon="user" />}
          </Tooltip>
        </MenuItem>
      </Menu>
    );
  }
}

export default withRouter(injectIntl(SideMenu));
