import test from 'node:test';
import assert from 'node:assert/strict';
import { worlds,findWorld } from '../data/worlds';
import { getStageQuestions } from '../data/questions';
import { getChallengeStage } from '../data/challenge';
import { getExpertStage } from '../data/expert';
import { emptyProgress,applyResult,isStageUnlocked } from '../lib/progress';
import { readProgress,writeProgress } from '../lib/storage';
import { createGame,answerQuestion,nextQuestion,getGameResult } from '../lib/game-engine';
import type { Difficulty } from '../types/game';

test('7번 한자 마을은 세 난이도에 5단계와 고유한 75문항을 제공한다',()=>{
  const world=findWorld('hanja-village');
  assert.equal(world?.id,7); assert.equal(worlds.length,7);
  const prompts=new Set<string>();
  for(const difficulty of ['basic','challenge','expert'] as Difficulty[]){
    for(const stage of world!.stages){
      assert.ok(isStageUnlocked(emptyProgress(),7,stage.id));
      const info=difficulty==='challenge'?getChallengeStage(7,stage):difficulty==='expert'?getExpertStage(7,stage):stage;
      const items=getStageQuestions(7,stage.id,difficulty);
      assert.equal(info.questionCount,5); assert.equal(items.length,5);
      let state=createGame(items);
      for(const q of items){
        assert.match(q.question,/[\u3400-\u9fff]/,q.id);
        assert.ok(!prompts.has(q.question),q.id);prompts.add(q.question);
        assert.equal(new Set(q.choices).size,4,q.id);
        assert.equal(q.choices.filter(c=>c===q.answer).length,1,q.id);
        assert.ok(q.hint&&q.explanation&&!q.explanation.endsWith(q.hint),q.id);
        state=nextQuestion(answerQuestion(state,q.answer,1000));
      }
      assert.equal(getGameResult(state).accuracy,100);assert.ok(state.finished);
    }
  }
  assert.equal(prompts.size,75);
});
test('7번 마을 기록이 세 난이도에서 복원되고 기존 마을 기록을 유지한다',()=>{
  const map=new Map<string,string>();const store={getItem:(k:string)=>map.get(k)??null,setItem:(k:string,v:string)=>{map.set(k,v);}};
  const result={accuracy:100,stars:3,cleared:true,score:500,bestCombo:5,hints:0,unresolved:[],firstCorrect:5,total:5};
  for(const difficulty of ['basic','challenge','expert'] as Difficulty[]){
    const old=applyResult(emptyProgress(),1,1,result);
    writeProgress(store,old,difficulty);
    const updated=applyResult(readProgress(store,difficulty),7,5,result);
    writeProgress(store,updated,difficulty);
    assert.deepEqual(readProgress(store,difficulty),updated);
    assert.deepEqual(readProgress(store,difficulty).stages['1-1'],old.stages['1-1']);
  }
});

