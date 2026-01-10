import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Trophy, Medal, Award } from 'lucide-react';

interface Player {
  name: string;
  rating: number;
  wins: number;
  losses: number;
  draws: number;
}

const mockPlayers: Player[] = [
  { name: 'Magnus Carlsen', rating: 2882, wins: 156, losses: 12, draws: 34 },
  { name: 'Hikaru Nakamura', rating: 2794, wins: 142, losses: 18, draws: 28 },
  { name: 'Fabiano Caruana', rating: 2786, wins: 138, losses: 15, draws: 31 },
  { name: 'Ding Liren', rating: 2780, wins: 135, losses: 20, draws: 29 },
  { name: 'Ian Nepomniachtchi', rating: 2771, wins: 131, losses: 22, draws: 26 },
  { name: 'Wesley So', rating: 2760, wins: 128, losses: 19, draws: 30 },
];

export function Leaderboard() {
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-[#f1c40f]" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-[#cd7f32]" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center">{index + 1}</span>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {mockPlayers.map((player, index) => (
            <div 
              key={player.name}
              className={`
                flex items-center gap-4 p-3 rounded-lg transition-all
                ${index < 3 ? 'bg-gradient-to-r from-gray-50 to-gray-100' : 'bg-gray-50'}
                hover:shadow-md
              `}
            >
              <div className="flex items-center justify-center w-8">
                {getRankIcon(index)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{player.name}</span>
                  <span className="text-[#3498db]">{player.rating}</span>
                </div>
                <div className="text-sm text-gray-600">
                  W: {player.wins} | L: {player.losses} | D: {player.draws}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
