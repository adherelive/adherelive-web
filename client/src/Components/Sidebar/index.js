import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Menu, Tooltip, message, Avatar, Icon, Dropdown } from "antd";
import { PATH, USER_CATEGORY, PERMISSIONS } from "../../constant";
import confirm from "antd/es/modal/confirm";

import Logo from "../../Assets/images/logo3x.png";
import dashboardIcon from "../../Assets/images/dashboard.svg";
import { withRouter } from "react-router-dom";
import {
  CalendarTwoTone,
  FileOutlined,
  ProfileOutlined,
  AccountBookOutlined,
} from "@ant-design/icons";
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
const TEMPLATES = "templates";
const MEDICINES = "medicines";
const ACCOUNT = "account";

const ADD_ACCOUNT = "add_account";

const PRIVACY_PAGE_URL = `${config.WEB_URL}${PATH.PRIVACY_POLICY}`;

const SIDEBAR_NAVIGATION = {
  SUB_MENU: {
    SETTINGS: "SETTINGS",
    PRIVACY_POLICY: "PRIVACY_POLICY",
  },
};

class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: "",
    };
  }

  formatMessage = (message) => this.props.intl.formatMessage(message);

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

  handleRedirect = ({ key }) => {
    try {
      confirm({
        title: `Are you sure you want to leave?`,
        content: <div>{this.warnNote()}</div>,
        onOk: async () => {
          this.handleItemSelectForRedirect({ key });
        },
        onCancel() {},
      });
    } catch (error) {
      console.log("err --->", error);
    }
  };

  handleItemSelectForRedirect = ({ key }) => {
    const {
      users,
      history,
      authenticated_category,
      authenticated_user,
      authPermissions = [],
      openAppointmentDrawer,
    } = this.props;
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
          if (
            authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT) ||
            onboarded
          ) {
            history.push(PATH.LANDING_PAGE);
          }
        }
        break;
      case PROFILE:
        if (onboarded) {
          history.push(PATH.PROFILE);
        }
        break;
      case ADD_ACCOUNT:
        history.push(PATH.SIGN_IN);
        break;
      case SETTINGS:
        if (onboarded) {
          history.push(PATH.SETTINGS);
        }
        break;
      case NOTIFICATIONS:
        if (authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT)) {
          openAppointmentDrawer({ doctorUserId: authenticated_user });
        }
        break;
      case CALENDER:
        if (authPermissions.includes(PERMISSIONS.ADD_DOCTOR)) {
          history.push(PATH.PROVIDER.CALENDER);
        }
        break;
      case TRANSACTION_DETAILS:
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
  };

  handleItemSelect = async ({ key }) => {
    const {
      users,
      history,
      authenticated_category,
      authenticated_user,
      authPermissions = [],
      openAppointmentDrawer,
      switchUserRole,
    } = this.props;
    const { handleLogout } = this;
    const current_user = users[authenticated_user];
    const { onboarded } = current_user;

    const url = window.location.href.split("/");
    let doctor_id = url.length > 4 ? url[url.length - 1] : "";

    if (key.includes(ACCOUNT)) {
      await switchUserRole({ userRoleId: key.split(".")[1] });
      history.replace(PATH.LANDING_PAGE);
      window.location.reload();
    }

    if (
      doctor_id &&
      authenticated_category === USER_CATEGORY.PROVIDER &&
      !window.location.href.includes(PATH.ADMIN.DOCTORS.ROOT)
    ) {
      this.handleRedirect({ key });
    } else {
      switch (key) {
        case LOGO:
        case DASHBOARD:
          if (authenticated_category === USER_CATEGORY.ADMIN) {
            if (authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT)) {
              history.push(PATH.ADMIN.DOCTORS.ROOT);
            }
          } else {
            if (
              authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT) ||
              onboarded
            ) {
              history.push(PATH.LANDING_PAGE);
            }
          }
          break;
        case PROFILE:
          if (onboarded) {
            history.push(PATH.PROFILE);
          }
          break;
        case ADD_ACCOUNT:
          history.push(PATH.SIGN_IN);
          break;
        case SETTINGS:
          if (onboarded) {
            history.push(PATH.SETTINGS);
          }
          break;
        case NOTIFICATIONS:
          if (authPermissions.includes(PERMISSIONS.VERIFIED_ACCOUNT)) {
            openAppointmentDrawer({ doctorUserId: authenticated_user });
          }
          break;
        case CALENDER:
          if (authPermissions.includes(PERMISSIONS.ADD_DOCTOR)) {
            history.push(PATH.PROVIDER.CALENDER);
          }
          break;
        case TOS_PP_EDITOR:
          history.push(PATH.ADMIN.TOS_PP_EDITOR);
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
          if (authenticated_category === USER_CATEGORY.ADMIN) {
            history.push(PATH.ADMIN.ALL_MEDICINES);
          }
          break;
        case TEMPLATES:
          if (authenticated_category === USER_CATEGORY.DOCTOR) {
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

  getOnboardedByDetails = (provider_id) => {
    const { providers } = this.props;
    const { formatMessage } = this;

    const { details: { icon } = {}, basic_info: { name } = {} } =
      providers[provider_id] || {};

    if (provider_id) {
      if (icon) {
        return (
          <img src={icon} alt={"hospital logo"} className={"br50 w30 h30"} />
        );
      } else {
        return <div>{name}</div>;
      }
    } else {
      return <div>{formatMessage(messages.selfAccount)}</div>;
    }
  };

  handleManageAccount = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // const { history } = this.props;

    // history.push();
  };

  handleNavigate = (path) => (e) => {
    e.preventDefault();
    const { history } = this.props;
    switch (path) {
      case SIDEBAR_NAVIGATION.SUB_MENU.SETTINGS:
        history.push(PATH.SETTINGS);
        break;
      case SIDEBAR_NAVIGATION.SUB_MENU.PRIVACY_POLICY:
        window.open(PRIVACY_PAGE_URL, "_blank").focus();
        break;
      default:
        break;
    }
  };

  getDoctorDetails = () => {
    const { auth_role, user_roles, doctors } = this.props;
    const { handleNavigate, formatMessage } = this;

    const { basic_info: { user_identity } = {} } = user_roles[auth_role] || {};

    let doctorId = null;

    Object.keys(doctors).forEach((id) => {
      const { basic_info: { user_id } = {} } = doctors[id] || {};
      if(user_id === user_identity) {
        doctorId = id;
      }
    });

    const { basic_info: { full_name } = {}, profile_pic = null } =
      doctors[doctorId] || {};

    return (
      <div className="p10 flex align-center justify-start wp100">
        <Avatar size={64} src={profile_pic} className="wp30">
          {getAbbreviation(full_name)}
        </Avatar>
        <div className="ml10 flex direction-column justify-start wp70">
          <span className="fs22 fw700">{`Dr. ${full_name}`}</span>
          <div className="wp90 flex align-center justify-space-between dark-sky-blue fw700 fs14">
            <div onClick={handleNavigate(SIDEBAR_NAVIGATION.SUB_MENU.SETTINGS)}>
              {formatMessage(messages.settings_text)}
            </div>
            <div className="w5 h5 bg-dark-grey br50" />
            <div
              onClick={handleNavigate(
                SIDEBAR_NAVIGATION.SUB_MENU.PRIVACY_POLICY
              )}
            >
              {formatMessage(messages.privacy_policy_text)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  getUserRoles = () => {
    const {
      user_roles,
      user_role_ids,
      users,
      doctors,
      providers,
      authenticated_user,
      authDoctor,
    } = this.props;
    const {
      getOnboardedByDetails,
      handleManageAccount,
      getProviderIcon,
      formatMessage,
    } = this;

   return user_role_ids.map((id) => {
      const { basic_info: { user_identity, linked_id } = {} } =
        user_roles[id] || {};

      const { basic_info: { email } = {} } = users[user_identity] || {};

      const { details: { icon } = {}, basic_info: { name } = {} } =
        providers[linked_id] || {};

      let selfDoctorName = null;
      if (!linked_id) {
        const { basic_info: { full_name } = {} } = authDoctor || {};
        selfDoctorName = full_name;
      }

      const addedVia = linked_id ? name : formatMessage(messages.self_text);

      return (
        // <Fragment>
          <Menu.Item key={`${ACCOUNT}.${id}`} className="pointer">
            <div className={"flex align-center mt10 mb10"}>
              {linked_id ? (
                getProviderIcon("w50 h50", id)
              ) : (
                <div className="w50 h50 br5 bg-grey flex justify-center align-center">
                  {getAbbreviation(selfDoctorName)}
                </div>
              )}
              <div className="flex direction-column align-start ml10">
                <div className={"fs20 fw700"}>{addedVia}</div>
                <div className="fs14 fw500">{email}</div>
              </div>
            </div>
          </Menu.Item>
          // <Menu.Divider />
        // </Fragment>
      );
    });

    // return (
    //   <Fragment>
    //     <span className="p10">{formatMessage(messages.accounts_text)}</span>
    //     {userRoleTiles}
    //   </Fragment>
    // );
  };

  menu = () => {
    const { getUserRoles, getDoctorDetails, formatMessage } = this;
    return (
      <Menu
        // className="fixed l70 b20" // b20
        // getPopupContainer={() => this.menuRef}
        style={{
          position: "absolute",
          bottom: 10,
          left: 50,
          minWidth: 300,
        }}
        key={"sub"}
        onClick={this.handleItemSelect}
      >
        {getDoctorDetails()}
        <Menu.Divider />

        {/* <span className="p10">{formatMessage(messages.accounts_text)}</span> */}
        <Menu.ItemGroup key="ACCOUNT" title={formatMessage(messages.accounts_text)}>
          {getUserRoles()}
        </Menu.ItemGroup>
        <Menu.Divider />

        {/* <Menu.Divider /> */}
        {/* <Menu.Item className="p10" key={PRIVACY_POLICY}>
          <a href={PRIVACY_PAGE_URL} target={"_blank"}>
            {this.formatMessage(messages.privacy_policy_text)}
          </a>
        </Menu.Item> */}
        {/* <Menu.Divider />
        <Menu.Item className="pl24 pr80" key={PROFILE}>Profile
        </Menu.Item>
        <Menu.Divider />*/}
        {/* <Menu.Item className="pl24 pr80" key={SETTINGS}>
          Settings
        </Menu.Item> */}
        {/* <Menu.Item className="pl24 pr80" key={TEMPLATES}>
          {this.formatMessage(messages.templates)}
        </Menu.Item> */}
        {/* <Menu.Divider /> */}

        <Menu.Item className="p10" key={LOG_OUT}>
          <div className="wp100 flex justify-center align-center">
            <span className="pt6 pb6 pl10 pr10 bw-faint-grey br5 wp50 tac">
            {formatMessage(messages.sign_out_text)}
            </span>
          </div>
        </Menu.Item>
      </Menu>
    );
  };

  getProviderIcon = (className = "w35 h35", userRoleId = null) => {
    const { auth_role, user_roles, providers } = this.props;

    let currentUserRoleId = auth_role;
    if (userRoleId) {
      currentUserRoleId = userRoleId;
    }

    const { basic_info: { linked_with, linked_id } = {} } =
      user_roles[currentUserRoleId] || {};

    if (linked_with === USER_CATEGORY.PROVIDER && linked_id) {
      const { basic_info: { name } = {}, details: { icon } = {} } =
        providers[linked_id] || {};

      if (icon) {
        return <img alt={"Provider Icon"} src={icon} className={className} />;
      } else {
        return (
          // <div className={"h50"}>
          //   <Avatar>
          //     {name
          //       .split(" ")
          //       .map((word) => word.charAt(0).toUpperCase())
          //       .join(" ")}
          //   </Avatar>
          // </div>

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
    } else {
      return (
        <div className={`${className} br5 bg-grey flex justify-center align-center`}>{getAbbreviation()}</div>
      );
    }
  };

  render() {
    const {
      authenticated_user = 0,
      users = {},
      doctors = {},
      auth_role,
      user_roles,
      authenticated_category,
      intl: { formatMessage } = {},
    } = this.props;
    const { handleItemSelect, getProviderIcon } = this;

    const {basic_info: {linked_id} = {}} = user_roles[auth_role] || {};

    let dp = "";
    let initials = "";

    for (let doctor of Object.values(doctors)) {
      let {
        basic_info: {
          user_id = 0,
          profile_pic = "",
          first_name = " ",
          last_name = " ",
        } = {},
      } = doctor;

      if (user_id === authenticated_user) {
        dp = profile_pic;
        initials = `${first_name ? first_name[0] : ""}${
          last_name ? last_name[0] : ""
        }`;
      }
    }
    let { basic_info: { user_name = "" } = {} } =
      users[authenticated_user] || {};
    if (user_name) {
      initials = user_name
        .split(" ")
        .map((n) => (n && n.length > 0 && n[0] ? n[0].toUpperCase() : ""))
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
          <Tooltip
            placement="right"
            title={this.formatMessage(messages.dashboard)}
          >
            <img alt={"Dashboard Icon"} src={dashboardIcon} />
          </Tooltip>
        </MenuItem>
        {authenticated_category == USER_CATEGORY.DOCTOR ? (
          <MenuItem
            key={SUB_MENU}
            // className="flex direction-column align-center justify-space-between h200"
          >
            {/* {provider_icon && (
              <img
                alt={"Provider Icon"}
                src={provider_icon}
                className="w35 h35"
              />
            )} */}
            <div className="flex direction-column justify-space-between align-center hp100 p10 br5 bw-cool-grey">
              {getProviderIcon()}
              <Dropdown
                overlay={this.menu}
                overlayClassName={"fixed"}
                // visible={true}
              >
                <div className="flex direction-column align-center justify-end wp250">
                  {initials ? (
                    <Avatar src={dp}>{initials}</Avatar>
                  ) : (
                    <Avatar icon="user" />
                  )}
                </div>
              </Dropdown>
            </div>
            {/* </div> */}
          </MenuItem>
        ) : (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={LOG_OUT}
          >
            <Tooltip
              placement="right"
              title={this.formatMessage(messages.logOut)}
            >
              {initials ? (
                <Avatar src={dp}>{initials}</Avatar>
              ) : (
                <Avatar icon="user" />
              )}
            </Tooltip>
          </MenuItem>
        )}
        {authenticated_category !== USER_CATEGORY.ADMIN && (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={NOTIFICATIONS}
          >
            <Tooltip
              placement="right"
              title={this.formatMessage(messages.notifications)}
            >
              <Icon type="bell" theme="twoTone" twoToneColor="white" />
            </Tooltip>
          </MenuItem>
        )}

        {authenticated_category === USER_CATEGORY.PROVIDER ? (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={CALENDER}
          >
            <Tooltip
              placement="right"
              title={this.formatMessage(messages.calender)}
            >
              <CalendarTwoTone theme="twoTone" twoToneColor="white" />
            </Tooltip>
          </MenuItem>
        ) : null}

        {authenticated_category === USER_CATEGORY.ADMIN ? (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={TOS_PP_EDITOR}
          >
            <Tooltip
              placement="right"
              title={formatMessage(messages.tos_pp_editor)}
            >
              <FileOutlined style={{ color: "#fff" }} />
            </Tooltip>
          </MenuItem>
        ) : null}

        {authenticated_category === USER_CATEGORY.ADMIN ? (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={ALL_PROVIDERS}
          >
            <Tooltip
              placement="right"
              title={formatMessage(messages.all_providers)}
            >
              <ProfileOutlined style={{ color: "#fff" }} />
            </Tooltip>
          </MenuItem>
        ) : null}

        {authenticated_category === USER_CATEGORY.PROVIDER ||
        (authenticated_category === USER_CATEGORY.DOCTOR &&
          linked_id === null &&
          Object.keys(doctors).length > 0) ? (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={TRANSACTION_DETAILS}
          >
            <Tooltip
              placement="right"
              title={this.formatMessage(messages.transactionDetails)}
            >
              {/* <AccountBookOutlined style={{color: "#fff"}} /> */}
              <Icon style={{ color: "#fff" }} type="swap" />
            </Tooltip>
          </MenuItem>
        ) : null}

        {authenticated_category === USER_CATEGORY.ADMIN ? (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            key={MEDICINES}
          >
            <Tooltip
              placement="right"
              title={this.formatMessage(messages.medicineText)}
            >
              {/* <AccountBookOutlined style={{color: "#fff"}} /> */}
              <Icon style={{ color: "#fff" }} type="medicine-box" />
            </Tooltip>
          </MenuItem>
        ) : null}
        {/* {doctor_provider_id && (
          <MenuItem
            className="flex direction-column justify-center align-center p0"
            // key={DASHBOARD}
          >
            <Tooltip
              placement="right"
              title={this.formatMessage(messages.providerIcon)}
            >
              <img
                alt={"Provider Icon"}
                src={provider_icon}
                className="w35 h35"
              />
            </Tooltip>
          </MenuItem>
        )} */}
      </Menu>
    );
  }
}

export default withRouter(injectIntl(SideMenu));
