import React, { useEffect, useState } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [taskWindow, setShowTask] = useState(false);
  const [count, setCount] = useState(0)
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const items = Array(daysInMonth).fill(null);

  const addTask = () => {
    setShowTask(!taskWindow);
    console.log("ADD TASK"); 
  }; 

  return (
    <>

      <nav>
        <button type='button' onClick={addTask}>New Task</button>
        <button type='button' onClick="alert('Click')">New Project</button>
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
        <div class = "month"><button type='button' onClick="">&laquo;</button><h2>{today.toLocaleString("default", { month: "long" })} {year}</h2><button type='button' onClick="">&raquo;</button></div>
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
