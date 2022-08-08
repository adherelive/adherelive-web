import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

import throttle from "lodash-es/throttle";

import Form from "antd/es/form";
import Input from "antd/es/input";
import Select from "antd/es/select";
import message from "antd/es/message";
import config from "../../../../config";
import Tooltip from "antd/es/tooltip";

import { EditOutlined, CloseCircleOutlined } from "@ant-design/icons";

import {
  InstantSearch,
  Hits,
  SearchBox,
  Highlight,
  connectSearchBox,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import { connectHits } from "react-instantsearch-dom";

const { Item: FormItem } = Form;
const { Option } = Select;

const FIELD_NAME = "medicine_id";

class MedicationStage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicines: {},
      fetchingMedicines: false,
      isSearching: false,
      medicine_name: "",
      searching_medicine: false,
      state_hits: {},
    };

    this.handleMedicineSearch = throttle(
      this.handleMedicineSearch.bind(this),
      2000
    );
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("PREV PROPS =====>", prevProps);
    console.log("Prosssssssssss ----->", this.props);
  }

  Hits = ({ hits }) => {
    console.log("7654678743576890", { hits, length: hits.length });

    // let list = [];
    // for(let hit of hits){
    //   const {medicine_id = null , name ='' , generic_name ='' } = hit;
    //   list.push(<Option key={hit.objectID}
    //   key={medicine_id}
    //   value={medicine_id}
    //   >{this.searchOptions({hit})}</Option>)
    // }
    // return list;

    // // console.log("76543456735467890",hits);

    return (
      <ol>
        {hits.map((hit) => (
          <li key={hit.objectID}>{this.searchOptions({ hit })}</li>
        ))}
      </ol>
    );
  };

  CustomHits = connectHits(this.Hits);

  SearchBox = ({ currentRefinement, isSearchStalled, refine }) => {
    const { searching_medicine = true, isSearching = true } = this.state;
    const { CustomHits } = this;
    return (
      <form noValidate action="" role="search" className="medicine-search-form">
        {/* <input
        type="search"
        placeholder="Type Medicine Name"
        value={currentRefinement}
        onChange={(event) => {
          refine(event.currentTarget.value)
          this.setListVisible(event);
        }}
      />
      {isSearching
      ?
      ( <button
        className="reset-btn"
        onClick={(event) => {
          refine('')
          this.reset(event)      
         }}
        >
            <CloseCircleOutlined className="fs18" />
        </button>)
        :
        null
    }
      */}

        <Select
          onSearch={(value) => {
            console.log("5464564524354654634  Search--->", value);
            refine(value);
            // this.setListVisible(value);
          }}
          onChange={(value) => {
            console.log("5464564524354654634 --->", value);
            // refine(value);
          }}
          className="form-inputs"
          showSearch
          placeholder={"Type Medicine Name"}
          value={currentRefinement}
          onSelect={(value) => {
            console.log("5464564524354654634 Select -->", value);
            // refine(value);
          }}
          autoComplete="off"
        >
          <Option key="Options-med">
            {" "}
            <CustomHits />
          </Option>

          {/* {<CustomHits key={"medicine-ol"} />} */}
        </Select>

        {/* <CustomHits key={"medicine-ol"} /> */}
      </form>
    );
  };

  CustomSearchBox = connectSearchBox(this.SearchBox);

  getStagesOption = () => {
    const { medicines = {} } = this.props;
    // let medicationStagesOption = [];

    return Object.keys(medicines).map((id) => {
      const { basic_info: { name } = {} } = medicines[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });
  };

  getParentNode = (t) => t.parentNode;

  async handleMedicineSearch(data) {
    try {
      if (data) {
        const { searchMedicine } = this.props;
        this.setState({ fetchingMedicines: true });
        const response = await searchMedicine(data);
        const { status, payload: { data: responseData, message } = {} } =
          response;
        if (status) {
          this.setState({ fetchingMedicines: false });
        } else {
          this.setState({ fetchingMedicines: false });
        }
      } else {
        this.setState({ fetchingMedicines: false });
      }
    } catch (err) {
      console.log("err", err);
      message.warn("Something wen't wrong. Please try again later");
      this.setState({ fetchingMedicines: false });
    }
  }

  algoliaClient = () => {
    return algoliasearch(config.algolia.app_id, config.algolia.app_key);
  };

  searchOptions = ({ hit }) => {
    console.log("6543234678987542356789");
    const { medicine_id = null, name = "", generic_name = "" } = hit;
    let final_name = name;
    let final_generic_name = generic_name;

    if (name === generic_name) {
      console.log("675456789763445", name);
      final_generic_name = "";
    }

    // console.log("4353465332423673543453453",hit);

    return (
      <div
        key={medicine_id}
        className="pointer flex wp100  align-center justify-space-between"
        onClick={this.setMedicineValue(medicine_id, final_name)}
      >
        <div className="flex direction-column align-start justify-center">
          <Tooltip title="Name">
            <div className="fs18 fw800 black-85">
              <Highlight attribute="name" hit={hit}>
                <div>{final_name ? final_name : " -- "}</div>
              </Highlight>
            </div>
          </Tooltip>

          <Tooltip title="Generic Name">
            <div className="fs16">
              <Highlight attribute="generic_name" hit={hit}>
                <div>{final_generic_name ? final_generic_name : ""}</div>
              </Highlight>
            </div>
          </Tooltip>
        </div>
      </div>
    );
  };

  onSearch = (e) => {
    e.preventDefault();
    // console.log("98172381723 e.currentTarget", e.currentTarget);
  };

  setListVisible = (value) => {
    const { isSearching = false } = this.state;

    if (isSearching === true) {
      this.setState({ isSearching: false });
    } else {
      this.setState({ isSearching: true });
    }
  };

  reset = (e) => {
    e.preventDefault();
    const { isSearching = false } = this.state;
    if (isSearching === true) {
      this.setState({ isSearching: false });
    }
  };

  setMedicineValue = (medicine_id, medicine_name) => (e) => {
    e.preventDefault();
    const {
      form: { setFieldsValue, getFieldValue },
      setFormulation,
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: medicine_id });
    this.setState({
      isSearching: false,
      medicine_name: medicine_name,
      searching_medicine: false,
    });
  };

  isSearchingMedicine = (e) => {
    e.preventDefault();
    console.log("7865467890765467890");
    this.setState({ searching_medicine: true });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
      setFormulation,
    } = this.props;

    const {
      fetchingMedicines,
      medicine_name = "",
      searching_medicine = false,
    } = this.state;
    const { isSearching = false } = this.state;

    const { getStagesOption, getParentNode, handleMedicineSearch } = this;

    // if (!program_has_medication_stage || (!!purpose && !!!getInitialValue())) {
    //   return null;
    // }

    // const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);
    const { CustomSearchBox } = this;

    return (
      <FormItem>
        {getFieldDecorator(
          FIELD_NAME,
          {}
        )(
          <div className="ais-InstantSearch">
            <div className="form-headings">Search Medicine</div>

            <InstantSearch
              indexName={config.algolia.medicine_index}
              searchClient={this.algoliaClient()}
              onChange={this.onSearch}
            >
              <div className="right-panel">
                {medicine_name && !searching_medicine ? (
                  <Fragment>
                    <span className="fs20 ml20">{medicine_name}</span>
                    <span style={{ marginLeft: "5px" }}>
                      <EditOutlined
                        onClick={this.isSearchingMedicine}
                        title={"Edit Medicine"}
                      />
                    </span>
                  </Fragment>
                ) : (
                  <CustomSearchBox />
                )}

                {/* {isSearching && */}
                {/* <div>
                    <Hits
                        hitComponent={this.searchOptions}
                    />

                  </div> */}
                {/* } */}
              </div>
            </InstantSearch>
          </div>
        )}
      </FormItem>
    );
  }
}

const Field = injectIntl(MedicationStage);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
