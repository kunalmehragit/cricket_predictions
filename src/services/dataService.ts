import * as Papa from 'papaparse';
import axios from 'axios';

interface User {
  userId: string;
  username: string;
  password: string;
}

interface Match {
  id: number;
  team1: string;
  team2: string;
  date: string; 
}

interface Player {
  id: number;
  name: string;
  team: string; 
  role: string;
  price: number;
}

interface UserSelection {
  username: string;
  matchId: number;
  teamname: string;
  playername: string;
  date: string;
}

const usersFilePath = './src/data/bloom_users.csv';
const matchesFilePath = './src/data/ipl_matches.csv';
const playersFilePath = './src/data/ipl_players.csv';
const userSelectionsFilePath = './src/data/ipl_choices.csv';

const loadData = async (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      header: true,
      download: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        console.error(`Error parsing ${filePath}:`, error);
        reject(error);
      },
    });
  });
};

export const saveData = async (selection: any) => {
  try {    
    const existingData = localStorage.getItem('userSelections') || '[]';
    const parsedData = JSON.parse(existingData) as UserSelection[];
    parsedData.push(selection[0]);
    localStorage.setItem('userSelections', JSON.stringify(parsedData));
    console.log(parsedData);
    console.log('User selection saved successfully.');
  } catch (error) {
    console.error('Error saving user selection:', error);
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const data = await loadData(usersFilePath);
    console.log('Loaded users data:', data); 
    return data.map((row: any) => ({ 
      username: row.username, 
      password: row.password 
    })) as User[]; 
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

export const getMatches = async (): Promise<Match[]> => {
  try {
    const data = await loadData(matchesFilePath);
    console.log('Loaded matches data:', data); 
    return data as Match[];
  } catch (error) {
    console.error('Error loading matches:', error);
    return [];
  }
};

export const getPlayers = async (): Promise<Player[]> => {
  try {
    const data = await loadData(playersFilePath);
    console.log('Loaded players data:', data); 
    return data as Player[];
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
};

export const getUserSelections = async (username: string): Promise<UserSelection[]> => {
  try {
    const data = await loadData(userSelectionsFilePath);
    const userSelections = data.filter((selection: UserSelection) => selection.username === username) as UserSelection[];
    console.log('Loaded user selections:', userSelections); 
    return userSelections;
  } catch (error) {
    console.error('Error loading user selections:', error);
    return [];
  }
};

export const saveUserSelection = async (selection: UserSelection) => {
  try {
    // Load existing data from the file
    const existingData = await loadData(userSelectionsFilePath); 

    console.log('Existing data:', existingData);

    // Find the index of the existing selection (if any)
    const existingSelectionIndex = existingData.findIndex(
      (s) => s.username === selection.username && s.matchId === selection.matchId 
    );

    console.log('Existing selection index:', existingSelectionIndex);

    if (existingSelectionIndex !== -1) {
      // Update existing selection
      existingData[existingSelectionIndex] = selection; 
    } else {
        existingData.push(selection); 
    }

    console.log('Updated data:', existingData[0]);

    const response = await axios.post('http://localhost:3001/save-prediction', selection); 

    if (response.status === 201) {
      console.log('User selection saved successfully.');
      alert('User selection saved successfully.');

    } else {
      console.error('Error saving user selection:', response.statusText);
    }

  } catch (error) {
    console.error('Error saving user selection:', error);
  }
};