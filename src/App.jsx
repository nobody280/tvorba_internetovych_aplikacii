import React, { useEffect, useState } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [users, setUsers] = useState([]);
  const [taskWindow, setShowTask] = useState(false);
  const [count, setCount] = useState(0)
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear()); 
  const today = new Date();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const items = Array(daysInMonth).fill(null);

  

  const addTask = () => {
    setShowTask(!taskWindow);
    console.log("ADD TASK"); 
  }; 

  const oneMore = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const oneLess = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1); 
    } else {
      setMonth(month - 1);
    }
  };

  return (
    <>
      <nav>
        <button type='button' onClick={addTask}>New Task</button>
        <button type='button' onClick={addTask}>New Project</button>
      </ nav>

      {taskWindow && (
        <div class = "taskWindow">
          <h3>Task Info:</h3>
          <div class = "form">
            <input type="text" id="name" name="name" placeholder="Task name" />
            <input type="text" id="discription" name="discription" placeholder="Discription" />
            
          </div>
          
          
        </div>
      )}

      <div class="calendar">
        <div class = "month">
          <button type='button' onClick={oneLess}>&laquo;</button><h2>
            {new Date(year, month).toLocaleString("default", { month: "long" })} {year}</h2>
          <button type='button' onClick={oneMore}>&raquo;</button></div>
        <div class = "monthbox">
          {items.map((_, index) => (
            <div class="daybox">
              {index + 1}.
            </div>
          ))}
        </div>
        
      </div>
    </>
  )
}

export default App
