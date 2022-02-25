import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Input from "antd/es/input";
import messages from "./messages";
import { VIDEO_TYPES } from "../../../constant";
import message from "antd/es/message";
import CameraOutlined from "@ant-design/icons/CameraOutlined";
import Upload from "antd/es/upload";

const { Item: FormItem } = Form;
const { Option, OptGroup } = Select;

const NAME = "name";
const REPETITION_VALUE = "repetition_value";
const REPETITION_ID = "repetition_id";
const CALORIFIC_VALUE = "calorific_value";
const VIDEO_CONTENT = "video_content";

const FIELDS = [
  NAME,
  REPETITION_VALUE,
  REPETITION_ID,
  CALORIFIC_VALUE,
  VIDEO_CONTENT,
];

class AddExerciseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { exercise_name = "" } = this.props;
    if (exercise_name.length) {
      const { form: { setFieldsValue } = {} } = this.props;

      setFieldsValue({ [NAME]: exercise_name });
    }
  }

  getRepetitionOptions = () => {
    const { repetitions = {} } = this.props;

    return Object.values(repetitions).map((each, index) => {
      const { id = null, type = "" } = each || {};
      return (
        <Option key={`${index}-${type}`} value={id}>
          {type}
        </Option>
      );
    });
  };

  handleRepetitionSelect = (value) => {
    const { form: { setFieldsValue } = {} } = this.props;

    setFieldsValue({ [REPETITION_ID]: value });
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  handleUpload = async ({ file }) => {
    const {
      uploadExerciseContent,
      form: { setFieldsValue } = {},
      setUploadedVideoUrl,
      setVideoContentType,
    } = this.props;
    const data = new FormData();
    data.set("files", file);
    try {
      this.setState({ loading: true });
      const response = await uploadExerciseContent(data);
      const { status, payload: { data: { documents = [] } = {} } = {} } =
        response || {};

      if (status === true) {
        if (documents.length) {
          const { name = "", file: resp_file = "" } = documents[0] || {};
          setVideoContentType(VIDEO_TYPES.UPLOAD);
          setFieldsValue({ [VIDEO_CONTENT]: name });
          setUploadedVideoUrl(resp_file);
        }
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  onChange = (e) => {
    const {
      form: { setFieldsValue } = {},
      setUploadedVideoUrl,
      setVideoContentType,
    } = this.props;
    setVideoContentType(VIDEO_TYPES.URL);
    setUploadedVideoUrl("");
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError },
    } = this.props;

    const { formatMessage, handleUpload } = this;

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    return (
      <Form className="fw700 wp100 pb30 Form">
        {/* food item name */}
        <FormItem
          label={formatMessage(messages.exercise_name)}
          className="flex-grow-1 mt-4"
        >
          {getFieldDecorator(NAME, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.name_required_error),
              },
            ],
          })(<Input type="string" max="500" />)}
        </FormItem>

        <div className="flex align-center justify-space-between wp100">
          <div className="flex  wp40 ">
            {/* portion size */}
            <FormItem
              label={formatMessage(messages.repetition_value)}
              className="mt-4 flex-grow-1"
            >
              {getFieldDecorator(REPETITION_VALUE, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      messages.repetition_value_required_error
                    ),
                  },
                ],
              })(<Input type="number" min="1" />)}
            </FormItem>
          </div>
          <div className="flex  wp40 ">
            {/* portion type */}
            <FormItem
              label={formatMessage(messages.repetition_type)}
              className="mt-4 flex-grow-1"
            >
              {getFieldDecorator(REPETITION_ID, {
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      messages.repetition_id_required_error
                    ),
                  },
                ],
              })(
                <Select
                  className="drawer-select"
                  onSelect={this.handleRepetitionSelect}
                >
                  {this.getRepetitionOptions()}
                </Select>
              )}
            </FormItem>
          </div>
        </div>

        {/* calories */}
        <FormItem
          label={formatMessage(messages.calories)}
          className="flex-grow-1 mt-4 "
        >
          {getFieldDecorator(
            CALORIFIC_VALUE,
            {}
          )(<Input type="number" className="mb20" />)}
        </FormItem>

        <FormItem
          label={formatMessage(messages.videoUrl)}
          className="flex-grow-1 mt-4 "
        >
          {getFieldDecorator(
            VIDEO_CONTENT,
            {}
          )(
            <Input
              type="string"
              className="mb20 "
              onChange={this.onChange}
              suffix={
                <div className="form-button tab-color pointer">
                  <Upload
                    showUploadList={false}
                    multiple={false}
                    accept=".mp4"
                    className="flex align-center chat-upload-component"
                    customRequest={handleUpload}
                  >
                    <div className="chat-upload-btn">
                      <CameraOutlined />
                    </div>
                  </Upload>
                </div>
              }
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(AddExerciseForm);
