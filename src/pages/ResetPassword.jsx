import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {

    const { token } = useParams();

    const navigate = useNavigate();

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        try {

            setLoading(true);

            await axios.post(
                // `http://localhost:5000/api/v1/auth/reset-password/${token}`,
                `https://api.webnityglobal.in/api/v1/auth/reset-password/${token}`,
                {
                    password,
                }
            );

            alert("Password updated successfully");

            navigate("/login");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen flex justify-center items-center">

            <form
                onSubmit={submit}
                className="bg-white shadow-lg rounded-lg p-6 w-[400px]"
            >

                <h2 className="text-2xl font-bold mb-5">

                    Reset Password

                </h2>

                <input
                    type="password"
                    placeholder="New Password"
                    className="border p-3 rounded w-full"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button
                    className="bg-blue-600 text-white w-full mt-5 py-3 rounded"
                    disabled={loading}
                >

                    {loading
                        ? "Updating..."
                        : "Reset Password"}

                </button>

            </form>

        </div>
    );
}