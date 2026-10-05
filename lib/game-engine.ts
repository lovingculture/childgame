import type { Question,GameState,GameResult } from '../types/game';
import { calculateScore,calculateStars } from './scoring';
export function createGame(items:Question[]):GameState {
  return {queue:items,index:0,round:0,pending:[],total:items.length,firstCorrect:0,score:0,combo:0,bestCombo:0,lives:3,hints:0,hinted:false,hintedIds:[],feedback:null,finished:items.length===0,unresolved:[]};
}
export function answerQuestion(state:GameState,choice:string,elapsedMs:number):GameState {
  if(state.finished||state.feedback) return state;
  const q=state.queue[state.index];
  if(!q.choices.includes(choice)) return state;
  const correct=choice===q.answer;
  const combo=correct?state.combo+1:0;
  const points=correct?calculateScore({firstTry:state.round===0,fastAnswer:elapsedMs<=10000,combo,supportMode:state.lives===0}):0;
  return {...state,score:state.score+points,combo,bestCombo:Math.max(combo,state.bestCombo),lives:correct?state.lives:Math.max(0,state.lives-1),firstCorrect:state.firstCorrect+(correct&&state.round===0?1:0),pending:correct?state.pending:[...state.pending,q],feedback:{correct,choice,points}};
}
export function useHint(state:GameState):GameState {
  if(state.finished||state.feedback||state.hinted) return state;
  const id=state.queue[state.index].id;
  const counted=state.hintedIds.includes(id);
  return {...state,hinted:true,hints:state.hints+(counted?0:1),hintedIds:counted?state.hintedIds:[...state.hintedIds,id],score:Math.max(0,state.score-(counted?0:20))};
}
export function nextQuestion(state:GameState):GameState {
  if(!state.feedback||state.finished) return state;
  if(state.index+1<state.queue.length) return {...state,index:state.index+1,feedback:null,hinted:false};
  if(state.pending.length&&state.round<2) return {...state,queue:state.pending,pending:[],index:0,round:state.round+1,feedback:null,hinted:false};
  return {...state,finished:true,unresolved:state.pending,feedback:null};
}
export function getGameResult(state:GameState):GameResult {
  return {accuracy:state.total?Math.round(state.firstCorrect/state.total*100):0,stars:calculateStars(state.firstCorrect,state.total,state.hints),cleared:state.total>0&&state.firstCorrect/state.total>=.7,score:state.score,bestCombo:state.bestCombo,hints:state.hints,unresolved:state.unresolved,firstCorrect:state.firstCorrect,total:state.total};
}
