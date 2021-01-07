import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Form from "antd/es/form";
import Select from "antd/es/select";
import Spin from "antd/es/spin";
import Tooltip from "antd/es/tooltip";
import { EditOutlined } from "@ant-design/icons";

import messages from "../message";
import algoliasearch from "algoliasearch/lite";
import config from "../../../../config";
import {
  InstantSearch,
  // Hits,
  // SearchBox,
  // Highlight,
  // connectSearchBox,
  // connectHighlight
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
      searching_medicine: false,
      medicine_name: ""
    };

    const algoliaClient = this.algoliaClient();
    this.index = algoliaClient.initIndex(config.algolia.medicine_index);
  }

  componentDidMount() {
    const {addMedication , medicationData} = this.props;
    if(addMedication && !medicationData){
        this.handleMedicineSearch(" ");
        return;
    }

    this.getDefaultMedicine();
  }

  getDefaultMedicine = () => {
    const {
      medications = {},
      payload: { id: medication_id } = {},
      medicines = {}
    } = this.props;

    let { basic_info: { details: { medicine_id = null } = {} } = {} } =
    medications[medication_id] || {};

    const { basic_info: { name } = {} } = medicines[medicine_id] || {};

    let defaultHit = [];

    const {medicationData ={}} = this.props;
    if(medicationData){
      const {medicine_id : template_medicine_id  } =  medicationData || {};
      if(template_medicine_id){
        medicine_id = template_medicine_id;
      }
    }

    this.index.search(name).then(({ hits }) => {

        defaultHit = hits.filter(hit => hit.medicine_id === medicine_id);
      console.log("19831829 defaultHit inside--> ",medicine_id, hits, defaultHit);
      this.setState({hits: defaultHit, temp_medicine: medicine_id});
    });

    console.log("19831829 defaultHit --> ", defaultHit);
  };

  


  getMedicineOptions = () => {
    const { hits = {}, value: state_value = "" } = this.state;
    const { temp_medicine = "" } = this.state;

    const { searchOptions } = this;

    let defaultOption = [];

    const {
      medications = {},
      payload: { id: medication_id } = {},
      medicines = {}
    } = this.props;

    const { basic_info: { details: { medicine_id = null } = {} } = {} } =
      medications[medication_id] || {};

    const { basic_info: { name: med_name = "" } = {} } = medicines[medicine_id] || {};
    //
    // if (!temp_medicine) {
    //   defaultOption.push(
    //     <Option key={`opt-${medicine_id}`} value={`${medicine_id}`}>
    //         <Tooltip title="Name">
    //           <div className="fs18 fw800 black-85 medicine-selected">
    //             <span>{med_name}</span>
    //           </div>
    //         </Tooltip>
    //     </Option>
    //   );
    //
    //   return defaultOption;
    // }

    // console.log("10982309123 hits ---> ", hits);


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
      // console.log("10982309123 medicine_id, type of medicine_id ", medicine_id, typeof medicine_id);

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
    const { value, searching_medicine, temp_medicine } = this.state;
    let final_name = name;
    let final_generic_name = generic_name;

    if (name === generic_name) {
      final_generic_name = "";
    }

    if (!searching_medicine) {
      this.setMedicineValue(medicine_id, name);
      return (
        <div
          key={medicine_id}
          className="pointer flex wp100  align-center justify-space-between"
          onClick={this.setMedicineValue(medicine_id, name)}
        >
          <Tooltip title={this.formatMessage(messages.name)}>
            {" "}
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

    return (
      <div
        key={medicine_id}
        className="pointer flex wp100  align-center justify-space-between"
        onClick={this.setMedicineValue(medicine_id, name)}
      >
        <div className="flex direction-column align-start justify-center">
          <Tooltip title={this.formatMessage(messages.name)}>
            {" "}
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
      setFormulation,
      enableSubmit
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: medicine_id });
    this.setState({
      medicine_name: medicine_name,
      searching_medicine: false
    });
    enableSubmit();
  };

  algoliaClient = () => {
    return algoliasearch(config.algolia.app_id, config.algolia.app_key);
  };

  formatMessage = message => this.props.intl.formatMessage(message);

  handleMedicineSearch = value => {
    const algoliaClient = this.algoliaClient();
    const index = algoliaClient.initIndex(config.algolia.medicine_index);
    const { value: state_value = "", defaultHit = [] } = this.state;

    index.search(value).then(({ hits }) => {
      if (value !== state_value) {
        this.setState({
          hits,
          value,
          searching_medicine: true
        });
      }
    });
  };

  onOptionSelect = value => {
    const {
      enableSubmit
    } = this.props;
    this.setState({ medicine_id: value, temp_medicine: value });
    enableSubmit();

  };

  dropdownVisible = open => {
    this.setState({ searching_medicine: open, temp_medicine: "" });
  };

  getParentNode = t => t.parentNode;

  handleOnBlur = () => {
  
    const {medicine_id=null} = this.state;
    const {
      medications = {},
      payload: { id: medication_id } = {},
      medicines = {}
    } = this.props;

    let { basic_info: { details: { medicine_id : default_medicine_id = null } = {} } = {} } =
    medications[medication_id] || {};

    const { medicationData} = this.props;

    if(medicationData){
      const {medicine_id : template_medicine_id  } =  medicationData || {};
      if(template_medicine_id){
        default_medicine_id = template_medicine_id;
      }
    }
    
    if(medicine_id){
      // console.log("867546756877654567 --> 1",this.state);

       this.setState({
        temp_medicine:medicine_id
      })
    }else if (default_medicine_id){
      // console.log("867546756877654567 --> 2",this.state);

      this.setState({
        temp_medicine:default_medicine_id
      })
    }

    // console.log("867546756877654567",this.state);

   
  }

  getLabel = () => {
    return (
        <Fragment>
          <span className="form-label">{this.formatMessage(messages.addMedicine)}</span>
          <span className="star-red">*</span>
        </Fragment>
    )
  };


  render() {
    const {
      fetchingMedicines,
      medicine_name: med_name = "",
      temp_medicine = ""
    } = this.state;

    const { getMedicineOptions, handleMedicineSearch, getParentNode } = this;

    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <FormItem label={this.getLabel()}>
        {getFieldDecorator(FIELD_NAME, {
          initialValue: temp_medicine ? `${temp_medicine}` : ""
        })(
          <InstantSearch
            indexName={"adhere_medicine"}
            searchClient={this.algoliaClient()}
          >
            <Select
              onSearch={handleMedicineSearch}
              notFoundContent={
                fetchingMedicines ? <Spin size="small" /> : "No match found"
              }
              className="drawer-select medicine-search-select"
              placeholder="Choose Medicine"
              showSearch
              onSelect={this.onOptionSelect}
              defaultActiveFirstOption={true}
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
