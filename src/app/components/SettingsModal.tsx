import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: GameSettings;
  onSettingsChange: (settings: GameSettings) => void;
}

export interface GameSettings {
  aiDifficulty: 'easy' | 'medium' | 'hard';
  soundEnabled: boolean;
  boardTheme: 'classic' | 'modern' | 'wooden';
  pieceStyle: 'classic' | 'modern';
}

export function SettingsModal({ open, onOpenChange, settings, onSettingsChange }: SettingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Game Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="ai-difficulty">AI Difficulty</Label>
            <Select
              value={settings.aiDifficulty}
              onValueChange={(value) => 
                onSettingsChange({ ...settings, aiDifficulty: value as 'easy' | 'medium' | 'hard' })
              }
            >
              <SelectTrigger id="ai-difficulty">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="board-theme">Board Theme</Label>
            <Select
              value={settings.boardTheme}
              onValueChange={(value) => 
                onSettingsChange({ ...settings, boardTheme: value as 'classic' | 'modern' | 'wooden' })
              }
            >
              <SelectTrigger id="board-theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="wooden">Wooden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="piece-style">Piece Style</Label>
            <Select
              value={settings.pieceStyle}
              onValueChange={(value) => 
                onSettingsChange({ ...settings, pieceStyle: value as 'classic' | 'modern' })
              }
            >
              <SelectTrigger id="piece-style">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sound-enabled">Sound Effects</Label>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => 
                onSettingsChange({ ...settings, soundEnabled: checked })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
