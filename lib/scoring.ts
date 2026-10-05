export function calculateScore(input:{firstTry:boolean;fastAnswer:boolean;combo:number;supportMode:boolean}):number {
  if(!input.firstTry||input.supportMode) return 100;
  return 100+20+(input.fastAnswer?20:0)+(input.combo>=10?50:input.combo>=5?20:input.combo>=3?10:0);
}
export function calculateStars(correct:number,total:number,hints:number):number {
  const rate=correct/total;
  return rate>=.9&&hints<=2?3:rate>=.8?2:rate>=.7?1:0;
}
