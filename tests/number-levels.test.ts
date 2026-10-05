import test from 'node:test';
import assert from 'node:assert/strict';
import { getNumberAreas } from '../data/numbers';
import { generateGradeQuestions,calculateFraction,formatFraction } from '../lib/number-grade-questions';
import { readNumberProgress,writeNumberProgress,NUMBER_STORAGE_KEY } from '../lib/number-progress';
import { emptyProgress,applyResult } from '../lib/progress';
test('학년별 모든 연산과 단계는 정답이 포함된 서로 다른 열 문제를 만든다',()=>{
  for(const level of ['challenge','expert'] as const){
    const areas=getNumberAreas(level);
    assert.equal(areas.length,level==='challenge'?4:5);
    for(const area of areas)for(const stage of area.stages)for(const seed of [1,42,20261005]){
      const items=generateGradeQuestions(level,area.id,stage.id,seed);
      assert.equal(items.length,10);assert.equal(new Set(items.map(q=>`${q.question}|${q.expression}`)).size,10);
      for(const q of items){
        assert.equal(q.choices.length,4);assert.equal(new Set(q.choices).size,4);assert.ok(q.choices.includes(q.answer));
        const actual=calculateFraction(q.operands[0],q.operation,q.operands[1]);
        const expected=q.extra?calculateFraction(actual,q.extra.operation,q.extra.operand):actual;
        assert.deepEqual(expected,q.result);
        const first=q.operation==='+'?q.a+q.b:q.operation==='−'?q.a-q.b:q.operation==='×'?q.a*q.b:q.a/q.b;
        const value=q.extra?(q.extra.operation==='+'?first+q.extra.operand.n/q.extra.operand.d:first*q.extra.operand.n/q.extra.operand.d):first;
        assert.ok(Math.abs(value-q.result.n/q.result.d)<1e-9);
        if(q.remainder){assert.equal(q.a,q.b*q.value+q.remainder);assert.ok(q.remainder<q.b);}
        else assert.equal(q.answer,formatFraction(q.target==='right'?q.operands[1]:q.result,q.format,q.answerDenominator));
        assert.ok(q.explanation.includes(q.answer));
      }
      assert.ok(new Set(items.map(q=>q.choices.indexOf(q.answer))).size>=3);
    }
  }
});
test('도전은 같은 분모의 분수, 최고 수준은 통분·분수 사칙연산과 소수 나눗셈을 포함한다',()=>{
  for(const id of [1,2])for(const q of generateGradeQuestions('challenge',id,3,19)){assert.equal(q.operands[0].d,q.operands[1].d);if(q.answer.includes('/'))assert.ok(q.answer.endsWith(`/${q.operands[0].d}`));}
  for(const id of [1,2])for(const q of generateGradeQuestions('expert',id,1,19))assert.notEqual(q.operands[0].d,q.operands[1].d);
  for(const q of generateGradeQuestions('expert',4,5,19)){assert.equal(q.format,'decimal');assert.equal(q.remainder,0);assert.ok(!q.answer.includes('/'));}
  for(const q of generateGradeQuestions('expert',5,2,19))assert.ok(q.expression.includes('('));
  assert.equal(formatFraction(calculateFraction({n:1,d:10},'+',{n:2,d:10}),'decimal'),'0.3');
  assert.deepEqual(calculateFraction({n:1,d:3},'+',{n:1,d:2}),{n:5,d:6});
  assert.deepEqual(calculateFraction({n:2,d:3},'−',{n:1,d:4}),{n:5,d:12});
  assert.deepEqual(calculateFraction({n:2,d:3},'×',{n:3,d:5}),{n:2,d:5});
  assert.deepEqual(calculateFraction({n:2,d:3},'÷',{n:4,d:5}),{n:5,d:6});
  assert.equal(formatFraction(calculateFraction({n:3,d:10},'×',{n:2,d:10}),'decimal'),'0.06');
});
test('숫자 난이도별 기록은 분리되고 기존 기본 기록은 그대로 읽힌다',()=>{
  const entries=new Map<string,string>();const storage={getItem:(key:string)=>entries.get(key)??null,setItem:(key:string,value:string)=>{entries.set(key,value);}};
  const result={accuracy:100,stars:3,cleared:true,score:1234,bestCombo:10,hints:0,unresolved:[],firstCorrect:10,total:10};
  const p=applyResult(emptyProgress(),1,1,result);
  assert.ok(writeNumberProgress(storage,p));assert.ok(entries.has(NUMBER_STORAGE_KEY));
  assert.equal(readNumberProgress(storage).stages['1-1'].bestScore,1234);
  assert.deepEqual(readNumberProgress(storage,'challenge').stages,{});
  writeNumberProgress(storage,p,'challenge');assert.deepEqual(readNumberProgress(storage,'expert').stages,{});
  assert.equal(readNumberProgress(storage,'challenge').stages['1-1'].stars,3);
});
