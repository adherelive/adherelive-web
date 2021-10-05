function transactionReducer(state, data) {
    const {transactions} = data || {};
    if (transactions) {
        return {
            ...state,
            ...transactions
        };
    } else {
        return state;
    }
}

export default (state = {}, action) => {
    const {type, data} = action;
    switch (type) {
        default:
            return transactionReducer(state, data)
    }
};
