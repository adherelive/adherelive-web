import React, {Component} from "react";
import {injectIntl} from "react-intl";
import generateRow from "./dataRow";
import {PERMISSIONS} from "../../../constant";
import getColumn from "./header";
import Table from "antd/es/table";


class VitalTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            vital_ids: [],
        };
    }

    componentDidMount() {
        this.getVitals();
    }

    getVitals = async () => {
        try {
            const {getPatientVitals} = this.props;
            const {loading} = this.state;
            const response = await getPatientVitals();
            console.log("139871283 response", response);
            const {status, payload: {data: {vital_ids = []} = {}} = {}} = response || {};
            this.setState({vital_ids, loading: false});
        } catch(error) {
            this.setState({loading: false});
        }
    };

    getDataSource = () => {
        const {
            vitals,
            vital_templates,
            intl: {formatMessage} = {}
        } = this.props;
        const {vital_ids} = this.state;

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