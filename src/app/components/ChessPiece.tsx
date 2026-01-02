import React from 'react';
import { motion } from 'motion/react';

interface ChessPieceProps {
  piece: string;
  isDragging?: boolean;
}

const pieceSymbols: { [key: string]: string } = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

export function ChessPiece({ piece, isDragging = false }: ChessPieceProps) {
  const symbol = pieceSymbols[piece] || '';
  const isWhite = piece === piece.toUpperCase();

  return (
    <motion.div
      className={`text-5xl select-none cursor-grab ${isWhite ? 'text-white' : 'text-gray-900'}`}
      style={{
        textShadow: isWhite 
          ? '0 0 3px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.5)' 
          : '0 0 3px rgba(255,255,255,0.5)',
        opacity: isDragging ? 0.5 : 1
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
    >
      {symbol}
    </motion.div>
  );
}
