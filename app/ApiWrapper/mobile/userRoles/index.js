import BaseUserRole from "../../../services/userRoles";
import userRolesService from "../../../services/userRoles/userRoles.service";

class MUserRoleWrapper extends BaseUserRole {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            user_identity,
            category_id,
            category_type,
            created_at,
            deleted_at,
            updated_at
        } = _data || {};

        return {
            basic_info: {
                id,
                user_identity,
                category_id,
                category_type
            },
            updated_at,
            deleted_at,
            created_at
        };
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new MUserRoleWrapper(data);
    }
    const profile = await userRolesService.getUserRoleById(id);
    return new MUserRoleWrapper(profile);
}