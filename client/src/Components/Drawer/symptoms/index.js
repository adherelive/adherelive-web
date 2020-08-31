import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, Select, Input, message, Button, Spin, Radio, DatePicker } from "antd";
import config from "../../../config";
import messages from './message';
import "react-datepicker/dist/react-datepicker.css";
import humanBody from '../../../Assets/images/humanBody.png'
import { PARTS, PART_LIST, BODY } from '../../../constant';


class SymptomsDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }
    formatMessage = data => this.props.intl.formatMessage(data);

    getBodyPartName = (selected_part) => {
        const { formatMessage } = this;
        if (selected_part === PARTS.HEAD) {
            return formatMessage(messages.head);
        } else if (selected_part === PARTS.LEFT_EYE) {
            return formatMessage(messages.leftEye);
        } else if (selected_part === PARTS.RIGHT_EYE) {
            return formatMessage(messages.rightEye);
        } else if (selected_part === PARTS.LEFT_EAR) {
            return formatMessage(messages.leftEar);
        } else if (selected_part === PARTS.RIGHT_EAR) {
            return formatMessage(messages.rightEar);
        } else if (selected_part === PARTS.NOSE) {
            return formatMessage(messages.nose);
        } else if (selected_part === PARTS.MOUTH) {
            return formatMessage(messages.mouth);
        } else if (selected_part === PARTS.NECK) {
            return formatMessage(messages.neck);
        } else if (selected_part === PARTS.LEFT_SHOULDER) {
            return formatMessage(messages.leftShoulder);
        } else if (selected_part === PARTS.RIGHT_SHOULDER) {
            return formatMessage(messages.rightShoulder);
        } else if (selected_part === PARTS.CHEST) {
            return formatMessage(messages.chest);
        } else if (selected_part === PARTS.LEFT_ARM) {
            return formatMessage(messages.leftArm);
        } else if (selected_part === PARTS.RIGHT_ARM) {
            return formatMessage(messages.rightArm);
        } else if (selected_part === PARTS.LEFT_ELBOW) {
            return formatMessage(messages.leftElbow);
        } else if (selected_part === PARTS.RIGHT_ELBOW) {
            return formatMessage(messages.rightElbow);
        } else if (selected_part === PARTS.STOMACH) {
            return formatMessage(messages.stomach);
        } else if (selected_part === PARTS.ABDOMEN) {
            return formatMessage(messages.abdomen);
        } else if (selected_part === PARTS.LEFT_FOREARM) {
            return formatMessage(messages.leftForearm);
        } else if (selected_part === PARTS.RIGHT_FOREARM) {
            return formatMessage(messages.rightForearm);
        } else if (selected_part === PARTS.LEFT_WRIST) {
            return formatMessage(messages.leftWrist);
        } else if (selected_part === PARTS.RIGHT_WRIST) {
            return formatMessage(messages.rightWrist);
        } else if (selected_part === PARTS.LEFT_HAND) {
            return formatMessage(messages.leftHand);
        } else if (selected_part === PARTS.RIGHT_HAND) {
            return formatMessage(messages.rightHand);
        } else if (selected_part === PARTS.LEFT_HAND_FINGER) {
            return formatMessage(messages.leftHandFingers);
        } else if (selected_part === PARTS.RIGHT_HAND_FINGER) {
            return formatMessage(messages.rightHandFingers);
        } else if (selected_part === PARTS.LEFT_HIP) {
            return formatMessage(messages.leftHip);
        } else if (selected_part === PARTS.RIGHT_HIP) {
            return formatMessage(messages.rightHip);
        } else if (selected_part === PARTS.LEFT_THIGH) {
            return formatMessage(messages.leftThigh);
        } else if (selected_part === PARTS.RIGHT_THIGH) {
            return formatMessage(messages.rightThigh);
        } else if (selected_part === PARTS.LEFT_KNEE) {
            return formatMessage(messages.leftKnee);
        } else if (selected_part === PARTS.RIGHT_KNEE) {
            return formatMessage(messages.rightKnee);
        } else if (selected_part === PARTS.LEFT_SHIN) {
            return formatMessage(messages.leftShin);
        } else if (selected_part === PARTS.RIGHT_SHIN) {
            return formatMessage(messages.rightShin);
        } else if (selected_part === PARTS.LEFT_ANKLE) {
            return formatMessage(messages.leftAnkle);
        } else if (selected_part === PARTS.RIGHT_ANKLE) {
            return formatMessage(messages.rightAnkle);
        } else if (selected_part === PARTS.LEFT_FOOT) {
            return formatMessage(messages.leftFoot);
        } else if (selected_part === PARTS.RIGHT_FOOT) {
            return formatMessage(messages.rightFoot);
        } else if (selected_part === PARTS.LEFT_TOE) {
            return formatMessage(messages.leftToe);
        } else if (selected_part === PARTS.RIGHT_TOE) {
            return formatMessage(messages.rightToe);
        } else if (selected_part === PARTS.RECTUM) {
            return formatMessage(messages.rectum);
        } else if (selected_part === PARTS.URINARY_BLADDER) {
            return formatMessage(messages.urinary);
        }
    };

    renderBody = () => {
        const { payload: { data: { body_part = PARTS.HEAD, description = '' } } } = this.props;
        return (
            <div className='humanbody-container hp100'>
                <div className='fs20 medium tac'>{this.getBodyPartName(body_part)}</div>
                <div className='humanBodyWrapper' >
                    <img
                        src={humanBody}
                        className={'wp100 hp100'}
                    />
                    {PART_LIST.map(part => {
                        const { key, areaStyle = {}, dotStyle = {} } = BODY[part];
                        const { top: bpTop = 0,
                            left: bpLeft = 0,
                            height: bpHeight = 0,
                            width: bpWidth = 0 } = areaStyle || {};
                        console.log('4895724839uf89324uufu489urfj', key, body_part);
                        const { top: dotTop = 0, left: dotLeft = 0 } = dotStyle || {};
                        return (
                            <div
                                key={key}
                                style={{ position: 'absolute', top: `${bpTop}px`, left: `${bpLeft}px`, height: `${bpHeight}px`, width: `${bpWidth}px` }}
                            >
                                <div
                                    style={{
                                        top: `${dotTop}px`,
                                        left: `${dotLeft}px`,
                                        position: "absolute",
                                        height: body_part === key ? 12 : 0,
                                        width: body_part === key ? 12 : 0,
                                        backgroundColor: body_part === key ? "red" : 'rgba(0,0,0,0)',
                                        borderRadius: '50%',

                                        // height:  12,
                                        // width:  12 ,
                                        // backgroundColor: "red",
                                        // borderRadius: '50%'
                                    }
                                    }
                                />
                            </div>
                        );
                    })}
                </div>

                <div className='fs16 tac'>{`${description}`}</div>
            </div>
        );
    }


    render() {
        const { visible, close } = this.props;
        if (visible !== true) {
            return null;
        }
        console.log('86348732648732684723=======>', this.props)
        return (
            <Fragment>
                <Drawer
                    className={"human-body-drawer"}
                    title={this.formatMessage(messages.symptoms)}
                    placement="right"
                    // closable={false}
                    // closeIcon={<img src={backArrow} />}
                    maskClosable={false}
                    headerStyle={{
                        position: "sticky",
                        zIndex: "9999",
                        top: "0px"
                    }}
                    onClose={close}
                    visible={visible} // todo: change as per state, -- WIP --
                    width={400}
                >
                    {this.renderBody()}
                </Drawer>

            </Fragment>
        );
    }
}

export default injectIntl(SymptomsDrawer);



