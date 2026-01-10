import React, { useState, useEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { motion } from 'motion/react';
import { ChessBoard } from './components/ChessBoard';
import { GameHistory } from './components/GameHistory';
import { Leaderboard } from './components/Leaderboard';
import { SettingsModal, GameSettings } from './components/SettingsModal';
import { GameOverModal } from './components/GameOverModal';
import { Button } from './components/ui/button';
import { Settings, RotateCcw, Clock } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<'ai' | 'human'>('ai');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gameOverOpen, setGameOverOpen] = useState(false);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);
  const [gameOverReason, setGameOverReason] = useState('');
  const [settings, setSettings] = useState<GameSettings>({
    aiDifficulty: 'medium',
    soundEnabled: true,
    boardTheme: 'classic',
    pieceStyle: 'classic'
  });
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes in seconds
  const [blackTime, setBlackTime] = useState(600);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      if (game.turn() === 'w') {
        setWhiteTime(prev => {
          if (prev <= 1) {
            handleGameOver('black', 'White ran out of time');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 1) {
            handleGameOver('white', 'Black ran out of time');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, game]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const makeAIMove = () => {
    const gameCopy = new Chess(game.fen());
    const moves = gameCopy.moves();
    
    if (moves.length === 0) return;

    let selectedMove: string;
    
    if (settings.aiDifficulty === 'easy') {
      // Random move
      selectedMove = moves[Math.floor(Math.random() * moves.length)];
    } else if (settings.aiDifficulty === 'medium') {
      // Slightly better - prefer captures
      const captureMoves = moves.filter(move => move.includes('x'));
      selectedMove = captureMoves.length > 0 
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : moves[Math.floor(Math.random() * moves.length)];
    } else {
      // Hard - same as medium for now (could implement minimax)
      const captureMoves = moves.filter(move => move.includes('x'));
      const checkMoves = moves.filter(move => move.includes('+'));
      const priorityMoves = checkMoves.length > 0 ? checkMoves : captureMoves;
      selectedMove = priorityMoves.length > 0
        ? priorityMoves[Math.floor(Math.random() * priorityMoves.length)]
        : moves[Math.floor(Math.random() * moves.length)];
    }

    gameCopy.move(selectedMove);
    setGame(gameCopy);
    setMoveHistory([...moveHistory, selectedMove]);
    checkGameStatus(gameCopy);
  };

  const handleMove = (from: Square, to: Square) => {
    const gameCopy = new Chess(game.fen());
    
    try {
      const move = gameCopy.move({ from, to, promotion: 'q' });
      if (move) {
        setGame(gameCopy);
        setMoveHistory([...moveHistory, move.san]);
        
        if (!isTimerRunning) {
          setIsTimerRunning(true);
        }

        if (checkGameStatus(gameCopy)) return;

        // AI move after player move
        if (gameMode === 'ai' && gameCopy.turn() === 'b') {
          setTimeout(() => {
            makeAIMove();
          }, 500);
        }
      }
    } catch (error) {
      toast.error('Invalid move!');
    }
  };

  const checkGameStatus = (currentGame: Chess): boolean => {
    if (currentGame.isCheckmate()) {
      const winnerColor = currentGame.turn() === 'w' ? 'black' : 'white';
      handleGameOver(winnerColor, 'Checkmate!');
      return true;
    } else if (currentGame.isDraw()) {
      handleGameOver('draw', 'Draw by insufficient material');
      return true;
    } else if (currentGame.isStalemate()) {
      handleGameOver('draw', 'Stalemate!');
      return true;
    } else if (currentGame.isThreefoldRepetition()) {
      handleGameOver('draw', 'Draw by threefold repetition');
      return true;
    } else if (currentGame.isCheck()) {
      toast('Check!', { duration: 1500 });
    }
    return false;
  };

  const handleGameOver = (winnerColor: 'white' | 'black' | 'draw', reason: string) => {
    setWinner(winnerColor);
    setGameOverReason(reason);
    setGameOverOpen(true);
    setIsTimerRunning(false);
    
    const message = winnerColor === 'draw' ? reason : `${winnerColor === 'white' ? 'White' : 'Black'} wins! ${reason}`;
    toast.success(message);
  };

  const handleNewGame = () => {
    setGame(new Chess());
    setMoveHistory([]);
    setGameOverOpen(false);
    setWinner(null);
    setWhiteTime(600);
    setBlackTime(600);
    setIsTimerRunning(false);
    toast.success('New game started!');
  };

  const handleReset = () => {
    if (moveHistory.length > 0 && confirm('Are you sure you want to reset the game?')) {
      handleNewGame();
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
      <Toaster position="bottom-center" />
      
      {/* Navigation Bar with Blur Effect */}
      <motion.nav
        className="sticky top-0 z-50 px-6 py-4 mb-8"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl text-[#3498db]">Chess Master</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setGameMode(gameMode === 'ai' ? 'human' : 'ai')}
            >
              {gameMode === 'ai' ? 'vs AI' : 'vs Human'}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Board */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Display */}
            <div className="flex justify-between items-center">
              <motion.div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  game.turn() === 'b' ? 'bg-gray-800 text-white' : 'bg-gray-200'
                }`}
                animate={{ scale: game.turn() === 'b' ? 1.05 : 1 }}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(blackTime)}</span>
              </motion.div>
              <span className="text-xl">Black</span>
            </div>

            {/* Chess Board */}
            <div className="flex justify-center">
              <ChessBoard game={game} onMove={handleMove} />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xl">White</span>
              <motion.div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  game.turn() === 'w' ? 'bg-white border-2 border-[#3498db]' : 'bg-gray-200'
                }`}
                animate={{ scale: game.turn() === 'w' ? 1.05 : 1 }}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(whiteTime)}</span>
              </motion.div>
            </div>

            {/* Status */}
            <div className="text-center p-4 bg-white rounded-lg shadow">
              <p className="text-lg">
                {game.isCheck() && <span className="text-red-500 mr-2">Check!</span>}
                {game.turn() === 'w' ? "White's turn" : "Black's turn"}
              </p>
            </div>
          </div>

          {/* Right Column - Info Panels */}
          <div className="space-y-6">
            <GameHistory moves={moveHistory} />
            <Leaderboard />
          </div>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
      />

      <GameOverModal
        open={gameOverOpen}
        winner={winner}
        reason={gameOverReason}
        onNewGame={handleNewGame}
        onClose={() => setGameOverOpen(false)}
      />
    </div>
  );
}
