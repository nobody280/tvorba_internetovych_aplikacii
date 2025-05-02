import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Calendar from './pages/Calendar'; 
import Login from './pages/Login';
import Register from './pages/Register';
import Edit from './pages/Edit';

function App() {
  const [error, setError] = useState('');
  const [authStatus, setAuthStatus] = useState(false);

  return (
    <div className='app'>
      <Router>
        <Routes>
          <Route path="/" element={<Login error={error} setError={setError} setAuthStatus={setAuthStatus} />} />
          <Route path="/register" element={<Register error={error} setError={setError} setAuthStatus={setAuthStatus} />} />
          <Route path="/calendar" element={<Calendar setAuthStatus={setAuthStatus} />} />
          <Route path="/edit" element={<Edit setAuthStatus={setAuthStatus} />} />
        </Routes>
      </Router>
    </div>
  );
};
export default App;