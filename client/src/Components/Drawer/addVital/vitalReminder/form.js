import React, { Component, Fragment } from "react";
import { Form, Button } from "antd";
import messages from "../message";
import { hasErrors } from "../../../../Helper/validation";
import { USER_CATEGORY } from "../../../../constant";
const { Item: FormItem } = Form;

class AddvitalsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      form: { validateFields },
      // currentUser: {
      //   basicInfo: { _id, category },
      //   programId = []
      // },
      fetchMedicationStages,
      fetchProgramProducts
    } = this.props;
    const { programId } = [];
    const { _id } = "23";
    const { category } = "PATIENT";
    validateFields();

    if (category === USER_CATEGORY.PATIENT) {
      fetchProgramProducts(programId[0]);
      fetchMedicationStages(_id).then(response => {
        const { status, payload } = response;
        if (status) {
          const {
            data: { medicationStages = [], program_has_medication_stage } = {}
          } = payload;
          if (medicationStages.length > 0) {
            this.setState({
              medicationStages: medicationStages,
              program_has_medication_stage
            });
          } else {
            this.setState({
              medicationStages: [],
              program_has_medication_stage
            });
          }
        }
      });
    }
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  getFooter = () => {
    const {
      form: { getFieldsError },
      requesting
    } = this.props;
    const { formatMessage } = this;

    return (
      <div className="footer">
        <div className="flex fr h100">
          <FormItem className="m0">
            <Button
              className="ant-btn ant-btn-primary pr30 pl30 mt46"
              type="primary"
              htmlType="submit"
              loading={requesting}
              disabled={hasErrors(getFieldsError())}
            >
              {formatMessage(messages.addMedicationReminder)}
            </Button>
          </FormItem>
        </div>
      </div>
    );
  };

  render() {
    const {
      setFormulation
    } = this;

    const {
      form: { getFieldValue },
      medicines
    } = this.props;

    return (
      <Fragment>
        <Form className="event-form pb80 wp100">
        </Form>
      </Fragment>
    );
  }
}

export default AddvitalsForm;
