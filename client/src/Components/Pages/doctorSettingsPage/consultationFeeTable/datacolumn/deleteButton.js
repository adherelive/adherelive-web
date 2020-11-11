import React from "react";
import { DeleteTwoTone } from "@ant-design/icons";

export default props => {
  const {data : { basic_info:{id = null ,name ='',type='',amount=''} = {} , deleteDoctorProduct } = {}  }= props || {};

  return <div>
       <DeleteTwoTone
          className={"pointer align-self-end"}
          onClick={ () =>deleteDoctorProduct(id,name,type,amount)}
          twoToneColor="#cc0000"
          style={{ fontSize: '24px'}}
      />
  </div>;
};
