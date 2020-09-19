import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, Select, Input, message, Button, Spin, Radio, DatePicker } from "antd";
import moment from "moment";
import throttle from "lodash-es/throttle";

import india from '../../../Assets/images/india.png';
import australia from '../../../Assets/images/australia.png';
import us from '../../../Assets/images/flag.png';
import uk from '../../../Assets/images/uk.png';
import russia from '../../../Assets/images/russia.png';
import germany from '../../../Assets/images/germany.png';
import southAfrica from '../../../Assets/images/south-africa.png';
import pakistan from '../../../Assets/images/pakistan.png';
import bangladesh from '../../../Assets/images/bangladesh.png';
import japan from '../../../Assets/images/japan.png';
import china from '../../../Assets/images/china.png';
import switzerland from '../../../Assets/images/switzerland.png';
import france from '../../../Assets/images/france.png';
import messages from './message';
import "react-datepicker/dist/react-datepicker.css";
const { Option } = Select;

const MALE = 'm';
const FEMALE = 'f';
const OTHER = 'o';

class PatientDetailsDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile_number: '',
            name: '',
            gender: '',
            date_of_birth: '',
            treatment: '',
            severity: '',
            condition: '',
            prefix: "91",
            fetchingCondition: false,
            fetchingTreatment: false,
            fetchingSeverity: false,
        };

        this.handleConditionSearch = throttle(this.handleConditionSearch.bind(this), 2000);
        this.handleTreatmentSearch = throttle(this.handleTreatmentSearch.bind(this), 2000);
        this.handleSeveritySearch = throttle(this.handleSeveritySearch.bind(this), 2000);
    }

    componentDidMount() {


    }


    getGenderOptions = () => {
        const genderes = [
            { name: "Female", value: "f" },
            { name: "Male", value: "m" },
            { name: "Other", value: "o" }
        ];
        let options = [];

        for (let id = 0; id < genderes.length; ++id) {
            const { name, value } = genderes[id];
            options.push(
                <Option key={id} value={value} name={name}>
                    {name}
                </Option>
            );
        }
        return options;
    };

    setName = e => {
        const { value } = e.target;
        const reg = /^[a-zA-Z][a-zA-Z\s]*$/;
        if (reg.test(value) || value === '') {
            this.setState({ name: e.target.value });
        }
    };


    setPrefix = value => {
        this.setState({ prefix: value });
    };

    setNumber = e => {
        const { value } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.setState({ mobile_number: e.target.value });
        }
    };

    setTreatment = value => {
        this.setState({ treatment: value });
    };

    setSeverity = value => {
        this.setState({ severity: value });
    };

    setCondition = async value => {

        const { searchTreatment } = this.props;
        this.setState({ condition: value });

        const response = await searchTreatment(value);

        const { status, payload: { data: { treatments = {} } = {}, message } = {} } = response;
        if (status) {
            this.setState({ treatments, treatment: '' });
        }
    };

    setGender = value => () => {
        this.setState({ gender: value });
    };

    setDOB = e => {
        // (date) => {
        this.setState({ date_of_birth: moment(e.target.value) });
    }

    getTreatmentOption = () => {
        let { treatments = {} } = this.state;
        let newTreatments = [];
        for (let treatment of Object.values(treatments)) {
            let { basic_info: { id = 0, name = '' } = {} } = treatment;
            newTreatments.push(<Option key={id} value={id}>
                {name}
            </Option>)
        }
        return newTreatments;
    }


    getSeverityOption = () => {
        let { severity = {} } = this.props;
        let newSeverity = [];
        for (let sev of Object.values(severity)) {
            let { basic_info: { id = 0, name = '' } = {} } = sev;
            newSeverity.push(<Option key={id} value={id}>
                {name}
            </Option>)
        }
        return newSeverity;
    }


    getConditionOption = () => {
        let { conditions = {} } = this.props;
        let newConditions = [];
        for (let condition of Object.values(conditions)) {
            let { basic_info: { id = 0, name = '' } = {} } = condition;
            newConditions.push(<Option key={id} value={id}>
                {name}
            </Option>)
        }
        return newConditions;
    }

    async handleConditionSearch(data) {
        try {
            if (data) {
                const { searchCondition } = this.props;
                this.setState({ fetchingCondition: true });
                const response = await searchCondition(data);
                const { status, payload: { data: responseData, message } = {} } = response;
                if (status) {
                    this.setState({ fetchingCondition: false });
                } else {
                    this.setState({ fetchingCondition: false });
                }
            } else {
                this.setState({ fetchingCondition: false });
            }
        } catch (err) {
            console.log("err", err);
            message.warn(this.formatMessage(messages.somethingWentWrong));
            this.setState({ fetchingCondition: false });
        }
    };

    async handleTreatmentSearch(data) {
        try {
            if (data) {
                const { searchTreatment } = this.props;
                this.setState({ fetchingTreatment: true });
                const response = await searchTreatment(data);
                const { status } = response;
                if (status) {
                    this.setState({ fetchingTreatment: false });
                } else {
                    this.setState({ fetchingTreatment: false });
                }
            } else {
                this.setState({ fetchingTreatment: false });
            }
        } catch (err) {
            console.log("err", err);
            message.warn(this.formatMessage(messages.somethingWentWrong));
            this.setState({ fetchingCondition: false });
        }
    };

    async handleSeveritySearch(data) {
        try {
            if (data) {
                const { searchSeverity } = this.props;
                this.setState({ fetchingSeverity: true });
                const response = await searchSeverity(data);
                const { status } = response;
                if (status) {
                    this.setState({ fetchingSeverity: false });
                } else {
                    this.setState({ fetchingSeverity: false });
                }
            } else {
                this.setState({ fetchingSeverity: false });
            }
        } catch (err) {
            console.log("err", err);
            message.warn(this.formatMessage(messages.somethingWentWrong));
            this.setState({ fetchingSeverity: false });
        }
    };

    renderAddPatient = () => {

        let dtToday = new Date();

        let month = dtToday.getMonth() + 1;
        let day = dtToday.getDate();
        let year = dtToday.getFullYear();

        if (day < 10) {
            day = '0' + day;
        } else if (month < 10) {
            month = '0' + month;
        }

        const { mobile_number = '', name = '', condition = '', prefix = '' } = this.state;
        const prefixSelector = (

            <Select className="flex align-center h50 w80"
                value={prefix}
                onChange={this.setPrefix}>
                {/* india */}
                <Option value="91"><div className='flex align-center'><img src={india} className='w16 h16' /> <div className='ml4'>+91</div></div></Option>
                {/* australia */}
                <Option value="61"><div className='flex align-center'><img src={australia} className='w16 h16' /> <div className='ml4'>+61</div></div></Option>
                {/* us */}
                <Option value="1"><div className='flex align-center'><img src={us} className='w16 h16' /> <div className='ml4'>+1</div></div></Option>
                {/* uk */}
                <Option value="44"><div className='flex align-center'><img src={uk} className='w16 h16' /> <div className='ml4'>+44</div></div></Option>
                {/* china */}
                <Option value="86"><div className='flex align-center'><img src={china} className='w16 h16' /> <div className='ml4'>+86</div></div></Option>
                {/* japan */}
                <Option value="81"><div className='flex align-center'><img src={japan} className='w16 h16' /> <div className='ml4'>+81</div></div></Option>
                {/* germany */}
                <Option value="49"><div className='flex align-center'><img src={germany} className='w16 h16' /> <div className='ml4'>+49</div></div></Option>
                {/* france */}
                <Option value="33"><div className='flex align-center'><img src={france} className='w16 h16' /> <div className='ml4'>+33</div></div></Option>
                {/* switzerland */}
                <Option value="41"><div className='flex align-center'><img src={switzerland} className='w16 h16' /> <div className='ml4'>+41</div></div></Option>

                {/* russia */}
                <Option value="7"><div className='flex align-center'><img src={russia} className='w16 h16' /> <div className='ml4'>+7</div></div></Option>
                {/* south africa */}
                <Option value="27"><div className='flex align-center'><img src={southAfrica} className='w16 h16' /> <div className='ml4'>+27</div></div></Option>
                {/* pakistan */}
                <Option value="92"><div className='flex align-center'><img src={pakistan} className='w16 h16' /> <div className='ml4'>+92</div></div></Option>
                {/* bangladesh */}
                <Option value="880"><div className='flex align-center'><img src={bangladesh} className='w16 h16' /> <div className='ml4'>+880</div></div></Option>
            </Select>
        );

        return (
            <div className='form-block-ap'>
                <div className='form-headings flex align-center justify-start'>{this.formatMessage(messages.phoneNo)}<div className="star-red">*</div></div>
                <Input
                    addonBefore={prefixSelector}
                    className={"form-inputs-ap"}
                    placeholder={this.formatMessage(messages.phoneNo)}
                    minLength={6}
                    maxLength={20}
                    value={mobile_number}
                    onChange={this.setNumber}
                />
                <div className='form-headings-ap '>{this.formatMessage(messages.name)}</div>
                <Input
                    placeholder={this.formatMessage(messages.name)}
                    value={name}
                    className={"form-inputs-ap"}
                    onChange={this.setName}
                />
                <div className='form-headings-ap'>{this.formatMessage(messages.gender)}</div>
                <div className='add-patient-radio wp100 mt6 mb18 flex'>

                    <Radio.Group buttonStyle="solid" >
                        <Radio.Button value={MALE} onClick={this.setGender(MALE)}>M</Radio.Button>
                        <Radio.Button value={FEMALE} onClick={this.setGender(FEMALE)}>F</Radio.Button>
                        <Radio.Button value={OTHER} onClick={this.setGender(OTHER)}>O</Radio.Button>
                    </Radio.Group>
                </div>

                <div className='form-headings-ap flex align-center justify-start'>{this.formatMessage(messages.dob)}<div className="star-red">*</div></div>

                <Input className={"form-inputs-ap"} type='date'
                    max={`${year}-${month}-${day}`}
                    onChange={this.setDOB} />
                <div className='form-category-headings-ap'>{this.formatMessage(messages.treatmentPlan)}</div>

                <div className='form-headings-ap flex align-center justify-start'>{this.formatMessage(messages.condition)}<div className="star-red">*</div></div>


                <Select
                    className="form-inputs-ap drawer-select"
                    placeholder="Select Condition"
                    value={this.state.condition}
                    onChange={this.setCondition}
                    onSearch={this.handleConditionSearch}
                    notFoundContent={this.state.fetchingCondition ? <Spin size="small" /> : 'No match found'}
                    showSearch
                    // onFocus={() => handleMedicineSearch("")}
                    autoComplete="off"
                    // onFocus={() => handleMedicineSearch("")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                // getPopupContainer={getParentNode}

                >
                    {this.getConditionOption()}
                </Select>

                <div className='form-headings-ap  flex align-center justify-start'>{this.formatMessage(messages.severity)}<div className="star-red">*</div></div>


                <Select
                    className="form-inputs-ap drawer-select"
                    placeholder="Select Severity"
                    value={this.state.severity}
                    onChange={this.setSeverity}
                    onSearch={this.handleSeveritySearch}
                    notFoundContent={this.state.fetchingSeverity ? <Spin size="small" /> : 'No match found'}
                    showSearch
                    // onFocus={() => handleMedicineSearch("")}
                    autoComplete="off"
                    // onFocus={() => handleMedicineSearch("")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                // getPopupContainer={getParentNode}

                >
                    {this.getSeverityOption()}
                </Select>


                <div className='form-headings-ap flex align-center justify-start'>{this.formatMessage(messages.treatment)}<div className="star-red">*</div></div>

                <Select
                    className="form-inputs-ap drawer-select"
                    placeholder="Select Treatment"
                    value={this.state.treatment}
                    onChange={this.setTreatment}
                    // onSearch={this.handleTreatmentSearch}
                    notFoundContent={this.state.fetchingTreatment ? <Spin size="small" /> : 'No match found'}
                    showSearch
                    disabled={!condition}
                    autoComplete="off"
                    // onFocus={() => handleMedicineSearch("")}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                    }
                // getPopupContainer={getParentNode}

                >
                    {this.getTreatmentOption()}
                </Select>
            </div>
        );

    }


    validateData = () => {
        const { mobile_number = '', date_of_birth = '', treatment = '', severity = '', condition = '', prefix = '' } = this.state;
        let age = date_of_birth ? moment().diff(moment(date_of_birth), 'years') : -1;

        if (!prefix) {
            message.error(this.formatMessage(messages.prefixError))
            return false;
        } else if (mobile_number.length < 6 || mobile_number.length > 20 || !mobile_number) {
            message.error(this.formatMessage(messages.mobNoError))
            return false;
        } else if (!date_of_birth) {
            message.error(this.formatMessage(messages.dobError))
            return false;
        }
        else if (date_of_birth && (age < 0 || age > 140 || moment(date_of_birth).isAfter(moment()))) {  //handle case of newBorn

            message.error(this.formatMessage(messages.validdobError))
            return false;
        }
        else if (!treatment) {
            message.error(this.formatMessage(messages.treatmentError))
            return false;
        }
        else if (!severity) {
            message.error(this.formatMessage(messages.severityError))
            return false;
        }
        else if (!condition) {
            message.error(this.formatMessage(messages.conditionError))
            return false;
        }
        
        return true;
    }

    onSubmit = () => {
        const { mobile_number = '', name = '', gender = '', date_of_birth = '', treatment = '', severity = '', condition = '', prefix = '' } = this.state;
        const validate = this.validateData();
        const { submit } = this.props;
        if (validate) {
            submit({ mobile_number, name, gender, date_of_birth, treatment_id: treatment, severity_id: severity, condition_id: condition, prefix })
        }
    }



    formatMessage = data => this.props.intl.formatMessage(data);

    onClose = () => {
        const { close } = this.props;
        this.setState({
            mobile_number: '',
            name: '',
            gender: '',
            date_of_birth: '',
            treatment: '',
            severity: '',
            condition: '',
            prefix: "91",
            fetchingCondition: false,
            fetchingTreatment: false,
            fetchingSeverity: false
        });
        close();
    };

    render() {
        const { visible } = this.props;
        const { onClose, renderAddPatient } = this;

        if (visible !== true) {
            return null;
        }
        return (
            <Fragment>
                <Drawer
                    title={this.formatMessage(messages.addPatient)}
                    placement="right"
                    // closable={false}
                    // closeIcon={<img src={backArrow} />}
                    maskClosable={false}
                    headerStyle={{
                        position: "sticky",
                        zIndex: "9999",
                        top: "0px"
                    }}
                    onClose={onClose}
                    visible={visible} // todo: change as per state, -- WIP --
                    width={400}
                >
                    {renderAddPatient()}
                    <div className='add-patient-footer'>
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            {this.formatMessage(messages.cancel)}
                        </Button>
                        <Button onClick={this.onSubmit} type="primary">
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div>
                </Drawer>

            </Fragment>
        );
    }
}

export default injectIntl(PatientDetailsDrawer);
