import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Button, Drawer } from "antd";
import messages from "./messages";
import SingleDayComponent from "../singleDayComponent/index";
import message from "antd/es/message";
import DietFieldsForm from "./form";
import Form from "antd/es/form";
import Footer from "../footer";
import Loading from "../../Common/Loading";
import confirm from "antd/es/modal/confirm";

class EditDiet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completeData: {},
      total_calories: 0,
      submitting: false,
      initialFormData: {},
      loading: false,
      timings: {},
      deletedFoodGroupIds: [],
      canOnlyView: false,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      DietFieldsForm
    );
  }

  async componentDidMount() {
    const { dietData = {}, editTemplateDiet = null } = this.props;

    await this.getAllPortions();

    if (editTemplateDiet !== null) {
      const { total_calories, details: { diet_food_groups = {} } = {} } =
        dietData || {};

      this.setState({
        completeData: { ...diet_food_groups },
        initialFormData: {},
        total_calories,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    const {
      isDietVisible = false,
      visible = false,
      dietData = {},
    } = this.props;
    const {
      isDietVisible: prev_isDietVisible = false,
      visible: prev_visible = false,
    } = prevProps;
    if (visible && visible !== prev_visible) {
      await this.setPatientPreferenceTimings();
      await this.getDietDetails();
    }

    if (isDietVisible && isDietVisible !== prev_isDietVisible) {
      const { total_calories, details: { diet_food_groups = {} } = {} } =
        dietData || {};

      this.setState({
        completeData: { ...diet_food_groups },
        initialFormData: {},
        total_calories,
      });
    }
  }

  setPatientPreferenceTimings = async () => {
    try {
      this.setState({ loading: true });
      const {
        getPatientPreferenceDietDetails,
        payload: { patient_id = null } = {},
      } = this.props;
      const response = await getPatientPreferenceDietDetails(patient_id);
      const {
        status,
        payload: { data: resp_data = {}, message: resp_msg = "" } = {},
      } = response;
      if (!status) {
        message.error(resp_msg);
      } else {
        const { timings = {} } = resp_data || {};
        this.setState({ timings });
      }

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      console.log("error => ", error);
    }
  };

  setDeletedFoodGroupId = (id) => {
    const { deletedFoodGroupIds = [] } = this.state;
    deletedFoodGroupIds.push(id);
    this.setState({ deletedFoodGroupIds });
  };

  getDietDetails = async () => {
    try {
      const {
        getSingleDietData,
        payload = {},
        updateDietTotalCalories,
      } = this.props;
      const {
        care_plan_id,
        diet_id = null,
        canViewDetails = false,
      } = payload || {};

      this.setState({ loading: true });

      const response = await getSingleDietData(diet_id);
      const { status, payload: { data = {}, message: resp_msg = "" } = {} } =
        response || {};

      if (!status) {
        message.warn(resp_msg);
      } else {
        const {
          diets = {},
          diet_food_groups = {},
          food_groups_total_calories = 0,
        } = data || {};

        const {
          basic_info: {
            name = "",
            total_calories = "",
            start_date = "",
            end_date = "",
          } = {},
          details: { not_to_do = "" } = {},
          expired_on = null,
        } = diets[diet_id] || {};

        if (total_calories !== food_groups_total_calories) {
          const updateCalResponse = await updateDietTotalCalories({
            total_calories: food_groups_total_calories,
            diet_id,
          });

          const {
            status: updateCalStatus,
            payload: { message: updateCal_resp_msg = "" } = {},
          } = updateCalResponse || {};
          if (!updateCalStatus) {
            message.warn(updateCal_resp_msg);
          }
        }

        const initialFormData = {
          name,
          start_date,
          end_date,
          not_to_do,
        };

        this.setState({
          completeData: { ...diet_food_groups },
          initialFormData,
          care_plan_id,
          total_calories: food_groups_total_calories,
        });

        if (expired_on || canViewDetails) {
          this.setState({ canOnlyView: true });
        }
      }

      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
      console.log("error ===>", { error });
    }
  };

  getAllPortions = async () => {
    try {
      const { getPortions } = this.props;
      const response = await getPortions();
      const { status, payload: { message: resp_msg = "" } = {} } =
        response || {};

      if (!status) {
        message.error(resp_msg);
      }
    } catch (error) {
      message.error(error);
    }
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  setFinalDayData = (data) => {
    this.setState({ completeData: data });
  };

  onClose = () => {
    const { close } = this.props;
    const {
      props: {
        form: { resetFields },
      },
    } = this.formRef;

    this.setState({
      completeData: {},
      total_calories: 0,
      submitting: false,
      initialFormData: {},
      loading: false,
      timings: {},
      deletedFoodGroupIds: [],
      canOnlyView: false,
    });

    resetFields();
    close();
  };

  setNewTotalCal = (newTotalCal) => {
    this.setState({ total_calories: newTotalCal });
  };

  setFormRef = (formRef) => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  validateDietData = () => {
    const { completeData: diet_food_groups = {} } = this.state;

    if (Object.keys(diet_food_groups).length === 0) {
      message.warn(this.formatMessage(messages.addDietDetails));
      return false;
    }

    let allEmpty = true;

    for (let each in diet_food_groups) {
      const eachArr = diet_food_groups[each] || [];

      if (eachArr.length > 0) {
        allEmpty = false;
        break;
      }
    }

    if (allEmpty) {
      message.warn(this.formatMessage(messages.addDietDetails));
      return false;
    }

    return true;
  };

  handleSubmit = async () => {
    const {
      props: {
        form: { validateFields },
      },
    } = this.formRef;

    const {
      updateDiet,
      carePlanId: care_plan_id = null,
      payload,
      addTemplateDiet = null,
      editTemplateDiet = null,
    } = this.props;
    const {
      completeData: diet_food_groups = {},
      total_calories = 0,
      deletedFoodGroupIds = [],
    } = this.state;
    const { diet_id = null } = payload || {};
    const validated = this.validateDietData();

    if (!validated) {
      return;
    }

    validateFields(async (err, values) => {
      if (!err) {
        let {
          name,
          start_date: moment_start_date,
          end_date: moment_end_date,
          what_not_to_do,
          repeat_days,
        } = values;

        if (
          name.length === 0 ||
          repeat_days.length === 0 ||
          (addTemplateDiet === null &&
            editTemplateDiet === null &&
            !care_plan_id)
        ) {
          message.warn(this.formatMessage(messages.fillAlldetails));
          return false;
        }

        const start_date = moment_start_date.toISOString();
        const end_date = moment_end_date ? moment_end_date.toISOString() : null;

        const data = {
          name,
          repeat_days,
          diet_food_groups,
          care_plan_id,
          total_calories,
          start_date,
          end_date,
          not_to_do: what_not_to_do,
          delete_food_group_ids: deletedFoodGroupIds,
        };

        this.setState({ submitting: true });

        if (addTemplateDiet === null && editTemplateDiet === null) {
          // normal edit diet
          const response = await updateDiet(data, diet_id);
          const {
            status,
            statusCode,
            payload: { data: resp_data = {}, message: resp_msg = "" } = {},
          } = response || {};
          if (status) {
            message.success(resp_msg);
            this.onClose();
          } else {
            message.warn(resp_msg);
          }

          this.setState({ submitting: false });
        } else {
          // using template

          if (addTemplateDiet) {
            addTemplateDiet(data);
          } else if (editTemplateDiet) {
            editTemplateDiet(data);
          }
        }

        this.setState({ submitting: false });
      } else {
        let allErrors = "";
        for (let each in err) {
          const { errors = [] } = err[each] || {};
          for (let error of errors) {
            const { message = "" } = error;
            allErrors = allErrors + message + ".";
          }
        }
        message.warn(allErrors);
        this.setState({ submitting: false });
        return false;
      }
    });
  };

  getDietComponent = () => {
    const { setFinalDayData, setNewTotalCal, setDeletedFoodGroupId } = this;
    const {
      completeData = {},
      total_calories = 0,
      timings = {},
      canOnlyView = false,
    } = this.state;

    return (
      <div>
        <div className="fs16 fw700 wp100  mt20 flex justify-space-between">
          <div className=" ">{this.formatMessage(messages.diet_text)}</div>
          <div className=" tar">{`${
            total_calories >= 0 ? total_calories : "--"
          }${" "}Cal`}</div>
        </div>

        <SingleDayComponent
          setFinalDayData={setFinalDayData}
          setNewTotalCal={setNewTotalCal}
          setDeletedFoodGroupId={setDeletedFoodGroupId}
          completeData={completeData}
          total_calories={total_calories}
          timings={timings}
          canOnlyView={canOnlyView}
          {...this.props}
        />
      </div>
    );
  };

  handleDelete = () => {
    const { warnNote } = this;
    const {
      payload: { diet_id = null, patient_id } = {},
      getPatientCarePlanDetails,
    } = this.props || {};

    confirm({
      title: `${this.formatMessage(messages.warnNote)}`,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        try {
          const { deleteDiet } = this.props;
          const response = (await deleteDiet(diet_id)) || {};
          const {
            status,
            statusCode,
            payload: { data: resp_data = {}, message: resp_msg = "" } = {},
          } = response || {};
          if (status) {
            message.success(resp_msg);
            await getPatientCarePlanDetails(patient_id);
            this.onClose();
          } else {
            message.warn(resp_msg);
          }
        } catch (err) {
          console.log("err ", err);
          message.warn(this.formatMessage(messages.somethingWentWrong));
        }
      },
      onCancel() {},
    });
  };

  warnNote = () => {
    return (
      <div className="pt16">
        <p>
          <span className="fw600">{"Note"}</span>
          {` :${this.formatMessage(messages.irreversibleWarn)} `}
        </p>
      </div>
    );
  };

  getDeleteButton = () => {
    const { handleDelete } = this;
    const { loading, deleteDietOfTemplate, hideDiet, addTemplateDiet } =
      this.props;

    if (addTemplateDiet) {
      return (
        <Button onClick={hideDiet} style={{ marginRight: 8 }}>
          Cancel
        </Button>
      );
    }

    return (
      <Button
        type={"danger"}
        ghost
        className="fs14 no-border style-delete"
        onClick={deleteDietOfTemplate ? deleteDietOfTemplate : handleDelete}
        loading={loading}
      >
        <div className="flex align-center delete-text">
          <div className="ml4">Delete</div>
        </div>
      </Button>
    );
  };

  render() {
    const {
      formatMessage,
      onClose,
      setFormRef,
      getDietComponent,
      getDeleteButton,
      FormWrapper,
    } = this;
    const { visible = false } = this.props;
    const {
      dietVisible = false,
      hideDiet = null,
      addTemplateDiet = null,
      editTemplateDiet = null,
    } = this.props;
    const {
      submitting = false,
      initialFormData = {},
      loading = false,
      canOnlyView = false,
    } = this.state;

    return (
      <Fragment>
        <Drawer
          title={
            canOnlyView
              ? formatMessage(messages.viewDetails)
              : editTemplateDiet === null && addTemplateDiet === null
              ? formatMessage(messages.editDiet)
              : addTemplateDiet
              ? formatMessage(messages.addDietText)
              : formatMessage(messages.editDiet)
          }
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          destroyOnClose={true}
          onClose={addTemplateDiet || editTemplateDiet ? hideDiet : onClose}
          visible={addTemplateDiet || editTemplateDiet ? dietVisible : visible}
          width={`30%`}
        >
          {loading ? (
            <div className="hp100 wp100 flex direction-column align-center justify-center z1">
              <Loading className={"wp100"} />
            </div>
          ) : (
            <div className="wp100">
              <FormWrapper
                wrappedComponentRef={setFormRef}
                {...this.props}
                getDietComponent={getDietComponent}
                initialFormData={initialFormData}
                canOnlyView={canOnlyView}
              />

              {!canOnlyView && (
                <Footer
                  className="flex justify-space-between"
                  onSubmit={this.handleSubmit}
                  onClose={onClose}
                  submitText={formatMessage(messages.submit_text)}
                  submitButtonProps={{}}
                  cancelComponent={getDeleteButton()}
                  submitting={submitting}
                />
              )}
            </div>
          )}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(EditDiet);
