import React, {Component} from "react";
import {injectIntl} from "react-intl";
import generateRow from "./dataRow";
import {PERMISSIONS} from "../../../constant";
import getColumn from "./header";
import Table from "antd/es/table";


class MedicationTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            medication_ids: [],
        };
    }

    componentDidMount() {
        console.log("Medication table Component did Mount!",this.props);
        this.getMedications();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const  {medication_ids = []}  = this.props;
        const {medication_ids: prev_medication_ids = []}  = prevProps;

        if(medication_ids.length !== prev_medication_ids.length) {
            this.setState({medication_ids});
        }
    }

    getMedications = async () => {
        try {
            const {getPatientMedications} = this.props;
            const {loading} = this.state;
            const response = await getPatientMedications();
            // const {status, payload: {data: {medication_ids = []} = {}} = {}} = response || {};
            const {medication_ids = []} = this.props;
            this.setState({medication_ids, loading: false});
        } catch(error) {
            this.setState({loading: false});
        }
    };

    getDataSource = () => {
        const {
            medications,
            medicines,
            isOtherCarePlan,
            intl: {formatMessage} = {},
        } = this.props;

        const {medication_ids} = this.state;

        const {openResponseDrawer, openEditDrawer} = this;


        return medication_ids.map((id) => {
            return generateRow({
                id,
                medications,
                openResponseDrawer,
                openEditDrawer,
                formatMessage,
                isOtherCarePlan,
                medicines
            });
        });
    };

    openResponseDrawer = (id) => (e) => {
        e.preventDefault();
        // console.log("INSIDE OPEN RESPONSE DRAWER ------------------>",this.props);
        const {medicationResponseDrawer} = this.props;
        medicationResponseDrawer({id, loading: true});
    };

    openEditDrawer = (id) => (e) => {
        e.preventDefault();
        const {editMedicationDrawer, isOtherCarePlan, patientId} = this.props;
        console.log("1237182 patientId --> ", {patientId});
        if(!isOtherCarePlan) {
            editMedicationDrawer({id, patient_id: patientId, loading: true});
        }   //TODOj
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

export default injectIntl(MedicationTable);