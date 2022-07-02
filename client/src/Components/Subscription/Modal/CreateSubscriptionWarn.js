import React, { useState, Fragment } from "react";
import { Modal, Button } from "antd";

function CreateSubscriptionWarn({ isModalVisible, handleOk, handleCancel }) {
  return (
    <Fragment>
      <Modal
        title="Subscription Info"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Created subscription can't be edited</p>
      </Modal>
    </Fragment>
  );
}

export default CreateSubscriptionWarn;
