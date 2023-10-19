/**
 * @author Gaurav Sharma
 * @email gaurav6421@gmail.com
 * @create date 2021-04-16 09:30:27
 * @modify date 2023-10-19 14:55:42
 * @desc topic model.
 */

const mongoose = require('mongoose');
const reassignAudit = mongoose.Schema(
    {
        assignedBy: {
            type: String,
            required: true,
        },
        assignedTo: {
            type: String,
            required: true,
        },
        activity_id: {
            type: String,
            required: true
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: Boolean,
        },
        isAcceptedByDoctor: {
            type: Boolean,
        },
    },
    { timestamp: true }
);

module.exports = mongoose.model('ReassignAudit', reassignAudit);
