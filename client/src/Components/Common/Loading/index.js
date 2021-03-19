import React from "react";
import { Spin, Icon } from "antd";

const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default props => {
    const {color=''}=props;
    return (<Spin {...props} indicator={antIcon}  style={{color}}   />)
};