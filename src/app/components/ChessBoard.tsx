import React, { useState } from 'react';
import { Chess, Square } from 'chess.js';
import { motion } from 'motion/react';
import { ChessPiece } from './ChessPiece';

interface ChessBoardProps {
  game: Chess;
  onMove: (from: Square, to: Square) => void;
}

export function ChessBoard({ game, onMove }: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);

  const board = game.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

  const handleSquareClick = (square: Square) => {
    if (selectedSquare) {
      // Try to make a move
      if (validMoves.includes(square)) {
        onMove(selectedSquare, square);
      }
      setSelectedSquare(null);
      setValidMoves([]);
    } else {
      // Select piece
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true });
        setValidMoves(moves.map(move => move.to as Square));
      }
    }
  };

  const isLightSquare = (file: number, rank: number) => {
    return (file + rank) % 2 === 0;
  };

  return (
    <div className="relative">
      <div 
        className="grid grid-cols-8 gap-0 w-[640px] h-[640px] shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #d4a574 0%, #bc9862 100%)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {ranks.map((rank, rankIndex) => 
          files.map((file, fileIndex) => {
            const square = `${file}${rank}` as Square;
            const piece = game.get(square);
            const isLight = isLightSquare(fileIndex, rankIndex);
            const isSelected = selectedSquare === square;
            const isValidMove = validMoves.includes(square);
            const isInCheck = game.inCheck() && piece?.type === 'k' && piece.color === game.turn();

            return (
              <motion.div
                key={square}
                className={`
                  relative flex items-center justify-center cursor-pointer
                  ${isLight ? 'bg-[#f0d9b5]' : 'bg-[#b58863]'}
                  ${isSelected ? 'ring-4 ring-[#3498db] ring-inset' : ''}
                  ${isInCheck ? 'bg-red-400' : ''}
                `}
                onClick={() => handleSquareClick(square)}
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {/* Square Label */}
                {rankIndex === 7 && (
                  <div className="absolute bottom-1 left-1 text-xs font-semibold opacity-40">
                    {file}
                  </div>
                )}
                {fileIndex === 7 && (
                  <div className="absolute top-1 right-1 text-xs font-semibold opacity-40">
                    {rank}
                  </div>
                )}

                {/* Valid Move Indicator */}
                {isValidMove && (
                  <motion.div
                    className={`absolute w-4 h-4 rounded-full ${piece ? 'ring-4 ring-[#2ecc71]' : 'bg-[#2ecc71]'} opacity-60`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Piece */}
                {piece && <ChessPiece piece={piece.type === 'p' && piece.color === 'w' ? 'P' : piece.type === 'p' ? 'p' : piece.color === 'w' ? piece.type.toUpperCase() : piece.type} />}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
