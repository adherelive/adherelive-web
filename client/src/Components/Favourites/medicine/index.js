import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import Input from "antd/es/input";
import Button from "antd/es/button";
import message from "antd/es/message";
import Select from "antd/es/select";
import Tooltip from "antd/es/tooltip";
import { TagFilled, TagOutlined } from "@ant-design/icons";

const { Option } = Select;

class favouriteMedicine extends Component {
  constructor(props) {
    super(props);
  }

  setId = (e) => {
    const { value } = e.target;
    this.setState({ id: value });
  };

  componentDidMount() {
    // setMedicineValue(medId,name);
    const { markFavourite, removeFavourite, getFavourites } = this.props;
    const { favourite_medicine_ids, favourites_data } = this.props;

    this.handleGetFavourites();
  }

  getOption = (medicine_id, medicine_name) => {
    const { setMedicineValue } = this.props;
    return (
      <div
        key={medicine_id}
        className="pointer flex wp100  align-center justify-space-between"
        onClick={setMedicineValue(medicine_id, medicine_name)}
      >
        <Tooltip title={"Name"}>
          {" "}
          {/* formatMessage here */}
          <div className="fs18 fw800 black-85 medicine-selected pr10">
            <span>{medicine_name}</span>
          </div>
        </Tooltip>
        <Tooltip title="Unmark">
          <TagFilled
            style={{ fontSize: "20px", color: "#08c" }}
            onMouseDown={this.handleOnMouseDownPreventDef}
            onClick={this.handleremoveFavourites(medicine_id)}
          />
        </Tooltip>
      </div>
    );
  };

  getFavouriteOptions = () => {
    const {
      favourites_data,
      favourite_medicine_ids,
      onFavOptionSelect,
      getFavouriteSelectedMedicine,
    } = this.props;
    const options = [];

    console.log("98346753264792834657234672930 ########################", {
      L: Object.keys(favourites_data).length,
      favourites_data,
    });
    for (let each in favourites_data) {
      const { basic_info = {}, marked_favourites_data = {} } =
        favourites_data[each] || {};
      const { marked_favourite_type = "" } = basic_info;
      if (marked_favourite_type === "medicine") {
        const key = Object.keys(marked_favourites_data)[0] || null;

        // console.log("932867523847927482369704823789 ====>",
        // { props:this.props,
        //   EACH:favourites_data[each],
        //   marked_favourites_data,
        //   key,
        //   KeyDATAAA:marked_favourites_data[key]
        // })

        const {
          basic_info: { name: medicine_name = "", id: medicine_id = null } = {},
        } = marked_favourites_data[key];
        options.push(
          <li
            key={`opt-${medicine_id}`}
            value={medicine_id}
            onMouseDown={this.handleOnMouseDownPreventDef}
            // onClick={onFavOptionSelect(medicine_id)}
            onClick={this.handleGetFavouriteSelectedMedicine(
              medicine_id,
              medicine_name
            )}
          >
            {this.getOption(medicine_id, medicine_name)}
          </li>
        );
      }
    }

    return options;
  };

  handleGetFavouriteSelectedMedicine = (medicine_id, medicine_name) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { getFavouriteSelectedMedicine, onFavOptionSelect } = this.props;
    getFavouriteSelectedMedicine(medicine_id, medicine_name);
    onFavOptionSelect(medicine_id);
  };

  handleOnMouseDownPreventDef = (e) => {
    e.preventDefault();
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
      console.log("9836462746239846239", { id, response });
      const {
        status,
        statusCode,
        payload: { data: resp_data = {}, message: resp_msg = "" } = {},
      } = response;
      if (status) {
        message.success(resp_msg);
      } else {
        message.error(resp_msg);
      }
    } catch (error) {
      console.log("error", { error });
    }
  };

  handleGetFavourites = async () => {
    try {
      const { getFavourites } = this.props;
      const type = "medicine";
      const res = await getFavourites({ type: "medicine" });
      console.log("932867523847927482369704823789", { res });
    } catch (error) {
      console.log(" error ===>", error);
    }
  };

  render() {
    const { medicineIdSelected = false, searching_medicine = "" } = this.props;
    console.log("9836462746239846239 searching_medicine", {
      searching_medicine,
    });
    return (
      <div
        className={`fav-list ${
          medicineIdSelected && searching_medicine ? "mt80-I" : ""
        }`}
      >
        <ul>{this.getFavouriteOptions()}</ul>
      </div>
    );
  }
}

export default withRouter(injectIntl(favouriteMedicine));
