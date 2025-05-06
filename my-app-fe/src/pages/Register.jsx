import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from '../services/authService';
import '../App.css'

function Register (props) {
    const navigate = useNavigate();
    
    const [first_name, setName1] = useState('');
    const [last_name, setName2] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password_copy, setPasswordCopy] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        if (username === '' || password === '') {
            props.setError('Username and password are required!');
            return;
        }

        if ( password !== password_copy) {
            props.setError('password doesnt match');
            return;
        }

        register( username, first_name, last_name, password )
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
        <div className="month"><h2>Register</h2></div>
        <form className="registerform"> 
            <label htmlFor="name">Name:</label>
            <input type="text" id="first_name" name="first_name" value={first_name} onChange={e => setName1(e.target.value)} ></input>
            <input type="text" id="last_name" name="last_name" value={last_name} onChange={e => setName2(e.target.value)} ></input>
            <br></br>

            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={username} onChange={e => setUsername(e.target.value)} ></input>
            <br></br>

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={e => setPassword(e.target.value)} ></input>
            <br></br>

            <label htmlFor="password_copy">Repeat Password:</label>
            <input type="password" id="password_copy" name="password_copy" value={password_copy} onChange={e => setPasswordCopy(e.target.value)} ></input>
            <br></br>

            <button className="logbutton" onClick={handleRegister}>
              Register&Login
            </button>
        </form>
        </>
    );
};

export default Register;
