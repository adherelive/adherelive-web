import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

import throttle from "lodash-es/throttle";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Spin from "antd/es/spin";
import message from "antd/es/message";
import config from "../../../../config";
import Tooltip from "antd/es/tooltip";
import { CloseCircleOutlined } from "@ant-design/icons";

import {
  InstantSearch,
  Hits,
  SearchBox,
  Highlight,
  connectSearchBox,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import { EditOutlined } from "@ant-design/icons";

const { Item: FormItem } = Form;
const { Option } = Select;

const FIELD_NAME = "medicine_id";

class MedicationStage extends Component {
  constructor(props) {
    super(props);
    const { medicines } = props;
    this.state = {
      medicines,
      medicine_id: null,
      fetchingMedicines: false,
      isSearching: false,
      medicine_name: "",
      searching_medicine: false,
    };

    this.handleMedicineSearch = throttle(
      this.handleMedicineSearch.bind(this),
      1000
    );
  }

  componentDidMount() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched, getFieldValue },
      medications,
      medicationData,
      payload: { id: medication_id } = {},
      medicines = {},
    } = this.props;

    let { basic_info: { details: { medicine_id } = {} } = {} } =
      medications[medication_id] || {};

    const { medicine_id: medicineId = "" } = medicationData || {};

    if (medicineId) {
      medicine_id = medicineId.toString();
    }

    const { basic_info: { name = "" } = {} } = medicines[medicine_id];
    this.setState({
      medicine_name: name,
      medicine_id: medicine_id,
    });
  }

  getStagesOption = () => {
    const { medications, payload: { id: medication_id } = {} } = this.props;
    let medicationStagesOption = [];
    const { medicines } = this.props;

    // const { basic_info: { details: { medicine_id } = {} } = {} } = medications[medication_id] || {};

    return Object.keys(medicines).map((id) => {
      const { basic_info: { name, type } = {} } = medicines[id] || {};
      return (
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    });

    // medicationStagesOption = medicationStages.map(stage => {
    //   const { id, name } = stage;
    //   return (
    //     <Option key={id} value={id}>
    //       {name}
    //     </Option>
    //   );
    // });
    // medicationStagesOption.push(
    //   <Option key={DEFAULT} value={DEFAULT}>
    //     {"Default"}
    //   </Option>
    // );

    // return medicationStagesOption;
  };

  // getInitialValue = () => {
  //   const { purpose, event: { data = {} } = {} } = this.props;
  //   let initialValue;
  //   if (purpose) {
  //     initialValue = data[FIELD_NAME];
  //   }
  //   return initialValue;
  // };

  getParentNode = (t) => t.parentNode;

  async handleMedicineSearch(data) {
    try {
      const { searchMedicine } = this.props;
      this.setState({ fetchingMedicines: true });
      const response = await searchMedicine(data);
      const { status } = response;
      if (status) {
        this.setState({ fetchingMedicines: false });
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

  SearchBox = ({ currentRefinement, isSearchStalled, refine }) => {
    const { searching_medicine = true, isSearching = true } = this.state;
    return (
      <form noValidate action="" role="search" className="medicine-search-form">
        <input
          type="search"
          placeholder="Type Medicine Name"
          value={currentRefinement}
          onChange={(event) => {
            refine(event.currentTarget.value);
            this.setListVisible(event);
          }}
        />
        {isSearching ? (
          <button
            className="reset-btn"
            onClick={(event) => {
              refine("");
              this.reset(event);
            }}
          >
            <CloseCircleOutlined className="fs18" />
          </button>
        ) : null}
      </form>
    );
  };

  CustomSearchBox = connectSearchBox(this.SearchBox);

  searchOptions = ({ hit }) => {
    // console.log("786545657890 HIT",hit);
    const { medicine_id = null, name = "", generic_name = "" } = hit;
    let final_name = name;
    let final_generic_name = generic_name;

    if (name === generic_name) {
      final_generic_name = "";
    }

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
    console.log("98172381723 e.currentTarget", e.currentTarget);
  };

  setListVisible = () => {
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
      enableSubmit,
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: medicine_id });
    this.setState({
      isSearching: false,
      medicine_name: medicine_name,
      searching_medicine: false,
      medicine_id: medicine_id,
    });

    enableSubmit();
  };

  isSearchingMedicine = (e) => {
    e.preventDefault();
    this.setState({ searching_medicine: true });
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched, getFieldValue },
      medications,
      medicationData,
      payload: { id: medication_id } = {},
      medicines = {},
    } = this.props;

    // let { basic_info: { details: { medicine_id } = {} } = {} } = medications[medication_id] || {};

    // const { medicine_id: medicineId = '' } = medicationData || {};

    // if (medicineId) {
    //   medicine_id = medicineId.toString();
    // }

    const { isSearching = false } = this.state;
    const {
      fetchingMedicines,
      medicine_name = "",
      medicine_id = null,
      searching_medicine = false,
    } = this.state;

    const {
      getStagesOption,
      getInitialValue,
      getParentNode,
      handleMedicineSearch,
    } = this;
    // if (!program_has_medication_stage || (!!purpose && !!!getInitialValue())) {
    //   return null;
    // }

    // const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);
    const { CustomSearchBox } = this;

    return (
      <FormItem>
        {getFieldDecorator(FIELD_NAME, {
          initialValue: medicine_id,
        })(
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

                {isSearching && (
                  <div>
                    <Hits hitComponent={this.searchOptions} />
                  </div>
                )}
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
