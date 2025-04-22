import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Payment from "./Payment"; // Adjust the import path as necessary
import gpath from "../utility/globalPath";

const VideoPlans = ({ onPlanSelect }) => {
    const [selectedPlan, setSelectedPlan] = useState("Free");
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const { login } = useContext(AuthContext);
    const [clicked, setClicked] = useState(false);

    const plans = {
        Free: { name: "Free", timeLimit: "5 mins", cost: 0, download_per_day: 1 },
        Bronze: { name: "Bronze", timeLimit: "7 mins", cost: 10, download_per_day: 1 },
        Silver: { name: "Silver", timeLimit: "10 mins", cost: 50, download_per_day: 1 },
        Gold: { name: "Gold", timeLimit: "Unlimited", cost: 100, download_per_day: "Unlimited" },
    };

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
        onPlanSelect(plan);
        setClicked(null); // Set clicked to true when a plan is selected
    };


    const OnSuccess = async (res) => {

        console.log("Payment response:", res);

        try {
            // Send PUT request to update the user's plan
            console.log("User", user);
            console.log("Updating plan for user:", user._id, "to", selectedPlan);
            console.log("Selected plan:", selectedPlan);
            const response = await axios.patch(`${gpath}/api/user/update_plan`, {
                userId: user._id,
                newPlan: selectedPlan,
            });

            console.log("Plan updated successfully:", response.data);

            // alert(`Payment Successful for ${plans[selectedPlan].name} Plan! Invoice Sent.`);

            // // Update user in context & local storage
            const updatedUser = response.data.user;
            console.log("Updated user data:", updatedUser);
            setUser(updatedUser);
            login(updatedUser); // Update user in context
            localStorage.setItem("user", JSON.stringify(updatedUser)); // Update user in local storage
            console.log("User updated in local storage:", updatedUser);
            navigate("/"); // Navigate back
        } catch (error) {
            console.error("Error updating plan:", error);
            alert("Payment failed. Please try again.");
        }
    };

    return (
        <div className="container py-5 min-dvh-100">
            <h2 className="text-center fw-bold mb-5 display-6 text-primary">Upgrade Your Plan</h2>

            <div className="row justify-content-center g-5">
                {Object.keys(plans)?.map((plan) => {
                    // const isSelected = plan === user?.plan;
                    const planData = plans[plan];
                    return (
                        <div key={plan} className="col-md-4">
                            <div className={`card h-100 shadow-lg border-0 ${plan === "Free" ? "border border-primary" : ""}`}>
                                <div className={`card-header bg-${plan === "Free" ? "primary" : "light"} text-${plan === "Free" ? "white" : "dark"} text-center`}>
                                    <h4 className="mb-0">{planData.name}</h4>
                                </div>
                                <div className="card-body text-center">
                                    <span className="badge bg-info mb-3">{plan === "Free" ? "Free Forever" : "Premium Access"}</span>
                                    <p className="card-text fs-6"><strong>Time Limit:</strong> {planData.timeLimit}</p>
                                    <p className="card-text fs-6"><strong>Cost:</strong> {planData.cost === 0 ? "₹0" : `₹${planData.cost}`}</p>
                                    <p className="card-text fs-6"><strong>Downloads per day:</strong> {planData.download_per_day}</p>
                                    <button
                                        className={`btn ${plan === "Free" ? "btn-primary" : "btn-outline-primary"} w-100 my-2`}
                                        onClick={() => {
                                            handlePlanSelection(plan)
                                            if (plan !== "Free") setClicked(plan); // Set clicked to true when a plan is selected
                                        }}

                                    >
                                        {plan === "Free" ? "Plan Selected" : `Choose ${planData.name}`}
                                    </button>
                                    {clicked === plan && plan !== "Free" && (
                                        <Payment
                                            amount={planData.cost}
                                            plan={plan}
                                            onSuccess={() => OnSuccess()}
                                            setClicked={() => {
                                                setClicked(null)
                                                setSelectedPlan(plan); // Set selected plan to the one clicked
                                            }
                                            } // Reset clicked state after payment
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>


    );
};

export default VideoPlans;
