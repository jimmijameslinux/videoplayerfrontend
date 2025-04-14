import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const VideoPlans = ({ onPlanSelect }) => {
    const [selectedPlan, setSelectedPlan] = useState("Free");
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const plans = {
        Free: { name: "Free", timeLimit: "5 mins", cost: 0 },
        Bronze: { name: "Bronze", timeLimit: "7 mins", cost: 10 },
        Silver: { name: "Silver", timeLimit: "10 mins", cost: 50 },
        Gold: { name: "Gold", timeLimit: "Unlimited", cost: 100 },
    };

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
        onPlanSelect(plan);
    };

    const handlePayment = async () => {
        if (!user) {
            alert("You need to log in first!");
            return;
        }

        try {
            // Send PUT request to update the user's plan
            const response = await axios.patch("http://localhost:5000/update_plan", {
                userId: user.userId,
                selectedPlan,
            });

            alert(`Payment Successful for ${plans[selectedPlan].name} Plan! Invoice Sent.`);
            
            // Update user in context & local storage
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            navigate(-1); // Navigate back
        } catch (error) {
            console.error("Error updating plan:", error);
            alert("Payment failed. Please try again.");
        }
    };

    return (
        <div className="container mt-4 d-flex flex-column justify-content-center w-100">
            <h2>Upgrade Your Plan</h2>
            <div className="pt-4 pb-3 flex-wrap justify-content-center">
                {Object.keys(plans).map((plan) => (
                    // <div key={plan} className="d-flex  justify-content-center">
                        <div key={plan} className="card text-center mt-3 mx-2">
                            <div className="card-header">
                                <h5>{plans[plan].name} Plan</h5>
                            </div>
                            <div className="card-body">
                                <p className="card-text">Time Limit: {plans[plan].timeLimit}</p>
                                <p className="card-text">Cost: {plans[plan].cost === 0 ? "Free" : `${plans[plan].cost} Rs`}</p>
                                <button
                                    className={`btn btn-${plan === selectedPlan ? "primary" : "secondary"} mb-2`}
                                    onClick={() => handlePlanSelection(plan)}
                                >
                                    Select {plan}
                                </button>
                                {plan !== "Free" && selectedPlan === plan && (
                                    <button className="btn btn-success" onClick={handlePayment}>
                                        Pay {plans[plan].cost} Rs
                                    </button>
                                )}
                            </div>
                        </div>
                    // </div>
                ))}
            </div>
        </div>
    );
};

export default VideoPlans;
