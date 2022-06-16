import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import message from "antd/es/message";
import isEmpty from "../../../Helper/is-empty";

function MultipleTreatmentAlert({ diagnosis_description }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!isEmpty(diagnosis_description) && diagnosis_description.length > 1) {
      setIsModalVisible(true);
    }
  }, [diagnosis_description]);

  const openModelHandler = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title="Multiple treatment info"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          You added multiple treatment in diagnosis, later on you cn add form
          patient details page
        </p>
      </Modal>
    </>
  );
}

export default MultipleTreatmentAlert;
