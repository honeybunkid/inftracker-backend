import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let gameState = {
  currentGame: null,
  isPlaying: false,
  screenshot: null,
  timestamp: Date.now()
};

app.get('/games', (req, res) => {
  res.json({
    success: true,
    data: gameState
  });
});

app.post('/games/update', (req, res) => {
  const { currentGame, isPlaying, screenshot } = req.body;
  
  gameState = {
    currentGame,
    isPlaying,
    screenshot,
    timestamp: Date.now()
  };
  
  console.log(`Update: ${isPlaying ? `Playing ${currentGame}` : 'Not playing'}`);
  res.json({ success: true });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Running on :${PORT}`);
});
