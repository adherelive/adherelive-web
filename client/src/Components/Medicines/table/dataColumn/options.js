import React from "react";
import message from "antd/es/message";
import Icon from "antd/es/icon";
import Tooltip from "antd/es/tooltip";
import messages from "../messages";
import confirm from "antd/es/modal/confirm";
import moment from "moment";
import { DeleteOutlined } from "@ant-design/icons";

const ALL_TABS = {
  PUBLIC: "1",
  CREATOR: "2",
};

export default (props) => {
  const {
    medicineData = {},
    currentPage = 1,
    formatMessage,
    mapMedicineToPublic,
    getPublicMedicines,
    currentTab,
    changeTab,
  } = props || {};
  const {
    basic_info: { name = "", id: medicine_id = null, public_medicine = false },
  } = medicineData || {};

  const handleMakeMedicinePublic = (e) => {
    e.preventDefault();

    confirm({
      title: `${formatMessage(
        messages.publicMessage
      )} '${name}' ${formatMessage(messages.public)} ? `,
      content: (
        <div className="pt16">
          <p className="red">
            <span className="fw600">{"Note"}</span>
            {` :${formatMessage(messages.availableWarn)}`}
          </p>
        </div>
      ),
      // modalOptions={{ dismissible: false }}
      onOk: async () => {
        const { changeLoading } = props;
        try {
          const offset = currentPage - 1;
          const {
            makeMedicinePublic,
            getPrivateMedicines,
            searchText = "",
          } = props;
          changeLoading(true);
          const response = await makeMedicinePublic({ medicine_id, offset });
          const {
            payload: {
              data: { medicines = {} } = {},
              message: resp_message,
            } = {},
            status,
          } = response;
          let medicine = {};
          const medicineKey = Object.keys(medicines)[0];
          const { basic_info = {} } = Object.values(medicines)[0];

          const medicineValue = {
            basic_info,
            ["updated_at"]: moment().toISOString(),
          };

          medicine[medicineKey] = medicineValue;
          if (status) {
            let resp = {};
            if (searchText === "") {
              resp = await getPrivateMedicines({ offset });
            } else {
              resp = await getPrivateMedicines({ value: searchText, offset });
            }
            mapMedicineToPublic(medicine);

            // change tab back to public
            changeTab(ALL_TABS.PUBLIC);
            message.success(resp_message);
            changeLoading(false);
            console.log("382742849718654217836912837", { medicine });
          }
        } catch (error) {
          changeLoading(false);
          console.log("error", error);
        }
      },
      onCancel() {},
      maskClosable: false,
      keyboard: false,
    });
  };

  const warnNote = () => {
    return (
      <div className="pt16  ">
        <p className="red">
          <span className="fw600">{"Note"}</span>
          {` :${formatMessage(messages.irreversibleMessage)}`}
        </p>
      </div>
    );
  };

  const handleDelete = (e) => {
    e.preventDefault();

    confirm({
      title: `${formatMessage(messages.sureMessage)} '${name}' ? `,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        try {
          const { deleteMedicine, getPrivateMedicines } = props;
          const { currentPage = 1 } = props;
          const offset = currentPage - 1;
          const response = await deleteMedicine({ medicine_id, offset });
          console.log("98327548237469238048230490", { response });
          const { status, payload: { message: resp_msg = "" } = {} } = response;
          if (status) {
            message.success(resp_msg);
            // if(currentTab === ALL_TABS.PUBLIC){
            //   const resp = await getPublicMedicines({offset});
            // }else{
            //   const resp = await getPrivateMedicines({offset});
            // }
          } else {
            message.error(resp_msg);
          }
        } catch (error) {
          console.log("Error ===>", { error });
        }
      },
      onCancel() {},
      maskClosable: false,
      keyboard: false,
    });
  };

  return (
    <div className="wp100 flex justify-end align-center">
      <Tooltip
        title={
          public_medicine
            ? formatMessage(messages.public)
            : formatMessage(messages.makePublic)
        }
      >
        <Icon
          className="pointer align-self-end mr20 fs20 align-self-end"
          onClick={public_medicine ? "" : handleMakeMedicinePublic}
          type="check-circle"
          theme="twoTone"
          twoToneColor={public_medicine ? "#52c41a" : "pink"}
        />
      </Tooltip>
      <Tooltip className=" " title={formatMessage(messages.delete)}>
        <DeleteOutlined
          className={"pointer align-self-end mr20 fs20 align-self-end"}
          onClick={handleDelete}
          // style={{ fontSize: "18px" }}
        />
      </Tooltip>
    </div>
  );
};
