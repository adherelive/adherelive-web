import React from "react";

import Spin from "antd/es/spin";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined spin style={{ fontSize: 24 }} />;

export const PageLoading = (props) => {
  return (
    <div className="wp100 hp100 flex justify-center align-center">
      <Spin indicator={antIcon} />
    </div>
  );
};
