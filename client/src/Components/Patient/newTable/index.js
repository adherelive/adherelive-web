import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table, Icon } from "antd";
import generateRow from "./dataRow";
import getColumn from "./header";
import messages from "./messages";
import message from "antd/es/message";
import { CURRENT_TAB } from "../../Dashboard";
import { TABLE_COLUMN } from "./helper";
import config from "../../../config";

import Input from "antd/es/input";
import Button from "antd/es/button";
import SearchOutlined from "@ant-design/icons/SearchOutlined";
import { DIAGNOSIS_TYPE, ASCEND, DESCEND } from "../../../constant";

import {
  SORT_CREATEDAT,
  SORT_NAME,
  FILTER_DIAGNOSIS,
  FILTER_TREATMENT,
  OFFSET
} from "../../Dashboard/index";

export const SORTING_TYPE = {
  SORT_BY_DATE: "0",
  SORT_BY_NAME: "1"
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
      created_at_order: 1,
      name_order: 1,
      sort_by_name: "1",
      filterTreatment: null,
      sortCreatedAtAsc: null,
      sortCreatedAtDesc: null,
      sortByCreatedAt: null,
      sortByName: null,
      sortNameAsc: null,
      sortNameDesc: null,
      searchTreatmentText: "",
      searchDiagnosisText: "",
      total: 0,
      setOffset: null
    };
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  componentDidMount() {
    this.handleGetPatients();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentTab: prev_currentTab = "" } = prevProps;
    const { currentTab = "" } = this.props;

    if (currentTab !== prev_currentTab) {
      this.handleGetPatients(true);
      // await this.setState({tabChanged:true});
    }
    // else if(tabChanged && currentTab === prev_currentTab ){
    //     await this.setState({tabChanged:false});
    // }
  }

  getLoadingComponent = () => {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return {
      indicator: antIcon
    };
  };

  handleSearchTreatmentGetPatient = async (flag = false) => {
    try {
      const { searchTreatmentPaginatedPatients, tabState } = this.props;
      const { offset = 0 } = tabState;

      let data = tabState;
      data["offset"] = offset;

      if (flag) {
        data["offset"] = 0;
      }

      const { filter_treatment = "" } = data;

      const searchData = {
        offset,
        filter_treatment
      };

      this.setState({ loading: true });
      const response = await searchTreatmentPaginatedPatients(searchData);
      const {
        status,
        payload: { data: { total } = {}, message: resp_message = "" } = {}
      } = response;
      this.setState({ total });
      if (!status) {
        message.warn(resp_message);
      }

      this.setState({ loading: false });
    } catch (error) {
      console.log("2364523463284632746234723 error =====>", { error });
      this.setState({ loading: false });
    }
  };

  handleSearchDiagnosisGetPatient = async (flag = false) => {
    try {
      const { searchDiagnosisPaginatedPatients, tabState } = this.props;
      const { offset = 0 } = tabState;

      let data = tabState;
      data["offset"] = offset;

      if (flag) {
        data["offset"] = 0;
      }

      const { filter_diagnosis = "" } = data;

      const searchData = {
        offset,
        filter_diagnosis
      };

      this.setState({ loading: true });
      const response = await searchDiagnosisPaginatedPatients(searchData);
      const {
        status,
        payload: { data: { total } = {}, message: resp_message = "" } = {}
      } = response;
      this.setState({ total });
      if (!status) {
        message.warn(resp_message);
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log("2364523463284632746234723 error =====>", { error });
      this.setState({ loading: false });
    }
  };

  handleGetPatients = async (flag = false) => {
    try {
      const { getPatientsPaginated, tabState } = this.props;
      const { offset = 0 } = tabState;
      let data = tabState;

      data["offset"] = offset;

      if (flag) {
        data["offset"] = 0;
      }

      this.setState({ loading: true });
      const response = await getPatientsPaginated(data);
      const {
        status,
        payload: { data: { total } = {}, message: resp_message = "" } = {}
      } = response;
      this.setState({ total });
      if (!status) {
        message.warn(resp_message);
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log("2364523463284632746234723 error =====>", { error });
      this.setState({ loading: false });
    }
  };

  onRowClick = key => event => {
    event.preventDefault();
    const { openPatientDetailsDrawer } = this.props;
    openPatientDetailsDrawer({ patient_id: key });
  };

  getDataSource = () => {
    const {
      paginated_patients,
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
      tabChanged,
      search_treatments_patients,
      search_diagnosis_patients,
      tabState,
      auth_role
    } = this.props;

    const { searchTreatmentText = "", searchDiagnosisText = "" } = this.state;

    const { offset = 0 } = tabState;

    let doctor_id = null;
    Object.keys(doctors).forEach(id => {
      const { basic_info: { user_id = null } = {} } = doctors[id] || {};

      if (user_id === authenticated_user) {
        doctor_id = id;
      }
    });

    let watchlist_patient_ids = [];

    const { watchlist_ids = [] } = doctors[doctor_id] || {};

    if (auth_role) {
      watchlist_patient_ids = watchlist_ids[auth_role.toString()] || [];
    }

    const { currentTab = CURRENT_TAB.ALL_PATIENTS } = this.props;
    // const { paginated_all_patient_ids = {},paginated_watchlist_patient_ids ={}} = paginated_patient_ids;
    // let doctor_id = null ;

    let patientArr = [];

    if (searchTreatmentText.length) {
      patientArr = search_treatments_patients[offset] || [];
    } else if (searchDiagnosisText.length) {
      patientArr = search_diagnosis_patients[offset] || [];
    } else {
      patientArr = paginated_patients[offset] || [];
    }

    const { onRowClick, handleGetPatients } = this;

    const props = {
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
      auth_role
    };

    let finalPatientArr = [];

    if (currentTab === CURRENT_TAB.WATCHLIST) {
      for (let i = 0; i < patientArr.length; i++) {
        const each = patientArr[i] || {};
        const { patients: { id = null } = {} } = each || {};
        if (watchlist_patient_ids.includes(id)) {
          finalPatientArr.push(each);
        }
      }
    } else {
      finalPatientArr = patientArr;
    }

    return finalPatientArr.map((each, index) => {
      const paginatedPatientData = each;
      const { patients: { id = null } = {} } = each;

      return generateRow({
        id: index,
        ...props,
        paginatedPatientData
      });
    });
  };

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    const { currentTab, changeTabState } = this.props;

    if (dataIndex === TABLE_COLUMN.TREATMENT.dataIndex) {
      const filterText = selectedKeys[0] || "";
      changeTabState({ currentTab, type: FILTER_TREATMENT, value: filterText });

      this.setState({ searchTreatmentText: selectedKeys[0] });
    } else if (dataIndex === TABLE_COLUMN.DIAGNOSIS.dataIndex) {
      const filterText = selectedKeys[0];
      changeTabState({ currentTab, type: FILTER_DIAGNOSIS, value: filterText });
      this.setState({ searchDiagnosisText: selectedKeys[0] });
    }

    this.setState({
      searchedColumn: dataIndex
    });

    if (dataIndex === TABLE_COLUMN.TREATMENT.dataIndex) {
      this.handleSearchTreatmentGetPatient();
    } else if (dataIndex === TABLE_COLUMN.DIAGNOSIS.dataIndex) {
      this.handleSearchDiagnosisGetPatient();
    }
  };

  handleReset = clearFilters => {
    clearFilters();

    const { currentTab, changeTabState } = this.props;
    changeTabState({ currentTab, type: FILTER_TREATMENT, value: "" });
    changeTabState({ currentTab, type: FILTER_DIAGNOSIS, value: "" });
    this.setState({ searchTreatmentText: "", searchDiagnosisText: "" });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: "100%", marginBottom: 8, display: "block" }}
        />

        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={"search"}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          {this.formatMessage(messages.searchText)}
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          {this.formatMessage(messages.resetText)}
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      if (dataIndex === TABLE_COLUMN.TREATMENT.dataIndex) {
        const { carePlanData = {} } = record[dataIndex] || {};
        const { treatment = "" } = carePlanData;

        return treatment
          ? treatment
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "";
      } else if (dataIndex === TABLE_COLUMN.DIAGNOSIS.dataIndex) {
        const { carePlanData = {} } = record[dataIndex] || {};
        const { details: { diagnosis = {} } = {} } = carePlanData;
        const { type = "1", description = "" } = diagnosis || {};

        const diagnosisType = DIAGNOSIS_TYPE[type];
        const diagnosisTypeValue = diagnosisType["value"] || "";

        const recordText = `${diagnosisTypeValue} ${description}`;
        return recordText
          ? recordText
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "";
      }
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    }
  });

  onPageChange = async (page, pageSize) => {
    const pageOffset = parseInt(page) - 1 || 0;
    const { changeTabState, currentTab, tabState } = this.props;

    const { offset = 0 } = tabState;

    if (offset !== pageOffset) {
      await changeTabState({ currentTab, type: OFFSET, value: pageOffset });
      // this.handleGetPatients();
    }
  };

  onChange = (pagination, filters, sorter, extra) => {
    const { columnKey, order } = sorter;

    const {
      currentTab = CURRENT_TAB.ALL_PATIENTS,
      tabState = {},
      sortByName,
      sortByCreatedAt,
      changeTabState
    } = this.props;

    const { searchTreatmentText = "", searchDiagnosisText = "" } = this.state;

    if (
      (columnKey !== TABLE_COLUMN.CREATED_AT.key &&
        columnKey !== TABLE_COLUMN.PID.key) ||
      searchTreatmentText.length > 0 ||
      searchDiagnosisText.length > 0
    ) {
      return;
    }

    if (columnKey === TABLE_COLUMN.CREATED_AT.key) {
      if (!order) {
        // sort by createdAt  asc
        sortByCreatedAt({ currentTab });
        changeTabState({ currentTab, type: SORT_CREATEDAT, value: 1 });
      } else {
        // sort by created at asc or desc

        sortByCreatedAt({ currentTab });

        if (order === ASCEND) {
          changeTabState({ currentTab, type: SORT_CREATEDAT, value: 1 });
        } else if (order === DESCEND) {
          changeTabState({ currentTab, type: SORT_CREATEDAT, value: 0 });
        }
      }
    } else if (columnKey === TABLE_COLUMN.PID.key) {
      if (!order) {
        // sort by name ascending

        sortByName({ currentTab });
        changeTabState({ currentTab, type: SORT_NAME, value: 0 });
      } else {
        // sort ascending or descending
        sortByName({ currentTab });

        if (order === ASCEND) {
          changeTabState({ currentTab, type: SORT_NAME, value: 0 });
        } else if (order === DESCEND) {
          changeTabState({ currentTab, type: SORT_NAME, value: 1 });
        }
      }
    }

    this.handleGetPatients();
  };

  render() {
    const {
      getDataSource,
      onPageChange,
      formatMessage,
      getLoadingComponent
    } = this;
    const { loading = false, tabChanged = false, total = 0 } = this.state;
    const { tabState = {} } = this.props;

    const { offset = 0 } = tabState;
    const currentPage = parseInt(offset) + 1;

    const patientLocale = {
      emptyText: formatMessage(messages.emptyPatientTable)
    };

    const pageSize = config.REACT_APP_ADMIN_MEDICINE_ONE_PAGE_LIMIT;
    const intPageSize = parseInt(pageSize);
    return (
      <Table
        className="medicine-table patient-table"
        rowClassName={() => "pointer"}
        loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
          tabChanged,
          tabState,
          getColumnSearchProps: this.getColumnSearchProps
        })}
        dataSource={getDataSource()}
        scroll={{ x: 1600 }}
        pagination={{
          position: "bottom",
          pageSize: intPageSize,
          total: total,
          onChange: (page, pageSize) => {
            onPageChange(page, pageSize);
          },
          current: currentPage
        }}
        locale={patientLocale}
        onChange={this.onChange}
      />
    );
  }
}

export default injectIntl(patientTable);
