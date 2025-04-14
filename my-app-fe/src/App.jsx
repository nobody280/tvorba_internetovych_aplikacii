import React, { useEffect, useState } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true);
  const [logged, setIsLogged] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [taskWindow, setShowTask] = useState(false);
  const [count, setCount] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear()); 
  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const items = Array(daysInMonth).fill(null);

  useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const addTask = () => {
    setShowTask(!taskWindow);
  };

  const addProject = () => {
    // Will fix
  };

  const oneLess = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1); 
    } else {
      setMonth(month - 1);
    }
  };

  const oneMore = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (logged) {
    return (
      <>
        <nav>
        {users.map(user => (
            <div>{user.first_name} {user.last_name}</div>
          ))}
          <button type="button" onClick={addTask}>New Task</button>
          <button type="button" onClick={addProject}>New Project</button>
        </nav>

        {taskWindow && (
          <div className="taskWindow">
            <h3>Task Info:</h3>
            <div className="form">
              <input type="text" id="name" name="name" placeholder="Task name" />
              <input type="text" id="description" name="description" placeholder="Description" />
            </div>
          </div>
        )}

        <div className="calendar">
          <div className="month">
            <button type="button" onClick={oneLess}>&laquo;</button>
            <h2>{new Date(year, month).toLocaleString("default", { month: "long" })} {year}</h2>
            <button type="button" onClick={oneMore}>&raquo;</button>
          </div>
          <div className="monthbox">
            {items.map((_, index) => (
              <div className="daybox" key={index}>
                {index + 1}.
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } else {
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
          <button 
            onClick={(e) => {
              e.preventDefault();
              axios.post('/api/users', { username, password })
              .then(response => {
                setIsLogged(true);
              })
              .catch(error => {
                console.error('Login failed:', error);
              });
            }}
          >
            Login
          </button>
        </form> 
      </div>
      </>
    );
  }
  
}

export default App;
