import React, {Component} from "react";
import {injectIntl} from "react-intl";
import Loading from "../../Common/Loading";
import messages from "./messages";
import message from "antd/es/message";

class VitalTimeline extends Component {
    constructor(props) {
        super(props);
        this.setState({loading: false});
    }

    componentDidMount() {
        this.getTimelineData();
    }

    getTimelineData = async () => {
        const {getVitalTimeline} = this.props;
        try {
            this.setState({loading: true});
            const response = await getVitalTimeline();
            const {status, payload: {data: {vital_timeline = {}, vital_date_ids = []} = {}, message} = {}} = response || {};
            if(status === true) {
                this.setState({vital_timeline, vital_date_ids, loading: false});
                message.success(message, 5);
            } else {
                this.setState({loading: false});
                message.warn(message);
            }
        } catch(error) {
            this.setState({loading: false});
            console.log("1761867 error", error);
        }
    };

    render() {
        const {
            id,
            intl: {formatMessage} = {}
        } = this.props;
        const {loading} = this.state;

        console.log("298371289 loading", loading);

        if(loading === true) {
            return <Loading />;
        }

        return (
            <div>{`Timeline here ${id}`}</div>
        );
    }
}

export default injectIntl(VitalTimeline);