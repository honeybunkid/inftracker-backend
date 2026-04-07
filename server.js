import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let gameState = {
  currentGame: null,
  isPlaying: false,
  screenshot: null,
  timestamp: Date.now(),
  sessionStartTime: null,  
  playDuration: 0          
};

app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    message: 'inftracker.live backend',
    endpoints: {
      games: '/games',
      update: '/games/update'
    },
    timestamp: Date.now()
  });
});

app.get('/games', (req, res) => {
 
  let currentDuration = gameState.playDuration;
  
  if (gameState.isPlaying && gameState.sessionStartTime) {
    const elapsedSeconds = Math.floor((Date.now() - gameState.sessionStartTime) / 1000);
    currentDuration = elapsedSeconds;
  }
  
  res.json({
    success: true,
    data: {
      ...gameState,
      playDuration: currentDuration
    }
  });
});

app.post('/games/update', (req, res) => {
  const { currentGame, isPlaying, screenshot } = req.body;
  
  const now = Date.now();
  const previousGame = gameState.currentGame;
  
 
  if (currentGame !== previousGame) {
    gameState.sessionStartTime = isPlaying ? now : null;
    gameState.playDuration = 0;
    console.log(`game changed: ${previousGame || 'None'} → ${currentGame || 'None'}`);
  }
  
  else if (isPlaying && !gameState.isPlaying) {
    gameState.sessionStartTime = now;
    gameState.playDuration = 0;
  }
  
  else if (!isPlaying && gameState.isPlaying) {
    gameState.sessionStartTime = null;
    gameState.playDuration = 0;
  }
  
  gameState = {
    ...gameState,
    currentGame,
    isPlaying,
    screenshot,
    timestamp: now
  };
  
  const duration = gameState.sessionStartTime 
    ? Math.floor((now - gameState.sessionStartTime) / 1000)
    : 0;
  
  console.log(`update: ${isPlaying ? `Playing ${currentGame} (${formatTime(duration)})` : 'Not playing'}`);
  res.json({ success: true });
});

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`backend running on ${PORT}`);
});
