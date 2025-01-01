import hmacSHA256 from "crypto-js/hmac-sha256";

export const verifyTransaction = (razorpayData, transaction) => {
  const { order_id } = transaction.getTransactionResponse();
  const { razorpay_payment_id, razorpay_signature } = razorpayData || {};

  const SIGNATURE_FORMAT = `${order_id}|${razorpay_payment_id}`;
  const signature = hmacSHA256(
    SIGNATURE_FORMAT,
    process.config.razorpay.secret
  );
  const stringSignature = signature.toString();

  return stringSignature === razorpay_signature;
};
