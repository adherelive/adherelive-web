import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Menu, Tooltip, message, Avatar, Icon, Dropdown } from "antd";
import { PATH, USER_CATEGORY, PERMISSIONS } from "../../constant";

import Logo from "../../Assets/images/logo3x.png";
import dashboardIcon from "../../Assets/images/dashboard.svg";
import notificationIcon from "../../Assets/images/notification.png";
import { withRouter } from "react-router-dom";

const { Item: MenuItem, SubMenu } = Menu || {};

const LOGO = "logo";
const DASHBOARD = "dashboard";
const NOTIFICATIONS = "notifications";
const LOG_OUT = "log_out";
const PROFILE = "profile";
const SUB_MENU = "sub-menu";
const SETTINGS = "settings";

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
    } catch (error) {}
  };

  handleItemSelect = ({ key }) => {
    const { users, history, authenticated_category, authenticated_user, authPermissions = [], openAppointmentDrawer } = this.props;
    const { handleLogout } = this;
    const current_user = users[authenticated_user];
    const { onboarded } = current_user;
    switch (key) {
      case LOGO:
      case DASHBOARD:
        if (authenticated_category === USER_CATEGORY.ADMIN) {
          if (authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT)) {
            history.push(PATH.ADMIN.DOCTORS.ROOT);
          }
        } else {
          if (authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT) || onboarded) {
            history.push(PATH.LANDING_PAGE);
          }
        }
        break;
      case PROFILE:
        if(onboarded){
          history.push(PATH.PROFILE);
        }
        break;
      case SETTINGS:
        if(onboarded){
          history.push(PATH.SETTINGS);
        }
        break;  
      case NOTIFICATIONS:
        if (authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT)) {
          openAppointmentDrawer({ doctorUserId: authenticated_user });
        }
        break;
      case LOG_OUT:
        handleLogout();
        break;
      case SUB_MENU:
        break;
      default:
        history.push(PATH.LANDING_PAGE);
        break;
    }
    this.setState({ selectedKeys: key });
  };

  menu = () => {
    return (
      <Menu className="l70 b10 position fixed" key={"sub"} onClick={this.handleItemSelect}>
        <Menu.Item className="pl24 pr80" key={PROFILE}>Profile
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item className="pl24 pr80" key={LOG_OUT}>Logout
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item className="pl24 pr80" key={SETTINGS}>Settings
        </Menu.Item>
      </Menu>
    );
  };


  render() {
    const { selectedKeys } = this.state;
    const { handleItemSelect } = this;

    const {
      authenticated_user = 0,
      users = {},
      doctors = {},
      authenticated_category
    } = this.props;
    let dp = "";
    let initials = "";
    for (let doctor of Object.values(doctors)) {
      let {
        basic_info: {
          user_id = 0,
          profile_pic = "",
          first_name = " ",
          last_name = " "
        } = {}
      } = doctor;

      if (user_id === authenticated_user) {
        dp = profile_pic;
        initials = `${first_name ? first_name[0] : ""}${last_name ? last_name[0] : ""}`;
      }
    }
    let { basic_info: { user_name = "" } = {} } =
      users[authenticated_user] || {};
    if (user_name) {
      initials = user_name
        .split(" ")
        .map(n => (n && n.length > 0 && n[0] ? n[0].toUpperCase() : ""))
        .join("");
    }

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
        {authenticated_category == USER_CATEGORY.DOCTOR ? (
          // <SubMenu
          //   key="profile"
          //   title={initials ? <Avatar src={dp}>{initials}</Avatar> : <Avatar icon="user" />}
          // >
          //   <Menu.Item key={PROFILE}>Profile</Menu.Item>
          //   <Menu.Item key={LOG_OUT}>Logout</Menu.Item>
          // </SubMenu>

          <MenuItem
            key={SUB_MENU}
            className="flex direction-column justify-center align-center p0 logout_button"
          >
            <Dropdown overlay={this.menu} overlayClassName="relative">
              <div className="flex direction-column justify-center align-center wp250 hp100">
                {initials ? <Avatar src={dp}>{initials}</Avatar> : <Avatar icon="user" />}
              </div>
            </Dropdown>
          </MenuItem>
        ) : (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={LOG_OUT}
          >
            <Tooltip placement="right" title={"Log Out"}>
              {/* {  profile_pic?(<img src={profile_pic} className='sidebar-dp'/>):
              (<UserOutlined className="sidebar-bottom-custom text-white"/>)} */}
              {initials ? (
                <Avatar src={dp}>{initials}</Avatar>
              ) : (
                <Avatar icon="user" />
              )}
            </Tooltip>
          </MenuItem>
        )}
        <MenuItem
         className="flex direction-column justify-center align-center p0"
         key={NOTIFICATIONS}
        >
         <Tooltip placement="right" title={"Notifications"}>
            {/* <img alt={"Notification Icon"} className={'w22'} src={notificationIcon} />  */}
           <Icon type="bell" theme="twoTone" twoToneColor='white' />
         </Tooltip>
        </MenuItem>

        {/*<MenuItem*/}
        {/*  className="flex direction-column justify-center align-center p0"*/}
        {/*  key={LOG_OUT}*/}
        {/*>*/}
        {/*  <Tooltip placement="right" title={"Log Out"}>*/}
        {/*    /!* {profile_pic ? (<img src={profile_pic} className='sidebar-dp' />) :*/}
        {/*      (<UserOutlined className="sidebar-bottom-custom text-white" />)}  *!/*/}
        {/* {initials ?*/}
        {/*      <Avatar src={dp}>{initials}</Avatar> : <Avatar icon="user" />}*/}
        {/*  </Tooltip>*/}
        {/*</MenuItem>*/}

      </Menu>
    );
  }
}

export default withRouter(injectIntl(SideMenu));
