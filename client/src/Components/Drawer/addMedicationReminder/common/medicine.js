import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Form from "antd/es/form";
import Select from "antd/es/select";
import Spin from "antd/es/spin";
import Tooltip from "antd/es/tooltip";
import { EditOutlined } from "@ant-design/icons";

import messages from "../message";
import algoliasearch from "algoliasearch";
import config from "../../../../config";
import {
  InstantSearch,
  Hits,
  SearchBox,
  Highlight,
  connectSearchBox,
  connectHighlight
} from "react-instantsearch-dom";

const { Item: FormItem } = Form;
const { Option } = Select;
const FIELD_NAME = "medicine_id";

class Medicine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingMedicines: false,
      value: "",
      hits: {},
      searching_medicine: true,
      medicine_name: "",
      medicine_id: ""
    };

    const algoliaClient = this.algoliaClient();
    this.index = algoliaClient.initIndex(config.algolia.medicine_index);
  }

  componentDidMount() {
    this.handleMedicineSearch(" ");

    // this.setState({
    //   searching_medicine: true,
    //   medicine_name: ""
    // });
  }

  getMedicineOptions = () => {
    const algoliaClient = this.algoliaClient();
    const index = algoliaClient.initIndex(config.algolia.medicine_index);
    const { hits = {} } = this.state;
    let list = [];
    const { searchOptions } = this;

    return Object.values(hits).map(function(hit, index) {
      const {
        medicine_id = null,
        name = "",
        generic_name = "",
        objectID = null
      } = hit;
      let final_name = name;
      let final_generic_name = generic_name;

      if (name === generic_name) {
        console.log("675456789763445", name);
        final_generic_name = "";
      }

      return (
        <Option key={`opt-${medicine_id}`} value={medicine_id}>
          {searchOptions(hit, index)}
        </Option>
      );
    });
  };

  searchOptions = (hit, index) => {
    const {
      medicine_id = null,
      name = "",
      generic_name = "",
      objectID = null
    } = hit;
    const { value, searching_medicine } = this.state;
    let final_name = name;
    let final_generic_name = generic_name;

    if (name === generic_name) {
      final_generic_name = "";
    }


    if (!searching_medicine) {
      return (
        <div
          key={medicine_id}
          className="pointer flex wp100  align-center justify-space-between"
          onClick={this.setMedicineValue(medicine_id, name)}
        >
          <Tooltip title={this.formatMessage(messages.name)}>
            {" "}
            {/* formatMessage here */}
            <div className="fs18 fw800 black-85 medicine-selected">
              <span
                dangerouslySetInnerHTML={{
                  __html: hit._highlightResult.name.value
                }}
              ></span>
            </div>
          </Tooltip>
        </div>
      );
    }

    // console.log("8309778120 final_name.indexOf(value) --> ", hit);

    return (
      <div
        key={medicine_id}
        className="pointer flex wp100  align-center justify-space-between"
        onClick={this.setMedicineValue(medicine_id, name)}
      >
        <div className="flex direction-column align-start justify-center">
          <Tooltip title={this.formatMessage(messages.name)}>
            {" "}
            {/* formatMessage here */}
            <div className="fs18 fw800 black-85">
              <span
                dangerouslySetInnerHTML={{
                  __html: hit._highlightResult.name.value
                }}
              ></span>
            </div>
          </Tooltip>

          <Tooltip title="Generic Name">
            <div className="fs16">
              <span
                dangerouslySetInnerHTML={{
                  __html: hit._highlightResult.generic_name.value
                }}
              ></span>
            </div>
          </Tooltip>
        </div>
      </div>
    );
  };

  setMedicineValue = (medicine_id, medicine_name) => e => {
    e.preventDefault();
    const {
      form: { setFieldsValue, getFieldValue },
      setFormulation
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: medicine_id });
    this.setState({
      medicine_name: medicine_name,
      searching_medicine: false,
      medicine_id
    });
  };

  isSearchingMedicine = e => {
    e.preventDefault();
    this.setState({ searching_medicine: true });
  };

  algoliaClient = () => {
    return algoliasearch(config.algolia.app_id, config.algolia.app_key);
  };

  formatMessage = message => this.props.intl.formatMessage(message);

  handleMedicineSearch = value => {
    this.searchValue(value);
  };

  async searchValue(value) {
    try {
      const { value: state_value = "" } = this.state;
      const res = await this.index.search(value);
      const { hits = {} } = res;
      if (value !== state_value) {
        this.setState({
          fetchingMedicines: false,
          hits,
          value
        });
      }

      // console.log("987657890876567687980",res);
    } catch (error) {
      console.log("err --->", error);
    }
  }

  onOptionSelect = value => {
    const { setFormulation } = this.props;
    setFormulation(value);
    this.setState({medicine_id: value, temp_medicine: value});
  };

  dropdownVisible = open => {
    this.setState({searching_medicine: open, temp_medicine: ""});
  };

  getParentNode = t => t.parentNode;

  handleOnBlur = () => {
    // console.log("867546756877654567",this.state);
    const {medicine_id=null} = this.state;
    if(medicine_id){
      this.setState({
        temp_medicine:medicine_id
      })
    }
   
  }



  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      setFormulation
    } = this.props;

    const {
      fetchingMedicines,
      searching_medicine = false,
      medicine_name: med_name = "",
      temp_medicine = ""
    } = this.state;

    const { getMedicineOptions, handleMedicineSearch, getParentNode } = this;
    // console.log("7654676546765467", this.state.value);

    return (
      <FormItem label={this.formatMessage(messages.addMedicine)}>
        {getFieldDecorator(
          FIELD_NAME,

          {}
        )(
          <InstantSearch
            indexName={"adhere_medicine"}
            searchClient={this.algoliaClient()}
          >
            {/*{*/}
            {/*  !searching_medicine*/}
            {/*  ?*/}
            {/*  (*/}
            {/*    <>*/}
            {/*        <div className="med-defaul-container" onClick = {this.isSearchingMedicine}>*/}
            {/*            <span className="fs20 ml20" >{med_name}</span>*/}
            {/*        </div>*/}
            {/*    </>*/}
            {/*)*/}
            {/*  :*/}

            {/*  (       */}
            <Select
              onSearch={handleMedicineSearch}
              notFoundContent={
                fetchingMedicines ? <Spin size="small" /> : "No match found"
              }
              className="drawer-select medicine-search-select"
              placeholder="Choose Medicine"
              showSearch
              onSelect={this.onOptionSelect}
              defaultOpen={true}
              value={temp_medicine}
              onDropdownVisibleChange={this.dropdownVisible}
              autoComplete="off"
              optionFilterProp="children"
              filterOption={(input, option) => {
                return option.props.children;
              }}
              getPopupContainer={getParentNode}

              onBlur={this.handleOnBlur}
            >
              {getMedicineOptions()}
            </Select>
            {/*)*/}

            {/*}*/}
          </InstantSearch>
        )}
      </FormItem>
    );
  }
}

const Field = injectIntl(Medicine);

export default {
  field_name: FIELD_NAME,
  render: props => <Field {...props} />
};
