import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { USER_ADHERE_BOT, CHAT_MESSAGE_TYPE, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY } from "../../constant";


class symptomMessage extends Component{
    
    constructor(props){
        super(props);
        console.log("symptomMessage Props",this.props);
        
        
    }
    
    componentDidMount(){
        
    }
    
    render ()    {
        return (
            <div  className="symptomMessageDiv" >
            <h1>Message</h1>
            </div>
        );
    }
    
    
    
}

export default injectIntl(symptomMessage);

