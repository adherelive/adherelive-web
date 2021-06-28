import React from "react";

export default props => {
    const { workoutData:{basic_info:{name} ={}} ={} } = props || {};
    return <div>{
        name ? name : "--"
        
    }</div>;
};
