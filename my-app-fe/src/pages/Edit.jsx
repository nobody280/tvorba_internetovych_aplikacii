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
    const projectid = task.project;
    const project = task.name;
    const [decription, setTask] = useState(task.decription);
    const [priority, setPriority] = useState(task.project_priority);
    const [state, setState] = useState(task.state);
    const [date, setDate] = useState(task.deadline.split('T')[0]);
    const admin = task.admin;

    const allowEdit = admin && (state !== 'overdue')

    const [taskList, setTaskList] = useState([]);
    const [error, setError] = useState('');

    const fetchProject = async () => {
        try {
          const response = await axios.get('/api/projects',{ params: { id: userid, project: projectid }});
          setTaskList(response.data);
        } catch (error) {
          console.error('Error loading tasks:', error);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [userid, projectid]);

    const Back = () => {
        navigate('/calendar');
    };

    const editTask = async () => {
        try {
            if (admin) {
                const updatePromises = taskList.map(item => 
                    axios.put(`/api/tasks/${item.id}`, {
                      decription: item.decription,
                      priority: item.priority,
                      state: item.state,
                      date: item.deadline,
                    })
                  );
                await Promise.all(updatePromises);
                alert('All tasks saved successfully!');
            } else {
                const response = await axios.put(`/api/tasks/${taskid}`, { decription, priority, state, date });
            }
            navigate('/calendar');
          } catch (error) {
            console.error(error);
            setError(error);
          }
    };

    const deleteTask = async () => {
        try {
            const response = await axios.delete(`/api/tasks/${taskid}`);
            navigate('/calendar');
        } catch (error) {
            console.error(error);
            setError(error);
        }
    };

    const deleteProject = async () => {
        try {
            const response = await axios.delete(`/api/projects/${projectid}`);
            navigate('/calendar');
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
            
            {admin && (
                <>
                    <button className="logbutton" onClick={deleteProject}>
                    Delete Project
                    </button>
                    <br />

                    {taskList.map((t, index) => (
                    <div key={t.id}>
                        <label htmlFor={`taskName-${index}`}>Task {index + 1}:</label>
                        <input
                        type="text"
                        id={`taskName-${index}`}
                        name="name"
                        value={t.decription}
                        onChange={(e) => {
                            const updated = [...taskList];
                            updated[index].decription = e.target.value;
                            setTaskList(updated);
                        }}
                        />
                        <br />

                        <label htmlFor={`priority-${index}`}>Priority:</label>
                        <select
                        id={`priority-${index}`}
                        value={t.priority}
                        onChange={(e) => {
                            const updated = [...taskList];
                            updated[index].priority = e.target.value;
                            setTaskList(updated);
                        }}
                        >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        </select>
                        <br />

                        <label htmlFor={`date-${index}`}>Deadline:</label>
                        <input
                        type="date"
                        id={`date-${index}`}
                        name="date"
                        value={t.deadline?.split('T')[0] || ''}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                            const updated = [...taskList];
                            updated[index].deadline = e.target.value;
                            setTaskList(updated);
                        }}
                        />
                        <br />

                        <input
                        type="checkbox"
                        id={`state-${index}`}
                        name="state"
                        checked={t.state === 'finished'}
                        onChange={(e) => {
                            const updated = [...taskList];
                            updated[index].state = e.target.checked ? 'finished' : 'in progress';
                            setTaskList(updated);
                        }}
                        />
                        <label htmlFor={`state-${index}`}>Mark as Finished</label>
                        <br />
                    </div>
                    ))}
                </>
                )}

            {!admin && (
                <>
                <br></br>
                <br></br>
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
                </>
            )}
            
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
                    <br></br>
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
