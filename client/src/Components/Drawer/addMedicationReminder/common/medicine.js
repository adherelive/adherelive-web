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
      medicine_name: ""
    };

    const algoliaClient = this.algoliaClient();
    this.index = algoliaClient.initIndex(config.algolia.medicine_index);
  }

  componentDidMount(){
    this.setState({
      searching_medicine: true,
      medicine_name: ""})
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
    const { value } = this.state;
    let final_name = name;
    let final_generic_name = generic_name;

    if (name === generic_name) {
      final_generic_name = "";
    }

    console.log("8309778120 final_name.indexOf(value) --> ", hit);

    return (

      <div
        key={medicine_id}
        className="pointer flex wp100  align-center justify-space-between"
        onClick={this.setMedicineValue(medicine_id, name)}
      >
        <div className="flex direction-column align-start justify-center">
          <Tooltip title="Name">
            {" "}
            {/* formatMessage here */}
            <div className="fs18 fw800 black-85">
              <span dangerouslySetInnerHTML={{__html: hit._highlightResult.name.value}}></span>
            </div>
          </Tooltip>

          <Tooltip title="Generic Name">
          <div className="fs16">
            <span dangerouslySetInnerHTML={{__html: hit._highlightResult.generic_name.value}}></span>
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
      searching_medicine: false
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
    const { value: state_value = "" } = this.state;

    this.index.search(value).then(({ hits }) => {
      console.log("92839210 hits -> ", hits);
      if (value !== state_value) {
        this.setState({
          hits,
          value
        });
      }
    });
  };

  getParentNode = t => t.parentNode;


  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      setFormulation
    } = this.props;

    const {
      fetchingMedicines,
      searching_medicine = false,
      medicine_name : med_name= ""
    } = this.state;

    const { getMedicineOptions, handleMedicineSearch, getParentNode } = this;
    console.log("7654676546765467", this.state.value);



    return (
      <FormItem label={this.formatMessage(messages.addMedicine)}>
        {getFieldDecorator(
          FIELD_NAME,

          {
          }
        )(
          <InstantSearch
            indexName={"adhere_medicine"}
            searchClient={this.algoliaClient()}
          >
            {
              !searching_medicine
              ?
              (
                <>
                    <div className="med-defaul-container" onClick = {this.isSearchingMedicine}>
                        <span className="fs20 ml20" >{med_name}</span>
                    </div>
                </>
            )
              :

              (       
                <Select
                onSearch={handleMedicineSearch}
                notFoundContent={
                  fetchingMedicines ? <Spin size="small" /> : "No match found"
                }
                className="drawer-select medicine-search-select"
                placeholder="Choose Medicine"
                showSearch
                onSelect={setFormulation}
                // autoFocus={true}
                defaultActiveFirstOption={true}
                // onFocus={() => handleMedicineSearch("")}
                autoComplete="off"
                // onFocus={() => handleMedicineSearch("")}
  
                optionFilterProp="children"
                filterOption={(input, option) => {
                      console.log("83128908 options.props.children --> ", option.props.children);
                    return option.props.children;
                      // .toLowerCase()
                      // .indexOf(input.toLowerCase()) >= 0
                }
                }
  
                // filterOption={(input, option) =>
                //   option.props.children
                //     .toString()
                //     .toLowerCase()
                //     .indexOf(option.props.children.toString().toLowerCase()) > -1
                // }
                getPopupContainer={getParentNode}
              >
                {getMedicineOptions()}
              </Select>
              )
             
            }
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
