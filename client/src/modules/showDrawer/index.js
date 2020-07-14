

function showDrawerReducer(state, data) {
    const { show } = data || {};
    console.log('SHOW DRAWER REDUCER IS FIREDDDD',show);
    if (show) {
        return show;
    } else {
        return false;
    }
}

export default (state = {}, action) => {
    const { type, data } = action;
    switch (type) {
        default:
            return showDrawerReducer(state, data)
    }
};
