import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table, Icon } from "antd";
import generateRow from "./dataRow";
import getColumn from "./header";
import messages from "./messages";
import message from "antd/es/message";
import { CURRENT_TAB } from "../../Dashboard";

export const SORTING_TYPE = {
  SORT_BY_DATE: "0",
  SORT_BY_NAME: "1",
};

class patientTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      pageSize: 0,
      loading: false,
      total: null,
      tabChanged: false,
    };
  }

  async componentDidMount() {
    this.handleGetPatients();
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      currentTab: prev_currentTab = "",
      sortingType: prev_sortingType = SORTING_TYPE.SORT_BY_NAME,
    } = prevProps;
    const { currentTab = "", sortingType = SORTING_TYPE.SORT_BY_NAME } =
      this.props;
    const { offset, tabChanged = false } = this.state;

    if (currentTab !== prev_currentTab) {
      await this.handleGetPatients(true);
      await this.setState({ tabChanged: true });
    } else if (tabChanged && currentTab === prev_currentTab) {
      this.setState({ tabChanged: false });
    }

    if (sortingType !== prev_sortingType) {
      await this.handleGetPatients();
    }
  }

  handleGetPatients = async (tabChanged = false) => {
    try {
      const { getPatientsPaginated, sortingType = "1" } = this.props;
      let { offset: state_offset = 0 } = this.state;
      const { currentTab = CURRENT_TAB.ALL_PATIENTS } = this.props;
      let is_watchlist_flag = "0";
      if (tabChanged === true) {
        state_offset = 0;
      }

      if (currentTab === CURRENT_TAB.WATCHLIST) {
        is_watchlist_flag = "1";
      }

      const payload = {
        offset: state_offset,
        sort_by_name: sortingType,
        watchlist: is_watchlist_flag,
      };
      this.setState({ loading: true });
      const response = await getPatientsPaginated(payload);
      const {
        status,
        statusCode,
        payload: { data = {}, message: msg = "" } = {},
      } = response || {};
      const { offset = "", pageSize = "", total = null } = ({} = data || {});

      if (!status) {
        message.warn(msg);
      } else {
        const intOffset = parseInt(offset);
        const intPageSize = parseInt(pageSize);
        this.setState({ offset: intOffset, pageSize: intPageSize, total });
      }

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      console.log("87238543284286342387 error ========>", { error });
    }
  };

  getDataSource = () => {
    const {
      paginated_patients: temp_patients,
      doctors,
      providers,
      treatments,
      conditions,
      severity,
      care_plans,
      users,
      authenticated_user,
      addToWatchlist,
      removePatientFromWatchlist,
      openEditPatientDrawer,
      paginated_patient_ids = {},
      tabChanged,
    } = this.props;

    const { offset = 0 } = this.state;

    const { currentTab = CURRENT_TAB.ALL_PATIENTS, sortingType } = this.props;

    const {
      paginated_all_patient_ids = {},
      paginated_watchlist_patient_ids = {},
    } = paginated_patient_ids;
    let doctor_id = null;

    const { onRowClick, handleGetPatients } = this;

    Object.keys(doctors).forEach((id) => {
      const { basic_info: { user_id = null } = {} } = doctors[id] || {};

      if (user_id === authenticated_user) {
        doctor_id = id;
      }
    });

    const { watchlist_patient_ids: doc_watchlist_patient_ids = [] } =
      doctors[doctor_id] || [];

    let patientIdsArr = [];
    let arrayOfIds = [];
    const obj =
      currentTab === CURRENT_TAB.ALL_PATIENTS
        ? paginated_all_patient_ids
        : paginated_watchlist_patient_ids;
    const offsetObj = obj[offset.toString()] || {};
    for (let each in offsetObj) {
      let id = offsetObj[each];
      if (id) {
        arrayOfIds.push(id);
      }
    }

    let patients = {};
    if (currentTab === CURRENT_TAB.ALL_PATIENTS) {
      patients = Object.keys(temp_patients)
        .filter((key) => arrayOfIds.includes(parseInt(key)))
        .reduce((obj, key) => {
          obj[key] = temp_patients[key];
          return obj;
        }, {});
    } else {
      patients = Object.keys(temp_patients)
        .filter(
          (key) =>
            arrayOfIds.includes(parseInt(key)) &&
            doc_watchlist_patient_ids.includes(parseInt(key))
        )
        .reduce((obj, key) => {
          obj[key] = temp_patients[key];
          return obj;
        }, {});
    }

    if (currentTab === CURRENT_TAB.ALL_PATIENTS) {
      patientIdsArr = arrayOfIds;
    } else {
      for (let each in arrayOfIds) {
        let id = arrayOfIds[each];
        if (doc_watchlist_patient_ids.includes(parseInt(id))) {
          patientIdsArr.push(id);
        }
      }
    }

    const props = {
      patients,
      doctors,
      providers,
      treatments,
      conditions,
      severity,
      care_plans,
      users,
      authenticated_user,
      addToWatchlist,
      onRowClick,
      removePatientFromWatchlist,
      openEditPatientDrawer,
      tabChanged,
      handleGetPatients,
      currentTab,
      offset,
      paginated_patient_ids,
    };

    if (sortingType === SORTING_TYPE.SORT_BY_DATE) {
      return patientIdsArr.map((id) => {
        return generateRow({ id, ...props });
      });
    } else {
      return patientIdsArr.map((id) => {
        return generateRow({ id, ...props });
      });
    }
  };

  onRowClick = (key) => (event) => {
    event.preventDefault();
    const { openPatientDetailsDrawer } = this.props;
    openPatientDetailsDrawer({ patient_id: key });
  };

  onPageChange = async (page, pageSize) => {
    const pageOffset = parseInt(page) - 1 || 0;
    const { offset: state_offset } = this.state;

    if (state_offset !== pageOffset) {
      await this.setState({ offset: pageOffset });
      this.handleGetPatients();
    }
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getLoadingComponent = () => {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return {
      indicator: antIcon,
    };
  };

  render() {
    const { getDataSource, onPageChange, formatMessage, getLoadingComponent } =
      this;
    const {
      pageSize = 10,
      loading = false,
      total = null,
      tabChanged = false,
    } = this.state;

    const { toggleSort, sortingType = SORTING_TYPE.SORT_BY_NAME } = this.props;
    const patientLocale = {
      emptyText: formatMessage(messages.emptyPatientTable),
    };

    return (
      <Table
        className="medicine-table"
        rowClassName={() => "pointer"}
        loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
          toggleSort,
          sortingType,
        })}
        dataSource={getDataSource()}
        scroll={{ x: 1600 }}
        pagination={{
          position: "bottom",
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            onPageChange(page, pageSize);
          },
          ...(tabChanged && { current: 1 }),
        }}
        locale={patientLocale}
      />
    );
  }
}

export default injectIntl(patientTable);
