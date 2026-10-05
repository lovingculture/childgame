import test from 'node:test';
import assert from 'node:assert/strict';
import { scienceWorlds,getScienceQuestions } from '../data/science';
import { readScienceProgress,writeScienceProgress } from '../lib/science-progress';
import { emptyProgress,applyResult } from '../lib/progress';
import { createGame,answerQuestion,nextQuestion,getGameResult } from '../lib/game-engine';
import type { Difficulty } from '../types/game';
test('과학 6테마·학년군별 30단계·270고유문항은 정답과 풀이를 갖추고 완료된다',()=>{
  assert.equal(scienceWorlds.length,6);const prompts=new Set<string>(),ids=new Set<string>();
  for(const level of ['basic','challenge','expert'] as Difficulty[])for(const world of scienceWorlds)for(let stage=1;stage<=5;stage++){
    const items=getScienceQuestions(world.id,stage,level);assert.equal(items.length,3);
    let state=createGame(items);
    for(const q of items){assert.ok(!prompts.has(q.question),q.id);prompts.add(q.question);assert.ok(!ids.has(q.id));ids.add(q.id);assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.equal(q.choices.filter(c=>c===q.answer).length,1);assert.ok(q.hint&&q.explanation);state=nextQuestion(answerQuestion(state,q.answer,1000));}
    assert.ok(state.finished);assert.equal(getGameResult(state).accuracy,100);
  }
  assert.equal(prompts.size,270);
});
test('과학 세 난이도 기록은 서로와 한글·숫자 저장 키를 침범하지 않는다',()=>{
  const map=new Map<string,string>([['batchim-rescue-progress-v1','keep'],['number-rescue-progress-v1','keep']]);
  const store={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}};
  const result={accuracy:100,stars:3,cleared:true,score:300,bestCombo:3,hints:0,unresolved:[],firstCorrect:3,total:3};
  for(const [i,level]of(['basic','challenge','expert']as Difficulty[]).entries()){const p=applyResult(emptyProgress(),i+1,1,result);writeScienceProgress(store,p,level);assert.deepEqual(readScienceProgress(store,level),p);}
  assert.equal(map.get('batchim-rescue-progress-v1'),'keep');assert.equal(map.get('number-rescue-progress-v1'),'keep');
  assert.deepEqual(readScienceProgress({getItem:()=>'{'}),emptyProgress());
  assert.equal(writeScienceProgress({setItem:()=>{throw Error();}},emptyProgress()),false);
});
