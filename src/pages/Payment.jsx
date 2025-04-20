import React,{useContext} from "react";
import { AuthContext } from "../context/AuthContext";
// import { useNavigate } from "react-router-dom";
import logo from "./logo192.png"; // Replace with your logo path

const Payment = ({ amount, plan, onSuccess }) => {
    // const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Access user from context

    if (!user) {
        alert("You need to log in first!");
        return;
    }
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        const res = await loadRazorpayScript();

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const options = {
            key: process.env.REACT_APP_RAZORPAY, // 🔁 Replace this with your actual Razorpay test key
            currency: "INR",
            amount:amount * 100, // Razorpay requires amount in paisa
            name: "Jimmi",
            description: `Purchase ${plan} Plan`,
            image: logo, // Optional
            handler: function (response) {
                // alert("Payment Successful!");
                // console.log("Razorpay Response:", response);
                onSuccess(response); // Trigger parent handler
            },
            prefill: {
                name: "Test User",
                email: "testuser@example.com",
                contact: "6377328870",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    return (
        <button className="btn btn-success" onClick={handlePayment}>
            Pay {amount} Rs with Razorpay
        </button>
    );
};

export default Payment;
