import React, {Component, Fragment} from "react";
import {injectIntl} from "react-intl";
import {Table, Icon} from "antd";
import generateRow from "./dataRow";
import getColumn from "./header";
import messages from "./messages";

class TemplateTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  
  componentDidMount() {
    const {} = this.props;
  }
  
  onRowClick = (key) => (event) => {
    event.preventDefault();
  };
  
  onRow = (record, rowIndex) => {
    const {onRowClick} = this;
    const {key} = record;
    return {
      onClick: onRowClick(key),
    };
  };
  
  onSelectChange = (selectedRowKeys) => {
    this.setState({selectedRows: selectedRowKeys});
  };
  
  getLoadingComponent = () => {
    const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>;
    return {
      indicator: antIcon,
    };
  };
  
  getDataSource = () => {
    const {onRowClick} = this;
    
    const {
      authenticated_category = "",
      authenticated_user = "",
      care_plan_template_ids = [],
      care_plan_templates = {},
      createCareplanTemplate,
      doctors = {},
      getAllTemplatesForDoctor,
      medicines = {},
      openCreateCareplanTemplateDrawer,
      template_appointments = {},
      template_medications = {},
      template_vitals = {},
      vital_templates = {},
      repeat_intervals = {},
      duplicateCareplanTemplate,
      handleOpenEditDrawer,
    } = this.props;
    
    console.log("19873781293 care_plan_template_ids", care_plan_template_ids);
    
    return care_plan_template_ids.map((id) => {
      return generateRow({
        id,
        authenticated_category,
        authenticated_user,
        care_plan_template_ids,
        care_plan_templates,
        createCareplanTemplate,
        doctors,
        getAllTemplatesForDoctor,
        medicines,
        openCreateCareplanTemplateDrawer,
        template_appointments,
        template_medications,
        template_vitals,
        vital_templates,
        repeat_intervals,
        duplicateCareplanTemplate,
        handleOpenEditDrawer,
      });
    });
  };
  
  render() {
    const {getLoadingComponent, getDataSource} = this;
    const {loading, intl: {formatMessage} = {}} = this.props;
    
    console.log("12837919827 loading", {loading});
    
    const templateLocale = {
      emptyText: formatMessage(messages.emptyTemplateTable),
    };
    
    return (
      <Fragment>
        <Table
          className="template-table"
          rowClassName={() => "pointer"}
          loading={loading === true ? getLoadingComponent() : false}
          columns={getColumn({
            formatMessage,
            className: "pointer",
          })}
          dataSource={getDataSource()}
          scroll={{x: "100%"}}
          pagination={{
            position: "top",
            pageSize: 10,
          }}
          locale={templateLocale}
        />
      </Fragment>
    );
  }
}

export default injectIntl(TemplateTable);
