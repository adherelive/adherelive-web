import React, { Component } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
import { CHART_TITLE, NO_ADHERENCE, NO_ACTION, NO_APPOINTMENT, NO_MEDICATION, TEST_TWO, TEST_ONE } from "../../constant";

import { Button, Checkbox, Modal } from "antd";



const graphs = [NO_ADHERENCE, NO_ACTION, NO_APPOINTMENT, NO_MEDICATION, TEST_ONE, TEST_TWO];

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
        const { selectedGraphs = [] } = this.state;

        const { visible } = this.props;
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
                            return (
                                <div key={graph} className='flex justify-space-between wp100 mb8 mt4'>
                                    <div className='flex pointer'>
                                        <Checkbox checked={selectedGraphs.includes(graph)} onChange={this.toggleGraphSelected(graph)}/>
                                        <div className='ml10 fs16 fw700' onClick={this.toggleGraphSelected(graph)}>{CHART_TITLE[graph]}</div>
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
