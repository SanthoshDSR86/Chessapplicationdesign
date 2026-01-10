import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Trophy, Users } from 'lucide-react';

interface GameOverModalProps {
  open: boolean;
  winner: 'white' | 'black' | 'draw' | null;
  reason: string;
  onNewGame: () => void;
  onClose: () => void;
}

export function GameOverModal({ open, winner, reason, onNewGame, onClose }: GameOverModalProps) {
  const getTitle = () => {
    if (winner === 'draw') return 'Game Draw!';
    if (winner === 'white') return 'White Wins!';
    if (winner === 'black') return 'Black Wins!';
    return 'Game Over';
  };

  const getIcon = () => {
    if (winner === 'draw') {
      return <Users className="w-16 h-16 text-[#f1c40f] mx-auto mb-4" />;
    }
    return <Trophy className="w-16 h-16 text-[#f1c40f] mx-auto mb-4" />;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="py-6 text-center">
          {getIcon()}
          <p className="text-lg mb-2">{reason}</p>
        </div>
        <DialogFooter className="flex gap-2 sm:justify-center">
          <Button onClick={onNewGame} className="bg-[#3498db] hover:bg-[#2980b9]">
            New Game
          </Button>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
