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
    const [decription, setTask] = useState(task.decription);
    const [priority, setPriority] = useState(task.priority);
    const [state, setState] = useState(task.state);
    const [date, setDate] = useState(task.deadline.split('T')[0]);

    const [error, setError] = useState('');

    const Back = () => {
        navigate('/calendar');
    };

    const editTask = async () => {
        try {
            const response = await axios.put('/api/tasks/', { data: { taskid, decription, priority, state, date } });
            Back();
          } catch (error) {
            console.error(error);
            setError(error);
          }
    };

    const deleteTask = async () => {
        try {
            const response = await axios.delete('/api/tasks/', { data: { taskid } });
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

            <div className="form">
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
                
                <label htmlFor="state">Mark as Finished</label>
                <input type="checkbox" id="state" name="state" checked={state === 'finished'} onChange={(e) => setState(e.target.checked ? 'finished' : 'in progress')}></input>
                <br></br>
            </div>

            <button className="logbutton" onClick={editTask}>
              SaveChanges
            </button>
            <button className="logbutton" onClick={Back}>
              DiscardChanges
            </button>
            <button className="logbutton" onClick={deleteTask}>
              DeleteTask
            </button>
        </div>
        </>
    );
};

export default Edit;
