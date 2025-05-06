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
    const [projectWindow, setShowProject] = useState(false);
    const [notifications, setShowNotifications] = useState(false);

    const [project, setProject] = useState('');
    const [user, setUser] = useState(username);
    const [task, setTask] = useState('');
    const [state, setState] = useState('in progress');
    const [description, setDesc] = useState('');
    const [date, setDate] = useState('');
    const [findate, setFinDate] = useState('');
    const [priority, setPriority] = useState('low');
    const [projectTasks, setProjectTask] = useState([{ name: '', user: '', date: '', admin: false }]);
    const [taskList, setTaskList] = useState([]);
    const [noteList, setNoteList] = useState([]);
  
    const [error, setError] = useState('');

    const fetchTasks = async () => {
        try {
          const response = await axios.get('/api/tasks',{ params: { id: userid }});
          setTaskList(response.data);
        } catch (error) {
          console.error('Error loading tasks:', error);
        }
    };

    const getNotifications = () => {
        const relevantTasks = taskList.filter(t => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const days = {
                "low": 1 * 24 * 60 * 60 * 1000,
                "medium": 3 * 24 * 60 * 60 * 1000,
                "high": 7 * 24 * 60 * 60 * 1000
            };

            return t.state === "in progress" && new Date(t.date) <= today+days[t.priority];
        });
        const notes = relevantTasks.map(t => {
            return `Task "${t.decription}" is due by ${t.deadline}.`;
        });
        setNoteList(notes);
    };

    useEffect(() => {
        fetchTasks();
        getNotifications();
    }, [userid]);

    const tasksByDate = (taskList) => {
        return taskList.reduce((acc, task) => {
          const date = task.deadline.slice(0, 10);
          if (!acc[date]) acc[date] = [];
          acc[date].push(task);
          return acc;
        }, {});
    };

    const Notifications = () => {
        
        setShowNotifications(true);
    };

    const getColor = (taskState) => {
        switch (taskState) {
            case 'overdue':
                return 'tomato';
            case 'finished':
                return 'greenyellow';
            default:
                return 'aqua';
        }
    };
    
    const addTask = () => {
        setShowTask(true);
    };

    const newTask = async ()  => {
        try {
          Hide();
          console.log(priority);
          const response = await axios.post('/api/tasks', { task, date, state, priority });
          fetchTasks();
        } catch (error) {
          console.error(error);
          setError(error);
        }
    };

    const handleEditTask = async (task) => {
        setPriority(task.priority);
        console.log(task);
        localStorage.setItem('task', JSON.stringify(task)); 
        navigate('/edit');
    };
    
    const addProject = () => {
        setShowProject(true);
    };

    const appendProjectTask = () => {
        setProjectTask(prev => [...prev, { name: '', user: '', date: '', admin: false }]);
    };

    const updateProjectTask = (index, field, value) => {
        const updatedTasks = [...projectTasks];
        updatedTasks[index] = { ...updatedTasks[index], [field]: value };
        setProjectTask(updatedTasks);
    };

    const newProject = async ()  => {
        try {
            Hide();
            const response = await axios.post('api/projects', {userid, description, priority, findate, projectTasks});
            fetchTasks();
        } catch (error) {
            console.error(error);
            setError(error);
        };
    };
    
    const Hide = () => {
        setShowTask(false);
        setShowProject(false);
        setShowNotifications(false);
    
        setTask('');
        setDate('');
        setProject('');
        setPriority('low');
        setProjectTask([{ name: '', user: '', date: '' }]);
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

        {taskWindow1 && (
                <div className="taskWindow">
                    <h3>Task Info:</h3>
                    <div className="form">
                    <label htmlFor="taskName">TaskName:</label>
                    <input type="text" id="name" name="name" value={task} onChange={e => setTask(e.target.value)} ></input>
                    <br></br>
                    <label htmlFor="priority">Priority:</label>
                    <select id='priority' value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <br></br>
                    <label htmlFor="deadline">Deadline:</label>
                    <input type="date" id="date" name="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]}></input>
                    <br></br>
                    
                    <button type="button" className="colorbutton" onClick={newTask}>Add Task</button>
                    <button type="button" className="colorbutton" onClick={Hide}>Discard</button>
                    </div>
                </div>
        )}

        {projectWindow && (
            <div className='taskWindow'>
                <h3>Project Info:</h3>
                <div className='form'>
                    <label htmlFor="projectName">ProjectName:</label>
                    <input type="text" id="name" name="name" value={description} onChange={e => setDesc(e.target.value)} ></input>
                    <br></br>
                    <label htmlFor="priority">Priority:</label>
                    <select id='priority' value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <br></br>
                    <label htmlFor="deadline">Final Deadline:</label>
                    <input type="date" id="date" name="date" value={findate} onChange={e => setFinDate(e.target.value)} min={new Date().toISOString().split('T')[0]}></input>
                    
                    <br></br>

                    {projectTasks.map((t, index) => (
                        <div>
                            <h4>Task{index+1}</h4>
                            <label htmlFor="taskName">Name:</label>
                            <input type="text" id={`name-${index}`} name="name" value={t.name} onChange={e => updateProjectTask(index, "name", e.target.value)} ></input>
                            <br></br>
                            <label htmlFor="taskAssignment">User:</label>
                            <input type="text" id={`user-${index}`} name="user" value={t.user} onChange={e => updateProjectTask(index, "user", e.target.value)} ></input>
                            <input type="checkbox" id={`admin-${index}`} name="admin" checked={t.admin == true} onChange={(e) => updateProjectTask(index, "admin", e.target.value)}></input>
                            <label htmlFor="taskAssignment">User is Admin</label>
                            <br></br>
                            <label htmlFor="deadline">Final Deadline:</label>
                            <input type="date" id={`date-${index}`} name="date" value={t.date} onChange={e => updateProjectTask(index, "date", e.target.value)} min={new Date().toISOString().split('T')[0]} max = {findate || new Date().toISOString().split('T')[0]}></input>
                            
                        </div>
                    ))}
                    <button type='button' className='plusbutton' onClick={appendProjectTask}>+</button>
                    <br></br>
                    <button type="button" className="colorbutton" onClick={newProject}>Add Project</button>
                    <button type="button" className="colorbutton" onClick={Hide}>Discard</button>
                </div>
            </div>
        )}

        {notifications && (
            <div className='taskWindow'>
                {noteList.map((note) => (
                    <div>
                        <h4>Upcoming deadline</h4>
                        
                    </div>
                ))}
            </div>
        )}


        <nav>
          <div>{username}</div>
          <button type='button' onClick={Notifications}>Notifications</button>
          <button type="button" onClick={addTask}>New Task</button>
          <button type="button" onClick={addProject}>New Project</button>
          <button type="button" onClick={handleLogout}>LogOut</button>
        </nav>

        <div className='calendar'>
            <div className="month">
                <button type="button" onClick={oneLess}>&laquo;</button>
                <h2>{new Date(year, month).toLocaleString("en-US", { month: "long" })} {year}</h2>
                <button type="button" onClick={oneMore}>&raquo;</button>
            </div>

            <div className="monthbox">
            {items.map((_, index) => {
                const dayOfMonth = index;
                const currentDate = `${year}-${String(month+1).padStart(2, '0')}-${String(dayOfMonth+1).padStart(2, '0')}`;
                const groupedTasks = tasksByDate(taskList);
                const tasksForThisDay = groupedTasks[currentDate] || [];

                return (
                    <div className="daybox" key={index}>
                    {dayOfMonth+1}.
                        {tasksForThisDay.map((task, taskIndex) => (
                         <button className="taskbutton" style={{backgroundColor: getColor(task.state)}} onClick={() => handleEditTask(task)} key={task.id}>{task.decription}</button>
                        ))}
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
