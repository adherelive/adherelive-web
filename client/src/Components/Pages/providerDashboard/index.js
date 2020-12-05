import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";
import { PERMISSIONS } from "../../../constant";

// antd components
import Button from "antd/es/button";
import Menu from "antd/es/menu";
import Dropdown from "antd/es/dropdown";

import messages from "./messages";


import DoctorTable from "../../../Containers/Doctor/table";

class ProviderDoctorPage extends Component {
    constructor(props) {
        super(props);
    }

    addDoctor = () => {
        this.props.history.push('/register-profile');
    }
    formatMessage = data => this.props.intl.formatMessage(data);
    
    getMenu = () => {
        const { authPermissions = [] } = this.props;
        return (
          <Menu>
            {authPermissions.includes(PERMISSIONS.ADD_DOCTOR) && (
              <Menu.Item onClick={this.addDoctor}>
                <div className="tac" >{this.formatMessage(messages.addDoctor)}</div>
              </Menu.Item>
            )}
           
          </Menu>
        );
      };

    render() {

      const {authenticated_user ='',users ={},providers = {},authPermissions = []} = this.props;

      const {basic_info : {user_name = ''} = {}} = users[authenticated_user] || {};
      let providerID = null;
      let providerName = "";
      Object.keys(providers).forEach(id => {
        const { basic_info: { user_id } = {} } = providers[id] || {};
  
        if (user_id === authenticated_user) {
          providerID = id;
        }
      });

      const {basic_info  : {name: p_name =''}= {}} = providers[providerID] || {};
      providerName = p_name;

        return (
            // <Fragment>
            //     <div className="wp100 flex direction-column">
                  

            //     <div className="flex direction-row justify-space-between align-center wp100 mr20 mb40">
            //       {providerName !== "" ? (
            //         <div className="p18 fs30 fw700 mb20">
            //           {this.formatMessage(messages.welcome)}, {providerName}
            //         </div>
            //       ) : (
            //         <div className="p18 fs30 fw700 mb20">
            //           {this.formatMessage(messages.welcome)}
            //         </div>
            //       )}
            //     <Dropdown
            //       className={"mr40 "}
            //       overlay={this.getMenu()}
            //       trigger={["click"]}
            //       placement="bottomRight"
            //     >
            //          <Button type="primary" className="ml10 add-button " icon={"plus"}>
            //           <span className="fs16">{this.formatMessage(messages.add)}</span>
            //         </Button>

                    
            //     </Dropdown>
            //   </div>
            //     {/* <Button onClick={this.addDoctor} >{this.formatMessage(messages.addDoctor)} </Button> */}
            //     <div className="wp100 pl14 pr14 flex align-center justify-center">
            //         <DoctorTable />
            //     </div>
            //     </div>
            // </Fragment>
            <Fragment>
                    <div className="p20">
         
                <div
                    className={`mb0 mt10 flex direction-row justify-space-between align-center`}
                >
              {providerName !== "" ? (
                <div className="fs28 fw700">
                  {this.formatMessage(messages.welcome)}, {providerName}
                </div>
              ) : (
                <div className="fs28 fw700">
                  {this.formatMessage(messages.welcome)}
                </div>
              )}
              {(authPermissions.includes(PERMISSIONS.ADD_DOCTOR) ) && (
                <div className="flex direction-row justify-space-between align-center">

                  <Dropdown
                    overlay={this.getMenu()}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                        <Button type="primary" className="ml10 add-button mb0 " icon={"plus"}>
                        <span className="fs16">{this.formatMessage(messages.add)}</span>
                      </Button>

                  </Dropdown>
                </div>
              )}

                
            </div>

            {/* <div className="mt0 wp100 flex align-center justify-center provider-doctor-table">
                    <DoctorTable />
            </div> */}
            <div className="wp100 pl14 pr14 flex align-center justify-center provider-doctor-table">
                    <DoctorTable />
            </div>

           
   </div>
            </Fragment>
        );
    }
}

export default injectIntl(ProviderDoctorPage);