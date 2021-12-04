import React, {Component} from "react";
import {injectIntl} from "react-intl";
import {Table, Icon} from "antd";
import Input from "antd/es/input";
import Button from "antd/es/button";
import moment from "moment";

import generateRow from "./dataRow";
import getColumn from "./header";
import config from "../../../config";

import message from "antd/es/message";
import {TABLE_COLUMN} from "./helper";

import messages from "./messages";

const ALL_TABS = {
  PUBLIC: "1",
  CREATOR: "2",
};

class MedicineTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      loading: false,
      searchPublicText: "",
      searchPrivateText: "",
      searchPrivateCount: null,
      searchPublicCount: null,
    };
  }
  
  componentDidMount() {
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log(
      "782657387923785623789233 CD UPDATEEEEEEEEEEEEEEEEEeeeeeeeeeeeeeee"
    );
    const {searchPublicText: prev_searchPublicText = ""} = prevState;
    const {searchPublicText = ""} = this.state;
    const {searchPrivateText: prev_searchPrivateText = ""} = prevState;
    const {searchPrivateText = ""} = this.state;
    
    const {currentTab = ALL_TABS.PUBLIC} = this.props;
    const {currentPage = 1} = this.state;
    
    const offset = parseInt(currentPage) - 1 || 0;
    
    if (searchPublicText !== "" && searchPublicText !== prev_searchPublicText) {
      if (currentTab === ALL_TABS.PUBLIC) {
        this.handleSearchPublicMedicine(searchPublicText, offset);
      }
    }
    
    if (
      searchPrivateText !== "" &&
      searchPrivateText !== prev_searchPrivateText
    ) {
      if (currentTab === ALL_TABS.CREATOR) {
        this.handleSearchPrivateMedicine(searchPrivateText, offset);
      }
    }
  }
  
  async handleSearchPublicMedicine(value, offset) {
    try {
      const {getPublicMedicines} = this.props;
      this.setState({loading: true});
      const response = await getPublicMedicines({value, offset});
      console.log("3275437847237845324625347879198371293712945216", {
        response,
        value,
        offset,
      });
      const {
        payload: {
          data: {total_count = 0} = {},
          response: resp_msg = "",
        } = {},
      } = response || {};
      this.setState({searchPublicCount: total_count, loading: false});
    } catch (error) {
      console.log("error ===>", error);
    }
  }
  
  async handleSearchPrivateMedicine(value, offset) {
    try {
      const {getPrivateMedicines} = this.props;
      this.setState({loading: true});
      const response = await getPrivateMedicines({value, offset});
      const {
        payload: {
          data: {total_count = 0} = {},
          response: resp_msg = "",
        } = {},
      } = response || {};
      this.setState({searchPrivateCount: total_count, loading: false});
    } catch (error) {
      console.log("error ===>", error);
    }
  }
  
  async handleGetPublicMedicines(offset) {
    try {
      const {getPublicMedicines} = this.props;
      this.setState({loading: true});
      const response = await getPublicMedicines({offset});
      const {
        payload: {
          data: {total_count = 0} = {},
          response: resp_msg = "",
        } = {},
      } = response || {};
      this.setState({loading: false});
    } catch (error) {
      this.setState({loading: false});
      console.log("89368754234 error ===>", error);
    }
  }
  
  formatMessage = (message, ...rest) =>
    this.props.intl.formatMessage(message, rest);
  
  async handleGetPrivateMedicines(offset) {
    try {
      const {getPrivateMedicines} = this.props;
      this.setState({loading: true});
      const response = await getPrivateMedicines({offset});
      const {
        payload: {
          data: {total_count = 0} = {},
          response: resp_msg = "",
        } = {},
      } = response || {};
      this.setState({loading: false});
    } catch (error) {
      this.setState({loading: false});
      console.log("89368754234 error ===>", error);
    }
  }
  
  getDataSource = () => {
    const {
      currentTab = ALL_TABS.PUBLIC,
      admin_medicines: {
        private_medicines: props_private_medicines = {},
        public_medicines: props_public_medicines = {},
      } = {},
      admin_search_medicines: {
        search_private_medicines: props_search_private_medicines = {},
        search_public_medicines: props_search_public_medicines = {},
      } = {},
    } = this.props;
    
    const {
      // admin_medicines = {},
      doctors = {},
      makeMedicinePublic,
      getPrivateMedicines,
      mapMedicineToPublic,
      deleteMedicine,
      getPublicMedicines,
    } = this.props;
    
    const {currentPage = 1} = this.state;
    
    let private_medicines = {};
    let public_medicines = {};
    
    const key = parseInt(currentPage) - 1 || 0;
    const {searchPrivateText = "", searchPublicText = ""} = this.state;
    
    console.log("9817231287 currentPage", {
      currentPage,
      key,
      props_public_medicines,
      props_search_public_medicines,
      searchPublicText,
    });
    
    if (key >= 0) {
      if (currentTab === ALL_TABS.PUBLIC) {
        if (props_public_medicines[key] && searchPublicText === "") {
          public_medicines = props_public_medicines[key];
        } else if (
          props_search_public_medicines[key] &&
          searchPublicText !== ""
        ) {
          public_medicines = props_search_public_medicines[key];
        }
      } else {
        if (props_private_medicines[key] && searchPrivateText === "") {
          private_medicines = props_private_medicines[key];
        } else if (
          props_search_private_medicines[key] &&
          searchPrivateText !== ""
        ) {
          private_medicines = props_search_private_medicines[key];
        }
      }
    }
    
    const {loading = true} = this.state;
    const {changeLoading} = this;
    
    console.log("272391872398 currentTab", {
      currentTab,
      public_medicines,
      private_medicines,
    });
    
    if (currentTab === ALL_TABS.PUBLIC) {
      return Object.keys(public_medicines)
        .sort((medA, medB) => {
          const {updated_at: aUpdatedAt} = public_medicines[medA] || {};
          const {updated_at: bUpdatedAt} = public_medicines[medB] || {};
          
          if (moment(aUpdatedAt).diff(moment(bUpdatedAt), "seconds") > 0) {
            return -1;
          } else {
            return 1;
          }
        })
        .map((id) => {
          const medicineData = public_medicines[id] || {};
          const {basic_info: {creator_id = null} = {}} = medicineData || {};
          const doctorData = doctors[creator_id] || {};
          return generateRow({
            id,
            medicineData,
            doctors: doctorData,
            currentPage,
            deleteMedicine,
            getPublicMedicines,
            currentTab,
          });
        });
    } else {
      return Object.keys(private_medicines).map((id) => {
        const medicineData = private_medicines[id] || {};
        const {basic_info: {creator_id} = {}} = medicineData || {};
        const doctorData = doctors[creator_id] || {};
        return generateRow({
          id,
          medicineData,
          doctors: doctorData,
          makeMedicinePublic,
          currentPage,
          getPrivateMedicines,
          changeLoading,
          searchText: searchPrivateText,
          mapMedicineToPublic,
          deleteMedicine,
          getPublicMedicines,
          currentTab,
        });
      });
    }
  };
  
  changeLoading = (newLoading) => {
    this.setState({loading: newLoading});
  };
  
  onPageChange = (page, pageSize) => {
    this.setState({currentPage: page});
    const {
      currentTab = ALL_TABS.PUBLIC,
      admin_medicines: {
        private_medicines: props_private_medicines = {},
        public_medicines: props_public_medicines = {},
      } = {},
      admin_search_medicines: {
        search_private_medicines: props_search_private_medicines = {},
        search_public_medicines: props_search_public_medicines = {},
      } = {},
    } = this.props;
    
    let private_medicines = {};
    let public_medicines = {};
    const key = parseInt(page) - 1 || 0;
    
    const {searchPublicText = "", searchPrivateText = ""} = this.state;
    
    if (currentTab === ALL_TABS.PUBLIC) {
      if (!props_public_medicines[key] && searchPublicText === "") {
        this.handleGetPublicMedicines(key);
      } else if (
        !props_search_public_medicines[key] &&
        searchPublicText !== ""
      ) {
        this.handleSearchPublicMedicine(searchPublicText, key);
      }
    } else {
      if (!props_private_medicines[key] && searchPrivateText === "") {
        this.handleGetPrivateMedicines(key);
      } else if (
        !props_search_private_medicines[key] &&
        searchPrivateText !== ""
      ) {
        this.handleSearchPrivateMedicine(searchPrivateText, key);
      }
    }
  };
  
  getPlaceholderSearch = (key) => {
    switch (key) {
      case TABLE_COLUMN.MEDICINE_NAME.dataIndex:
        return this.formatMessage(messages.medicineNameSearchText);
      case TABLE_COLUMN.CREATOR_NAME.dataIndex:
        return this.formatMessage(messages.creatorNameSearchText);
    }
  };
  
  handleSearch = (selectedKeys, confirm) => {
    const {currentTab = ALL_TABS.PUBLIC} = this.props;
    const {currentPage = 1} = this.state;
    const offset = parseInt(currentPage) - 1 || 0;
    confirm();
    // search api call
    // this.setState({ searchText: selectedKeys[0] });
    if (currentTab === ALL_TABS.PUBLIC) {
      if (typeof selectedKeys[0] === "undefined") {
        this.handleGetPublicMedicines(offset);
        this.setState({searchPublicText: ""});
      } else {
        this.setState({searchPublicText: selectedKeys[0]});
      }
    } else {
      if (typeof selectedKeys[0] === "undefined") {
        this.handleGetPublicMedicines(offset);
        this.setState({searchPrivateText: ""});
      } else {
        this.setState({searchPrivateText: selectedKeys[0]});
      }
    }
  };
  
  handleReset = (clearFilters) => {
    clearFilters();
    const {currentTab = ALL_TABS.PUBLIC} = this.props;
    const {currentPage = 1} = this.state;
    const offset = parseInt(currentPage) - 1 || 0;
    if (currentTab === ALL_TABS.PUBLIC) {
      const {resetSearchPublic} = this.props;
      resetSearchPublic();
      this.handleGetPublicMedicines(offset);
      this.setState({searchPublicText: ""});
    } else {
      const {resetSearchPrivate} = this.props;
      resetSearchPrivate();
      this.handleGetPrivateMedicines(offset);
      this.setState({searchPrivateText: ""});
    }
  };
  
  getColumnSearchProps = (dataIndex) => {
    return {
      filterDropdown: ({
                         setSelectedKeys,
                         selectedKeys,
                         confirm,
                         clearFilters,
                       }) => {
        const data = TABLE_COLUMN[dataIndex];
        return (
          <div style={{padding: 8}}>
            <Input
              ref={(node) => {
                this.searchInput = node;
              }}
              placeholder={`Search ${this.getPlaceholderSearch(
                data.dataIndex
              )}`}
              value={selectedKeys[0]}
              onChange={(e) =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{width: 188, marginBottom: 8, display: "block"}}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{width: 90, marginRight: 8}}
            >
              {this.formatMessage(messages.searchText)}
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{width: 90}}
            >
              {this.formatMessage(messages.resetText)}
            </Button>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <Icon
          type="search"
          style={{color: filtered ? "#1890ff" : undefined}}
        />
      ),
      onFilter: (value, record) => {
        if (dataIndex === TABLE_COLUMN.MEDICINE_NAME.dataIndex) {
          console.log("09810912 records: ", {value, record});
          // const {searchResults} = this.state;
          const {medicineData = {}} = record[dataIndex] || {};
          let status = false;
          
          const {basic_info: {name} = {}} = medicineData || {};
          
          return name.toString().toLowerCase().includes(value.toLowerCase());
        } else if (dataIndex === TABLE_COLUMN.CREATOR_NAME.dataIndex) {
          const {doctors: {basic_info: {full_name = ""} = {}} = {}} =
          record[dataIndex] || {};
          
          return full_name
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        }
      },
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => this.searchInput.select());
        }
      },
    };
  };
  
  getLoadingComponent = () => {
    const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;
    return {
      indicator: antIcon,
    };
  };
  
  handleTableChange = (props) => {
    console.log("1083791238172 props", {props});
  };
  
  render() {
    const {
      getLoadingComponent,
      getDataSource,
      onPageChange,
      handleTableChange,
    } = this;
    
    const {
      intl: {formatMessage} = {},
      currentTab = ALL_TABS.PUBLIC,
      totalPublicMedicinesCount = 0,
      totalPrivateMedicinesCount = 0,
      admin_medicines: {public_medicines = {}} = {},
      changeTab,
    } = this.props;
    
    const {
      loading = true,
      searchPublicText = "",
      searchPrivateText = "",
      searchPublicCount = null,
      searchPrivateCount = null,
      currentPage = 1,
    } = this.state;
    
    const pageSize = config.REACT_APP_ADMIN_MEDICINE_ONE_PAGE_LIMIT;
    
    const locale = {
      emptyText: "No Medicines Present",
    };
    
    const obj = public_medicines["0"] || {};
    
    const total =
      currentTab === ALL_TABS.PUBLIC
        ? searchPublicText === ""
          ? totalPublicMedicinesCount
          : searchPublicCount
        : searchPrivateText === ""
          ? totalPrivateMedicinesCount
          : searchPrivateCount;
    
    console.log("3785463254729847923864832");
    
    return (
      <Table
        className="medicine-table"
        rowClassName={() => "pointer"}
        loading={loading === true ? getLoadingComponent() : false}
        columns={getColumn({
          formatMessage,
          className: "pointer",
          currentTab,
          changeTab,
          getColumnSearchProps: this.getColumnSearchProps,
        })}
        dataSource={getDataSource()}
        onChange={handleTableChange}
        scroll={{x: 1600}}
        pagination={{
          position: "bottom",
          pageSize:
            currentPage === 1 && currentTab === ALL_TABS.PUBLIC
              ? Object.keys(obj).length
                ? Object.keys(obj).length
                : parseInt(pageSize)
              : parseInt(pageSize),
          total:
            currentTab === ALL_TABS.PUBLIC
              ? searchPublicText === ""
                ? totalPublicMedicinesCount
                : searchPublicCount
              : searchPrivateText === ""
                ? totalPrivateMedicinesCount
                : searchPrivateCount,
          onChange: (page, pageSize) => {
            onPageChange(page, pageSize);
          },
        }}
        locale={locale}
      />
    );
  }
}

export default injectIntl(MedicineTable);
