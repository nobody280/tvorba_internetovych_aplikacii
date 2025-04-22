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
  const [EditWindow1, setEditTask] = useState(false);
  const [count, setCount] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear()); 
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const items = Array(daysInMonth).fill(null);

  const [project, setProject] = useState('');
  const [task, setTask] = useState('');
  const [state, setState] = useState('in progress');
  const [description, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  

  const [error, setError] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [message, setMessage] = useState('');

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

  const editTask = (t) => {
    setEditTask(true);
    setSelectedTask(t);
  };

  const addOneDay = (date) => {
    const dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + 1); 
    return dateObj.toISOString().slice(0, 10); 
  };

  const saveTask = async () => {
    try {
      removeTask();
      if (!date && selectedTask?.deadline) {
        
        setDate(addOneDay(selectedTask.deadline.slice(0, 10)));
      }
      setEditTask(false);
      const response = await axios.post('/api/tasks', { username, task, date, state });
      const createdTask = response.data;
      setTaskList(prevList => [...prevList, createdTask]);
      setTask("");
      setDate("");
      setState("in progress");
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const removeTask = () => {
    setMessage("Remove feature will be added later");
  };

  const Leave = () => {
    setEditTask(false);
  }

  const addProject = () => {
    setMessage("This feature will be finished in the future");
    setShowTask(true);
  };

  const Hide = () => {
    setShowTask(false);
    setShowProject(false);

    setTask('');
    setDate('');
    setProject('');
  }

  const newTask = async ()  => {
    try {
      Hide();
      const response = await axios.post('/api/tasks', { username, task, date, state });
      const createdTask = response.data;
      setTaskList(prevList => [...prevList, createdTask]);
    } catch (error) {
      console.error(error);
      setError(error);
    }
  }
  
  const newProject = () => {
    setMessage("This feature will be added later");
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

  const logout = () => {
    setIsLogged(false);
    setUsername('USER 1');
    setPassword('password');
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
          <button type="button" onClick={logout}>LogOut</button>
        </nav>

        {message && (
          <div className='message'>
            {message}
            <button type="colorbutton" onClick={() => setMessage('')}>Understand</button>
          </div>
        )}

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

        {EditWindow1 && (
          <div className="editWindow">
              <h3>Edit Task:</h3>
              <label htmlFor="taskName">TaskName:</label>
              <input type="text" id="name" name="name" value={task} placeholder={String(selectedTask.decription)} onChange={e => setTask(e.target.value) } ></input>
              <br></br>
       
              <label htmlFor="deadline">CurrentDeadline: {String( selectedTask.deadline.slice(0, 10))}</label>
              <br></br>

              <label htmlFor="deadline">NewDeadline:</label>
              <input type="date" id="date" name="date" value={date} onChange={e => setDate(e.target.value)}></input>
              <br></br>

              <label htmlFor="state">Current State:</label>
              <select 
                  id="state"
                  name="state"
                  value={state}
                  onChange={e => setState(e.target.value)}
                >
                  <option value="in progress">InProgress</option>
                  <option value="finished">Finished</option>
              </select>
              <br></br>

              <button className='colorbutton' onClick={saveTask}>Edit</button>
              <button className='colorbutton' onClick={Leave}>GoBack</button>
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
                  {tasksForThisDay.map(task => (
                    <button
                      className="taskbutton"
                      onClick={() => editTask(task)}
                      key={task.task_id}
                    >
                      {task.decription}
                    </button>
                  ))}
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
