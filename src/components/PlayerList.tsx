import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayers } from '../services/dataService'; 

const PlayerList: React.FC = () => {
  const { matchId } = useParams(); 
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayersForMatch = async () => {
      try {
        // Implement logic to fetch players based on matchId 
        // (You'll likely need to fetch all matches and find the 
        // match with the given ID)
        const allPlayers = await getPlayers(); 
        // ... (Logic to filter players based on the retrieved match)
        setPlayers(filteredPlayers); 
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    if (matchId) { 
      fetchPlayersForMatch(); 
    }
  }, [matchId]); 

  return (
    <div>
      <h2>Players</h2>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name} - {player.team}</li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerList;