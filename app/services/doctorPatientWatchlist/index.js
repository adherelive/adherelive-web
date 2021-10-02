export default class DoctorPatientWatchlist {
    constructor(data) {
        this._data = data;
    }

    getPatientId = () => {
        return this._data.get("patient_id");
    };

    getDoctorId = () => {
        return this._data.get("doctor_id");
    };

    getId = () => {
        return this._data.get("id");
    };

    getUserRoleId = () => {
        return this._data.get("user_role_id");
    };

    getCreatedAt = () => {
        return this._data.get("created_at");
    };

    getDeletedAt = () => {
        return this._data.get("deleted_at");
    }
}
