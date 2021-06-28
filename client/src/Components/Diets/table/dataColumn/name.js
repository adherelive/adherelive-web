import React from "react";

export default props => {
    const { dietData:{basic_info:{name} ={}} ={} } = props || {};
    return <div>{
        name ? name : "--"
        
    }</div>;
};
