import React, { useEffect, useState } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [logged, setIsLogged] = useState(false);
  const [username, setUsername] = useState('USER 1');
  const [password, setPassword] = useState('password');
  const [taskWindow1, setShowTask] = useState(false);
  const [taskWindow2, setShowProject] = useState(false);
  const [count, setCount] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear()); 
  const today = new Date();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const items = Array(daysInMonth).fill(null);

  const [project, setProject] = useState('');
  const [task, setTask] = useState('');
  const [description, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [taskList, setTaskList] = useState([]);


  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true);  


  useEffect(() => {
    if (!logged) return;
  
    const loadTasks = async () => {
      try {
        const response = await axios.get('/api/tasks', {
          params: { username: username }
        });
        setTaskList(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
        setLoading(false);
      }
    };
  
    loadTasks();
  }, [logged, username]);


  const AppendTasks = (newVal) => {
    setTasks(prev => [...prev, newVal]);
  };

  const addTask = () => {
    setShowTask(true);
  };

  const addProject = () => {
    setShowProject(true);
  };

  const Hide = () => {
    setShowTask(false);
    setShowProject(false);

    setTask('');
    setDate('');
  }

  const newTask = async ()  => {
    try {
      Hide();
      const response = await axios.post('/api/tasks', { username, task, date });
      const createdTask = response.data;
      setTaskList(prevList => [...prevList, createdTask]);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }
  
  const newProject = () => {
    // will fix
  }

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

  const tasksByDate = taskList.reduce((acc, task) => {
    const date = task.deadline.slice(0, 10);
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {});

  if (loading) {<div>Loading...</div>};

  if (logged) {
    return (
      <>
        <nav>
        <div>{username}</div>
          <button type="button" onClick={addTask}>New Task</button>
          <button type="button" onClick={addProject}>New Project</button>
        </nav>

        {taskWindow1 && (
          <div className="taskWindow">
            <h3>Task Info:</h3>
            <br></br>
            <div className="form">
              <label htmlFor="taskName">TaskName:</label>
              <input type="text" id="name" name="name" value={task} onChange={e => setTask(e.target.value)} ></input>
              <br></br>
              <label htmlFor="deadline">Deadline:</label>
              <input type="date" id="date" name="date" value={date} onChange={e => setDate(e.target.value)}></input>
              <br></br>

              <button className='colorbutton' onClick={newTask}>AddTask</button>
              <button className='colorbutton' onClick={Hide}>DiscardTask</button>
            </div>
          </div>
        )}

        {taskWindow2 && (
          <div className="taskWindow">
            <h3>Project Info:</h3>
            <div className='form'>
              <label htmlFor="taskName">ProjectName:</label>
              <input type="text" id="name" name="name" value={project} onChange={e => setProject(e.target.value)} ></input>

              <label htmlFor="taskName">TaskName1:</label>
              <input type="text" id="name" name="name" value={task} onChange={e => AppendTasks()} ></input>
              <br></br>
              <br></br>
              <label htmlFor="taskName">TaskName2:</label>
              <input type="text" id="name" name="name" value={task} onChange={e => AppendTasks()} ></input>
              <br></br>
              <br></br>
              <label htmlFor="taskName">TaskName3:</label>
              <input type="text" id="name" name="name" value={task} onChange={e => AppendTasks()} ></input>
              <br></br>
              <br></br>
              <label htmlFor="deadline">Deadline:</label>
              <input type="date" id="date" name="date" value={date} onChange={e => setDate(e.target.value)}></input>
              <br></br>
              <label htmlFor="description" value={description} onChange={e => setDesc(e.target.value)}>Description:</label>
              <input type="text" id="description" name="description"></input>
              <br></br>
              <button className='colorbutton' onClick={newProject}>AddProject</button>
              <button className='colorbutton' onClick={Hide}>DiscardProject</button>
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
            {items.map((_, index) => {
              const dayOfMonth = index;
              const currentDate = `${year}-${String(month+1).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`;
              const tasksForThisDay = tasksByDate[currentDate] || [];

               return (
                <div className="daybox" key={index}>
                  {dayOfMonth+1}.
                  {tasksForThisDay.length > 0 && (
                    <ul>
                      {tasksForThisDay.map(task => (
                        <li key={task.task_id}>{task.decription}</li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            }
            )}
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
