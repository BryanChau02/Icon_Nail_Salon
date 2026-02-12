import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

{/* Navigate is NOT working... */ }

export const Signup = () => {
    const [fNameInputValue, setFNameInputValue] = useState("");
    const [lNameInputValue, setLNameInputValue] = useState("");
    const [emailInputValue, setEmailInputValue] = useState("");
    const [passwordInputValue, setPasswordInputValue] = useState("");
    const [phoneInputValue, setPhoneInputValue] = useState("");
    const navigate = useNavigate();

    const createUser = async (e) => {
        e.preventDefault();
        let data = {
            email: emailInputValue,
            password: passwordInputValue,
            phone: phoneInputValue,
            first: fNameInputValue,
            last: lNameInputValue
        };

        try {
            const backendLink = import.meta.env.VITE_BACKEND_URL
            const res = await fetch(`${backendLink}/api/user`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' }
            });

            if (!res.ok) {
                let errData = null;
                try { errData = await res.json(); } catch { }
                console.log("Signup failed:", errData);
                alert(errData?.msg || `Signup failed (${res.status})`);
                return;
            }

            console.log("Signup success");
            navigate("/", { replace: true });
            alert("Successful Sign Up!")
        } catch (error) {
            console.error(error);
            alert("There is already an account with this email.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h1 className="auth-title">Sign Up!</h1>
                <form onSubmit={createUser}>
                    <input
                        className="form-control time-pill mb-3"
                        value={fNameInputValue}
                        placeholder="First Name"
                        onChange={(event) => setFNameInputValue(event.target.value)}
                    />
                    <input
                        className="form-control time-pill mb-3"
                        value={lNameInputValue}
                        placeholder="Last Name"
                        onChange={(event) => setLNameInputValue(event.target.value)}
                    />
                    <input
                        className="form-control time-pill mb-3"
                        value={emailInputValue}
                        placeholder="E-Mail"
                        onChange={(event) => setEmailInputValue(event.target.value)}
                    />{/* onKeyDown={(event) => postTodo(event)} - change this to throw an error if both fields are not full */}
                    <input
                        className="form-control time-pill mb-3"
                        value={phoneInputValue}
                        placeholder="Phone #"
                        type="tel"
                        onChange={(event) => setPhoneInputValue(event.target.value)}
                    />
                    <input
                        className="form-control time-pill mb-3"
                        type="password"
                        value={passwordInputValue}
                        placeholder="Password"
                        onChange={(event) => setPasswordInputValue(event.target.value)}
                    />{/* onKeyDown={(event) => postTodo(event)} - change this to throw an error if both fields are not full */}

                    <div className="stack-sm mt-3 mb-3">
                        <Link to="/" className="btn btn-secondary me-2 text-decoration-none">
                            Cancel
                        </Link>

                        <button type="submit" className="btn btn-gold ms-2">
                            Sign up!
                        </button>
                    </div>
                    <p className="mt-3 text-center small">
                        Already have an account?{" "}
                        <Link to="/Login" className="link-gold">Login</Link>.
                    </p>
                </form>
                {/* put link to send signup token here, and onclick (onsubmit?) */}
            </div>
        </div>
    )
}