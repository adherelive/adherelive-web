import React , {Component} from "react";
import {injectIntl} from "react-intl";
import Drawer from "antd/es/drawer";
import Input from "antd/es/input";
import Radio from "antd/es/radio";
import message from "antd/es/message";
import Footer from "../footer";
import {MEDICINE_TYPE} from "../../../constant";
import messages from "./messages";



const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class NewMedicineDrawer extends Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            type:'',
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
        this.setState({name:value})
    }

    setTypeValue = (e) => {
        e.preventDefault();
        const {value} = e.target;
        this.setState({type:value})
    }


    getDrawerFields = () => {
        const {name=''}=this.state;
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

                <div className="form-headings flex align-center justify-start">
                    {this.formatMessage(messages.formulation)}
                    <div className="star-red">*</div>
                </div>

              <RadioGroup
                            className="flex justify-content-end radio-formulation"
                            buttonStyle="solid"
                            
                            
                        >
                            <RadioButton value={MEDICINE_TYPE.SYRUP} onClick={this.setTypeValue}>{this.formatMessage(messages.syrup)}</RadioButton>
                            <RadioButton value={MEDICINE_TYPE.TABLET} onClick={this.setTypeValue}>{this.formatMessage(messages.tablet)}</RadioButton>
                            <RadioButton value={MEDICINE_TYPE.INJECTION} onClick={this.setTypeValue}>{this.formatMessage(messages.syringe)}</RadioButton>
              </RadioGroup>
            </div>
        )   
          
    }

    handleSubmit = async() => {
        try{
            const {name='',type=''}=this.state;
            if(name === '' || type ===''){
                message.error(this.formatMessage(messages.fillFieldsError));
                return;
            }

            const {addNewMedicine,setNewMedicineId} = this.props;
            const medicine_data = {name,type};
            this.setState({submitting:true});
            const response = await addNewMedicine({medicine_data});
            const {status,statusCode,payload : {data={},message:respMsg=''}={}} = response || {};
            if(status){
                const {medicines = {}} = data || {};
                const medId = Object.keys(medicines)[0];
                const {basic_info:{id=null}={}} = medicines[medId] || {};
                setNewMedicineId(id);
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
        const {visible = false , close}=this.props;
        const {submitting =false} = this.state;
        console.log("98347523462378463254879234",{state:this.state,props:this.props});
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