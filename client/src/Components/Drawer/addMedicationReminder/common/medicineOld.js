import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Form from "antd/es/form";
import Select from "antd/es/select";
import Spin from "antd/es/spin";
import Tooltip from "antd/es/tooltip";
import Button from "antd/es/button";
import { EditOutlined } from "@ant-design/icons";
import messages from "../message";
import message from "antd/es/message";
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
import {TagFilled,TagOutlined} from "@ant-design/icons";
import {TABLET} from "../../../../constant";

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
      searching_medicine: true,
      medicine_name: "",
      medicine_id: "",
      inputText:'',
      blur:true
    };
    const algoliaClient = this.algoliaClient();
    this.index = algoliaClient.initIndex(config.algolia.medicine_index);
  }

  componentDidMount() {
    // this.handleMedicineSearch(" ");
    this.handleGetFavourites();
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
      setFormulation
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
      setFormulation(medicineId);
      this.getNewDefaultMedicine(medicineId,name);
      this.setState({ medicine_id: medicineId, temp_medicine: medicineId });
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
    // console.log("9836462746239846239  setInputText",{value});
    this.setState({inputText:value});
  }

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
        console.log("675456789763445", name);
        final_generic_name = "";
      }

      let hit = hits[index];
      options.push(
      <Option key={`opt-${medicine_id}`} value={medicine_id}>
      {searchOptions(hit, index)}
    </Option>)
    }

       
    const {inputText =''} = this.state;
    if(options.length === 0 && inputText !== ''){
      const {inputText=''}=this.state;
      options.push(
        <div
         key={"no-match-medicine-div"}
         className="flex align-center justify-center" 
         onClickCapture={this.handleAddMedicineOpen}
         className="add-new-medicine-button-div"
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
    e.preventDefault();
    e.stopPropagation();
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
    const { value, searching_medicine } = this.state;
    let final_name = name;
    let final_generic_name = generic_name;

    if (name === generic_name) {
      final_generic_name = "";
    }

    const {favourite_medicine_ids = []}=this.props;
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
            <div className="fs18 fw800 black-85 medicine-selected pr10">
              <span
                dangerouslySetInnerHTML={{
                  __html: hit._highlightResult.name.value
                }}
              ></span>
            </div>
          </Tooltip>
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
      setFormulation
    } = this.props;
    setFieldsValue({ [FIELD_NAME]: medicine_id });
    this.setState({
      medicine_name: medicine_name,
      searching_medicine: false,
      medicine_id
    });

    const {inputText  = ""}=this.state;
    if(inputText != ""){
      this.setState({blur:true})
    }
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
      this.searchValue(value);
    }

  };

  async searchValue(value) {
    try {
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
      const { value: state_value = "" } = this.state;

      const res = await this.index.search(value ,
        {
          filters : `creator_id:${doctor_id} OR public_medicine:true OR public_medicine:1`
        });
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
    this.setState({ medicine_id: value, temp_medicine: value });
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
    // console.log("867546756877654567",this.state);
    const { medicine_id = null } = this.state;
    if (medicine_id) {
      this.setState({
        temp_medicine: medicine_id
      });
    }
  };

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
    const {medicine_id ="" ,searching_medicine=false} = this.state;
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
    const {newMedicineId=null}=this.props;
    console.log("08381293810923 temp_medicine render",
    {temp_medicine, type_temp_medicine: typeof temp_medicine});
    const {inputText ,blur=true,medicine_id="" } = this.state;
    const {favourite_medicine_ids = []}=this.props;


    console.log("9836462746239846239 INPUT TEXXXXT",{medicine_id,temp_medicine,flag:temp_medicine !== '',blur});

    
    console.log("9836462746239846239",{flag:
      inputText === "" 
      && blur===false
      && favourite_medicine_ids.length>0,
      flag1:inputText === "",
      flag2:blur===false,
      flag3:favourite_medicine_ids.length>0
    });

    console.log("9836462746239846239",{
      inputText , medicine_id ,temp_medicine,
      favourite_medicine_ids,
    })

    return (
      <FormItem label={this.getLabel()}>
        {getFieldDecorator(FIELD_NAME, {})(
          <InstantSearch
            indexName={config.algolia.medicine_index}
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
                fetchingMedicines ? <Spin size="small" /> : ""
              }
              className="drawer-select medicine-search-select"
              placeholder="Choose Medicine"
              showSearch
              onSelect={this.onOptionSelect}
              defaultOpen={true}
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

            {/* {
            (inputText === "" 
            && blur===false
            && favourite_medicine_ids.length>0)
            || searching_medicine
            ? this.getFavouritesComponent() : null } */}

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
