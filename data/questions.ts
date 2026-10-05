import type { Question, QuestionType } from '../types/game';
import source from './questions-source.json';
import { challengeQuestions } from './challenge';
import { expertQuestions } from './expert';
import type { Difficulty } from '../types/game';
import { vocabularyVillageQuestions } from './vocabulary-village';
import { hanjaVillageQuestions } from './hanja-village';

// 원본 CSV는 scripts/import-questions.ps1로 가져옵니다.
const images: Record<string, string> = {
  '산 그림': '⛰️', '달 그림': '🌙', '꽃 그림': '🌷', '밭 그림': '🥬',
  '나뭇잎 그림': '🍃', '닭 그림': '🐔', '공 그림': '⚽',
  '숲 그림': '🌳', '별 그림': '⭐', '가격표 그림': '🏷️',
};
export const questions: Question[] = [...source.map(row => ({
  id: row.id,
  world: Number(row.world),
  stage: Number(row.stage),
  type: row.type as QuestionType,
  word: row.word || row.answer,
  ...(row.stem ? { stem: `${row.stem}＿` } : {}),
  question: row.prompt,
  answer: row.answer,
  choices: row.choices.split('|').map(choice => choice.trim()),
  hint: row.hint,
  explanation: row.correctSentence
    ? `정답은 ‘${row.word || row.answer}’이에요. ${row.correctSentence}`
    : `정답은 ‘${row.word || row.answer}’이에요. ${row.hint}`,
  difficulty: Number(row.id.split('-')[2]) <= 3 ? 1 : Number(row.id.split('-')[2]) <= 7 ? 2 : 3,
  ...(row.correctSentence ? { correctSentence: row.correctSentence } : {}),
  ...(row.imageHint ? { imageHint: row.imageHint, image: images[row.imageHint] } : {}),
  ...(row.audioSrc ? { audioSrc: row.audioSrc } : {}),
  ...(row.audioText ? { audioText: row.audioText } : {}),
})),...vocabularyVillageQuestions('basic'),...hanjaVillageQuestions('basic')];

export function getStageQuestions(worldId: number, stageId: number, difficulty: Difficulty = 'basic'): Question[] {
  return (difficulty === 'expert' ? expertQuestions : difficulty === 'challenge' ? challengeQuestions : questions).filter(q => q.world === worldId && q.stage === stageId);
}
