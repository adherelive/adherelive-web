import React , { Component , Fragment } from "react";
import { injectIntl } from "react-intl";
import { Button, Drawer } from "antd";
import messages from "./messages";
import SingleDayComponent from "../singleDayComponent/index";
import message from "antd/es/message";
import DietFieldsForm from "./form";
import Form from "antd/es/form";
import Footer from "../footer";

class AddDiet extends Component{
    constructor(props){
        super(props)
        this.state={
            completeData : {},
            total_calories:0,
            submitting:false
        }

        this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
          DietFieldsForm
        );
    
    }


    async componentDidMount(){
      await this.getAllPortions();
    }


    getAllPortions = async() => {
      try{

        const { getPortions } = this.props;
        const response = await getPortions();
        const { status, payload: { message : resp_msg = ''  } = {}  } =
            response || {};
            
        if(!status){
            message.error(resp_msg);
        }


      }catch(error){
        message.error(error);
      }
    } 

  
    formatMessage = data => this.props.intl.formatMessage(data);

    setFinalDayData = (data) => {
        this.setState({ completeData:data });
    }

    onClose = () => {
        const { close } = this.props;
        const {
          props: {
            form: { resetFields },
          },
        } = this.formRef;
        
        this.setState({
          completeData : {},
          total_calories:0
        });
        
        resetFields();
        close();
    }

 

    setNewTotalCal = (newTotalCal) => {
      this.setState({total_calories:newTotalCal});
    }

    setFormRef = (formRef) => {
      this.formRef = formRef;
      if (formRef) {
        this.setState({ formRef: true });
      }
    };

    validateDietData = () => {

      const { completeData : diet_food_groups = {}  } = this.state;

      if(Object.keys(diet_food_groups).length === 0 ){
        message.warn(this.formatMessage(messages.addDietDetails));
        return false;
      }

      let allEmpty = true;

      for(let each in diet_food_groups){
        const eachArr = diet_food_groups[each] || [];

        if(eachArr.length > 0 ){
          allEmpty = false;
          break;
        }
      }

      if(allEmpty){
        message.warn(this.formatMessage(messages.addDietDetails));
        return false;
      }

      return true;


    }

    handleSubmit = async() => {

      const {
        props: {
          form: { validateFields },
        },
      } = this.formRef;

      const validated = this.validateDietData();

      if(!validated){
        return;
      }


      const {addDiet , carePlanId : care_plan_id = null } = this.props;
      const {completeData : diet_food_groups = {} ,total_calories = 0 } = this.state;


      validateFields(async (err, values) => {

        if (!err ) {

          let {
            name,
            start_date:moment_start_date,
            end_date:moment_end_date,
            what_not_to_do,
            repeat_days
          } = values;

          if(name.length === 0 ||
            repeat_days.length === 0 ||
             !care_plan_id 
            ){
           message.warn(this.formatMessage(messages.fillAlldetails));
           return false;
         }
      
          const start_date =moment_start_date.toISOString();
          const end_date = moment_end_date ? moment_end_date.toISOString() : null;

          const data = {
            name,
            repeat_days,
            diet_food_groups,
            care_plan_id,
            total_calories,
            start_date ,
            end_date,
            not_to_do:what_not_to_do
          };

          this.setState({submitting:true});
          const response = await addDiet(data);

          const {status,statusCode,payload:{data:resp_data={},message:resp_msg=''} ={} } = response || {};
         
          if(status){
            message.success(resp_msg);
            this.onClose();
          }else{
            message.warn(resp_msg);
          }

          this.setState({submitting:false});

        }else{

          let allErrors = '';
          for(let each in err){
            const {errors = [] } = err[each] || {};
            for(let error of errors ){
              const {message = ''} = error;
              allErrors = allErrors + message+".";
            }
          }
          message.warn(allErrors);
          this.setState({submitting:false});
          return false;

        }

      });


    }

    getDietComponent = () => {

      const {setFinalDayData , setNewTotalCal } = this;
      const { completeData = {} , total_calories=0 } = this.state;

      // console.log("82374723648273648723647832 ==========>>>>>> ",{total_calories});
      
      return (
          <div>
             <div className="fs16 fw700 wp100  mt20 flex justify-space-between" >
                <div className=" " >{this.formatMessage(messages.diet_text)}</div>
                <div className=" tar">{`${total_calories >= 0 ? total_calories : '--'  }${" "}Cal`}</div>
              </div>
            
            <SingleDayComponent 
                setFinalDayData={setFinalDayData}
                setNewTotalCal={setNewTotalCal}
                completeData = {completeData}
                total_calories={total_calories}
                {...this.props}
            />
          </div>
          )
    }
    
    render(){
      // console.log("82374723648273648723647832",{state:this.state});

      const { 
        formatMessage ,
        onClose , 
        setFormRef, 
        getDietComponent,
        FormWrapper } = this;
      const { visible = false  } = this.props;
      const {submitting = false }=this.state;

       
    return (
        <Fragment>
          <Drawer
            title={formatMessage(messages.addDiet)}
            placement="right"
            maskClosable={false}
            headerStyle={{
              position: "sticky",
              zIndex: "9999",
              top: "0px"
            }}
            destroyOnClose={true}
            onClose={onClose}
            visible={visible} 
            width={`30%`}
          >
              
              <FormWrapper
                 wrappedComponentRef={setFormRef}
                  {...this.props}
                  getDietComponent={getDietComponent}
                />
                
                <Footer
                  onSubmit={this.handleSubmit}
                  onClose={onClose}
                  submitText={formatMessage(messages.submit_text)}
                  submitButtonProps={{}}
                  cancelComponent={null}
                  submitting={submitting}
                />

          </Drawer>
        </Fragment>
      );
       
    }
} 


export default injectIntl(AddDiet);
