import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Menu, Tooltip, message, Avatar, Icon, Dropdown } from "antd";
import { PATH, USER_CATEGORY, PERMISSIONS } from "../../constant";
import confirm from "antd/es/modal/confirm";

import Logo from "../../Assets/images/logo3x.png";
import dashboardIcon from "../../Assets/images/dashboard.svg";
import { withRouter } from "react-router-dom";
import {CalendarTwoTone, FileOutlined} from "@ant-design/icons";
import messages from "./messages";
import config from "../../config";

const { Item: MenuItem } = Menu || {};


const LOGO = "logo";
const DASHBOARD = "dashboard";
const NOTIFICATIONS = "notifications";
const LOG_OUT = "log_out";
const PROFILE = "profile";
const SUB_MENU = "sub-menu";
const SETTINGS = "settings";
const CALENDER = "calender";
const TOS_PP_EDITOR = "tos-pp-editor";
const PRIVACY_POLICY = "privacy_policy";

const PRIVACY_PAGE_URL = `${config.WEB_URL}${PATH.PRIVACY_POLICY}`;

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: ""
    };
  }

  formatMessage = message => this.props.intl.formatMessage(message);

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

  warnNote = () => {
    return (
      <div className="pt16">
        <p className="red">
          <span className="fw600">{"Note"}</span>
          {" : Doctor onboard information is not yet completed"}
        </p>
      </div>
    );
  };

   handleRedirect =({key}) => {

   try{
       confirm({
        title: `Are you sure you want to leave?`,
        content: (
          <div>
            {this.warnNote()}
          </div>
        ),
        onOk: async () => {
          this.handleItemSelectForRedirect({key})
        },
        onCancel() {
          
        }
      });
    }catch(error){
      console.log("err --->",error);
    }
  }

  handleItemSelectForRedirect = ({key}) => {

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
      // case PRIVACY_POLICY:
      //   history.push(PATH.PRIVACY_POLICY);
      //   break;
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
      case CALENDER :
        if(authPermissions.includes(PERMISSIONS.ADD_DOCTOR)){
          history.push(PATH.PROVIDER.CALENDER)
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
  }

  
  handleItemSelect = ({ key }) => {
    
    const { users, history, authenticated_category, authenticated_user, authPermissions = [], openAppointmentDrawer } = this.props;
    const { handleLogout } = this;
    const current_user = users[authenticated_user];
    const { onboarded } = current_user;

    const url = window.location.href.split("/");
    let doctor_id=url.length > 4 ? url[url.length - 1] : "";
    
   
    if(doctor_id && authenticated_category===USER_CATEGORY.PROVIDER && !window.location.href.includes(PATH.ADMIN.DOCTORS.ROOT)){
      this.handleRedirect({key});
    }else{
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
          // case PRIVACY_POLICY:
          //   history.push(PATH.PRIVACY_POLICY);
          //   break;
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
          case CALENDER :
            if(authPermissions.includes(PERMISSIONS.ADD_DOCTOR)){
              history.push(PATH.PROVIDER.CALENDER)
            }
            break;
          case TOS_PP_EDITOR:
            history.push(PATH.ADMIN.TOS_PP_EDITOR)
              break;
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
    }
  };

  menu = () => {
    return (
      <Menu className="l70 b10 position fixed" key={"sub"} onClick={this.handleItemSelect}>
        <Menu.Item className="pl24 pr80" key={PRIVACY_POLICY}>
          <a href={PRIVACY_PAGE_URL} target={"_blank"}>
            {this.formatMessage(messages.privacy_policy_text)}
          </a>
        </Menu.Item>
        <Menu.Divider />
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
      authenticated_category,
        intl: {formatMessage} = {}
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

        {authenticated_category === USER_CATEGORY.PROVIDER
        ?
          (<MenuItem
            className="flex direction-column justify-center align-center p0"
            key={CALENDER}
          >
            <Tooltip placement="right" title={"calender"}>
              <CalendarTwoTone   theme="twoTone" twoToneColor='white' />
            </Tooltip>
          </MenuItem>)
       :
          null}

        {authenticated_category === USER_CATEGORY.ADMIN
            ?
            (<MenuItem
                className="flex direction-column justify-center align-center p0"
                key={TOS_PP_EDITOR}
            >
              <Tooltip placement="right" title={formatMessage(messages.tos_pp_editor)}>
                <FileOutlined style={{color: "#fff"}}/>
              </Tooltip>
            </MenuItem>)
            :
            null}

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
