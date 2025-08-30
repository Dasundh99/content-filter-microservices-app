import React, { useState } from "react";
import axios from "axios";

const AuthPage = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(true); // true = signup, false = signin

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage(""); // clear previous messages

    try {
      if (isSignUp) {
        // SIGNUP
        const signupRes = await axios.post("http://192.168.67.2:30006/signup", { username, password });
        setMessage(signupRes.data.message + " Please sign in.");

        // Switch to SignIn automatically
        setIsSignUp(false);
        setPassword(""); // clear password for login

      } else {
        // SIGNIN
        const loginRes = await axios.post("http://192.168.67.2:30006/login", { username, password });
        const token = loginRes.data.token;
        localStorage.setItem("token", token);
        setMessage("Login successful!");

        if (onAuthSuccess) onAuthSuccess(token);
      }
    } catch (err) {
      // Show backend error
      setMessage(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", paddingTop: "50px" }}>
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>

      <form onSubmit={handleAuth}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: "10px", color: isSignUp ? "green" : "red" }}>{message}</p>
      )}

      <p style={{ marginTop: "15px" }}>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setMessage("");
            setPassword("");
          }}
          style={{ color: "blue", background: "none", border: "none", cursor: "pointer" }}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;

