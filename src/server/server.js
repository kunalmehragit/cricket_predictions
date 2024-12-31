import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

// MySQL connection pool
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'cricket_db',
});

app.use(express.json());

app.post('/save-prediction', async (req, res) => {
    console.log('Request received:', req.body);
    const { username, matchId, teamname, playername, date} = req.body;

    const playerNameToInsert = playername === '' ? null : playername;


    try {
        // Insert data into the database
        const [results] = await pool.execute(
            'INSERT INTO ipl_predictions (username, matchId, teamname, playername, date) VALUES (?, ?, ?, ?, ?)',
            [username, matchId, teamname, playerNameToInsert, date]
        );

        res.status(201).json({ message: 'Prediction saved successfully' });
        console.log('Prediction saved successfully');
    } catch (error) {
        console.log('Error saving prediction:', error);
        console.error('Error saving prediction:', error);
        res.status(500).json({ error: 'Error saving prediction' });
    }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});