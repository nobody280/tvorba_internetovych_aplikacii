import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../services/authService';
import '../App.css'

function LoginPage(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const navigate = useNavigate();


};

export default LoginPage;