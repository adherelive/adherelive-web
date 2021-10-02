import Razorpay from "razorpay";

class RazorpayService {
    constructor() {
        this.razorpay = new Razorpay({
            key_id: process.config.razorpay.key,
            key_secret: process.config.razorpay.secret
        });
    }

    createOrder = async (data = {}) => {
        try {
            const order = await this.razorpay.orders.create(data);
            return order;
        } catch (error) {
            throw error;
        }
    };

    directTransfer = async (data = {}) => {
        try {
            const transfer = await this.razorpay.transfers.create(data);
            return transfer;
        } catch (error) {
            throw error;
        }
    };
}

export default RazorpayService;
