import React, { useState, useEffect } from 'react';
import { getUsers, getMatches, getPlayers } from '../services/dataService';
// import './LoginForm.css'; 
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [matches, setMatches] = useState<Match[]>([]); 
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const allMatches = await getMatches();
        if (selectedDate) {
          const selectedDateMatches = allMatches.filter((match) => {
            const matchDate = new Date(match.date); 
            return matchDate.toDateString() === selectedDate.toDateString(); 
          });
          setMatches(selectedDateMatches);
        } else {
          // Handle case where no date is selected (e.g., display all matches)
          setMatches(allMatches); 
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [selectedDate]); 

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const allPlayers = await getPlayers();
        const filteredPlayers = matches.length > 0 
          ? allPlayers.filter((player) => 
              player.team === matches[0].homeTeam || player.team === matches[0].awayTeam 
            ) 
          : []; 
        setPlayers(filteredPlayers);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    fetchPlayers();
  }, [matches]); 

  const handleLogin = async () => {
    try {
      const users = await getUsers();
      const user = users.find(
        (user) => user.username === username && user.password === password
      );

      if (user) {
        console.log('Login successful!'); 
        // You would typically use a router here to navigate to another component
        // Example using react-router-dom:
        // useNavigate 
        navigate('/matches'); 
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-container"> 
      <h2>Login</h2>
      <input 
        type="text" 
        placeholder="Username" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}

      {/* ... (rest of the JSX) ... */}
    </div>
  );
};

export default LoginForm;