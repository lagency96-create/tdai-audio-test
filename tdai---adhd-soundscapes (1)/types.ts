
export enum SoundMode {
  FOCUS = 'FOCUS',
  RELAX = 'RELAX',
  SLEEP = 'SLEEP',
  MOVE = 'MOVE'
}

export interface SoundState {
  mode: SoundMode;
  isPlaying: boolean;
  volume: number;
  noiseType: 'white' | 'brown' | 'pink' | 'none';
  binauralFreq: number;
}

export interface AICoachingMessage {
  text: string;
  timestamp: Date;
  sender: 'ai' | 'user';
}

export interface TaskFocus {
  task: string;
  duration: number; // in minutes
}
