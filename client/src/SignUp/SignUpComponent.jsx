import React, { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const SignUpComponent = () => {
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("signUp"); // "signUp" or "verify"
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await signUp.create({ emailAddress: email, password });

      console.log("Signup response:", response);

      if (response.verifications.emailAddress.status === "needs_verification") {
        await signUp.prepareEmailAddressVerification();
        setStep("verify"); // Move to verification step
      }
    } catch (err) {
      setError(err.errors[0]?.message || "Signup failed");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await signUp.attemptEmailAddressVerification({ code: verificationCode });

      console.log("Verification response:", response);

      if (response.status === "complete") {
        navigate("/dashboard"); // Redirect after verification
      } else {
        setError("Invalid verification code. Try again.");
      }
    } catch (err) {
      setError(err.errors[0]?.message || "Verification failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "25rem" }}>
        {step === "signUp" ? (
          <>
            <h2 className="text-center">Sign Up</h2>
            <form onSubmit={handleSignUp}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button type="submit" className="btn btn-primary w-100">Sign Up</button>
            </form>
            <p className="mt-3 text-center">
              Already have an account? <a href="/signin">Sign In</a>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-center">Verify Email</h2>
            <p className="text-center">Enter the verification code sent to your email.</p>
            <form onSubmit={handleVerify}>
              <div className="mb-3">
                <label htmlFor="verificationCode" className="form-label">Verification Code</label>
                <input
                  id="verificationCode"
                  type="text"
                  className="form-control"
                  placeholder="Enter code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <button type="submit" className="btn btn-success w-100">Verify</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUpComponent;
