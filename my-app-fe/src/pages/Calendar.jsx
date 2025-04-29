import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from '../services/authService';
import axios from 'axios';
import '../App.css'

function Calendar(props) {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const userid = localStorage.getItem('userid');
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear()); 
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const items = Array(daysInMonth).fill(null);

    const [taskWindow1, setShowTask] = useState(false);
    const [taskWindow2, setShowProject] = useState(false);
    const [EditWindow1, setEditTask] = useState(false);

    const [project, setProject] = useState('');
    const [task, setTask] = useState('');
    const [state, setState] = useState('in progress');
    const [description, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [taskList, setTaskList] = useState([]);
    const [selectedTask, setSelectedTask] = useState('');
  
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTasks = async () => {
            try {
              const response = await axios.get('/api/tasks',{ params: { id: userid }});
              setTaskList(response.data);
            } catch (error) {
              console.error('Error loading tasks:', error);
            }
        };
        fetchTasks();
    }, [userid]);

    const tasksByDate = (taskList) => {
        return taskList.reduce((acc, task) => {
          const date = task.deadline.slice(0, 10);
          if (!acc[date]) acc[date] = [];
          acc[date].push(task);
          return acc;
        }, {});
    };
    
    const addTask = () => {
        setShowTask(true);
    };

    const newTask = async ()  => {
        try {
          Hide();
          const response = await axios.post('/api/tasks', { username, task, date, state });
          const createdTask = response.data;
          console.log(createdTask);
          fetchTasks();
        } catch (error) {
          console.error(error);
          setError(error);
        }
    };
    
    const addProject = () => {};
    
    const Hide = () => {
        setShowTask(false);
        setShowProject(false);
    
        setTask('');
        setDate('');
        setProject('');
    };

    const handleLogout = () => {
        logout()
        .then(() => {
            props.setAuthStatus(false);
            localStorage.clear(); 
            navigate('/');
        })
        .catch((error) => {
            console.error('Logout failed:', error.message);
        });
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
    
    return (
        <>
        <nav>
          <div>{username}</div>
          <button type="button" onClick={addTask}>New Task</button>
          <button type="button" onClick={addProject}>New Project</button>
          <button type="button" onClick={handleLogout}>LogOut</button>
        </nav>

        <div className='calendar'>
            <div className="month">
                <button type="button" onClick={oneLess}>&laquo;</button>
                <h2>{new Date(year, month).toLocaleString("default", { month: "long" })} {year}</h2>
                <button type="button" onClick={oneMore}>&raquo;</button>
            </div>

            {taskWindow1 && (
                <div className="taskWindow">
                    <h3>Task Info:</h3>
                    <br></br>
                    <div className="form">
                    <label htmlFor="taskName">TaskName:</label>
                    <input type="text" id="name" name="name" value={task} onChange={e => setTask(e.target.value)} ></input>
                    <br></br>
                    <label htmlFor="deadline">Deadline:</label>
                    <input type="date" id="date" name="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}></input>
                    <br></br>

                    <button type="button" className="colorbutton" onClick={newTask}>Add Task</button>
                    <button type="button" className="colorbutton" onClick={Hide}>Discard Task</button>
                    </div>
                </div>
            )}

            <div className="monthbox">
            {items.map((_, index) => {
                const dayOfMonth = index;
                const currentDate = `${year}-${String(month+1).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}`;
                const groupedTasks = tasksByDate(taskList);
                const tasksForThisDay = groupedTasks[currentDate] || [];

                return (
                    <div className="daybox" key={index}>
                    {dayOfMonth+1}.
                    <ul>
                        {tasksForThisDay.map((task, taskIndex) => (
                        <li key={taskIndex}>
                         <button className="taskbutton">{task.decription}</button>
                        </li>
                        ))}
                    </ul>
                    </div>
                );
                }
            )}
            </div>
        </div>
        </> 
    );
};

export default Calendar;