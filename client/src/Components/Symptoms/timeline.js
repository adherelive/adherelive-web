import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { MEDICINE_TYPE, GENDER, PERMISSIONS, ROOM_ID_TEXT, TABLET, SYRINGE, SYRUP, PARTS, PART_LIST_BACK, PART_LIST_CODES, PART_LIST_FRONT, BODY } from "../../constant";
import { Timeline, message, Button, Spin } from "antd";

import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import moment from "moment";
import audio from "../../Assets/images/music.png";
import messages from "./message";
import config from "../../config";



const TABS = {
    TIMELINE: "1",
    SUMMARY: "2"
};



class TimelineTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: TABS.TIMELINE,
            timelineSymptoms: {},
            loading: false
        };
    }

    componentDidMount() {
        const { getSymptomTimeLine, patientId } = this.props;

        this.setState({ loading: true });
        getSymptomTimeLine(patientId).then(res => {
            const { status = false, payload: { data = {} } = {} } = res || {};
            if (status) {
                const { timeline_symptoms = {} } = data || {};
                this.setState({ timelineSymptoms: timeline_symptoms });
            }

            this.setState({ loading: false });
        });

    }


    onRowSymptoms = (record, rowIndex) => {
        const { onRowClickSymptoms } = this;
        // const { key } = record;
        return {
            onClick: onRowClickSymptoms(record)
        };
    };

    handleSubmitTemplate = (data) => {
        const { addCarePlanMedicationsAndAppointments, getMedications, getAppointments, care_plans, patient_id, getPatientCarePlanDetails } = this.props;
        let carePlanId = 1;
        for (let carePlan of Object.values(care_plans)) {
            let { basic_info: { id = 1, patient_id: patientId = 1 } } = carePlan;
            if (patient_id == patientId) {
                carePlanId = id;
            }

        }
        addCarePlanMedicationsAndAppointments(data, carePlanId).then(response => {
            const { status = false, statusCode, payload: { error: { error_type = '' } = {}, message: errorMessage = '' } = {} } = response;
            if (status) {
                this.onCloseTemplate();

                message.success(this.formatMessage(messages.carePlanUpdated));
                getMedications(patient_id).then(() => {
                    getAppointments(patient_id).then(() => {
                        getPatientCarePlanDetails(patient_id);
                    })
                })
            } else {
                if (statusCode === 422 && error_type == 'slot_present') {
                    message.error(this.formatMessage(messages.slotPresent))
                } else if (statusCode === 422) {

                    message.error(errorMessage)
                } else {
                    message.error(this.formatMessage(messages.somethingWentWrong))
                }
            }
        });
    };


    getBodyPartName = (selected_part) => {
        const { formatMessage } = this;
        if (selected_part === PART_LIST_CODES.HEAD) {
            return formatMessage(messages.head);
        } else if (selected_part === PART_LIST_CODES.LEFT_EYE) {
            return formatMessage(messages.leftEye);
        } else if (selected_part === PART_LIST_CODES.RIGHT_EYE) {
            return formatMessage(messages.rightEye);
        } else if (selected_part === PART_LIST_CODES.LEFT_EAR) {
            return formatMessage(messages.leftEar);
        } else if (selected_part === PART_LIST_CODES.RIGHT_EAR) {
            return formatMessage(messages.rightEar);
        } else if (selected_part === PART_LIST_CODES.NOSE) {
            return formatMessage(messages.nose);
        } else if (selected_part === PART_LIST_CODES.MOUTH) {
            return formatMessage(messages.mouth);
        } else if (selected_part === PART_LIST_CODES.NECK) {
            return formatMessage(messages.neck);
        } else if (selected_part === PART_LIST_CODES.LEFT_SHOULDER) {
            return formatMessage(messages.leftShoulder);
        } else if (selected_part === PART_LIST_CODES.RIGHT_SHOULDER) {
            return formatMessage(messages.rightShoulder);
        } else if (selected_part === PART_LIST_CODES.CHEST) {
            return formatMessage(messages.chest);
        } else if (selected_part === PART_LIST_CODES.LEFT_ARM) {
            return formatMessage(messages.leftArm);
        } else if (selected_part === PART_LIST_CODES.RIGHT_ARM) {
            return formatMessage(messages.rightArm);
        } else if (selected_part === PART_LIST_CODES.LEFT_ELBOW) {
            return formatMessage(messages.leftElbow);
        } else if (selected_part === PART_LIST_CODES.RIGHT_ELBOW) {
            return formatMessage(messages.rightElbow);
        } else if (selected_part === PART_LIST_CODES.STOMACH) {
            return formatMessage(messages.stomach);
        } else if (selected_part === PART_LIST_CODES.ABDOMEN) {
            return formatMessage(messages.abdomen);
        } else if (selected_part === PART_LIST_CODES.LEFT_FOREARM) {
            return formatMessage(messages.leftForearm);
        } else if (selected_part === PART_LIST_CODES.RIGHT_FOREARM) {
            return formatMessage(messages.rightForearm);
        } else if (selected_part === PART_LIST_CODES.LEFT_WRIST) {
            return formatMessage(messages.leftWrist);
        } else if (selected_part === PART_LIST_CODES.RIGHT_WRIST) {
            return formatMessage(messages.rightWrist);
        } else if (selected_part === PART_LIST_CODES.LEFT_HAND) {
            return formatMessage(messages.leftHand);
        } else if (selected_part === PART_LIST_CODES.RIGHT_HAND) {
            return formatMessage(messages.rightHand);
        } else if (selected_part === PART_LIST_CODES.LEFT_HAND_FINGER) {
            return formatMessage(messages.leftHandFingers);
        } else if (selected_part === PART_LIST_CODES.RIGHT_HAND_FINGER) {
            return formatMessage(messages.rightHandFingers);
        } else if (selected_part === PART_LIST_CODES.LEFT_HIP) {
            return formatMessage(messages.leftHip);
        } else if (selected_part === PART_LIST_CODES.RIGHT_HIP) {
            return formatMessage(messages.rightHip);
        } else if (selected_part === PART_LIST_CODES.LEFT_THIGH) {
            return formatMessage(messages.leftThigh);
        } else if (selected_part === PART_LIST_CODES.RIGHT_THIGH) {
            return formatMessage(messages.rightThigh);
        } else if (selected_part === PART_LIST_CODES.LEFT_KNEE) {
            return formatMessage(messages.leftKnee);
        } else if (selected_part === PART_LIST_CODES.RIGHT_KNEE) {
            return formatMessage(messages.rightKnee);
        } else if (selected_part === PART_LIST_CODES.LEFT_SHIN) {
            return formatMessage(messages.leftShin);
        } else if (selected_part === PART_LIST_CODES.RIGHT_SHIN) {
            return formatMessage(messages.rightShin);
        } else if (selected_part === PART_LIST_CODES.LEFT_ANKLE) {
            return formatMessage(messages.leftAnkle);
        } else if (selected_part === PART_LIST_CODES.RIGHT_ANKLE) {
            return formatMessage(messages.rightAnkle);
        } else if (selected_part === PART_LIST_CODES.LEFT_FOOT) {
            return formatMessage(messages.leftFoot);
        } else if (selected_part === PART_LIST_CODES.RIGHT_FOOT) {
            return formatMessage(messages.rightFoot);
        } else if (selected_part === PART_LIST_CODES.LEFT_TOE) {
            return formatMessage(messages.leftToe);
        } else if (selected_part === PART_LIST_CODES.RIGHT_TOE) {
            return formatMessage(messages.rightToe);
        } else if (selected_part === PART_LIST_CODES.RECTUM) {
            return formatMessage(messages.rectum);
        } else if (selected_part === PART_LIST_CODES.URINARY_BLADDER) {
            return formatMessage(messages.urinary);
        } else if (selected_part === PART_LIST_CODES.HEAD_BACK) {
            return formatMessage(messages.head);
        } else if (selected_part === PART_LIST_CODES.NECK_BACK) {
            return formatMessage(messages.neck);
        } else if (selected_part === PART_LIST_CODES.RIGHT_SHOULDER_BACK) {
            return formatMessage(messages.rightShoulder);
        } else if (selected_part === PART_LIST_CODES.LEFT_SHOULDER_BACK) {
            return formatMessage(messages.leftShoulder);
        } else if (selected_part === PART_LIST_CODES.BACK) {
            return formatMessage(messages.back);
        } else if (selected_part === PART_LIST_CODES.LOWER_BACK) {
            return formatMessage(messages.lowerBack);
        } else if (selected_part === PART_LIST_CODES.LEFT_TRICEP) {
            return formatMessage(messages.leftTricep);
        } else if (selected_part === PART_LIST_CODES.RIGHT_TRICEP) {
            return formatMessage(messages.rightTricep);
        } else if (selected_part === PART_LIST_CODES.LEFT_FOREARM_BACK) {
            return formatMessage(messages.leftForearm);
        } else if (selected_part === PART_LIST_CODES.RIGHT_FOREARM_BACK) {
            return formatMessage(messages.rightForearm);
        } else if (selected_part === PART_LIST_CODES.LEFT_HAMSTRING) {
            return formatMessage(messages.leftHamString);
        } else if (selected_part === PART_LIST_CODES.RIGHT_HAMSTRING) {
            return formatMessage(messages.rightHamString);
        } else if (selected_part === PART_LIST_CODES.LEFT_CALF) {
            return formatMessage(messages.leftCalf);
        } else if (selected_part === PART_LIST_CODES.RIGHT_CALF) {
            return formatMessage(messages.rightCalf);
        };
    };

    formatDataForTimeLine = () => {
        let { upload_documents = {} } = this.props;

        const { timelineSymptoms = {} } = this.state;
        let data = [];
        // createdAtDates.forEach(date => {
        for (let date of Object.keys(timelineSymptoms)) {
            data.push({
                date: `${date}`
            });
            const activityData = timelineSymptoms[date] || [];
            activityData.forEach((activity, index) => {
                // const temp = this.formatActivityData(index, activity);
                const {
                    data: {
                        text = "",
                        image_document_ids = [],
                        audio_document_ids = [],
                        config: { parts = [] } = {}
                    } = {},
                    createdAt = ""
                } = activity || {};
                const temp = {
                    text,
                    image_document_ids,
                    audio_document_ids,
                    createdAt,
                    parts
                };
                data.push(temp);
            });
        }

        return data;
    }

    renderTimelineBody = (data) => {
        const { upload_documents = {} } = this.props;
        let dataTorender = [];
        for (let rowData of data) {
            const {
                date = "",
                text = "",
                image_document_ids = [],
                audio_document_ids = [],
                createdAt = moment(),
                parts = []
            } = rowData || {};
            let imageUrl = "";
            let audioUrl = "";
            let audioName = "";
            if (image_document_ids.length) {
                const { basic_info: { document = "" } = {} } =
                    upload_documents[image_document_ids[0]] || {};
                imageUrl = document;
            }
            if (audio_document_ids.length) {
                const { basic_info: { document = "", name = "" } = {} } =
                    upload_documents[audio_document_ids[0]] || {};
                audioUrl = document;
                audioName = name;
            }
            // console.log('ROW DETAILSSSSSSSSS=======>', imageUrl, audioUrl);
            if (date) {
                dataTorender.push(
                    <Timeline.Item dot={<div className={'timelineDot'} />}>
                        <div className={'fs16 medium w300'}>
                            {moment(date).format("Do MMMM,YYYY")}
                        </div>
                    </Timeline.Item>
                );
            }
            dataTorender.push(
                <Timeline.Item dot={<div className={'timelineDot'} />}>
                    <div
                        style={{
                            flex: 1,
                            backgroundColor: "#ffffff",
                            marginBottom: 20,
                            marginRight: 14,
                            paddingLeft: imageUrl && imageUrl.length ? 0 : 10,
                            paddingRight: imageUrl && imageUrl.length ? 0 : 10,
                            paddingBottom: 5,
                            paddingTop: imageUrl && imageUrl.length ? 0 : 5,
                            borderRadius: 2,
                            marginTop: -12,
                            width: 300
                        }}
                    >
                        {text && text.length ? (
                            <div className={'fs16 medium'}>
                                {text}
                            </div>
                        ) : null}
                        {imageUrl && imageUrl.length ? (
                            <img
                                src={imageUrl}
                                style={{ width: 300, height: 200, borderRadius: 2 }}
                            />
                        ) : null}

                        {audioUrl && audioUrl.length ? (
                            <div
                                style={{ height: 40, width: 250, marginTop: 5 }}
                            // onPress={this.downloadDocument(audioUrl, audioName)}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        flex: 1,
                                        backgroundColor: "#ededed",
                                        borderRadius: 4,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        height: 40,
                                        marginRight: 10,
                                        paddingLeft: 10,
                                        paddingRight: 10
                                    }}
                                >
                                    <div className={'fs16'}>
                                        {audioName.length <= 12
                                            ? audioName
                                            : `${audioName.substring(0, 13)}...`}
                                    </div>
                                    <img src={audio} style={{ height: 20, width: 20 }} />
                                </div>
                            </div>
                        ) : null}
                        <div
                            // className={'flex  mt10 align-center' + imageUrl && imageUrl.length ? 'ml10' : ''}
                            style={{ display: 'flex', flexDirection: 'row', marginTop: (text || imageUrl || audioUrl) ? 10 : 0, marginLeft: 10, alignItems: 'center' }}
                        >
                            <div>{moment(createdAt).format("h a")}</div>
                            <div
                                className={'seperator'}
                            />
                            <div>{this.getBodyPartName(parts[0])}</div>
                        </div>
                    </div>
                </Timeline.Item>
            );
        }
        return dataTorender;
    }


    formatMessage = (data) => this.props.intl.formatMessage(data);


    render() {
        const data = this.formatDataForTimeLine();
        console.log('weiutqweoiuiquwoerw===>', data);
        let { symptoms = {} } = this.props;
        const { carePlanTemplateIds = [], currentTab = TABS.TIMELINE, loading } = this.state;
        if (loading) {
            return (
                <div className='wp100 hp100 flex justify-center align-center'>
                    <Spin />
                </div>
            );
        }
        return (
            <div className="pt10 pr10 pb10 pl10 timelineContainer flex direction-colmn align-center " style={{ backgroundColor: '#f4f4f4' }}>
                <Timeline>
                    {this.renderTimelineBody(data)}
                </Timeline>

            </div>
        );
    }
}

export default injectIntl(TimelineTab);
