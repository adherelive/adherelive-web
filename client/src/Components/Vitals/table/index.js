import React, {Component} from "react";
import {injectIntl} from "react-intl";
import generateRow from "./dataRow";
import {PERMISSIONS} from "../../../constant";
import getColumn from "./header";
import Table from "antd/es/table";


class VitalTable extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {vital_ids, getPatientVitals} = this.props;
        if(vital_ids.length === 0) {
            getPatientVitals();
        }
    }

    getDataSource = () => {
        const {
            vitals,
            vital_templates,
            vital_ids,
            intl: {formatMessage} = {}
        } = this.props;

        const {openResponseDrawer, openEditDrawer} = this;


        return vital_ids.map((id) => {
            return generateRow({
                id,
                vitals,
                vital_templates,
                openResponseDrawer,
                openEditDrawer,
                formatMessage
            });
        });
    };

    openResponseDrawer = (id) => (e) => {
        e.preventDefault();
        const {vitalResponseDrawer} = this.props;
        vitalResponseDrawer({id, loading: true});
    };

    openEditDrawer = (id) => (e) => {
        e.preventDefault();
        const {editVitalDrawer} = this.props;
        editVitalDrawer({id, loading: true});
    };

    render() {
        const {
            intl: { formatMessage } = {},
        } = this.props;
        const { getLoadingComponent, getDataSource } = this;

        return (
            <Table
                rowClassName={() => "pointer"}
                // loading={loading === true ? getLoadingComponent() : false}
                columns={getColumn({
                    formatMessage,
                    className: "pointer",
                })}
                dataSource={getDataSource()}
                scroll={{ x: '100%' }}
                pagination={{
                    position: "bottom",
                }}
            />
        );
    }
}

export default injectIntl(VitalTable);