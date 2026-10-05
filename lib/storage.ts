import type { Progress,StageProgress,Difficulty } from '../types/game';
import { emptyProgress } from './progress';
export const STORAGE_KEY='batchim-rescue-progress-v1';
export const CHALLENGE_STORAGE_KEY='batchim-rescue-challenge-progress-v1';
export const EXPERT_STORAGE_KEY='batchim-rescue-expert-progress-v1';
function validStage(key:string,s:StageProgress):boolean {
  return Boolean(s&&typeof s==='object'&&key===`${s.worldId}-${s.stageId}`&&Number.isInteger(s.worldId)&&s.worldId>=1&&s.worldId<=7&&Number.isInteger(s.stageId)&&s.stageId>=1&&s.stageId<=5&&typeof s.cleared==='boolean'&&typeof s.puzzlePiece==='boolean'&&Number.isInteger(s.stars)&&s.stars>=0&&s.stars<=3&&[s.bestScore,s.bestCombo,s.attempts].every(n=>Number.isInteger(n)&&n>=0));
}
export function readProgress(storage:Pick<Storage,'getItem'>,difficulty:Difficulty='basic'):Progress {
  try {
    const raw=storage.getItem(difficulty==='expert'?EXPERT_STORAGE_KEY:difficulty==='challenge'?CHALLENGE_STORAGE_KEY:STORAGE_KEY);
    if(!raw) return emptyProgress();
    const p=JSON.parse(raw) as Progress;
    if(p.version!==1||!p.stages||typeof p.stages!=='object'||Array.isArray(p.stages)||typeof p.settings?.soundEnabled!=='boolean'||!Object.entries(p.stages).every(([k,s])=>validStage(k,s))) return emptyProgress();
    return p;
  } catch {return emptyProgress();}
}
export function writeProgress(storage:Pick<Storage,'setItem'>,p:Progress,difficulty:Difficulty='basic'):boolean {
  try {storage.setItem(difficulty==='expert'?EXPERT_STORAGE_KEY:difficulty==='challenge'?CHALLENGE_STORAGE_KEY:STORAGE_KEY,JSON.stringify(p));return true;}catch{return false;}
}
