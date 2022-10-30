import "./Login.css";

import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    await Axios.post("http://localhost:3001/login", {
      email_id: email,
      password: password,
    }).then((response) => {
      if (response.data.error) {
        setIsPending(false);
        console.log(response.data);
        setError(response.data.error);
      }
      if (response.data.message) {
        setIsPending(false);
        setUser({ auth: true, email_id: email, password });
        navigate("/dashboard");
      }
    });
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        <span> Email </span>
        <input
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </label>
      <label>
        <span> Password </span>
        <input
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </label>

      {!isPending && <button className="btn">Login</button>}
      {isPending && (
        <button className="btn" disabled>
          Logging in
        </button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
