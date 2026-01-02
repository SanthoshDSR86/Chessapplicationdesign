import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface GameMove {
  moveNumber: number;
  white: string;
  black?: string;
}

interface GameHistoryProps {
  moves: string[];
}

export function GameHistory({ moves }: GameHistoryProps) {
  const formattedMoves: GameMove[] = [];
  
  for (let i = 0; i < moves.length; i += 2) {
    formattedMoves.push({
      moveNumber: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1]
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Move History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <table className="w-full">
            <thead className="sticky top-0 bg-[#f9f9f9] z-10">
              <tr className="border-b">
                <th className="text-left py-2 px-2">#</th>
                <th className="text-left py-2 px-4">White</th>
                <th className="text-left py-2 px-4">Black</th>
              </tr>
            </thead>
            <tbody>
              {formattedMoves.map((move, index) => (
                <tr 
                  key={move.moveNumber} 
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-2 px-2">{move.moveNumber}</td>
                  <td className="py-2 px-4">{move.white}</td>
                  <td className="py-2 px-4">{move.black || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {formattedMoves.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No moves yet. Start playing!
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
