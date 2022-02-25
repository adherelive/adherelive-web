import React from "react";
import { Modal } from "antd";

function CreateSubscriptionWarn({ isModalVisible, handleOk, handleCancel }) {
  return (
    <>
      <Modal
        title="Subscription Info"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Created subscription can't be edited</p>
      </Modal>
    </>
  );
}

export default CreateSubscriptionWarn;
