import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, Select, Input, message, Button, Spin, Radio, DatePicker } from "antd";
import config from "../../../config";
// import Cookies from 'js-cookie';
import { get, set } from "js-cookie";
// import { encode, decode } from 'js-base64';
import { connect } from "getstream";
import messages from './message';
import "react-datepicker/dist/react-datepicker.css";
const { Option } = Select;

const { GETSTREAM_API_KEY, GETSTREAM_APP_ID } = config;

const MALE = 'm';
const FEMALE = 'f';
const OTHER = 'o';

class NotificationDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

        const { auth: { notificationToken = '', feedId = '' } = {} } = this.props;
        // if (get("notificationToken") && get("feedId")) {
        if (notificationToken || feedId) {
            let client = connect(
                GETSTREAM_API_KEY,
                notificationToken,
                GETSTREAM_APP_ID
            );

            let clientFeed = client.feed("notification", feedId);
            console.log('546768546468587587578', notificationToken, feedId, client, clientFeed.get({ limit: 7 }));

            this.setState({ clientFeed });
            clientFeed.get({ limit: 7 }).then(data => {
                this.getNotificationFromActivities(data);
            });

            clientFeed.subscribe(data => {
                clientFeed.get({ limit: 7 }).then(res => {
                    this.getNotificationFromActivities(res);
                });
            });
        }
    }



    getNotificationFromActivities(data) {
        const { getNotification, updateUnseenNotification } = this.props;
        let activities = [];
        let activitiesId = [];
        let groupId = {};
        const { results = [], unseen } = data;
        // console.log("unseen----------------->", unseen);
        // updateUnseenNotification(unseen);

        results.forEach(result => {
            const { activities: response = [], is_read, id } = result;
            let activityData = {};
            activityData.activity = response;
            activityData.is_read = is_read;

            activities = activities.concat(activityData);
            const { id: activity_id } = response[0] || {};
            activitiesId = activitiesId.concat(activity_id);
            groupId[activity_id] = id;
        });

        activities.sort((a, b) => {
            if (a.time < b.time) {
                return 1;
            }
            return -1;
        });
        this.setState({
            notifications: activitiesId,
            activityGroupId: groupId
        });
        console.log('activities765863563865356886', data, activities);
        getNotification(activities);
    }

    readNotification = (groupId, activity_id) => {
        const { auth: { notificationToken = '', feedId = '' } = {} } = this.props;
        if (notificationToken || feedId) {
            let client = connect(
                GETSTREAM_API_KEY,
                notificationToken,
                GETSTREAM_APP_ID
            );

            let clientFeed = client.feed("notification", feedId);
            clientFeed.get({ mark_read: [groupId], limit: 7 }).then(data => {
                clientFeed.get({ limit: 7 }).then(data => {
                    console.log("data-=-=-=-=-=-=-=-=-=-=-==-=-=>", data);
                    this.getNotificationFromActivities(data);
                });
            });
        }
    };

    markAllSeen = e => {
        // console.log("mark all seen");
        const { auth: { notificationToken = '', feedId = '' } = {} } = this.props;
        if (notificationToken || feedId) {
            let client = connect(
                GETSTREAM_API_KEY,
                notificationToken,
                GETSTREAM_APP_ID
            );

            let clientFeed = client.feed("notification", btoa(feedId));
            clientFeed.get({ mark_seen: true }).then(data => {
                clientFeed.get({ limit: 7 }).then(data => {
                    this.getNotificationFromActivities(data);
                });
            });
        }
    };


    formatMessage = data => this.props.intl.formatMessage(data);


    render() {
        const { visible, close } = this.props;
        if (visible !== true) {
            return null;
        }

        const { auth: { notificationToken = '', feedId = '' } = {} } = this.props;
        return (
            <Fragment>
                <Drawer
                    title={this.formatMessage(messages.notifications)}
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
                    {/* <div className='add-patient-footer'>
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            {this.formatMessage(messages.cancel)}
                        </Button>
                        <Button onClick={this.onSubmit} type="primary">
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div> */}
                </Drawer>

            </Fragment>
        );
    }
}

export default injectIntl(NotificationDrawer);



