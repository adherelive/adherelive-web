import React, { Component } from "react";
import { injectIntl } from "react-intl";

import Form from "antd/es/form";
import Select from "antd/es/select";
import Input from "antd/es/input";
import messages from "./messages";
import message from "antd/es/message";
import TextArea from "antd/es/input/TextArea";
import Button from "antd/es/button";
import debounce from "lodash-es/debounce";
import { VIDEO_TYPES } from "../../../constant";
import CameraOutlined from "@ant-design/icons/CameraOutlined";
import Upload from "antd/es/upload";

const { Item: FormItem } = Form;
const { Option } = Select;

const NAME = "name"; // -----> storing exercise id
const SETS = "sets";
const REPETITION_VALUE = "repetition_value";
const REPETITION_ID = "repetition_id";
const CALORIFIC_VALUE = "calorific_value";
const VIDEO_CONTENT = "video_content";
const NOTES = "notes";

const FIELDS = [
  NAME,
  SETS,
  REPETITION_VALUE,
  REPETITION_ID,
  CALORIFIC_VALUE,
  VIDEO_CONTENT,
  NOTES,
];

class EditExerciseGroupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise_id: null,
      searchingExercise: "",
      doctor_id: null,
    };

    this.handleExerciseSearch = debounce(
      this.handleExerciseSearch.bind(this),
      200
    );
  }

  async componentDidMount() {
    this.handleExerciseSearch("");
    const {
      form: { setFieldsValue } = {},
      editExerciseGroupDetails,
      setExerciseDetailId,
      setEditable,
      setExerciseName,
      exercises,
      exercise_contents = {},
      setUploadedVideoUrl,
      setVideoContentType,
    } = this.props;

    const { sets, detail_id, exercise_id } = editExerciseGroupDetails || {};

    setExerciseDetailId(detail_id);
    const { basic_info: { name = "" } = {} } = exercises[exercise_id] || {};
    setExerciseName(name);
    this.setState({ exercise_id });
    await this.setDoctorId();
    const canEdit = this.checkIfDoctorCanEdit();
    setEditable(canEdit);

    for (let each in exercise_contents) {
      const {
        basic_info: { exercise_id: ex_id = null } = {},
        video: { content_type = null, content = "" } = {},
      } = exercise_contents[each] || {};
      if (exercise_id.toString() === ex_id.toString()) {
        setFieldsValue({ [VIDEO_CONTENT]: content });
        setUploadedVideoUrl(content);
        setVideoContentType(content_type);
        break;
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      form: { setFieldsValue, is } = {},
      exercise_detail_id = null,
      clearLatestCreatedExercise,
      visibleAddExerciseDrawer,
      searched_exercise_details = {},
      searched_exercises = {},
      setExerciseName,
    } = this.props;
    const { latest_created_exercise: { created = false } = {} } = this.props;
    const { basic_info: { exercise_id: previous_exercise_id = null } = {} } =
      searched_exercise_details[exercise_detail_id] || {};
    const { basic_info: { name = "" } = {} } =
      searched_exercises[previous_exercise_id] || {};

    const {
      exercise_detail_id: prev_exercise_detail_id = null,
      visibleAddExerciseDrawer: prev_visibleAddExerciseDrawer = false,
    } = prevProps;

    if (
      !visibleAddExerciseDrawer &&
      prev_visibleAddExerciseDrawer !== visibleAddExerciseDrawer
    ) {
      if (created) {
        // fill new created exercise's details
        await this.fillAllNewCreatedExerciseDetails();
        await clearLatestCreatedExercise();
      } else {
        setFieldsValue({ [NAME]: previous_exercise_id }); // opening new exercise drawer removes name field's val and exercise name
        setExerciseName(name);
      }
    }
  }

  fillAllNewCreatedExerciseDetails = () => {
    const {
      latest_created_exercise: {
        exercises = {},
        exercise_details = {},
        exercise_contents = {},
      } = {},
    } = this.props;
    const { setExerciseName, setEditable, setExerciseDetailId } = this.props;
    let exercise_id = null,
      detail_id = null;

    const {
      form: { setFieldsValue } = {},
      setUploadedVideoUrl,
      setVideoContentType,
    } = this.props;

    if (Object.keys(exercises).length) {
      exercise_id = Object.keys(exercises)[0];
    }

    if (Object.keys(exercise_details).length) {
      detail_id = Object.keys(exercise_details)[0];
    }

    setExerciseDetailId(detail_id);

    const {
      basic_info: { repetition_value = null, repetition_id = null } = {},
      calorific_value = null,
    } = exercise_details[detail_id] || {};

    const { basic_info: { name = "" } = {} } = exercises[exercise_id] || {};

    const intExerciseId = parseInt(exercise_id);

    setExerciseName(name);
    this.setState({ exercise_id: intExerciseId });
    const canEdit = true;
    setEditable(canEdit);

    // setFieldsValue({ [SETS]:1 });

    setFieldsValue({ [NAME]: intExerciseId });
    setFieldsValue({ [CALORIFIC_VALUE]: calorific_value });
    setFieldsValue({ [REPETITION_VALUE]: repetition_value });
    setFieldsValue({ [REPETITION_ID]: repetition_id });

    if (Object.keys(exercise_contents).length) {
      const key = Object.keys(exercise_contents)[0] || null;
      const { video: { content_type = null, content = "" } = {} } =
        exercise_contents[key] || {};

      setFieldsValue({ [VIDEO_CONTENT]: content });
      setUploadedVideoUrl(content);
      setVideoContentType(content_type);
    }
  };

  setDoctorId = () => {
    const { doctors = {}, authenticated_user } = this.props;

    for (let each in doctors) {
      const { basic_info: { user_id = null } = {} } = doctors[each];
      if (user_id.toString() === authenticated_user.toString()) {
        this.setState({ doctor_id: each });
        break;
      }
    }
  };

  checkIfDoctorCanEdit = () => {
    const { doctor_id = null } = this.state;
    const { exercise_details, exercise_detail_id, authenticated_category } =
      this.props;

    const { creator_id = null, creator_type = null } =
      exercise_details[exercise_detail_id] || {};

    let canEdit = false;

    if (
      creator_type === authenticated_category &&
      creator_id &&
      doctor_id &&
      creator_id.toString() === doctor_id.toString()
    ) {
      canEdit = true;
    } else {
      canEdit = false;
    }

    return canEdit;
  };

  getRepeatTypeOptions = () => {
    const { exercise_id: state_exercise_id = null, doctor_id = null } =
      this.state;
    const {
      searched_exercise_details,
      repetitions = {},
      authenticated_category,
      searched_exercises,
    } = this.props;
    let options = [],
      repetition_ids = [],
      canEdit = true;

    const { exercise_detail_ids = [] } =
      searched_exercises[state_exercise_id] || {};

    for (let each of exercise_detail_ids) {
      const detail = searched_exercise_details[each] || {};
      const {
        basic_info: { id: detail_id, exercise_id, repetition_id } = {},
        creator_id = null,
        creator_type = null,
      } = detail;

      if (
        creator_type === authenticated_category &&
        creator_id &&
        doctor_id &&
        creator_id.toString() === doctor_id.toString()
      ) {
        canEdit = true;
      } else {
        canEdit = false;
      }

      repetition_ids.push(repetition_id);
      const { type = "" } = repetitions[repetition_id] || {};
      options.push(
        <Option
          key={`${each}-${type}`}
          value={repetition_id}
          onClick={this.handleExistingPortionSelect({
            detail_id,
            editable: canEdit,
          })}
        >
          {type}
        </Option>
      );
    }

    for (let each in repetitions) {
      const { id = null, type = "" } = repetitions[each] || {};

      if (!repetition_ids.includes(id)) {
        canEdit = true;

        options.push(
          <Option
            key={`${each}-${type}`}
            value={id}
            onClick={this.handleDifferentPortionSelect({ editable: canEdit })}
          >
            {type}
          </Option>
        );
      }
    }

    return options;
  };

  handleExistingPortionSelect =
    ({ detail_id: value, editable }) =>
    () => {
      const {
        form: { setFieldsValue } = {},
        searched_exercise_details,
        setExerciseDetailId,
        setEditable,
      } = this.props;

      const {
        basic_info: { id: detail_id, repetition_id, repetition_value } = {},
        calorific_value = 0,
      } = searched_exercise_details[value] || {};

      setFieldsValue({ [REPETITION_ID]: repetition_id });
      setFieldsValue({ [CALORIFIC_VALUE]: calorific_value });
      setFieldsValue({ [REPETITION_VALUE]: repetition_value });
      setExerciseDetailId(detail_id);
      setEditable(editable);
    };

  handleDifferentPortionSelect =
    ({ editable }) =>
    () => {
      // non existing details for exercise

      const {
        form: { setFieldsValue } = {},
        setExerciseDetailId,
        setEditable,
      } = this.props;

      setFieldsValue({ [REPETITION_ID]: null });
      setFieldsValue({ [CALORIFIC_VALUE]: null });
      setFieldsValue({ [REPETITION_VALUE]: 1 });

      setExerciseDetailId(null);
      setEditable(editable);
    };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  handleOpenAddDrawer = async (e) => {
    const { openAddExerciseDrawer } = this.props;
    const { form: { setFieldsValue } = {} } = this.props;
    e.preventDefault();
    e.stopPropagation();
    setFieldsValue({ [NAME]: "" });
    this.setState({ searchingExercise: "" });
    openAddExerciseDrawer();
  };

  getExerciseOptions = () => {
    let options = [];
    const { searched_exercises = {} } = this.props;
    const { searchingExercise = "" } = this.state;

    for (let each in searched_exercises) {
      const exercise = searched_exercises[each] || {};
      const { basic_info: { name: exercise_name, id: exercise_id } = {} } =
        exercise || {};

      options.push(
        <Option key={`${each}-${exercise_name}`} value={exercise_id}>
          {exercise_name}
        </Option>
      );
    }

    {
      searchingExercise.length &&
        options.length === 0 &&
        options.push(
          <div
            key={"new-food-div"}
            className="flex align-center justify-center"
            className="add-new-medicine-button-div"
          >
            <Button
              type={"ghost"}
              size="small"
              key={"no-match-food"}
              className="add-new-medicine-button"
              onClick={this.handleOpenAddDrawer}
            >
              {"Add New Exercise"}
              <span className="fw800 ml10">{`"${searchingExercise}"`}</span>
            </Button>
          </div>
        );
    }

    return options;
  };

  handleExerciseSearch = async (value) => {
    try {
      console.log("86763286876832687", { value, props: this.props });
      const { searchExercise, setExerciseName } = this.props;
      const response = await searchExercise(value);
      const { status, payload: { message: resp_msg = "" } = {} } =
        response || {};

      if (!status) {
        message.error(resp_msg);
      }

      if (value.length) {
        setExerciseName(value); // being used for exercise add prefill and name for display exercise grp
      }

      this.setState({ searchingExercise: value });
    } catch (error) {
      console.log("error ==>", { error });
    }
  };

  setExerciseId = (value) => {
    const {
      searched_exercises = {},
      setExerciseName,
      searched_exercise_details = {},
      setExerciseDetailId,
      setEditable,
      form: { setFieldsValue } = {},
      authenticated_category,
      exercise_contents = {},
      setUploadedVideoUrl,
      setVideoContentType,
    } = this.props;

    const { doctor_id = null, exercise_id: prev_exercise_id = null } =
      this.state;

    const { basic_info: { name = "" } = {}, exercise_detail_ids = [] } =
      searched_exercises[value] || {};
    const first = exercise_detail_ids.length ? exercise_detail_ids[0] : null;

    setExerciseName(name);
    this.setState({ exercise_id: value });

    // --- select first rep id for the exercise selected and if is editable
    if (prev_exercise_id !== value) {
      let editable = false;

      const {
        basic_info: { exercise_id } = {},
        creator_id = null,
        creator_type = null,
      } = searched_exercise_details[first] || {};
      if (value && exercise_id && value.toString() === exercise_id.toString()) {
        if (
          creator_type === authenticated_category &&
          creator_id &&
          doctor_id &&
          creator_id.toString() === doctor_id.toString()
        ) {
          editable = true;
        }
      }

      const {
        basic_info: { id: detail_id, repetition_id, repetition_value = 1 } = {},
        calorific_value = 0,
      } = searched_exercise_details[first] || {};

      let flag = false;
      for (let each in exercise_contents) {
        const {
          basic_info: { exercise_id = null } = {},
          video: { content_type = null, content = "" } = {},
        } = exercise_contents[each] || {};
        if (value.toString() === exercise_id.toString()) {
          setFieldsValue({ [VIDEO_CONTENT]: content });
          setUploadedVideoUrl(content);
          setVideoContentType(content_type);
          flag = true;
          break;
        }
      }

      if (flag === false) {
        setFieldsValue({ [VIDEO_CONTENT]: "" });
        setUploadedVideoUrl("");
        setVideoContentType("none");
      }

      setFieldsValue({ [REPETITION_ID]: repetition_id });
      setFieldsValue({ [REPETITION_VALUE]: repetition_value });
      setFieldsValue({ [CALORIFIC_VALUE]: calorific_value });

      setExerciseDetailId(detail_id);
      setEditable(editable);
    }
  };

  onBlur = (props) => {
    const value = parseInt(props);
    const isNotANumber = isNaN(value);

    const { form: { setFieldsValue, getFieldValue } = {} } = this.props;
    if (isNotANumber) {
      setFieldsValue({ [NAME]: null });
    }
  };

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
      editExerciseGroupDetails,
      exercise_details,
      editable = false,
    } = this.props;

    const {
      sets = 1,
      detail_id,
      exercise_id: initial_exercise_id,
      notes = null,
    } = editExerciseGroupDetails || {};

    const {
      basic_info: {
        repetition_value: rep_val = null,
        repetition_id: rep_id = null,
      } = {},
      calorific_value: cal_val,
    } = exercise_details[detail_id] || {};

    const calorific_value = cal_val ? cal_val : null;
    const repetition_value = rep_val ? rep_val : null;
    const repetition_id = rep_id ? rep_id : null;

    const {
      formatMessage,
      setExerciseId,
      handleExerciseSearch,
      getExerciseOptions,
      onBlur,
      onChange,
      handleUpload,
    } = this;

    const { exercise_id = null } = this.state;

    let fieldsError = {};
    FIELDS.forEach((value) => {
      const error = isFieldTouched(value) && getFieldError(value);
      fieldsError = { ...fieldsError, [value]: error };
    });

    return (
      <Form className="fw700 wp100 pb30 Form">
        {/* exercise  */}
        <FormItem
          label={formatMessage(messages.exercise)}
          className="flex-grow-1 mt-4"
        >
          {getFieldDecorator(NAME, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.exercise_required_error),
              },
            ],
            initialValue: initial_exercise_id,
          })(
            <Select
              placeholder={this.formatMessage(messages.search_exercise)}
              onSearch={handleExerciseSearch}
              showSearch
              onBlur={onBlur}
              notFoundContent={null}
              onSelect={setExerciseId}
              optionFilterProp="children"
              filterOption={(input, option) => {
                const children = option.props.children;

                if (typeof children === "string") {
                  return (
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                } else {
                  return option;
                }
              }}
            >
              {getExerciseOptions()}
            </Select>
          )}
        </FormItem>

        <div className="flex align-center justify-space-between wp100">
          <div className="flex wp20">
            {/* serving */}

            <FormItem
              label={formatMessage(messages.sets)}
              className="flex-grow-1 mt-4 multiply"
            >
              {getFieldDecorator(SETS, {
                initialValue: sets ? sets : 1,
                rules: [
                  {
                    required: true,
                    message: formatMessage(messages.sets_required_error),
                  },
                ],
              })(<Input type="number" min="1" />)}
            </FormItem>
          </div>

          <div className="flex wp60 align-center justify-space-between">
            <div className="wp50 flex direction-column align-center justify-center">
              {/* portion size */}

              <FormItem
                label={formatMessage(messages.repetition_value)}
                className="flex-grow-1 mt-4 wp90"
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
                  initialValue: repetition_value,
                })(<Input type="number" min="1" disabled={!editable} />)}
              </FormItem>
            </div>

            <div className="wp50 flex direction-column align-center justify-center">
              {/* portion type */}

              <FormItem
                label={formatMessage(messages.repetition_type)}
                className="flex-grow-1 mt-4 wp90"
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
                  initialValue: repetition_id,
                })(
                  <Select
                    className="drawer-select"
                    disabled={!exercise_id}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.getRepeatTypeOptions()}
                  </Select>
                )}
              </FormItem>
            </div>
          </div>
        </div>

        <FormItem
          label={formatMessage(messages.calories)}
          className="flex-grow-1 mt-4 "
        >
          {getFieldDecorator(CALORIFIC_VALUE, {
            initialValue: calorific_value,
          })(<Input type="number" className="mb20" disabled={!editable} />)}
        </FormItem>

        {/* video content */}
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
              onChange={onChange}
              // disabled={!editable}
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

        {/* note */}

        <FormItem
          label={formatMessage(messages.note)}
          className="flex-grow-1 mt-4 "
        >
          {getFieldDecorator(NOTES, {
            initialValue: notes,
          })(<TextArea className="mb20" />)}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(EditExerciseGroupForm);
