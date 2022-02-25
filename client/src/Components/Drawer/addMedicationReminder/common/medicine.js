import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Form from "antd/es/form";
import Select from "antd/es/select";
import { algoliaSearchHelper } from "../../../../Helper/algoliaSearch";
import message from "antd/es/message";
import Tooltip from "antd/es/tooltip";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import messages from "../message";

const { Item: FormItem } = Form;
const { Option } = Select;
const FIELD_NAME = "medicine_id";

class Medicine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: {},
      inputText: "",
      searching: false,
      defaultSet: false,
      medicine_id: null,
      medicine_name: "",
    };
  }

  async componentDidMount() {
    await this.handleGetFavouritesMeds();
    const defaultHits = await algoliaSearchHelper(" ");
    this.setState({ defaultHits });
  }

  componentDidUpdate(prevProps, prevState) {
    const { newMedicineId: prev_newMedicineId = null } = prevProps;
    const { newMedicineId } = this.props;
    const {
      form: { setFieldsValue, getFieldValue },
      setFormulation,
    } = this.props;
    if (prev_newMedicineId !== newMedicineId) {
      const { medicines = {} } = this.props;
      const { basic_info: { name = "", id = null } = {} } =
        medicines[newMedicineId] || {};
      const medicineId = parseInt(id);
      setFieldsValue({ [FIELD_NAME]: medicineId });
      this.setState({
        medicine_name: name,
        medicine_id: medicineId,
      });

      setFieldsValue({ [FIELD_NAME]: medicineId });
    }
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  handleGetFavouritesMeds = async () => {
    try {
      const { getFavourites } = this.props;
      const response = await getFavourites({ type: "medicine" });
      const { status, payload: { message: resp_msg = "" } = {} } = response;
      if (!status) {
        message.error(resp_msg);
      }
    } catch (error) {
      console.log("38926745237469732084 error =========>", { error });
    }
  };

  handleSearch = async (input) => {
    const hits = await algoliaSearchHelper(input);
    this.setState({ inputText: input });
    this.setState({ hits });
  };

  getHighlightedText(text, highlight) {
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight.toLowerCase()
                ? { fontWeight: "bold", backgroundColor: "orange" }
                : {}
            }
          >
            {part}
          </span>
        ))}{" "}
      </span>
    );
  }

  isMedicineFavorite = (id) => {
    const { favourite_medicine_ids = [] } = this.props;

    // return favourite_medicine_ids.includes(parseInt(id));
    return favourite_medicine_ids.includes(id.toString());
  };

  getSearchingResultOptions = ({ hits, isDefault }) => {
    let options = [];
    const { favourite_medicine_ids = [] } = this.props;
    const {
      inputText = "",
      searching = false,
      medicine_name: med_name = "",
      medicine_id: selectedMedicineId = null,
    } = this.state;
    const { getHighlightedText, isMedicineFavorite } = this;

    for (let each in hits) {
      const {
        name = "",
        medicine_id = null,
        generic_name = "",
      } = hits[each] || {};

      // default without selected

      if (isDefault ? medicine_id !== selectedMedicineId : true) {
        // check for add last selected option only for default hits case and not searching --->
        options.push(
          <Option
            key={`opt-${name}-${medicine_id}`}
            value={medicine_id}
            className="pointer flex wp100  align-center justify-space-between"
          >
            <div>
              <span className="block fs16">
                {searching ? getHighlightedText(name, inputText) : name}
              </span>
              {searching ? (
                <span className="block mt10">
                  {searching
                    ? getHighlightedText(generic_name, inputText)
                    : generic_name}
                </span>
              ) : null}
            </div>

            {searching ? (
              <Tooltip
                title={
                  isMedicineFavorite(medicine_id)
                    ? this.formatMessage(messages.unMark)
                    : this.formatMessage(messages.mark)
                }
              >
                {isMedicineFavorite(medicine_id) ? (
                  <StarFilled
                    style={{ fontSize: "20px", color: "#f9c216" }}
                    onClick={this.handleremoveFavourites(medicine_id)}
                  />
                ) : (
                  <StarOutlined
                    style={{ fontSize: "20px", color: "#f9c216" }}
                    onClick={this.handleAddFavourites(medicine_id)}
                  />
                )}
              </Tooltip>
            ) : null}
          </Option>
        );
      }
    }

    // console.log("2386456234723094",{med_id,med_name});

    if (isDefault && selectedMedicineId !== null) {
      //display selected option with other options only for default case
      options.push(
        <Option
          key={`opt-${selectedMedicineId}`}
          value={selectedMedicineId}
          className="pointer flex wp100  align-center justify-space-between"
        >
          <span>{med_name}</span>
          {searching ? (
            <Tooltip
              title={
                isMedicineFavorite(selectedMedicineId)
                  ? this.formatMessage(messages.unMark)
                  : this.formatMessage(messages.mark)
              }
            >
              {isMedicineFavorite(selectedMedicineId) ? (
                <StarFilled
                  style={{ fontSize: "20px", color: "#f9c216" }}
                  onClick={this.handleremoveFavourites(selectedMedicineId)}
                />
              ) : (
                <StarOutlined
                  style={{ fontSize: "20px", color: "#f9c216" }}
                  onClick={this.handleAddFavourites(selectedMedicineId)}
                />
              )}
            </Tooltip>
          ) : null}
        </Option>
      );
    }

    if (options.length === 0 && !isDefault) {
      // searching and no opt found
      const { inputText = "" } = this.state;
      options.push(
        <div
          key={"no-match-medicine-div"}
          className="flex align-center justify-center"
          //    onClickCapture={this.handleAddMedicineOpen}
          className="add-new-medicine-button-div"
        >
          <Button
            type={"ghost"}
            size="small"
            key={"no-match-medicine"}
            className="add-new-medicine-button"
            onClick={this.handleAddMedicineOpen}
          >
            {`${this.formatMessage(messages.addMedicine)} `}
            <span className="fw800">{` "${inputText}"`}</span>
          </Button>
        </div>
      );
    }

    return options;
  };

  handleAddMedicineOpen = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    // console.log("472384623897482394890793284",{props:this.props});
    const {
      openAddMedicineDrawer,
      setMedicineVal,
      form: { setFieldsValue } = {},
    } = this.props;
    const { inputText = "" } = this.state;
    this.setState({ medicine_id: null, medicine: "" });
    setFieldsValue({ [FIELD_NAME]: "" });
    setMedicineVal(inputText);
    openAddMedicineDrawer();
  };

  getFavouriteOptions = () => {
    const {
      favourite_medicine_ids = [],
      favourites_data,
      setFavMedicineValue,
      medicines = {},
    } = this.props;
    const { searching = false } = this.state;

    const options = [];

    const { medicine_name: med_name = "", medicine_id: med_id = null } =
      this.state;

    for (let each in favourites_data) {
      const { basic_info = {}, marked_favourites_data = {} } =
        favourites_data[each] || {};
      const { marked_favourite_type = "" } = basic_info;
      if (marked_favourite_type === "medicine") {
        const key = Object.keys(marked_favourites_data)[0] || null;

        const {
          basic_info: { name: medicine_name = "", id: medicine_id = null } = {},
        } = marked_favourites_data[key];

        if (medicine_id != med_id) {
          options.push(
            <Option
              key={`opt-${medicine_id}`}
              value={medicine_id}
              className="pointer flex wp100  align-center justify-space-between"
              // onMouseDown={this.handleOnMouseDownPreventDef}
              // onClick={this.setFavMedicineValue(medicine_id, medicine_name)}
            >
              <span>{medicine_name}</span>
              {searching ? (
                <Tooltip
                  title={
                    favourite_medicine_ids.includes(medicine_id.toString())
                      ? this.formatMessage(messages.unMark)
                      : this.formatMessage(messages.mark)
                  }
                >
                  {favourite_medicine_ids.includes(medicine_id.toString()) ? (
                    <StarFilled
                      style={{ fontSize: "20px", color: "#f9c216" }}
                      onClick={this.handleremoveFavourites(medicine_id)}
                    />
                  ) : (
                    <StarOutlined
                      style={{ fontSize: "20px", color: "#f9c216" }}
                      onClick={this.handleAddFavourites(medicine_id)}
                    />
                  )}
                </Tooltip>
              ) : null}
            </Option>
          );
        }
      }
    }

    if (med_id !== null) {
      //display selected option with favourites
      options.push(
        <Option
          key={`opt-${med_id}`}
          value={med_id}
          className="pointer flex wp100  align-center justify-space-between"
          // onMouseDown={this.handleOnMouseDownPreventDef}
          // onClick={this.setFavMedicineValue(medicine_id, medicine_name)}
        >
          <span>{med_name}</span>
          {searching ? (
            <Tooltip
              title={
                favourite_medicine_ids.includes(med_id.toString())
                  ? this.formatMessage(messages.unMark)
                  : this.formatMessage(messages.mark)
              }
            >
              {favourite_medicine_ids.includes(med_id.toString()) ? (
                <StarFilled
                  style={{ fontSize: "20px", color: "#f9c216" }}
                  onClick={this.handleremoveFavourites(med_id)}
                />
              ) : (
                <StarOutlined
                  style={{ fontSize: "20px", color: "#f9c216" }}
                  onClick={this.handleAddFavourites(med_id)}
                />
              )}
            </Tooltip>
          ) : null}
        </Option>
      );
    }

    return options;
  };

  getOptions = () => {
    const { hits = {}, inputText = "", defaultHits = {} } = this.state;
    const { favourite_medicine_ids = [] } = this.props;

    if (inputText.length > 0) {
      // searching data
      return this.getSearchingResultOptions({ hits: hits, isDefault: false });
    } else {
      if (favourite_medicine_ids.length > 0) {
        return this.getFavouriteOptions();
      } else {
        // return this.getDefaultResultOptions(defaultHits);
        return this.getSearchingResultOptions({
          hits: defaultHits,
          isDefault: true,
        });
      }
    }
  };

  // getDefaultResultOptions = (hits = []) => {
  //   for (let index = 0; index < hits.length; index++) {
  //     console.log("18237723819 hits", { hits });
  //     const { name = "", medicine_id = null, generic_name = "" } =
  //       hits[index] || {};
  //   }
  // };

  getParentNode = (t) => t.parentNode;

  onDropdownVisibleChange = (isOpen) => {
    this.setState({ searching: isOpen });
  };

  onOptionSelect = (value) => {
    const { medicines = {} } = this.props;
    const {
      form: { setFieldsValue },
    } = this.props;
    const { basic_info: { name: med_name = "" } = {} } = medicines[value] || {};
    this.setState({
      medicine_id: value,
      inputText: "",
      medicine_name: med_name,
    });
    setFieldsValue({ [FIELD_NAME]: value });
  };

  handleAddFavourites = (id) => async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const { markFavourite } = this.props;
      const data = {
        type: "medicine",
        id,
      };

      const response = await markFavourite(data);
      const { status, payload: { message: resp_msg = "" } = {} } = response;
      if (status === true) {
        message.success(resp_msg);
      } else {
        message.error(resp_msg);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  handleremoveFavourites = (id) => async (e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      const { removeFavourite } = this.props;
      const data = {
        type: "medicine",
        typeId: id,
      };

      const response = await removeFavourite(data);
      const { status, payload: { message: resp_msg = "" } = {} } = response;
      if (status === true) {
        message.success(resp_msg);
      } else {
        message.error(resp_msg);
      }
    } catch (error) {
      console.log("error", { error });
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { medicine_id = null } = this.state;
    const {
      getParentNode,
      formatMessage,
      handleSearch,
      getOptions,
      onOptionSelect,
      onDropdownVisibleChange,
    } = this;

    return (
      <FormItem label={formatMessage(messages.medicineLabel)}>
        {getFieldDecorator(
          FIELD_NAME,
          {}
        )(
          <Select
            onSearch={handleSearch}
            showSearch
            autoComplete="off"
            optionFilterProp="children"
            filterOption={(input, option) => {
              return option.props.children;
            }}
            getPopupContainer={getParentNode}
            onDropdownVisibleChange={onDropdownVisibleChange}
            onSelect={onOptionSelect}
            value={medicine_id}
          >
            {getOptions()}
          </Select>
        )}
      </FormItem>
    );
  }
}

const Field = injectIntl(Medicine);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
