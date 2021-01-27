import React, {Component} from "react";
import {injectIntl} from "react-intl";
import { withRouter } from "react-router-dom";
import moment from "moment";

import Table from "antd/es/table";

import generateRow from "./dataRow";
import getColumn from "./header";

import { PageLoading } from "../../../Helper/loading/pageLoading";


class TransactionTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    };

    componentDidMount(){
        this.handleGetAllTransactions();
    }

    formatMessage = (message) => this.props.intl.formatMessage(message);

    async handleGetAllTransactions(){
        try{
            const {getAllTransactions} = this.props;
            this.setState({loading: true});
            const response = await getAllTransactions();
            const {status} = response || {};
            if(status === true) {
                this.setState({loading: false});
            } else {
                this.setState({loading: false});
            }
        }catch(error){
            console.log("handleGetAllTransactions error : ",error);
        }
    }
        
    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRows: selectedRowKeys });
    };

    getLoadingComponent = () => {
        return (
            <PageLoading />
        )
    };

    getDataSource = () => {
        const { 
                transactions,
                transaction_ids,
                payment_products,
                patients,
                doctors,
                users
              } = this.props;


        return transaction_ids.map(id => {
            return generateRow({
                id,
                transactions,
                transaction_ids,
                payment_products,
                patients,
                doctors,
                users
            });
        });
    };
  

    onChange(pagination, filters, sorter, extra) {
        console.log('params', pagination, filters, sorter, extra);
    }



    getParentNode = t => t.parentNode;



    render() {
        const {loading} = this.state;
        const { 
             getLoadingComponent,
             getDataSource,
             formatMessage ,
             onChange ,
             getParentNode} = this;

        return (
            <Table
                // onRow={onRow}
                className="wp100 mt40"
                rowClassName={() => "pointer"}
                loading={loading === true ? getLoadingComponent() : false}
                columns={getColumn({
                    formatMessage,
                    className: "pointer"
                })}
                onChange={onChange}
                getPopupContainer={getParentNode}
                dataSource={getDataSource()}
                scroll={{ x: 1600 }}
                pagination={{
                    position: "top",
                    pageSize: 10
                }}
            />
        );
    }
}

export default withRouter(injectIntl(TransactionTable)); 