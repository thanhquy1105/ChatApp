import React, { useState } from "react";
import loginImage from "../../assets/images/login.svg";
import { Link } from "react-router-dom";
import AuthService from "../../services/authService";

import { useDispatch } from "react-redux";
import { login } from "../../store/actions/auth";
import { useHistory } from "react-router";

import "./Auth.scss";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [email, setEmail] = useState("Sam.smith@gmail.com");
  const [password, setPassword] = useState("secret");

  const submitForm = (e) => {
    e.preventDefault();

    dispatch(login({ email, password }, history));
  };

  return (
    <div id="auth-container">
      <div id="auth-card">
        <div className="card-shadow">
          <div id="image-section">
            <img src={loginImage} alt="Login" />
          </div>

          <div id="form-section">
            <h2>Welcome Back</h2>

            <form onSubmit={submitForm}>
              <div className="input-field mb-1">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required="required"
                  type="email"
                  placeholder="Email"
                />
              </div>

              <div className="input-field mb-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required="required"
                  type="password"
                  placeholder="Password"
                />
              </div>

              <button>LOGIN</button>
            </form>

            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
