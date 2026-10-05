import type { Progress, StageProgress } from '../types/game';
import { emptyProgress } from './progress';
import type { Difficulty } from '../types/game';
export const SCIENCE_STORAGE_KEY='science-rescue-progress-v1';
export const SCIENCE_LEVEL_KEY='science-rescue-level-v1';
function storageKey(level:Difficulty){return level==='basic'?SCIENCE_STORAGE_KEY:`science-rescue-${level}-progress-v1`;}
function validRecord(key:string,record:StageProgress):boolean {
  return Boolean(record&&key===`${record.worldId}-${record.stageId}`&&Number.isInteger(record.worldId)&&record.worldId>=1&&record.worldId<=6&&Number.isInteger(record.stageId)&&record.stageId>=1&&record.stageId<=5&&typeof record.cleared==='boolean'&&typeof record.puzzlePiece==='boolean'&&Number.isInteger(record.stars)&&record.stars>=0&&record.stars<=3&&[record.bestScore,record.bestCombo,record.attempts].every(n=>Number.isInteger(n)&&n>=0));
}
export function readScienceProgress(storage:Pick<Storage,'getItem'>,level:Difficulty='basic'):Progress {
  try {
    const raw=storage.getItem(storageKey(level));
    if(!raw)return emptyProgress();
    const p=JSON.parse(raw) as Progress;
    if(p.version!==1||!p.stages||typeof p.stages!=='object'||Array.isArray(p.stages)||typeof p.settings?.soundEnabled!=='boolean'||!Object.entries(p.stages).every(([key,record])=>validRecord(key,record)))return emptyProgress();
    return p;
  }catch{return emptyProgress();}
}
export function writeScienceProgress(storage:Pick<Storage,'setItem'>,progress:Progress,level:Difficulty='basic'):boolean {
  try{storage.setItem(storageKey(level),JSON.stringify(progress));return true;}catch{return false;}
}
