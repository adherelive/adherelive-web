import React, {Component} from "react";
import {injectIntl} from "react-intl";
import generateRow from "./dataRow";
import {PERMISSIONS} from "../../../constant";
import getColumn from "./header";
import Table from "antd/es/table";
import messages from "./messages";

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

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {care_plans: {vital_ids = []} = {}} = this.props;
        const {care_plans: {vital_ids: prev_vital_ids = []} = {}} = prevProps;

        let isDifferent=false;
        if(vital_ids.length>0 && prev_vital_ids.length>0){
            if(vital_ids[0] !== prev_vital_ids[0]){
                isDifferent=true;
            }
        }else if (vital_ids.length>0 || prev_vital_ids.length>0){
            isDifferent=true;
        }


        if(vital_ids.length !== prev_vital_ids.length || isDifferent ) {
            this.getVitals();
            this.setState({vital_ids});
        }
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
            care_plans,
            vital_templates,
            intl: {formatMessage} = {},
            isOtherCarePlan
        } = this.props;
        // const {vital_ids} = this.state;

        console.log("23943278648726348723",{props:this.props});
        const {vital_ids = [] } =care_plans || {};
        const {openResponseDrawer, openEditDrawer} = this;


        return vital_ids.map((id) => {
            return generateRow({
                id,
                vitals,
                vital_templates,
                openResponseDrawer,
                openEditDrawer,
                formatMessage,
                isOtherCarePlan
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
        const {editVitalDrawer, isOtherCarePlan} = this.props;
        if(!isOtherCarePlan) {
            editVitalDrawer({id, loading: true});
        }
    };

    formatMessage = data => this.props.intl.formatMessage(data);

    render() {
        const {
            intl: { formatMessage } = {},
        } = this.props;
        const { getLoadingComponent, getDataSource } = this;

        const vitalLocale = {
            emptyText:this.formatMessage(messages.emptyVitalTable)
        }

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
                locale={vitalLocale}
            />
        );
    }
}

export default injectIntl(VitalTable);