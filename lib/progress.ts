import type { Progress,GameResult } from '../types/game';
export function emptyProgress():Progress {return {version:1,stages:{},settings:{soundEnabled:true}};}
export function isStageUnlocked(_p:Progress,world:number,stage:number):boolean {
  return Number.isInteger(world)&&world>=1&&world<=7&&Number.isInteger(stage)&&stage>=1&&stage<=5;
}
export function applyResult(p:Progress,world:number,stage:number,result:GameResult):Progress {
  const key=`${world}-${stage}`;
  const old=p.stages[key];
  return {...p,stages:{...p.stages,[key]:{worldId:world,stageId:stage,cleared:Boolean(old?.cleared||result.cleared),stars:Math.max(old?.stars??0,result.stars),bestScore:Math.max(old?.bestScore??0,result.score),bestCombo:Math.max(old?.bestCombo??0,result.bestCombo),attempts:(old?.attempts??0)+1,puzzlePiece:Boolean(old?.puzzlePiece||result.cleared)}}};
}
export function totalStars(p:Progress):number {return Object.values(p.stages).reduce((n,s)=>n+s.stars,0);}
export function worldPieces(p:Progress,world:number):number {return Object.values(p.stages).filter(s=>s.worldId===world&&s.puzzlePiece).length;}
