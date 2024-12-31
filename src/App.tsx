import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import LoginForm from './components/LoginForm'; 
import MatchList from './components/MatchList';
import PlayerList from './components/PlayerList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/matches" element={<MatchList />} /> 
        <Route path="/matches/:matchId" element={<PlayerList />} /> 
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;