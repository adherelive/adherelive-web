import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { DatePicker } from "antd";
import FullCalendar from "fullcalendar-reactwrapper";
import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css";
// // import isEqual from "lodash-es/isEqual";

import next from "../../../Assets/images/ico-calendar-nav-next.svg";
import prev from "../../../Assets/images/ico-calendar-nav-prev.svg";
import dropDownIcon from "../../../Assets/images/ico-dropdown.svg";
import userPlaceHolder from "../../../Assets/images/ico-placeholder-userdp.svg";

import { doRequest } from "../../../Helper/network";
import { getBookedSlotsURL } from "../../../Helper/urls/event";

import messages from "./message";
import moment from "moment";
import { EVENT_TYPE } from "../../../constant";

const DropDownIcon = <img src={dropDownIcon} alt="d" className="w14 h14" />;

class CalendarComponent extends Component {
  eventResize = (event, duration) => {
    const { start, end } = event;
    const { onEventDurationChange } = this.props;
    onEventDurationChange(start, end);
  };

  eventResizeStart = (event, ...args) => {};

  eventResizeStop = (event, ...args) => {};

  eventDragStart = (event, args) => {};

  eventDrop = (event, duration) => {
    const { start, end } = event;
    const { onEventDurationChange } = this.props;
    onEventDurationChange(start, end);
  };

  eventDragStop = (event) => {};

  componentDidMount() {
    this.adjustCurrentEvent();
  }

  componentDidUpdate(prevProps, prevState) {
    this.adjustCurrentEvent();
  }

  adjustCurrentEvent = () => {
    const currentEvent = window.document.getElementsByClassName("current");
    if (currentEvent && currentEvent.length > 0) {
      currentEvent[0].scrollIntoView({
        // behavior: "smooth",
        block: "center",
      });
    }
  };

  render() {
    const { event, bookedEvents } = this.props;
    const {
      eventDragStart,
      eventDragStop,
      eventResize,
      eventResizeStop,
      eventResizeStart,
      eventDrop,
    } = this;
    return (
      <div id="12717728812718t27182t1">
        <FullCalendar
          header={{
            left: "",
            center: "",
            right: "",
          }}
          defaultDate={event.start ? event.start : null}
          events={event.start ? [event, ...bookedEvents] : []}
          editable={true}
          eventLimit={true}
          defaultView="agendaDay"
          eventDurationEditable={true}
          eventStartEditable={true}
          eventDragStart={eventDragStart}
          eventDragStop={eventDragStop}
          eventDrop={eventDrop}
          eventResize={eventResize}
          eventResizeStart={eventResizeStart}
          eventResizeStop={eventResizeStop}
          timezone={"local"}
        />
      </div>
    );
  }
}

class CalendarTimeSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bookedEvents: [],
    };
  }

  componentDidMount() {
    this.getBookedSlots();
  }

  componentDidUpdate(prevProps, prevState) {
    const { startDate, otherUser: { basicInfo: { _id } = {} } = {} } =
      this.props;
    const {
      startDate: prevDate,
      otherUser: { basicInfo: { _id: prevUser } = {} } = {},
    } = prevProps;

    if (prevUser !== _id || prevDate !== startDate) {
      this.getBookedSlots();
    }
  }

  getBookedSlots = async () => {
    const {
      startDate,
      otherUser: { basicInfo: { _id } = {} } = {},
      eventMode,
    } = this.props;

    if (
      eventMode === EVENT_TYPE.APPOINTMENT &&
      startDate &&
      startDate.isValid() &&
      _id
    ) {
      //fetching current startDate's booked appointments.
      const response = await doRequest({
        url: getBookedSlotsURL(),
        params: {
          startDate: startDate.clone().format("YYYY-MM-DD"),
          userId: _id,
        },
      });

      const { status, payload = {} } = response;
      if (status) {
        const { data: { bookedSlots } = [] } = payload;
        //for more appointments option got to https://fullcalendar.io/docs/event-parsing
        const bookedEvents = bookedSlots.map((event) => {
          const { start, end } = event;
          return {
            start,
            end,
            editable: false,
            startEditable: false,
            durationEditable: false,
            className: "booked",
          };
        });
        this.setState({ bookedEvents });
      }
    }
  };

  formatMessage = (messageId) => {
    const {
      intl: { formatMessage },
    } = this.props;
    return formatMessage(messageId);
  };

  getParentNode = (t) => t.parentNode;

  render() {
    const {
      className,
      eventEndTime,
      eventStartTime,
      onEventDurationChange,
      startDate,
      onStartDateChange,
      disabledStartDate,
      onPrev,
      onNext,
      disabled,
      otherUser: {
        basicInfo: { name, profilePicLink = userPlaceHolder } = {},
      } = {},
    } = this.props;
    const { formatMessage } = this;

    const { bookedEvents = [] } = this.state;

    let event = {};

    if (eventStartTime && eventEndTime) {
      event = {
        start: eventStartTime,
        end: eventEndTime,
        className: "current",
      };
    }

    if (disabled) {
      event = {
        ...event,
        editable: false,
        startEditable: false,
        durationEditable: false,
      };
    }

    let today = false;
    if (startDate && startDate !== null) {
      if (startDate.isValid) {
        today = moment().isSame(startDate, "day");
      }
    }

    return (
      <div className={`${className} calendar-selection`}>
        <div className="mask" />

        <Fragment>
          <div className=" header fontsize16 dark medium">
            {formatMessage(messages.chooseWhen)}
          </div>
          <div className="calendar-toolbar mt16 flex justify-content-start align-items-center">
            <Fragment>
              {/* //  {!range && ( */}
              <Fragment>
                <img
                  className={`mr8  ${
                    today || disabled ? "not-allowed" : "clickable"
                  } `}
                  src={prev}
                  alt="prev"
                  onClick={today || disabled ? null : onPrev}
                />
                <img
                  className={`mr8  ${disabled ? "not-allowed" : "clickable"} `}
                  src={next}
                  alt="prev"
                  onClick={disabled ? null : onNext}
                />
              </Fragment>
              {/* )} */}
              <div className="mr16">
                <DatePicker
                  disabledDate={disabledStartDate}
                  disabled={disabled}
                  allowClear={false}
                  className="date-picker"
                  format="DD/MM/YYYY, ddd"
                  suffixIcon={DropDownIcon}
                  value={startDate === null ? null : moment(startDate)}
                  onChange={onStartDateChange}
                  getCalendarContainer={this.getParentNode}
                />
              </div>
              <div
                className={
                  "flex-1 flex justify-content-end align-items-center mr8 ml8"
                }
              >
                {name && (
                  <div className="flex justify-content-start align-items-center bg-transparent">
                    <img alt={"u"} src={profilePicLink} />
                    <div className="deep-sea-blue fontsize12 medium mr8">{`${name}'s Calendar`}</div>
                  </div>
                )}
              </div>
            </Fragment>
          </div>
        </Fragment>

        <CalendarComponent
          onEventDurationChange={onEventDurationChange}
          event={event}
          bookedEvents={bookedEvents}
          disabled={disabled}
        />
      </div>
    );
  }
}

export default injectIntl(CalendarTimeSelection);
