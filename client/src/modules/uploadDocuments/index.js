function uploadDocumentReducer(state, data) {
    const { upload_documents } = data || {};
    if (upload_documents) {
        return {
            ...state,
            ...upload_documents,
        };
    } else {
        return state;
    }
}

export default (state = {}, action) => {
    const { type, data } = action;
    switch (type) {
        default:
            return uploadDocumentReducer(state, data);
    }
};