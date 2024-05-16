const crypto = require('crypto');
const Razorpay = require('razorpay');
const instance = new Razorpay({
    key_id:'rzp_test_y595riQBCfFEvo',
    key_secret:'rZCeiHV5bkRHUL4wXgC7t1ph'
});

const checkout = async (req, res) => {
    try {
       
        const options = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };
        const order = await instance.orders.create(options);
        console.log(order);
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({
            success: false,
            error: 'Error during checkout',
        });
    }
};

const paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        console.log("Received data:", razorpay_order_id, razorpay_payment_id, razorpay_signature);

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        console.log("Computed body:", body);

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest("hex");

        console.log("Expected Signature:", expectedSignature);

        const isAuthentic = expectedSignature === razorpay_signature;
        console.log("Is Authentic:", isAuthentic);

        if (isAuthentic) {
            // Database logic goes here
            res.status(200).json({
                status: 'ok',
                data: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
            });
        } else {
            res.status(400).json({
                success: false,
            });
        }
    } catch (error) {
        console.error("Error in paymentVerification:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};
   const RefundMoney=  async (req, res) => {
    try {
        console.log(req.body);
      const { paymentId ,amount} = req.body;
  
      const refund = await instance.payments.refund(paymentId, {
        amount:Number(amount*100), // Specify the refund amount in paise
        notes: {
          reason: 'Customer requested a refund',
        },
      });
      console.log(refund)
  
      res.status(200).json({refund});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


module.exports = { checkout, paymentVerification,RefundMoney };
