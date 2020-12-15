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
      searching_medicine: false,
      medicine_name: ""
    };
  }

  componentDidMount(){

    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched,getFieldValue },
      medications={},
      medicationData,
      payload: { id: medication_id } = {},
      medicines={}
    } = this.props;

    let { basic_info: { details: { medicine_id  = null} = {} } = {} } = medications[medication_id] || {};


    const { medicine_id: medicineId = '' } = medicationData || {};
      
    if (medicineId) {
      medicine_id = parseInt(medicineId);
    }

    const {basic_info : {name} = {} } = medicines[medicine_id] || {};

   if(medicine_id){
    this.setState({medicine_name:name,
      searching_medicine:false});
   }

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
          <Option
            key={`opt-${medicine_id}`}
            value={medicine_id}
          >
            {searchOptions(hit, index)}
          </Option>
        );
      });
 
  };

  highlightText = ({ highlight, attribute, hit }) => {
    const parsedHit = highlight({
      highlightProperty: "_highlightResult",
      attribute,
      hit
    });

    return (
      <span>
        {parsedHit.map((part, index) => {
            console.log("018381923 highlighted, index, value", {highlighted: part.isHighlighted, index, value: part.value, parsedHit});
            return (
                part.isHighlighted ? (
                    <mark key={index}>{part.value}</mark>
                ) : (
                    <span key={index}>{part.value}</span>
                )
            );
        }

        )}
      </span>
    );
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




  algoliaClient = () => {
    return algoliasearch(config.algolia.app_id, config.algolia.app_key);
  };

  formatMessage = message => this.props.intl.formatMessage(message);

  handleMedicineSearch = value => {
    const algoliaClient = this.algoliaClient();
    const index = algoliaClient.initIndex(config.algolia.medicine_index);
    const { value: state_value = "" } = this.state;

    console.log("128321930 config.algolia.medicine_index -> ", config);

    index.search(value).then(({ hits }) => {
      if (value !== state_value) {
        this.setState({
          hits,
          value
        });
      }
    });
  };

  getParentNode = t => t.parentNode;

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

  isSearchingMedicine = e => {
    e.preventDefault();
    console.log("7865467890765467890");
    this.setState({ searching_medicine: true });
  };

  render() {

    const {
      fetchingMedicines,
      searching_medicine=false,
      medicine_name : med_name =''

    } = this.state;

    const { getMedicineOptions, handleMedicineSearch, getParentNode } = this;


    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched,getFieldValue },
      medications={},
      medicationData,
      payload: { id: medication_id } = {},
      medicines={}
    } = this.props;

    let { basic_info: { details: { medicine_id  = null} = {} } = {} } = medications[medication_id] || {};


    const { medicine_id: medicineId = '' } = medicationData || {};
      
    if (medicineId) {
      medicine_id = parseInt(medicineId);
    }



    return (
      <FormItem label={this.formatMessage(messages.addMedicine)}>
        {getFieldDecorator(
          FIELD_NAME,

          {
            initialValue : medicine_id ? medicine_id :null
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
