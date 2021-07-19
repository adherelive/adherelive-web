import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Menu, Tooltip, message, Avatar, Icon, Dropdown } from "antd";
import { PATH, USER_CATEGORY, PERMISSIONS } from "../../constant";
import confirm from "antd/es/modal/confirm";

import Logo from "../../Assets/images/logo3x.png";
import dashboardIcon from "../../Assets/images/dashboard.svg";
import { withRouter } from "react-router-dom";
import {CalendarTwoTone, FileOutlined,ProfileOutlined , AccountBookOutlined} from "@ant-design/icons";
import messages from "./messages";
import config from "../../config";

import { getAbbreviation } from "../../Helper/common";

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
const ALL_PROVIDERS = "providers";
const TRANSACTION_DETAILS = "transaction_details";
const TEMPLATES="templates";
const MEDICINES = "medicines";

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
      case TRANSACTION_DETAILS :
        if (authenticated_category === USER_CATEGORY.PROVIDER) {
            history.push(PATH.PROVIDER.TRANSACTION_DETAILS);
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
                openAppointmentDrawer({doctorUserId: authenticated_user});
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
          case ALL_PROVIDERS:
            if (authenticated_category === USER_CATEGORY.ADMIN) {
                history.push(PATH.ADMIN.ALL_PROVIDERS);
            }
            break;
          case TRANSACTION_DETAILS:
            if (authenticated_category === USER_CATEGORY.PROVIDER) {
                history.push(PATH.PROVIDER.TRANSACTION_DETAILS);
            } else if (authenticated_category === USER_CATEGORY.DOCTOR) {
              history.push(PATH.DOCTOR.TRANSACTION_DETAILS);
            }
            break;
          case MEDICINES:
            if(authenticated_category === USER_CATEGORY.ADMIN) {
              history.push(PATH.ADMIN.ALL_MEDICINES);
            }
            break;
          case TEMPLATES:
            if(authenticated_category === USER_CATEGORY.DOCTOR){
              history.push(PATH.TEMPLATES);
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
  };

  menu = () => {
    return (
      <Menu className="l70 b20 fixed" key={"sub"} onClick={this.handleItemSelect}>
        <Menu.Item className="pl24 pr80" key={PRIVACY_POLICY}>
          <a href={PRIVACY_PAGE_URL} target={"_blank"}>
            {this.formatMessage(messages.privacy_policy_text)}
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item className="pl24 pr80" key={PROFILE}>Profile
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item className="pl24 pr80" key={SETTINGS}>Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item className="pl24 pr80" key={TEMPLATES}>
          {this.formatMessage(messages.templates)}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item className="pl24 pr80" key={LOG_OUT}>Logout
        </Menu.Item>
      </Menu>
    );
  };

  getProviderIcon = (className = "w35 h35", userRoleId = null) => {
    const { providers, doctor_provider_id } = this.props;

    if (doctor_provider_id) {
      const { basic_info: { name } = {}, details: { icon } = {} } =
        providers[doctor_provider_id] || {};

      if (icon) {
        return <img alt={"Provider Icon"} src={icon} className={className} />;
      } else {
        return (
          <div
            className={`${className} br5 bg-grey flex justify-center align-center`}
          >
            {name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase())
              .join(" ")}
          </div>
          // <div className={"bg-grey br50 w30 h30"}>{name.split(" ").map(word => word.charAt(0).toUpperCase()).join(" ")}</div>
        );
      }
    } 
    // else {
    //   const {basic_info: {full_name} = {}} = authDoctor || {};
    //   return (
    //     <div className={`${className} br5 bg-grey flex justify-center align-center`}>{""}</div>
    //   );
    // }
  };



  render() {
    // const { selectedKeys } = this.state;
    const { getProviderIcon, handleItemSelect } = this;

    const {
      authenticated_user = 0,
      users = {},
      doctors = {},
      authenticated_category,
        intl: {formatMessage} = {}
    } = this.props;
    const {doctor_provider_id =null , notification_count = {} } = this.props ; 

    const { unseen_notification_count : count = 0 } = notification_count || {};
    const unseen_notification_count = parseInt(count);
    // console.log("2934y98237498238423 COUNTTTTTTTTTT",{unseen_notification_count});
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
          <Tooltip placement="right" title={this.formatMessage(messages.dashboard)}>
            <img alt={"Dashboard Icon"} src={dashboardIcon} />
          </Tooltip>
        </MenuItem>
        {authenticated_category == USER_CATEGORY.DOCTOR ? (

          <MenuItem
            key={SUB_MENU}
            // className="flex direction-column justify-center align-center p0"
          >
            <div className={`flex direction-column ${doctor_provider_id ? "justify-space-between bw-cool-grey" : "justify-end"} align-center hp100 p10 br5`}>
            {getProviderIcon()}
            <Dropdown overlay={this.menu} overlayClassName="relative">
              <div className="flex direction-column justify-center align-center wp250">
                {initials ? <Avatar src={dp}>{initials}</Avatar> : <Avatar icon="user" />}
              </div>
            </Dropdown>
            </div>
          </MenuItem>
        ) : (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={LOG_OUT}
          >
            <Tooltip placement="right" title={this.formatMessage(messages.logOut)}>
              {initials ? (
                <Avatar src={dp}>{initials}</Avatar>
              ) : (
                <Avatar icon="user" />
              )}
            </Tooltip>
          </MenuItem>
        )}
        {authenticated_category !== USER_CATEGORY.ADMIN &&
        <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={NOTIFICATIONS}
        >
          <Tooltip placement="right" title={this.formatMessage(messages.notifications)}>
              <Icon type="bell" theme="twoTone" twoToneColor='white'  />
              {/* className={`${unseen_notification_count>0 && "noti-icon"}`} */}
          </Tooltip>
          {unseen_notification_count ? (<div className="fs10 notification-count flex align-center justify-center">
                {unseen_notification_count}
              </div>) : null}
        </MenuItem>}

        {authenticated_category === USER_CATEGORY.PROVIDER
        ?
          (<MenuItem
            className="flex direction-column justify-center align-center p0"
            key={CALENDER}
          >
            <Tooltip placement="right" title={this.formatMessage(messages.calender)}>
              <CalendarTwoTone   theme="twoTone" twoToneColor='white' />
            </Tooltip>
          </MenuItem>)
       :
          null}

        {authenticated_category === USER_CATEGORY.ADMIN
            ?
            (
                <MenuItem
                  className="flex direction-column justify-center align-center p0"
                  key={TOS_PP_EDITOR}
                >
                  <Tooltip placement="right" title={formatMessage(messages.tos_pp_editor)}>
                    <FileOutlined style={{color: "#fff"}}/>
                  </Tooltip>
                </MenuItem>
                
            )
            :
            null}

        {authenticated_category === USER_CATEGORY.ADMIN
            ?
            (
              <MenuItem
              className="flex direction-column justify-center align-center p0"
              key={ALL_PROVIDERS}
            >
              <Tooltip placement="right" title={formatMessage(messages.all_providers)}>
                <ProfileOutlined style={{color: "#fff"}}/>
              </Tooltip>
          </MenuItem> 
                
            )
            :
            null}    

          {authenticated_category === USER_CATEGORY.PROVIDER ||  ( authenticated_category === USER_CATEGORY.DOCTOR && ( doctor_provider_id === null  &&  Object.keys(doctors).length > 0 ))
          ?
          (<MenuItem
            className="flex direction-column justify-center align-center p0"
            key={TRANSACTION_DETAILS}
          >
            <Tooltip placement="right" title={this.formatMessage(messages.transactionDetails)}>
              {/* <AccountBookOutlined style={{color: "#fff"}} /> */}
              <Icon style={{color: "#fff"}} type="swap" />
            </Tooltip>
          </MenuItem>)
         :
          null}

        {authenticated_category === USER_CATEGORY.ADMIN
            ?
            (<MenuItem
                className="flex direction-column justify-center align-center p0"
                key={MEDICINES}
            >
              <Tooltip placement="right" title={this.formatMessage(messages.medicineText)}>
                {/* <AccountBookOutlined style={{color: "#fff"}} /> */}
                <Icon style={{color: "#fff"}} type="medicine-box" />
              </Tooltip>
            </MenuItem>)
            :
            null}

      </Menu>
    );
  }
}

export default withRouter(injectIntl(SideMenu));
