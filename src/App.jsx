import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const items = Array(daysInMonth).fill(null);

  return (
    <>

      <nav>
        <button type='button' onClick="alert('Click')">New Task</button>
        <button type='button' onClick="alert('Click')">New Project</button>
      </ nav>

      <div class="calendar">
        <div class = "month"><button type='button' onClick="">left</button><h2>{today.toLocaleString("default", { month: "long" })} {year}</h2><button type='button' onClick="">right</button></div>
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
