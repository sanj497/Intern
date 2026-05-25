import axios from "axios";
import Payment from "../model/khaltiModel.js"; 

// Initiate Khalti payment
export const addKhalti = async (req, res) => {
    const { paymentMethod, paymentStatus, pidx, orderId, totalAmount } = req.body;

    if (!paymentMethod || !orderId || !totalAmount) {
        return res.status(400).json({ message: "Missing required fields: paymentMethod, orderId, or totalAmount" });
    }

    try {
        // Create initial payment recordz
        const payment = await Payment.create({
            paymentMethod,
            paymentStatus: paymentStatus || 'unpaid',
            amount: totalAmount,
            orderId
        });

        if (paymentMethod === "khalti") {
            const data = {
                return_url: "http://localhost:5173/success/",
                website_url: "http://localhost:5173/",
                amount: totalAmount * 100, // Convert to paisa
                purchase_order_id: orderId,
                purchase_order_name: `orderName_${orderId}`,
            };

            const response = await axios.post(
                "https://a.khalti.com/api/v2/epayment/initiate/",
                data,
                {
                    headers: {
                        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const khaltiResponse = response.data;

            // Update DB with returned pidx
            payment.pidx = khaltiResponse.pidx;
            await payment.save();

            return res.status(200).json({
                message: "Payment initiated successfully",
                url: khaltiResponse.payment_url,
                data: khaltiResponse,
            });
        } else {
            return res.status(400).json({ message: "Unsupported payment method" });
        }
    } catch (error) {
        console.error("Error initiating Khalti payment:", error?.response?.data || error.message);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Verify Khalti transaction using pidx
export const verifyTransaction = async (req, res) => {
    const { pidx } = req.body;

    if (!pidx) {
        return res.status(400).json({ message: "Please provide pidx" });
    }

    try {
        const response = await axios.post(
            'https://a.khalti.com/api/v2/epayment/lookup/',
            { pidx },
            {
                headers: {
                    Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const data = response.data;
        console.log("Khalti Lookup Response:", data);

        if (data.status === 'Completed') {
            const payment = await Payment.findOneAndUpdate(
                { pidx },
                { paymentStatus: 'paid' },
                { new: true }
            );

            if (payment) {
                return res.status(200).json({
                    message: 'Payment verified successfully',
                    payment
                });
            } else {
                return res.status(404).json({ message: 'Payment record not found' });
            }
        } else {
            return res.status(200).json({
                message: 'Payment not completed',
                status: data.status,
                raw: data
            });
        }
    } catch (error) {
        console.error("Error verifying Khalti payment:", error?.response?.data || error.message);
        return res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
