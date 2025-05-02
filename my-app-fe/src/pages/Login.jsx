import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../services/authService';
import '../App.css'

function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const navigate = useNavigate();

    const handleRegister = () => {
      navigate('/register');
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === '' || password === '') {
            props.setError('Username and password are required!');
            return;
        }

        login(username, password)
          .then((response) => {
              props.setAuthStatus(true);
              localStorage.setItem('username', response.userName);
              localStorage.setItem('userid', response.userId);
              navigate('/calendar');
          })
          .catch((error) => {
              console.log(error.message);
              props.setError(error.message);
        });

        props.setError('');
    };
    return (
        <>
        <div className = "login">
          
          <form className="loginform">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} ></input>
            <br></br>
            <label htmlFor="password">Last name:</label>
            <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} ></input>
            <br></br>
            
          </form> 
            <button className="logbutton" onClick={handleLogin}>
              Login
            </button>
            <button className="logbutton" onClick={handleRegister}>
              Register
            </button>
        </div>
        </>
      );
};

export default Login;