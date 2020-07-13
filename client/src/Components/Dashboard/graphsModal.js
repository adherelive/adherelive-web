import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone } from "@ant-design/icons";
import { CHART_TITLE, GRAPH_COLORS, NO_ADHERENCE, NO_ACTION, NO_APPOINTMENT, NO_MEDICATION, ACTIVE_PATIENT, CRITICAL_PATIENT } from "../../constant";
import uuid from 'react-uuid';
import { Tabs, Button, Checkbox, Steps, Col, Select, Input, Upload, Modal, TimePicker, Icon, message } from "antd";



const graphs = [NO_ADHERENCE, NO_ACTION, NO_APPOINTMENT, NO_MEDICATION, ACTIVE_PATIENT, CRITICAL_PATIENT];

class ClinicRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.myRef = React.createRef();
    }

    componentDidMount() {
        const { selectedGraphs = [] } = this.props;
        this.setState({ selectedGraphs });
    }


    handleSave = () => {
        let { selectedGraphs } = this.state;
        let { handleOk } = this.props;

        handleOk(selectedGraphs);
        // this.setState({
        // });
    }

    toggleGraphSelected = (graph) => () => {

        let { selectedGraphs = [] } = this.state;
        if (selectedGraphs.includes(graph)) {
            selectedGraphs.splice(selectedGraphs.indexOf(graph), 1);
        } else {
            selectedGraphs.push(graph);
        }
        this.setState(selectedGraphs);

    }


    handleClose = () => {

        const { handleCancel } = this.props;
        handleCancel();

    }


    handleChangeAddress = address => {
        this.setState({ address });
    };

    handleSelect = address => {

        this.setState({ address });
    };


    render() {
        console.log("STATEEEEEEEEEEE OF MODAL", this.state);
        const { selectedGraphs = [] } = this.state;

        const { visible, handleCancel, handleOk } = this.props;
        return (
            <Modal
                visible={visible}
                title={'Graphs'}
                onCancel={this.handleClose}
                onOk={this.handleSave}
                footer={[
                    <Button key="back" onClick={this.handleClose}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleSave}>
                        Submit
                    </Button>,
                ]}
            >
                <div className='location-container'>
                    {
                        graphs.map(graph => {
                            console.log('GRAPHSSSSSSSS 19273', selectedGraphs, graph, selectedGraphs.includes(graph));
                            return (
                                <div className='flex justify-space-between wp100 mb8 mt4'>
                                    <div className='flex'>
                                        <Checkbox checked={selectedGraphs.includes(graph)} onChange={this.toggleGraphSelected(graph)} />
                                        <div className='ml10 fs16 fw700'>{CHART_TITLE[graph]}</div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </Modal>
        );

    }
}
export default injectIntl(ClinicRegister);
