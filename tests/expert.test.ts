import test from 'node:test';
import assert from 'node:assert/strict';
import { expertQuestions } from '../data/expert';
import { questions, getStageQuestions } from '../data/questions';
import { challengeQuestions } from '../data/challenge';
import { readProgress,writeProgress,EXPERT_STORAGE_KEY } from '../lib/storage';
import { emptyProgress,applyResult } from '../lib/progress';
import { createGame,answerQuestion,nextQuestion,getGameResult } from '../lib/game-engine';

test('중1 최고 수준 175문항은 다른 난이도와 겹치지 않고 35단계에서 완료할 수 있다',()=>{
  assert.equal(expertQuestions.length,175);
  assert.equal(new Set(expertQuestions.map(q=>q.id )).size,175);
  assert.equal(new Set(expertQuestions.map(q=>q.question )).size,175);
  const old=new Set([...questions,...challengeQuestions].map(q=>q.question));
  for(let world=1;world<=7;world++) for(let stage=1;stage<=5;stage++){
    const items=getStageQuestions(world,stage,'expert');
    assert.equal(items.length,5);
    let state=createGame(items);
    for(const q of items){
      assert.ok(!old.has(q.question),q.id);
      assert.equal(new Set(q.choices).size,4,q.id);
      assert.equal(q.choices.filter(c=>c===q.answer).length,1,q.id);
      assert.ok(q.hint && !q.explanation.endsWith(q.hint),q.id);
      state=nextQuestion(answerQuestion(state,q.answer,1000));
    }
    assert.equal(state.finished,true);
    assert.equal(getGameResult(state).accuracy,100);
  }
  assert.ok(expertQuestions.filter(q=>q.answer.includes(' · ')||q.answer.length>=12).length>=110);
});
test('최고 수준 기록을 저장해도 기본·6학년 도전 기록은 유지된다',()=>{
  const map=new Map<string,string>();
  const store={getItem:(key:string)=>map.get(key)??null,setItem:(key:string,value:string)=>{map.set(key,value);}};
  const result={accuracy:100,stars:3,cleared:true,score:500,bestCombo:5,hints:0,unresolved:[],firstCorrect:5,total:5};
  const basic=applyResult(emptyProgress(),1,1,result),challenge=applyResult(emptyProgress(),2,1,result),expert=applyResult(emptyProgress(),3,1,result);
  writeProgress(store,basic);writeProgress(store,challenge,'challenge');
  assert.deepEqual(readProgress(store,'expert'),emptyProgress());
  assert.equal(writeProgress(store,expert,'expert'),true);
  assert.deepEqual(readProgress(store),basic);
  assert.deepEqual(readProgress(store,'challenge'),challenge);
  assert.deepEqual(readProgress(store,'expert'),expert);
  assert.ok(map.has(EXPERT_STORAGE_KEY));
});
