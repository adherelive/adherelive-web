import React , {Component, Fragment} from "react";
import {injectIntl} from "react-intl";
import Drawer from "antd/es/drawer";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import Select from "antd/es/select";
import message from "antd/es/message";
import Footer from "../footer";
import {MEDICINE_TYPE, USER_CATEGORY , MEDICINE_UNITS} from "../../../constant";
import messages from "./messages";



const { Option, OptGroup } = Select;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class NewMedicineDrawer extends Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            type:'',
            generic_name: "",
            submitting:false
        }
    }

    componentDidMount(){
    }

    formatMessage = data => this.props.intl.formatMessage(data);

    componentDidUpdate(prevProps,prevState){
        const {visible:prev_visible=false}=prevProps;
        const {visible=false} = this.props;
        if(visible && visible !== prev_visible){
            const {input = ''} = this.props;
            console.log("8932647235462547239874623847329",{props:this.props});
            this.setState({name:input});
        }
    }


    onClose= ()=>{
        const {close} = this.props;
        this.setState({
            name:'',
            type:''
        })
        close();
    }

    setName = (e) => {
        e.preventDefault();
        const {value} = e.target;
        this.setState({name:value, generic_name: value})
    }

    setGenericName = (e) => {
      e.preventDefault();
      const {value} = e.target;
      this.setState({generic_name: value})
    };

    setTypeValue = (e) => {
        e.preventDefault();
        const {value} = e.target;
        this.setState({type:value})
    }

    getStringFormat = (str) => {
        return str ? `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}` : "";
    };

    getOptions = (items, category) => {
        const {getStringFormat} = this;

        return items.map((item) => {
            const {name, defaultUnit, id} = item || {};

            return (
                <Option key={`${category}:${defaultUnit}:${name}`} value={name} title={name}>{getStringFormat(name)}</Option>
            );
        });
    };

    getFormulationOptions = () => {
        const {medication_details: {medicine_type = {} } = {}} = this.props;
        const {getOptions, getStringFormat} = this;

        return Object.keys(medicine_type).map(id => {
           const {items, name} = medicine_type[id] || {};

           return (
             <OptGroup label={getStringFormat(name)}>
                   {getOptions(items, id)}
             </OptGroup>
           );
        });
    };

    

    handleSelect = (value) => {
        this.setState({type:value});
    }


    getDrawerFields = () => {
        const {auth: {authenticated_category} = {}} = this.props;

        const {name='', generic_name = ''}=this.state;
        const {handleSelect ,getFormulationOptions } = this;
        return (
            <div className="form-block-ap ">
              <div className="form-headings flex align-center justify-start">
              {this.formatMessage(messages.medicineName)}
                <div className="star-red">*</div>
              </div>
      
              <Input
                className={"form-inputs-ap"}
                placeholder={"Add Medicine Name"}
                type="text"
                onChange={this.setName}
                required={true}
                value={name}
              />

                {authenticated_category === USER_CATEGORY.ADMIN && (
                    <Fragment>
                        <div className="form-headings flex align-center justify-start">
                            {this.formatMessage(messages.genericName)}
                        </div>

                        <Input
                            className={"form-inputs-ap"}
                            placeholder={"Add Generic Name"}
                            type="text"
                            onChange={this.setGenericName}
                            // required={true}
                            value={generic_name}
                        />
                    </Fragment>
                    )}

                <div className="form-headings flex align-center justify-start">
                    {this.formatMessage(messages.formulation)}
                    <div className="star-red">*</div>
                </div>

                <Select
                            className="full-width"
                            placeholder=""
                            showSearch
                            autoComplete="off"
                            optionFilterProp="children"
                            suffixIcon={null}
                            // filterOption={(input, option) =>
                            //     option.props.children
                            //         .toLowerCase()
                            //         .indexOf(input.toLowerCase()) >= 0
                            // }
                            getPopupContainer={this.getParentNode}
                            onSelect={handleSelect}
                        >
                            {getFormulationOptions()}
                </Select>

            </div>
        )   
    }

    handleSubmit = async() => {
        try{
            const {addNewMedicine,addAdminMedicine, setNewMedicineId, auth: {authenticated_category} = {}} = this.props;
            const {name='',type='', generic_name = ""}=this.state;

            const addMedicine = authenticated_category === USER_CATEGORY.ADMIN ? addAdminMedicine : addNewMedicine;

            if(name === '' || type ===''){
                message.error(this.formatMessage(messages.fillFieldsError));
                return;
            }

            this.setState({submitting:true});
            const response = await addMedicine({name, type, generic_name});
            const {status,statusCode,payload : {data={},message:respMsg=''}={}} = response || {};
            if(status){
                const {medicines = {}} = data || {};
                const medId = Object.keys(medicines)[0];
                const {basic_info:{id=null}={}} = medicines[medId] || {};
                if(setNewMedicineId) {
                    setNewMedicineId(id);
                }
                message.success(respMsg);
                this.onClose();
            }else{
                message.warn(respMsg);
            }
            this.setState({submitting:false});
        }catch(error){
            console.log("Errorrrrrr",error);
            this.setState({submitting:false});
            message.warn(error);
        }

    }

    render (){
        const {visible = false}=this.props;
        const {submitting =false} = this.state;
        return (
            <div>
                <Drawer
                visible={visible}
                width={400}
                closable={true}
                onClose={this.onClose}
                headerStyle={{
                  position: "sticky",
                  zIndex: "9999",
                  top: "0px"
                }}
                
                maskClosable={false}
                destroyOnClose={true}
                className="ant-drawer"
                title={this.formatMessage(messages.addNewMedicine)}
                >

                    {this.getDrawerFields()}
                    <Footer
                        onSubmit={this.handleSubmit}
                        onClose={this.onClose}
                        submitText={this.formatMessage(messages.submit)}
                        submitButtonProps={{}}
                        cancelComponent={null}
                        submitting={submitting}
                    />
                    
                </Drawer>
            </div>
        )
    }
}

export default injectIntl(NewMedicineDrawer);