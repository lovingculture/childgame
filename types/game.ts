export type Difficulty = 'basic' | 'challenge' | 'expert';
export type QuestionType = 'batchim' | 'word-choice' | 'sentence' | 'fix-spelling' | 'image' | 'audio';
export type Question = {
  id: string; world: number; stage: number; type: QuestionType;
  question: string; word: string; stem?: string; answer: string; choices: string[];
  hint: string; explanation: string; difficulty: number; image?: string;
  audioSrc?: string; audioText?: string; correctSentence?: string; imageHint?: string;
};
export type Stage = { id: number; title: string; focus: string; questionCount: number; boss: boolean };
export type World = { id: number; slug: string; title: string; description: string; icon: string; reward: string; color: string; stages: Stage[] };
export type GameState = {
  queue: Question[]; index: number; round: number; pending: Question[]; total: number;
  firstCorrect: number; score: number; combo: number; bestCombo: number; lives: number;
  hints: number; hinted: boolean; hintedIds: string[];
  feedback: {correct: boolean; choice: string; points: number} | null;
  finished: boolean; unresolved: Question[];
};
export type GameResult = {accuracy: number; stars: number; cleared: boolean; score: number; bestCombo: number; hints: number; unresolved: Question[]; firstCorrect: number; total: number};
export type StageProgress = {worldId: number; stageId: number; cleared: boolean; stars: number; bestScore: number; bestCombo: number; attempts: number; puzzlePiece: boolean};
export type Progress = {version: 1; stages: Record<string, StageProgress>; settings: {soundEnabled: boolean}};
