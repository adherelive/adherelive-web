import React, { useState } from "react";
import { Modal, Button } from "antd";

function CreateSubscriptionWarn({ isModalVisible, handleOk, handleCancel }) {
  return (
    <React.Fragment>
      <Modal
        title="Subscription Info"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Created subscription can't be edited</p>
      </Modal>
    </React.Fragment>
  );
}

export default CreateSubscriptionWarn;
