import React, { useState, useEffect } from 'react';
import { getMatches, getPlayers, saveUserSelection } from '../services/dataService';
import { format } from 'date-fns'; 

interface Match {
  id: number;
  team1: string;
  team2: string;
  date: string; 
}

const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null); 
  const [players, setPlayers] = useState<Player[]>([]);
  const [userPrediction, setUserPrediction] = useState(''); 
  const [error, setError] = useState(''); 

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const fetchedMatches = await getMatches();
        const todaysMatches = fetchedMatches.filter((match) => {
          const matchDate = new Date(match.date);
          return matchDate.toDateString() === new Date().toDateString();
        });
        setMatches(todaysMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (selectedMatch) {
        try {
          const allPlayers = await getPlayers();
          const filteredPlayers = allPlayers.filter((player) => 
            player.team === selectedMatch.team1 || player.team === selectedMatch.team2 
          );
          setPlayers(filteredPlayers);
        } catch (error) {
          console.error('Error fetching players:', error);
        }
      } else {
        setPlayers([]); 
      }
    };

    fetchPlayers();
  }, [selectedMatch]); 

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
  };

  const handlePredictionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPrediction(event.target.value);
  };

  const handleSavePrediction = async () => {
    if (!selectedMatch || !userPrediction) {
      setError("Please select a match and enter your prediction.");
      return;
    }

    try {
      // Assuming you have the current user ID available (e.g., stored in local storage)
      const username = 'username'; // TODO: Replace with actual username

      const userSelection = {
        username: username,
        matchId: selectedMatch.id,
        teamname: userPrediction,
        playername: '', // TODO: Add player selection logic
        date: format(new Date(), 'yyyy-MM-dd'), // Include prediction date
      };

      await saveUserSelection(userSelection); 
      setError(''); 
      // Optionally, display a success message to the user
    } catch (err) {
      setError("Error saving prediction. Please try again."); 
      console.error("Error saving prediction:", err);
    }
  };

  return (
    <div>
      <h2>Today's Matches</h2>
      <ul>
        {matches.map((match) => (
          <li key={match.id} onClick={() => handleMatchSelect(match)}> 
            {match.team1} vs {match.team2} - {format(new Date(match.date), 'dd MMM yyyy')}
          </li>
        ))}
      </ul>

      {selectedMatch && (
        <div>
          <h3>Selected Match: {selectedMatch.team1} vs {selectedMatch.team2}</h3>
          <ul>
            {players.map((player) => (
              <li key={player.id}>{player.name} - {player.team}</li>
            ))}
          </ul>

          <div>
            <label htmlFor="userPrediction">Your Prediction:</label>
            <input 
              type="text" 
              id="userPrediction" 
              value={userPrediction} 
              onChange={handlePredictionChange} 
            /> 
            <button onClick={handleSavePrediction}>Save Prediction</button>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchList;