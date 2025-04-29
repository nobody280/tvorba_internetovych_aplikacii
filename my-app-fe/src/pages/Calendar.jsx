import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from '../services/authService';
import axios from 'axios';
import '../App.css'

import {
    groupTasksByDate,
    oneLess,
    oneMore,
    showTaskForm,
    hideForms,
    createTask
  } from '../services/appService'

function Calendar(props) {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
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
  
    
    
    const addTask = () => {
        setShowTask(true);
    };

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
    
    const addProject = () => {};
    
    const Hide = () => {
        setShowTask(false);
        setShowProject(false);
    
        setTask('');
        setDate('');
        setProject('');
      }

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
    }

    
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
                    <input type="date" id="date" name="date" value={date} onChange={e => setDate(e.target.value)}></input>
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
                const tasksForThisDay = tasksByDate[currentDate] || [];

                return (
                    <div className="daybox" key={index}>
                    {dayOfMonth+1}.
                    
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