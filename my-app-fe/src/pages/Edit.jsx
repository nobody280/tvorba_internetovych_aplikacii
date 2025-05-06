import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import '../App.css'

function Edit (props) {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const userid = localStorage.getItem('userid');
    const task = JSON.parse(localStorage.getItem('task'));

    const taskid = task.id;
    const project = task.name;
    const [decription, setTask] = useState(task.decription);
    const [priority, setPriority] = useState(task.project_priority);
    const [state, setState] = useState(task.state);
    const [date, setDate] = useState(task.deadline.split('T')[0]);
    const admin = task.admin;

    const allowEdit = admin && (state != 'overdue')

    const [error, setError] = useState('');

    const Back = () => {
        navigate('/calendar');
    };

    const editTask = async () => {
        try {
            const response = await axios.put(`/api/tasks/${taskid}`, { decription, priority, state, date });
            navigate('/calendar');
          } catch (error) {
            console.error(error);
            setError(error);
          }
    };

    const deleteTask = async () => {
        try {
            const response = await axios.delete(`/api/tasks/${taskid}`);
            Back();
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    return (
        <>
        <div className='app'>
            <div className='month'>
                <h3>Task Info</h3>
            </div>

            {allowEdit && (
            <>
            <div className="form">
            <label htmlFor="taskName">Project:{project}</label>
                <label htmlFor="taskName">TaskName:</label>
                <input type="text" id="name" name="name" value={decription} onChange={e => setTask(e.target.value)}></input>
                <br></br>

                <label htmlFor="priority">Priority:</label>
                <select id='priority' value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <br></br>

                <label htmlFor="date">Deadline:</label>
                <input type="date" id="date" name="date" value={date} onChange={e => setDate(e.target.value) } min={new Date().toISOString().split('T')[0]}></input>
                <br></br>
                
                <input type="checkbox" id="state" name="state" checked={state === 'finished'} onChange={(e) => setState(e.target.checked ? 'finished' : 'in progress')}></input>
                <label htmlFor="state">Mark as Finished</label>
                <br></br>
            </div>

            <button className="logbutton" onClick={editTask}>
              Save
            </button>
            <button className="logbutton" onClick={Back}>
              GoBack
            </button>
            <button className="logbutton" onClick={deleteTask}>
              Delete
            </button>
            </>
            )}


            {!allowEdit && (
                <>
                <div className="form">
                    <label htmlFor="taskName">Project: {project}</label>
                    <label htmlFor="taskName">TaskName: {decription}</label>
                    <br></br>
                    <label htmlFor="priority">Priority: {priority}</label>
                    <br></br>
                    <label htmlFor="date">Deadline: {date}</label>
                    <input type="checkbox" id="state" name="state" checked={state === 'finished'} onChange={(e) => setState(e.target.checked ? 'finished' : 'in progress')}></input>
                    <label htmlFor="state">Mark as Finished</label>
                    <br></br>
                </div>

                <button className="logbutton" onClick={editTask}>
                Save
                </button>
                <button className="logbutton" onClick={Back}>
                GoBack
                </button>
                </>
            )}
        </div>
        </>
    );
};

export default Edit;
