import isEmpty from "lodash/isEmpty";

export const getFormattedData = (data = {}) => {
    const {payment_products = []} = data;

    let updatedPaymentProducts = [];
    payment_products.forEach(product => {
        const {name, type, amount, id, razorpay_link = ''} = product || {};

        let details = {};

        if (!isEmpty(id)) {
            details.id = id;
        }

        if (!isEmpty(name)) {
            details.name = name;
        }

        if (!isEmpty(type)) {
            details.type = type;
        }

        if (!isEmpty(amount)) {
            details.amount = amount;
        }

        details.razorpay_link = razorpay_link;

        updatedPaymentProducts.push(details);
    });

    return updatedPaymentProducts;
};
