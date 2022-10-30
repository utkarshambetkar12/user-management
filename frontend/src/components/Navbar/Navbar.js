//styles & images

import "./Navbar.css";

import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, setUser } = useAuthContext();
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const Logout = () => {
    setIsPending(true);
    setUser({ auth: null, email_id: null, password: null });
    setIsPending(false);
    navigate("/");
  };

  return (
    <div className="navbar">
      <ul>
        <li className="logo">
          <span> Software Developer Assignment (Node.js and MySQL) </span>
        </li>
        {user.auth && (
          <li>
            {!isPending && (
              <button className="btn" onClick={Logout}>
                Logout
              </button>
            )}
            {isPending && (
              <button className="btn" disabled>
                {" "}
                Logging Out...{" "}
              </button>
            )}
          </li>
        )}
      </ul>
    </div>
  );
}
