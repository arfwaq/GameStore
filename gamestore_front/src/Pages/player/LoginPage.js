import React from "react";
import LoginComponent from "../../components/player/LoginComponent";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../../css/login.css"; // 연결된 CSS 파일

const LoginPage = () => {
    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate("/player/make");
    };

    return (
        <div className="login-page">
            <Navbar />
            <div className="login-container">
                <LoginComponent />
                <button className="signup-button" onClick={handleSignUp}>
                    회원가입
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
