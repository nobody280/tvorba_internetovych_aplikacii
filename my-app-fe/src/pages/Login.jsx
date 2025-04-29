import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from '../services/authService';
import '../App.css'

function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const navigate = useNavigate();

    const registration = () => {
      register()
      .then((response) => {
        props.setAuthStatus(true);
        localStorage.setItem('username', response.userName);
        navigate('/calendar');
    })
    .catch((error) => {
        console.log(error.message);
        props.setError(error.message);
  });

  props.setError('');
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (username === '' || password === '') {
            props.setError('Username and password are required!');
            return;
        }

        login(username, password)
          .then((response) => {
              props.setAuthStatus(true);
              localStorage.setItem('username', response.userName);
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
          <div className='month'>
            <h2>Loggin</h2>
          </div>
          
          <form>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} ></input>
            <br></br>
            <label htmlFor="password">Last name:</label>
            <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} ></input>
            <br></br>
            <button onClick={handleSubmit}>
              Login
            </button>
            <button onClick={registration}>
              Register
            </button>
          </form> 
        </div>
        </>
      );
};

export default Login;