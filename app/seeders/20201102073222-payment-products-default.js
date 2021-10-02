'use strict';

import {TABLE_NAME, PAYMENT_TYPE} from "../models/paymentProducts";
import {USER_CATEGORY} from "../../constant";

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert(TABLE_NAME, [
            {
                name: "Tele-Medicine",
                type: PAYMENT_TYPE.ONE_TIME,
                creator_type: USER_CATEGORY.ADMIN,
                product_user_type: "patient",
                for_user_role_id: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Offline Consultation",
                type: PAYMENT_TYPE.ONE_TIME,
                creator_type: USER_CATEGORY.ADMIN,
                product_user_type: "patient",
                for_user_role_id: 0,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Adherence Monitoring",
                type: PAYMENT_TYPE.RECURRING,
                creator_type: USER_CATEGORY.ADMIN,
                product_user_type: "patient",
                for_user_role_id: 0,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete(TABLE_NAME, null, {});
    }
};
