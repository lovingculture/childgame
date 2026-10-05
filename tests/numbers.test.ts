import test from 'node:test';
import assert from 'node:assert/strict';
import { numberAreas } from '../data/numbers';
import { generateNumberQuestions, carryCount, borrowCount } from '../lib/number-questions';
import { readNumberProgress, writeNumberProgress, NUMBER_STORAGE_KEY } from '../lib/number-progress';
import { emptyProgress, applyResult } from '../lib/progress';
import { createGame, answerQuestion } from '../lib/game-engine';

test('9영역·45단계에서 중복 없는 10문항과 정확한 연산·보기를 제공한다',()=>{
  assert.equal(numberAreas.length,9);
  for(const area of numberAreas) {
    assert.equal(area.stages.length,5);
    for(const stage of area.stages) for(const seed of [1,42,20261005]) {
      const items=generateNumberQuestions(area.id,stage.id,seed);
      assert.equal(items.length,10,`${area.slug}/${stage.id}`);
      assert.equal(new Set(items.map(q=>`${q.a}/${q.operation}/${q.b}`)).size,10);
      for(const q of items) {
        const value=q.operation==='+'?q.a+q.b:q.operation==='−'?q.a-q.b:q.operation==='×'?q.a*q.b:Math.floor(q.a/q.b);
        assert.equal(q.value,value,q.id);
        assert.equal(q.choices.length,4);
        assert.equal(new Set(q.choices).size,4);
        assert.equal(q.choices.filter(c=>c===q.answer).length,1);
        assert.equal(q.answer,q.remainder?`몫 ${q.value}, 나머지 ${q.remainder}`:String(q.target==='left'?q.a:q.target==='right'?q.b:q.value));
        assert.equal(answerQuestion(createGame([q]),q.answer,1000).feedback?.correct,true);
        assert.ok(q.hint && q.explanation && q.question);
        if(q.operation==='÷') {
          assert.ok(q.b>=2 && q.b<=9);
          assert.equal(q.a,q.b*q.value+q.remainder);
          assert.ok(q.remainder>=0 && q.remainder<q.b);
          assert.equal(q.remainder>0,stage.id===5);
        } else if(area.digits>1) {
          assert.ok(q.a>=10**(area.digits-1) && q.a<10**area.digits);
          const bDigits=area.operation==='×'?1:area.digits;
          assert.ok(q.b>=10**(bDigits-1) && q.b<10**bDigits);
        }
        if(q.operation==='−') assert.ok(q.value>=0);
        if(q.operation==='+' && stage.id===1) assert.equal(carryCount(q.a,q.b),0);
        if(q.operation==='−' && stage.id===1) assert.equal(borrowCount(q.a,q.b),0);
        if(q.operation==='−' && stage.id===4 && area.digits>=3) assert.match(String(q.a),area.digits===4?/00/:/0/);
      }
      assert.ok(new Set(items.map(q=>q.choices.indexOf(q.answer))).size>=3);
    }
  }
});
test('재시작은 새 문제를 생성하고 0을 거치는 받아내림도 계산한다',()=>{
  assert.notDeepEqual(generateNumberQuestions(4,5,1),generateNumberQuestions(4,5,2));
  assert.equal(borrowCount(4000,1234),3);
  assert.equal(carryCount(9999,9999),4);
});
test('빈칸 문제와 자리별 올림·내림이 단계 목표에 맞는다',()=>{
  assert.ok(generateNumberQuestions(2,4,42).some(q=>q.target!=='result'));
  assert.ok(generateNumberQuestions(3,4,42).every(q=>q.target!=='result'));
  assert.ok(generateNumberQuestions(5,4,42).every(q=>q.target!=='result' && q.value>=10000));
  for(const area of [3,4,5]) assert.ok(generateNumberQuestions(area,2,42).every(q=>carryCount(q.a,q.b)>0));
  for(const area of [6,7,8]) assert.ok(generateNumberQuestions(area,2,42).every(q=>borrowCount(q.a,q.b)===1));
  for(const area of [7,8]) assert.ok(generateNumberQuestions(area,3,42).every(q=>borrowCount(q.a,q.b)>=2));
  assert.ok(generateNumberQuestions(9,4,42).every(q=>q.value>=10 && q.remainder===0));
});
test('숫자 기록은 9영역까지 복원하고 받침 기록을 덮어쓰지 않는다',()=>{
  const store=new Map([['batchim-rescue-progress-v1','preserved']]);
  const storage={getItem:(key:string)=>store.get(key)??null,setItem:(key:string,value:string)=>{store.set(key,value);}};
  const result={accuracy:100,stars:3,cleared:true,score:1500,bestCombo:10,hints:0,unresolved:[],firstCorrect:10,total:10};
  const p=applyResult(emptyProgress(),9,5,result);
  assert.equal(writeNumberProgress(storage,p),true);
  assert.deepEqual(readNumberProgress(storage),p);
  assert.equal(store.get('batchim-rescue-progress-v1'),'preserved');
  assert.ok(store.has(NUMBER_STORAGE_KEY));
  const worse=applyResult(p,9,5,{...result,score:10,stars:0,cleared:false});
  assert.equal(worse.stages['9-5'].stars,3);
  assert.equal(worse.stages['9-5'].bestScore,1500);
  for(const raw of ['{','{"version":2}',JSON.stringify({...p,stages:{'10-5':{...p.stages['9-5'],worldId:10}}})]) {
    assert.deepEqual(readNumberProgress({getItem:()=>raw}),emptyProgress());
  }
  assert.equal(writeNumberProgress({setItem:()=>{throw Error('blocked');}},p),false);
});
