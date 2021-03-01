import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Form from "antd/es/form";
import Select from "antd/es/select";
import Spin from "antd/es/spin";
import Tooltip from "antd/es/tooltip";
import { EditOutlined } from "@ant-design/icons";
import message from "antd/es/message";

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
import Button from "antd/es/button";
import {TagFilled,TagOutlined} from "@ant-design/icons";
import FavouriteMedicines from "../../../../Containers/Favourites/medicine";

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
      medicine_name: "",
      blur:true

    };

    const algoliaClient = this.algoliaClient();
    this.index = algoliaClient.initIndex(config.algolia.medicine_index);
  }

  componentDidMount() {
    const {addMedication , medicationData,editMedication} = this.props;
    if(addMedication  && !medicationData ){
        // this.handleMedicineSearch(" ");
        this.handleGetFavourites();
    } else {
      this.getDefaultMedicine();
    }
  }

  handleGetFavourites = async () => {
    try{
        const {getFavourites} =this.props;
        const type = "medicine";
        const res = await getFavourites({type:"medicine"})
    }catch(error){
        console.log(" error ===>",error);
    }
}

  componentDidUpdate(prevProps,prevState){
    const {newMedicineId:prev_newMedicineId = null} = prevProps;
    const {newMedicineId}=this.props;
    const {
      form: { setFieldsValue, getFieldValue },
      enableSubmit
    } = this.props;
    if(prev_newMedicineId!==newMedicineId){
      const {medicines = {}} =this.props;
      const {basic_info:{name='',id=null}={}}=medicines[newMedicineId] || {};
      const medicineId = parseInt(id);
      setFieldsValue({ [FIELD_NAME]: medicineId });
      this.setState({
        medicine_name: name,
        searching_medicine: false,
        medicineId
      });
      this.getNewDefaultMedicine(medicineId,name);
      this.setState({ medicine_id: medicineId, temp_medicine: medicineId });
      enableSubmit();
    } 
  }

  getNewDefaultMedicine = (medicine_id,medicineName) => {
    let defaultHit = [];
    this.handleMedicineSearch(medicineName);
    // new index
    // const client = this.algoliaClient();
    // const index = client.initIndex(config.algolia.medicine_index);

    this.index.search(medicineName
     ).then(({ hits }) => {
        defaultHit = hits.filter(hit => {
          const X = hit.medicine_id;
          return(hit.medicine_id === medicine_id)
        });
      this.setState({hits: defaultHit, temp_medicine: medicine_id});
    });
  };

  setInputText = (value) => {
    console.log("382742347729378428349832",{value});
    this.setState({inputText:value});
  }

  getDefaultMedicine = () => {
    const {
      medications = {},
      payload: { id: medication_id } = {},
      medicines = {}
    } = this.props;


    let defaultHit = [];

    const {medicationData,doctors ={},authenticated_user=null} = this.props;
    const {templatePage = false} = medicationData || {};


    let medicine_id = null;
    let medicineName = "";

    let doctor_id=null;

    for(let each in doctors){
      const {basic_info : {
        id:docId = null,
        user_id=null
      } ={}} = doctors[each] || {};

      if(user_id === authenticated_user){
        doctor_id=docId;
      }

    }
    
    // for template edit medication from patient details page
    if(medicationData && !templatePage){
      const {medicine_id : template_medicine_id, medicine : name  } =  medicationData || {};
      if(template_medicine_id){
        medicine_id = template_medicine_id;
        medicineName = name;
      }
    }else if(medicationData && templatePage){
      // for template from settings page
      const {medicine_id : template_medicine_id  } =  medicationData || {};
      const { basic_info: { name, id } = {} } = medicines[template_medicine_id] || {};

      if(template_medicine_id){
        medicine_id = template_medicine_id;
        medicineName = name;
      }

    }
    else{
      // for default valMedicine of edit medication w/t template
    const  { basic_info: { details: { medicine_id : med_id = null } = {} } = {} } =
    medications[medication_id] || {};
    medicine_id=med_id;
    const { basic_info: { name, id } = {} } = medicines[medicine_id] || {};
    medicineName=name;
    }

    this.index.search(medicineName,
      {
        filters : `creator_id:${doctor_id} OR public_medicine:true OR public_medicine:1`
      }).then(({ hits }) => {

        defaultHit = hits.filter(hit => hit.medicine_id === medicine_id);
      this.setState({hits: defaultHit, temp_medicine: medicine_id});
    });

  };

  


  // getMedicineOptions = () => {
  //   const { hits = {}, value: state_value = "" } = this.state;
  //   const { temp_medicine = "" } = this.state;

  //   const { searchOptions } = this;

  //   let defaultOption = [];

  //   const {
  //     medications = {},
  //     payload: { id: medication_id } = {},
  //     medicines = {}
  //   } = this.props;

  //   const { basic_info: { details: { medicine_id = null } = {} } = {} } =
  //     medications[medication_id] || {};

  //   const { basic_info: { name: med_name = "" } = {} } = medicines[medicine_id] || {};
   


  //   return Object.values(hits).map(function(hit, index) {
  //     const {
  //       medicine_id = null,
  //       name = "",
  //       generic_name = "",
  //       objectID = null
  //     } = hit;
  //     let final_name = name;
  //     let final_generic_name = generic_name;

  //     if (name === generic_name) {
  //       final_generic_name = "";
  //     }


  //     return (
  //       <Option key={`opt-${medicine_id}`} value={medicine_id}>
  //         {searchOptions(hit, index)}
  //       </Option>
  //     );
  //   });
  // };


  getMedicineOptions = () => {
    const algoliaClient = this.algoliaClient();
    const index = algoliaClient.initIndex(config.algolia.medicine_index);
    const { hits = {} } = this.state;
    let list = [];
    const { searchOptions } = this;

    const options = [];

    for(let index in hits){
      
      const {
        medicine_id = null,
        name = "",
        generic_name = "",
        objectID = null
      } = hits[index];
      let final_name = name;
      let final_generic_name = generic_name;

      if (name === generic_name) {
        final_generic_name = "";
      }

      let hit = hits[index];
      options.push(
      <Option key={`opt-${medicine_id}`} value={medicine_id}>
      {searchOptions(hit, index)}
    </Option>)
    }

    const {inputText =''} = this.state;
       
    if(options.length === 0  && inputText !== '' ){
      const {inputText=''}=this.state;
      options.push(
        <div
         key={"no-match-medicine-div"}
         className="flex align-center justify-center"
         onClickCapture={this.handleAddMedicineOpen}
          >
          <Button 
          type={"default"}
          size="small"
          key={"no-match-medicine"}
          onClick={this.handleAddMedicineOpen} >{`${this.formatMessage(messages.addMedicine)} "${inputText}"`}</Button>
        </div>
      )
    }

    return options;
 

  };

  handleAddMedicineOpen = (e) => {
    if(e){
      e.preventDefault();
      e.stopPropagation();
    }
    const {openAddMedicineDrawer,setMedicineVal}=this.props;
    const {inputText =''}=this.state;
    setMedicineVal(inputText);
    openAddMedicineDrawer();
    const {newMedicineId = null}=this.props;

  }


  searchOptions = (hit, index) => {
    const {
      medicine_id = null,
      name = "",
      generic_name = "",
      objectID = null
    } = hit;

    const {hits = {}} = this.state;
    const { value, searching_medicine, temp_medicine } = this.state;
    let final_name = name;
    let final_generic_name = generic_name;

    if (name === generic_name) {
      final_generic_name = "";
    }

    const {favourite_medicine_ids = []}=this.props;

    console.log("986452387467239478623487679",{searching_medicine,flag:searching_medicine && Object.keys(hits).length > 0,
    flag1:Object.keys(hits).length > 0});

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
            <div className="fs18 fw800 black-85 medicine-selected pr10">
              <span
                dangerouslySetInnerHTML={{
                  __html: hit._highlightResult.name.value
                }}
              ></span>
            </div>
          </Tooltip>
          <div>
          <Tooltip
            title={favourite_medicine_ids && favourite_medicine_ids.includes(medicine_id.toString()) ? "Unmark" : "Mark" }
          >
            {favourite_medicine_ids && favourite_medicine_ids.includes(medicine_id.toString())
             ? 
             <TagFilled style={{ fontSize: '20px', color: '#08c' }}
              onClick={this.handleremoveFavourites(medicine_id)}
             /> 
             :
            <TagOutlined style={{ fontSize: '20px', color: '#08c' }} 
              onClick = {this.handleAddFavourites(medicine_id)}
            /> }

          </Tooltip>
        </div>
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
        <div>
          <Tooltip
            title={favourite_medicine_ids && favourite_medicine_ids.includes(medicine_id.toString()) ? "Unmark" : "Mark" }
          >
            {favourite_medicine_ids && favourite_medicine_ids.includes(medicine_id.toString())
             ? 
             <TagFilled style={{ fontSize: '20px', color: '#08c' }}
              onClick={this.handleremoveFavourites(medicine_id)}
             /> 
             :
            <TagOutlined style={{ fontSize: '20px', color: '#08c' }} 
              onClick = {this.handleAddFavourites(medicine_id)}
            /> }

          </Tooltip>
        </div>
      </div>
    );
  };

   
  handleAddFavourites = (id) => async(e) => {
    try{
      e.preventDefault();
      e.stopPropagation();
        const {markFavourite} = this.props;
        const data = {
            type:"medicine",
            id
        }

        console.log("98346753264792834657234672930 >>>>>>>>>>><<<<<<<<<<<<<<<<<",{id});

        const response = await markFavourite(data);
        const {status,statusCode,payload:{data : resp_data = {} , message : resp_msg= ''} = {}} = response;
        if(status){
          message.success(resp_msg);
        }else{
          message.error(resp_msg);
        }

    }catch(error){
        console.log("error",error);
    }
}

  handleremoveFavourites = (id) => async(e) => {
    try{
      e.preventDefault();
      e.stopPropagation();
        const {removeFavourite} = this.props;
        const data = {
            type:"medicine",
            typeId:id
        }

        const response = await removeFavourite(data);
        // console.log("9836462746239846239",{id,response});
        const {status,statusCode,payload:{data : resp_data = {} , message : resp_msg= ''} = {}} = response;
        if(status){
          message.success(resp_msg);
        }else{
          message.error(resp_msg);
        }
    }catch(error){
        console.log("error",{error});
    }
}



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
    const {inputText  = ""}=this.state;
    if(inputText != ""){
      this.setState({blur:true})
    }
    enableSubmit();
  };

  algoliaClient = () => {
    return algoliasearch(config.algolia.app_id, config.algolia.app_key);
  };

  formatMessage = message => this.props.intl.formatMessage(message);

  handleMedicineSearch = value => {
    const algoliaClient = this.algoliaClient();
    this.setInputText(value);
    if(value === "" || value === ''){
      this.setState({
        hits:{},
        medicine_name: '',
        searching_medicine: false,
        medicine_id:'',
        temp_medicine:'',
        blur:false
      });
      
    }else{
    
    const index = algoliaClient.initIndex(config.algolia.medicine_index);
    const { value: state_value = "", defaultHit = [] } = this.state;

    const {doctors ={},authenticated_user=null} = this.props ;

    let doctor_id=null;

    for(let each in doctors){
      const {basic_info : {
        id:docId = null,
        user_id=null
      } ={}} = doctors[each] || {};

      if(user_id === authenticated_user){
        doctor_id=docId;
      }

    }


    index.search(value,
      {
        filters : `creator_id:${doctor_id} OR public_medicine:true OR public_medicine:1`
      }).then(({ hits }) => {
        

      if (value !== state_value) {
        this.setState({
          hits,
          value,
          // searching_medicine: true
          searching_medicine:false
        });
      }
    });
    }
  };

  onOptionSelect = value => {
    const {
      enableSubmit
    } = this.props;
    this.setState({ medicine_id: value, temp_medicine: value });
    enableSubmit();

  };

  onFavOptionSelect = value => () => {
    // console.log("9836462746239846239 onFavOptionSelect",{value});
    const { setFormulation } = this.props;
    setFormulation(value);
    this.setState({ medicine_id: value, temp_medicine: value });
  };

  getFavouriteSelectedMedicine = (medicine_id,medicineName) => {
    let defaultHit = [];
    this.handleMedicineSearch(medicineName);

    this.index.search(medicineName
     ).then(({ hits }) => {
        defaultHit = hits.filter(hit => {
          const X = hit.medicine_id;
          return(hit.medicine_id === medicine_id)
        });
      this.setState({hits: defaultHit, temp_medicine: medicine_id});
    });
  };

  dropdownVisible = open => {
    this.setState({ searching_medicine: open, temp_medicine: "" });
  };

  getParentNode = t => t.parentNode;

  handleOnBlur = () => {
    this.setState({
      blur:true
    });
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

       this.setState({
        temp_medicine:medicine_id
      })
    }else if (default_medicine_id){

      this.setState({
        temp_medicine:default_medicine_id
      })
    }


   
  }

  getLabel = () => {
    return (
        <Fragment>
          <span className="form-label">{this.formatMessage(messages.addMedicine)}</span>
          <span className="star-red">*</span>
        </Fragment>
    )
  };

  getFavouritesComponent = () => {
    const {setMedicineValue , onFavOptionSelect,handleOnFocus,getFavouriteSelectedMedicine}=this;
    const {favourite_medicine_ids = []} = this.props;
    const {medicine_id ="" , searching_medicine=false} = this.state;
    return(
    <FavouriteMedicines 
      setMedicineValue={setMedicineValue} 
      onFavOptionSelect={onFavOptionSelect}
      handleOnFocus={handleOnFocus}
      getFavouriteSelectedMedicine={getFavouriteSelectedMedicine}
      medicineIdSelected={medicine_id!==""}
      searching_medicine={searching_medicine}
      />);
  }
  
  handleOnFocus = () => {
    const{inputText=""}=this.state;
    console.log("9836462746239846239 **********************",{inputText});

    this.setState({
      blur:false
    });
  }

  render() {
    const {
      fetchingMedicines,
      medicine_name: med_name = "",
      temp_medicine = "",
      searching_medicine=false
    } = this.state;

    const { getMedicineOptions, handleMedicineSearch, getParentNode } = this;

    const {
      form: { getFieldDecorator },
      medicines,
    } = this.props;

    const {inputText ,blur=true,medicine_id="" } = this.state;


    return (
      <FormItem label={this.getLabel()}>
        {getFieldDecorator(FIELD_NAME, {
          initialValue: temp_medicine ? `${temp_medicine}` : ""
        })(
          <InstantSearch
            indexName={config.algolia.medicine_index}
            searchClient={this.algoliaClient()}
          >
            <Select
              onSearch={handleMedicineSearch}
              notFoundContent={
                fetchingMedicines ? <Spin size="small" /> : ""
              }
              className="drawer-select medicine-search-select"
              placeholder="Choose Medicine"
              showSearch
              onSelect={this.onOptionSelect}
              defaultActiveFirstOption={true}
              value={
                searching_medicine 
                ? 
                inputText
                :
                temp_medicine
              }
              onDropdownVisibleChange={this.dropdownVisible}
              autoComplete="off"
              optionFilterProp="children"
              filterOption={(input, option) => {
                return option.props.children;
              }}
              getPopupContainer={getParentNode}

              onBlur={this.handleOnBlur}
              onFocus={this.handleOnFocus}

            >
              {getMedicineOptions()}
            </Select>
            {(inputText === "" ||medicine_id !== "") && blur===false ? this.getFavouritesComponent() : null }

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
